const BaseModel = require("../base.js");
const ApiError = require("../apiError.js"); 
const { sendEmailWithTemplate, cleanInboundMessage } = require('../helper/postmarkClient.js')
const { v4: uuidv4 } = require('uuid');

class CareersModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "careers", // table name
            "id",   // primary key
            []
        );
    }

    async getAll() {
        try {
            // Replace `created_at` with the column you want to order by
            const sql = `
                SELECT 
                    c.id,
                    c.job_reference_number,
                    c.title,
                    c.job_type,
                    c.location,
                    c.work_location,
                    c.status,
                    c.created_at,
                    SUM(CASE WHEN a.status = 'NEW_APPLICANT' THEN 1 ELSE 0 END) AS num_applicant
                FROM careers AS c
                LEFT JOIN applicants AS a 
                    ON c.job_reference_number = a.job_number
                GROUP BY 
                    c.id,
                    c.job_reference_number,
                    c.title,
                    c.job_type,
                    c.location,
                    c.work_location,
                    c.status,
                    c.created_at
                ORDER BY c.created_at DESC; 
            `;

            const value = [];

            const result = await this.mysql("query", null, sql, value);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            };
        } catch (err) {
            throw new ApiError(err, 400);
        }
    }
 
    async insert(body) {
        try {
            await this.requireFields(body, [
                "title", 
                "description", 
                "job_type",
                "location",
                "work_location", 
            ]);

            const { user_id: actorUserId, ...careersFields } = body;

            const year = new Date().getFullYear();
            const threeDigits = Math.floor(100 + Math.random() * 900);
  
            const job = {
                title: careersFields.title,
                description: careersFields.description,
                job_type: careersFields.job_type,
                location: careersFields.location,
                work_location: careersFields.location,
                status: 'Accepting_Applications',
                careers_job_details: careersFields.careers_job_details,
                created_at: new Date(),
                job_reference_number: `BSG${year}${threeDigits}`
            }

            // Insert main career info
            const careerResult = await this.create(job, "careers");
            const careerId = careerResult.insertId;

        //    // Bulk insert qualifications
        //     if (Array.isArray(body.qualifications) && body.qualifications.length > 0) {
        //         const values = body.qualifications.map(q => `(${careerId}, ?, NOW())`).join(', ');
        //         await this.mysql(
        //             "query",
        //             null,
        //             `INSERT INTO careers_qualifications (careers_id, qualification, created_at) VALUES ${values}`,
        //             body.qualifications
        //         );
        //     }

        //     // Bulk insert responsibilities
        //     if (Array.isArray(body.responsibilities) && body.responsibilities.length > 0) {
        //         const values = body.responsibilities.map(r => `(${careerId}, ?, NOW())`).join(', ');
        //         await this.mysql(
        //             "query",
        //             null,
        //             `INSERT INTO careers_responsibilities (careers_id, responsibilities, created_at) VALUES ${values}`,
        //             body.responsibilities
        //         );
        //     }

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Create",
                entity: "Careers",
                details: `Career created: ${job.title} (${job.job_reference_number}).`,
                status_message: `Career created successfully.`
            }

            // // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);
            return {
                data: {
                    success: true,
                    message: "Career created successfully.",
                    data: { careerId }
                }
            };

        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Create Career Failed",
                entity: "Careers",
                details: `Failed to create career: ${body.title || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
             })
             // throw new ApiError(error, 400);
        }
    }


    async getByRefId(job_reference) {
        try {
            /* const sql = `
                SELECT 
                    c.*, 
                    GROUP_CONCAT(DISTINCT cq.qualification ORDER BY cq.id ASC SEPARATOR '||') AS qualifications,
                    GROUP_CONCAT(DISTINCT cr.responsibilities ORDER BY cr.id ASC SEPARATOR '||') AS responsibilities
                FROM careers c
                LEFT JOIN careers_qualifications cq ON cq.careers_id = c.id
                LEFT JOIN careers_responsibilities cr ON cr.careers_id = c.id
                WHERE c.job_reference_number = ?
                GROUP BY c.id;
            `;

            const result = await this.mysql("query", null, sql, [job_reference]);

            if (!result || result.length === 0) {
                return {
                    data: {
                        success: false,
                        message: "Career not found",
                        data: null
                    }
                };
            }

            const career = result[0];

            // Convert to arrays safely
            const formattedCareer = {
                ...career,
                qualifications: career.qualifications
                    ? career.qualifications.split('||').map(q => q.trim())
                    : [],
                responsibilities: career.responsibilities
                    ? career.responsibilities.split('||').map(r => r.trim())
                    : []
            }; */
            let sql = `
               SELECT *
                FROM careers
                WHERE job_reference_number = ?
            `
            const result = await this.mysql("query", null, sql, [job_reference]);
            return {
                data: {
                    success: true,
                    message: "Career retrieved successfully",
                    data: result[0]
                }
            };
        } catch (error) {
            throw new ApiError(error, 400);
        }
    }
    
    async getByJobRefById (job_reference) {
        try {
            let sql = `
               SELECT *
                FROM careers
                WHERE job_reference_number = ?
                    AND status = 'Accepting_Applications'
            `
            const result = await this.mysql("query", null, sql, [job_reference]);
            return {
                data: {
                    success: true,
                    message: "Career retrieved successfully",
                    data: result[0]
                }
            };
        } catch (error) {
            throw new ApiError(error, 400)
        }
    } 

    async sentEmailHr (parts) {
        try {
            const response = await this.processFile(parts)
            const { files= [], props } = response

            // check if the email existing on the job number
            const applicant_existing = await this.checkIfExists(
                {
                    job_number: props.job_number,
                    email: props.email
                }, 
                    "applicants"
                );
                
            if (applicant_existing) {
                throw new ApiError("Your application already exists.", 409);
            }

            // Prepare Postmark template
            const templateModel = {
                fullName: props.fullName,
                email: props.email,
                phone: props.phone,
                applying : props.applying,
                job_number: props.job_number, 
                current_year: new Date().getFullYear(),
            };

            const applicants = {
                pid: uuidv4(),
                full_name: props.fullName,
                email: props.email,
                phone: props.phone,
                position: props.applying,
                job_number: props.job_number,
                status: "NEW_APPLICANT", 
                is_rejected: 0,
                created_at: new Date()
            }

            const result = await this.create(applicants, "applicants")

            if (files.length > 0) {
                for(const file of files) {
                file.filename = `applicant/${file.filename}`;
                const imageUrl = await this.uploadToR2(file);
                
                    await this.create(
                        {
                            applicants_id: result.insertId,
                            attachment_url: imageUrl,
                            file_name: file.original_name,
                            file_size: file.file_size,
                            file_type: file.mimetype,
                            created_at: new Date()
                        },
                        "applicants_attachment"
                    )
                } 
            }

            // Convert files to Postmark attachments
            const attachments = files.length
            ? files.map((file) => ({
                Name: file.original_name,
                Content: file.file.toString("base64"), // must be base64
                ContentType: file.mimetype,
                }))
            : undefined;


            await sendEmailWithTemplate({
                to: "careers@beesee.ph", // careers@beesee.ph
                templateModel,
                templateId: 43036315,
                replyTo: "no-reply@beesee.ph",
                attachments,
            });

            await sendEmailWithTemplate({
                to: "hr@beesee.ph", // hr@beesee.ph
                templateModel,
                templateId: 43036315,
                replyTo: "no-reply@beesee.ph",
                attachments,
            });

            return {
                data: { 
                    success: true 
                } 
            };
        } catch (err) {
            if (err instanceof ApiError) {
                throw err; // preserve 409
            }
            throw new ApiError.logAndCreate(err, 400, this.fastify, {
                user_id: null,
                action: "Send Application Failed",
                entity: "Careers",
                details: `Failed to send application for job number ${props.job_number}.`,
                status_message: `Error: ${ApiError.getMessage(err)}`
             })
             // throw new ApiError(err, 400);
        }
    }

    async delete(parts) {
        try {
           const response = await this.processFile(parts);
            const { props = {} } = response;

                // Accept ids as array, JSON string (e.g. "[1,2]"), CSV string ("1,2"), or single value.
            let ids = props.ids;
            if (typeof ids === "string") {
                const trimmed = ids.trim();
                if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                    try {
                        ids = JSON.parse(trimmed);
                    } catch (_error) {
                        ids = [];
                    }
                } else if (trimmed.includes(",")) {
                    ids = trimmed.split(",").map((id) => id.trim()).filter(Boolean);
                } else if (trimmed.length > 0) {
                    ids = [trimmed];
                }
            }

            if (!Array.isArray(ids)) {
                ids = [];
            }

            ids = ids
                .map((id) => Number(id))
                .filter((id) => Number.isInteger(id) && id > 0);

            if (ids.length === 0) {
                throw new ApiError("No IDs provided for deletion.", 400);
            }

            // Prepare SQL query
            const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
            const sql = `
                DELETE FROM careers
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids);

            const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "Careers",
                details: `Career records deleted.`,
                status_message: `Deleted  successfully.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
                data: {
                    success: true,
                    message: "Successfully deleted."
                }
            };
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Delete Career Failed",
                entity: "Careers",
                details: `Failed to delete career records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
             });
        }
    }

    async update(id, body) {
        try {
            if (!id) throw new ApiError("Career ID is required for update.", 400);

            const { user_id: actorUserId, ...mainFields } = body;
            delete mainFields.qualifications;
            delete mainFields.responsibilities;

            // 1️⃣ Update main careers table
            const fields = Object.keys(mainFields);
            if (fields.length > 0) {
                const setClause = fields.map(field => `${field} = ?`).join(", ");
                const values = fields.map(field => mainFields[field]);
                values.push(id);

                let sql = `UPDATE careers SET ${setClause} WHERE id = ?`;
                await this.mysql("query", null, sql, values);
            }

            // 2️⃣ Update qualifications
            // if (Array.isArray(body.qualifications)) {
            //     // Delete existing qualifications
            //     await this.mysql(
            //         "query",
            //         null,
            //         "DELETE FROM careers_qualifications WHERE careers_id = ?",
            //         [id]
            //     );
            //     // Insert new qualifications
            //     for (const qualification of body.qualifications) {
            //         await this.create({
            //             careers_id: id,
            //             qualification,
            //             created_at: new Date()
            //         }, "careers_qualifications");
            //     }
            // }

            // // 3️⃣ Update responsibilities
            // if (Array.isArray(body.responsibilities)) {
            //     // Delete existing responsibilities
            //     await this.mysql(
            //         "query",
            //         null,
            //         "DELETE FROM careers_responsibilities WHERE careers_id = ?",
            //         [id]
            //     );
            //     // Insert new responsibilities
            //     for (const responsibility of body.responsibilities) {
            //         await this.create({
            //             careers_id: id,
            //             responsibilities: responsibility,
            //             created_at: new Date()
            //         }, "careers_responsibilities");
            //     }
            // }

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "Careers",
                details: `Career updated${mainFields.title ? `: ${mainFields.title}` : ""}.`,
                status_message: `Career updated successfully.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
                data: {
                    success: true,
                    message: "Career updated successfully."
                }
            };
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Update Career Failed",
                entity: "Careers",
                details: `Failed to update career records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async getAllPublic () {
        try {
            let sql = `
                SELECT 
                    title,
                    job_reference_number,
                    description,
                    job_type,
                    location,
                    work_location,
                    created_at
                FROM careers
                WHERE status = 'Accepting_Applications'
                ORDER BY created_at DESC
            `

            const result = await this.mysql("query", null, sql, []);
            
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            };
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }
}

module.exports = CareersModel;
