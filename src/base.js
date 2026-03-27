const ApiError = require("../src/apiError");
const sharp = require("sharp");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../src/r2Client");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const os = require("os");
const fs = require("fs/promises");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path;

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);
if (ffprobePath) ffmpeg.setFfprobePath(ffprobePath);

class BaseModel {
  constructor(fastify, table, key = "id", searchColumns = []) {
    this.fastify = fastify;
    this.table = table;
    this.key = key;
    this.searchColumns = searchColumns;
    this.recordLimit = 10000;
  }

  async mysql(type, connection, sql, values, db = "inventory_system") {
    this.fastify.log.info(sql);
    this.fastify.log.info({ params: values });
    const client = this.fastify.mysql[db];
    this.fastify.log.info(client);
    let result = null;
    if (typeof connection !== "undefined" && connection !== null) {
      [result] = await connection[type](sql, values);
    } else {
      [result] = await client[type](sql, values);
    }
    this.fastify.log.info({ result });
    return result;
  }

  /*--------------------------------------------------------------------
  | check if row exists                                                 |
  ---------------------------------------------------------------------*/
  async checkIfExists(
    parameters,
    table,
    connection = null,
    db = "inventory_system",
  ) {
    // use parameters to check fields in table
    const fields = Object.keys(parameters);
    const values = Object.values(parameters);
    const whereClause = fields.map((field) => `${field} = ?`).join(" AND ");
    const sql = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${whereClause}) as existing`;
    const [result] = await this.mysql("query", connection, sql, values, db);
    return result.existing > 0;
  }

  /*--------------------------------------------------------------------
  | generic create function                                             |
  ---------------------------------------------------------------------*/
  async create(body, table, connection = null, db = "inventory_system") {
    //set if there are table name passed on, otherwise it will call  model table
    const tableName = table ? table : this.table;
    const fields = Object.keys(body);
    const fieldNames = fields.join(", ");
    const placeholders = Array(fields.length).fill("?").join(", ");
    const sql = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${placeholders})`;
    const values = Object.values(body);
    return await this.mysql("execute", connection, sql, values, db);
  }

  /*--------------------------------------------------------------------
  | generic update function                                             |
  ---------------------------------------------------------------------*/
  async update(body, table, connection = null, db = "inventory_system") {
    //set if there are table name passed on, otherwise it will call  model table
    const tableName = table ? table : this.table;
    const exists = await this.checkIfExists(
      { id: body.id },
      tableName,
      connection,
      db,
    ); //check if row exists
    if (!exists) throw new ApiError(`cannot update, row does not exists`, 400); //throw error if not exists

    let sql = `UPDATE ${tableName} SET `;
    const clause = [];
    const values = [];
    for (const [key, value] of Object.entries(body)) {
      //push key and value of object
      if (key !== this.key) {
        clause.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (clause.length === 0) {
      throw new Error("No fields to update");
    }
    sql += clause.join(", ");
    sql += ` WHERE ${this.key} = ?`;
    values.push(body[this.key]);
    return await this.mysql("execute", connection, sql, values, db);
  }

  /*--------------------------------------------------------------------
  | if entity or body has "id" it will do update                        |
  | otherwise it will insert                                            |
  ---------------------------------------------------------------------*/
  async save(body, table, connection = null) {
    const tableName = table ? table : this.table;
    if (body.hasOwnProperty(this.key))
      return await this.update(body, tableName, connection);
    else return await this.create(body, tableName, connection);
  }

  /*--------------------------------------------------------------------
  | generic get all function                                            |
  | use filter to filter data base on properties inside filter          |
  ---------------------------------------------------------------------*/
  async findAll(filters, connection = null, db = "inventory_system") {
    let sql = `SELECT * FROM ${this.table}`;
    let values = [];
    if (filters) {
      const keys = Object.keys(filters);
      values = Object.values(filters);
      const whereClause = keys.map((field) => `${field} = ?`).join(" AND ");
      sql += ` WHERE ${whereClause}`;
    }
    sql += ` LIMIT ${this.recordLimit}`;
    return await this.mysql("query", connection, sql, values, db);
  }
  /*--------------------------------------------------------------------
  | get single row data using one or more parameters                    |
  ---------------------------------------------------------------------*/
  async findOne(parameter, connection = null, db = "inventory_system") {
    const fields = Object.keys(parameter);
    const values = Object.values(parameter);
    const whereClause = fields.map((field) => `${field} = ?`).join(" AND ");
    const sql = `SELECT * FROM ${this.table} WHERE ${whereClause}`;
    const result = await this.mysql("query", connection, sql, values, db);
    return result[0];
  }

  /*--------------------------------------------------------------------
  | generic get by id function                                          |
  | get single row using id                                             |
  ---------------------------------------------------------------------*/
  async findById(id, connection = null, db = "inventory_system") {
    try {
      const exists = await this.checkIfExists({ id }, this.table);
      if (!exists)
        throw new ApiError(`row with request id does not exists`, 400);
      const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
      const response = await this.mysql("query", connection, sql, [id], db);
      return response[0];
    } catch (error) {
      throw new ApiError(error.message, error.statusCode);
    }
  }

  /*--------------------------------------------------------------------
  | fetching image from foreign key                                       |
  ---------------------------------------------------------------------*/
  async findByIdWithImage(
    db = "inventory_system",
    id,
    imageTable = null,
    foreignKey = null,
  ) {
    try {
      // check if the main record exists
      const exists = await this.checkIfExists({ id }, this.table);

      if (!exists) {
        throw new ApiError(`Record with id ${id} does not exists`, 400);
      }

      // fetch main record
      const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
      const [rows] = await this.fastify.mysql.query(db, sql, [id]);
      const record = rows[0];

      // if no image table provided just return the record
      if (!imageTable || !foreignKey) return record;

      // fetch the first or latest image url
      const imageSql = `
        SELECT image_url
        FROM ${imageTable}
        WHERE ${foreignKey} = ?
        ORDER BY created_at DESC
        LIMIT 1
      `;

      const [imageRows] = await this.fastify.mysql.query(db, imageSql, [id]);

      // Attach the single image URL (or null if none)
      record.image = imageRows.length > 0 ? imageRows[0].image_url : null;
      return {
        success: true,
        message: "Record retrieve successfully",
        data: record,
      };
    } catch (error) {
      throw new ApiError(error.message, error.statusCode || 500);
    }
  }

  /*--------------------------------------------------------------------
  | generic delete by id function                                       |
  | delete row using id                                                 |
  ---------------------------------------------------------------------*/
  async delete(id, connection = null, db = "inventory_system") {
    const sql = `DELETE FROM ${this.table} WHERE ${this.key} = ?`;
    const values = [id];
    return await this.mysql("execute", connection, sql, values, db);
  }

  /*--------------------------------------------------------------------
  | generic disable by id function                                       |
  | disable row using id                                                 |
  ---------------------------------------------------------------------*/
  async disable(id, connection = null, db = "inventory_system") {
    const sql = `UPDATE ${this.table} SET disabled = ? WHERE ${this.key} = ?`;
    const values = ["true", id];
    return await this.mysql("execute", connection, sql, values, db);
  }

  /*--------------------------------------------------------------------
  | check single required field                                         |
  ---------------------------------------------------------------------*/
  async requireField(data, field) {
    if (!data.hasOwnProperty(field))
      throw new ApiError(`Field ${field} is required`, 400, field);
    return data[field];
  }

  /*--------------------------------------------------------------------
  | require list of fields in the data                                  |
  ---------------------------------------------------------------------*/
  async requireFields(data, fields) {
    for (const field of fields) await this.requireField(data, field);
  }

  /*--------------------------------------------------------------------
  | use transaction if you have many queries to execute update/insert   |
  | this will rollback changes if queries inside transaction catch an   |
  | error to avoid data duplication                                     |
  ---------------------------------------------------------------------*/
  async startTransaction(callback) {
    const transaction = await this.fastify.mysql.getConnection();
    try {
      await transaction.beginTransaction();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      throw new ApiError(err.message, err.statusCode || 500);
    } finally {
      transaction.release();
    }
  }

  /*--------------------------------------------------------------------
  | process image from ui then return its filename, file and            |
  | mimetype for uploading                                              |
  ---------------------------------------------------------------------*/
  async processFile(parts) {
    let props = {};
    let files = [];
    for await (const part of parts) {
      // ----- form fields -----
      if (!part.file) {
        //if there is no file its value is property
        props[part.fieldname] = part.value; //pass all properties in props
        continue;
      }
      if (part.file.truncated) {
        throw new Error("File too large!");
      }
      const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/heic",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];

      const allowedExtensions = [".mp4", ".webm", ".mov"];
      const fileExt = path.extname(part.filename || "").toLowerCase();
      const mimeAllowed = allowedMimes.includes(part.mimetype);
      const extAllowed = allowedExtensions.includes(fileExt);
      const isVideo = part.mimetype?.startsWith("video/");

      if (!mimeAllowed && !(isVideo && extAllowed)) {
        //check file format
        throw new Error("Invalid file/image format!");
      }

      // ----- convert stream to buffer -----
      let fileBuffer;
      let finalMime = part.mimetype;
      let finalExt = fileExt || "";
      if (part.mimetype.startsWith("image/")) {
        fileBuffer = await this.processImageStream(part.file, part.mimetype); //stream image
      } else if (isVideo) {
        // keep raw video (no resize in sharp)
        if (!finalExt) finalExt = ".mp4";
        fileBuffer = await this.streamToBuffer(part.file);
        const maxVideoBytes = 130 * 1024 * 1024; // 130 MB
        if (fileBuffer.length > maxVideoBytes) {
          const compressed = await this.compressVideoBuffer(
            fileBuffer,
            finalExt,
            maxVideoBytes,
          );
          fileBuffer = compressed.buffer;
          finalMime = compressed.mimetype;
          finalExt = compressed.ext;
          if (fileBuffer.length > maxVideoBytes) {
            throw new Error("Video still exceeds 130MB after compression!");
          }
        }
      } else {
        fileBuffer = await this.streamToBuffer(part.file); //stream pdf
      }
      //build filename
      const randomName = uuidv4(); //use uuid for random naming
      const filename = `${randomName}${finalExt}`;

      files.push({
        fieldname: part.fieldname, // ✅ Add this line
        filename, // stored filename,
        original_name: part.filename, // optional (nice for UI)
        file: fileBuffer, // Buffer
        mimetype: finalMime, // file type
        file_size: fileBuffer.length, // ✅ SIZE IN BYTES
      });
    }
    return { props, files };
  }

  /*--------------------------------------------------------------------
  | process image to binary                                             |
  | compress image to 80%                                               |
  ---------------------------------------------------------------------*/
  // async processImageStream(stream, mimeType) {
  //   try {
  //     const chunks = [];
  //     for await (const chunk of stream) {
  //       chunks.push(chunk);
  //     }
  //     const buffer = Buffer.concat(chunks);
  //     if (mimeType === "image/png") {
  //       const fixedBuffer = await sharp(buffer).png({ force: true }).toBuffer();
  //       return await sharp(fixedBuffer)
  //         .resize({ width: 1920 })
  //         .jpeg({ quality: 100 })
  //         .toBuffer();
  //     }
  //     return await sharp(buffer).rotate().jpeg({ quality: 80 }).toBuffer();
  //   } catch (error) {
  //     throw new Error("Image processing failed: " + error.message);
  //   }
  // }

  async processImageStream(stream, mimeType) {
    try {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // 🔥 KEEP PNG AS PNG (transparent safe)
      if (mimeType === "image/png") {
        return await sharp(buffer)
          .resize({ width: 1920 })
          .png({ compressionLevel: 9 }) // keep alpha channel
          .toBuffer();
      }

      // jpg/jpeg only
      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        return await sharp(buffer)
          .rotate()
          .resize({ width: 1920 })
          .jpeg({ quality: 85 })
          .toBuffer();
      }

      // webp keep transparency
      if (mimeType === "image/webp") {
        return await sharp(buffer)
          .resize({ width: 1920 })
          .webp({ quality: 90 })
          .toBuffer();
      }

      return buffer;
    } catch (error) {
      throw new Error("Image processing failed: " + error.message);
    }
  }

  /*--------------------------------------------------------------------
  | process pdf file to binar                                           |
  ---------------------------------------------------------------------*/
  async streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async compressVideoBuffer(buffer, originalExt, targetBytes) {
    const inputPath = path.join(os.tmpdir(), `${uuidv4()}${originalExt}`);
    const outputPath = path.join(os.tmpdir(), `${uuidv4()}.mp4`);
    await fs.writeFile(inputPath, buffer);

    try {
      await this.compressVideoFile(inputPath, outputPath, targetBytes);
      const outBuffer = await fs.readFile(outputPath);
      return { buffer: outBuffer, mimetype: "video/mp4", ext: ".mp4" };
    } finally {
      await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);
    }
  }

  async compressVideoFile(inputPath, outputPath, targetBytes) {
    const duration = await this.getVideoDurationSeconds(inputPath);
    const audioBitrate = 128000; // 128 kbps
    const minVideoBitrate = 300000; // 300 kbps

    const totalBitrate =
      duration && duration > 0
        ? Math.floor((targetBytes * 8) / duration)
        : null;
    const videoBitrate =
      totalBitrate && totalBitrate > audioBitrate
        ? Math.max(totalBitrate - audioBitrate, minVideoBitrate)
        : null;

    await new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .outputOptions([
          "-c:v libx264",
          "-preset medium",
          "-c:a aac",
          `-b:a ${audioBitrate}`,
          "-movflags +faststart",
        ])
        .format("mp4")
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject);

      if (videoBitrate) {
        command.outputOptions([`-b:v ${videoBitrate}`]);
      } else {
        // fallback to quality-based compression if duration is unavailable
        command.outputOptions(["-crf 28"]);
      }

      command.run();
    });
  }

  async getVideoDurationSeconds(inputPath) {
    return await new Promise((resolve) => {
      ffmpeg.ffprobe(inputPath, (err, data) => {
        if (err || !data?.format?.duration) return resolve(null);
        resolve(Number(data.format.duration));
      });
    });
  }

  /*--------------------------------------------------------------------
  | upload file to cloudfront r2 bucket                                 |
  ---------------------------------------------------------------------*/
  async uploadToR2(data, path = "") {
    const { filename, file, mimetype } = data;
    path && `${path}/${data.filename}`; //set bucket folder path
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: file,
        ContentType: mimetype,
      }),
    );
    return `${process.env.R2_BUCKET_DOMAIN}${filename}`; //uploaded file public url - use this url for image uploaded
  }

  /*--------------------------------------------------------------------
  | update image url           |
  ---------------------------------------------------------------------*/
  async updateByCondition(
    table,
    data,
    condition,
    connection = null,
    db = "inventory_system",
  ) {
    const tableName = table ? table : this.table;

    // check if the row exists using the given condition
    const exists = await this.checkIfExists(condition, tableName);
    if (!exists) throw new ApiError(`cannot update, row does not exists`, 400);

    // build SET clause
    const setKeys = Object.keys(data);
    const setValues = Object.values(data);
    const setClause = setKeys.map((key) => `${key} = ?`).join(", ");

    // build WHERE clause
    const whereKeys = Object.keys(condition);
    const whereValues = Object.values(condition);
    const whereClause = whereKeys.map((key) => `${key} = ?`).join(" AND ");

    // final query
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const values = [...setValues, ...whereValues];

    return await this.mysql("execute", connection, sql, values, db);
  }
}

module.exports = BaseModel;

