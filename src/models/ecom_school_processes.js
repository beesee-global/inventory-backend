const ApiError = require("../apiError.js");
const BaseModel = require("../base.js");
const { v4: uuidv4 } = require("uuid");

class SchoolProcessesModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "school_processes",
            "id",
            []
        );
    }

    async insert (parts) {
        try {
            const { files, props } = await this.processFile(parts);

            await this.requireFields(props, ["title", "tagline", "description"]);

            const exist = await this.checkIfExists({ title: props.title }, this.table, null, 'ecommerce-db');

            if (exist) {
                throw new ApiError("School process with the same title already exists", 400);
            }

            props.created_at = new Date();
            props.pid = uuidv4();
            const result = await this.create(props, this.table, null, 'ecommerce-db');

            if (files && files.length > 0) {
                for (const file of files) {
                    file.filename = `school_process/${file.filename}`;
                    const imageUrl = await this.uploadToR2(file);
                    const fileRecord = {
                        school_process_id: result.insertId,
                        image_url: imageUrl,
                        created_at: new Date(),
                    };
                    await this.create(fileRecord, "school_processes_images", null, 'ecommerce-db');
                }
            }

            return { message: "School process created successfully" };

        } catch (error) {
            this.fastify.log.error(error);
            this.startTransaction = false;
            throw new ApiError(error.message || "Failed to insert school process", error.statusCode || 500);
        }
    }

    async getAll() {
        try {
            let sql = `
                SELECT 
                    sp.id,
                    sp.pid,
                    sp.title,
                    sp.tagline,
                    sp.description,
                    sp.created_at,
                    sp.updated_at
                FROM school_processes sp
                ORDER BY sp.created_at DESC;
            `

            const values = [];
            const result = await this.mysql("query", null, sql, values, 'ecommerce-db');
            return {
                success: true,
                data: result,
                message: "School processes retrieved successfully",
            }
        } catch (error) {
            throw new ApiError(error.message || "Failed to insert school process", error.statusCode || 500);
        }
    }

    async getByPid(pid) {
        try  {

        } catch (error) {
            throw new ApiError(error.message || "Failed to get school process by PID", error.statusCode || 500);
        }
    }
}

module.exports = SchoolProcessesModel;