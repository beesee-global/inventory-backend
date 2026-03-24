const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class FaqsModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "faqs", // table name
            "id",   // primary key
            []
        );
    }

    async insert (body) {   
        try {
            await this.requireFields(body, [
                "title", 
                "explanation", 
                "categories_id",
            ]);

            const { user_id: actorUserId, ...faqsFields } = body;

            if (!faqsFields.products_id) {
                faqsFields.products_id = null;
            }

            // check if name is exist
            const exists = await this.checkIfExists({ title: body.title }, this.table);
            if (exists.is_deleted === 0) {
                throw new ApiError(
                    "Title already exists",
                    400,
                )
            }
 
            faqsFields.pid = uuidv4();
            faqsFields.created_at = new Date();
            const result = await this.create(faqsFields);
           
            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Create",
                entity: "FAQ",
                details: `FAQ created: ${faqsFields.title}.`,
                status_message: `FAQ created successfully.`
            }

            // // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
              data: {
                    success: true,
                    message: "Faqs created successfully.",
                    data: result
              }
            }
            } catch (error) {
                throw new ApiError.logAndCreate(error, 400, this.fastify, {
                    user_id: actorUserId,
                    action: "Create FAQ Failed",
                    entity: "FAQs",
                    details: `Failed to create FAQ: ${faqsFields.title || "N/A"}.`,
                    status_message: `Error: ${ApiError.getMessage(error)}`
                });
        }
    } 

    async getAll () {
        try {
            let sql = `
            SELECT 
                f.id,
                f.pid,
                f.title,
                f.products_id,
                f.categories_id,
                f.created_at,
                f.explanation,
                COALESCE(p.name, 'All') as device,
                c.name as category
            FROM faqs as f
                LEFT JOIN products as p
                    ON p.id = f.products_id
                LEFT JOIN categories as c
                    ON c.id = f.categories_id
            WHERE f.is_deleted = 0
            ORDER BY f.created_at DESC
        `
            const value = [];
            const result = await this.mysql("query", null, sql, value);
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
     }

     async getAllPublic () {
        try {
            let sql = `
            SELECT 
                f.id,
                f.pid,
                f.title,
                f.products_id,
                f.categories_id,
                f.created_at,
                f.explanation,
                p. name as device,
                c.name as category
            FROM faqs as f
                LEFT JOIN products as p
                    ON p.id = f.products_id
                LEFT JOIN categories as c
                    ON c.id = f.categories_id
            WHERE f.is_deleted = 0
            ORDER BY f.created_at DESC
        `
            const value = [];
            const result = await this.mysql("query", null, sql, value);
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
     }

     async getByPid (pid) {
        try {
            let sql = `
            SELECT 
                f.id,
                f.pid,
                f.title,
                f.explanation,
                p.name as device,
                c.name as category
            FROM faqs as f
                LEFT JOIN products as p
                    ON p.id = f.products_id
                LEFT JOIN categories as c
                    ON c.id = f.categories_id
            WHERE f.pid = ?
        `

            const value = [pid];
            const result = await this.mysql("query", null, sql, value);
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result[0]
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }   
     }

    async updateById (id, body) {
        try {
            await this.requireFields(body, [
                "title", 
                "explanation",
                "products_id",
                "categories_id",
            ]);

            const { user_id: actorUserId, ...faqFields } = body;

            const sql = `
                SELECT 
                    *
                FROM faqs
                WHERE id = ?
            `;
            const value = [id];
            const rows = await this.mysql("query", null, sql, value);
            const currentFaq = rows[0];
            if (!currentFaq) {
                throw new ApiError("Faq not found", 404);
            }

            if (currentFaq.issue_id) {
                await this.mysql(
                    "query",
                    null,
                    `
                    UPDATE issues
                        SET name = ?,
                            possible_solutions = ?,
                            product_id = ?,
                            categories_id = ?,
                            is_publish = 1,
                            updated_at = ?
                    WHERE id = ?
                    `,
                    [
                        faqFields.title,
                        faqFields.explanation,
                        faqFields.products_id,
                        faqFields.categories_id,
                        new Date(),
                        currentFaq.issue_id
                    ]
                );
            }
            faqFields.products_id = faqFields.products_id || null
            faqFields.updated_at = new Date();
            faqFields.id = id;

            const result = await this.update(faqFields);

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "FAQ",
                details: `FAQ updated: ${faqFields.title}.`,
                status_message: `FAQ updated successfully.`
            }

            // // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {  
                data : {
                    success: true,
                    message: "Faqs updated successfully",
                    result
                }
            };
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: actorUserId,
                action: "Update FAQ Failed",
                entity: "FAQs",
                details: `Failed to update FAQ: ${body.title || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
             // throw new ApiError(error, 400);
        }
    }

    async delete (parts) {
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
                DELETE FROM faqs
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids);

             const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "FAQ",
                details: "FAQ records deleted.",
                status_message: "FAQ deleted successfully."
            }

            // // Insert audit log
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
                user_id: props.user_id, // extra
                action: "Delete FAQ Failed",
                entity: "FAQs",
                details: `Failed to delete FAQ records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });

        }
    }

}

module.exports = FaqsModel
