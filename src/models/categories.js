const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class CategoriesModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "categories", // table name
            "id",   // primary key
            []
        );
    }

    async insert (body) {   
        try {
            await this.requireFields(body, [
                "name", 
            ]);

            const { user_id: actorUserId, ...categoryFields } = body;

            // check if name is exist
            const exists = await this.checkIfExists({ name: categoryFields.name }, this.table);
            if (exists.is_deleted == 0) {
                throw new ApiError(
                    "Category name already exists",
                    400,
                )
            }
 
            categoryFields.pid = uuidv4();
            categoryFields.created_at = new Date();
            const result = await this.create(categoryFields);

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Create",
                entity: "Category",
                details: `Category created: ${categoryFields.name}.`,
                status_message: `Category created successfully`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
              data: {
                    success: true,
                    message: "Category created successfully.",
                    data: result
              }
            }
            } catch (error) {
                throw new ApiError.logAndCreate(error, 400, this.fastify, {
                    user_id: actorUserId,
                    action: "Create Category Failed",
                    entity: "Categories",
                    details: `Failed to create category: ${categoryFields.name || "N/A"}.`,
                    status_message: `Error: ${ApiError.getMessage(error)}`
                });
        }
    } 

     async getAll () {
        try {
            let sql = `
            SELECT * FROM categories
            WHERE is_deleted = 0
            ORDER BY created_at DESC;
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

     async getAllWithNoIsActive () {
        try {
            let sql = `
                SELECT 
                    *
                FROM categories
                WHERE is_active = 'false'
                AND is_deleted = 0
                ORDER BY created_at DESC
            `
            const result = await this.mysql("query", null, sql,[]);

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
            const sql = `
                SELECT *
                FROM categories
                WHERE is_active != 'true'
                AND is_deleted = 0
                ORDER BY name ASC
            `;

            const result = await this.mysql("query", null, sql, []);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            };
        } catch (error) {
            throw new ApiError(error, 400);
        }
    } 

    async getAllSelectField() {
        try {
            const sql = `
                SELECT *
                FROM categories 
                WHERE is_deleted = 0
                ORDER BY name ASC
            `;
            

            const result = await this.mysql("query", null, sql, []);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            };
        } catch (error) {
            throw new ApiError(error, 400);
        }
    } 

    async getAllPublicCs () {
        try {
            const sql = `
               SELECT *
                FROM categories
                WHERE is_deleted = 0
                ORDER BY 
                    is_active = 'true',   -- true goes last
                    name ASC;
            `

            const result = await this.mysql("query", null, sql, []);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error,400)
        }
    }

     async getByPid (pid) {
        try {
            let sql = `
            SELECT *
            FROM categories as c 
            WHERE pid = ?
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
                "name", 
            ]);

            const { user_id: actorUserId, ...categoryFields } = body;
            categoryFields.updated_at = new Date();
            categoryFields.id = id;

            const result = await this.update(categoryFields);

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "Category",
                details: `Category updated: ${categoryFields.name}.`,
                status_message: `Category updated successfully.`
            }

            // // Insert audit log
            // const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            // await auditLogsModel.insert(logs);

            return {  
                data : {
                    success: true,
                    message: "Category updated successfully",
                    result
                }
            };
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: actorUserId,
                action: "Update Category Failed",
                entity: "Categories",
                details: `Failed to update category: ${body.name || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
             // throw new ApiError(error, 400);
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
            const sqlCategories = `
                UPDATE categories SET is_deleted = 1 
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sqlCategories, ids);

            // Product
            const sqlProduct = `
                UPDATE products SET is_deleted = 1 
                WHERE categories_id IN (${placeholders})
            `;
            await this.mysql("query", null, sqlProduct, ids);

            // Issues
            const sqlIssues = `
                UPDATE issues SET is_deleted = 1 
                WHERE categories_id IN (${placeholders})
            `;
            await this.mysql("query", null, sqlIssues, ids);

            // faqs
            const sqlFaqs = `
                UPDATE faqs SET is_deleted = 1
                WHERE categories_id IN (${placeholders})
            `

            await this.mysql('query', null, sqlFaqs, ids)

            // tickets
            // const sqTickets = `
            //     UPDATE tickets SET is_deleted = 1
            //     WHERE categories_id IN (${placeholders})
            // `

            // await this.mysql('query', null, sqTickets, ids);

            const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "Category",
                details: "Category records deleted.",
                status_message: "Deleted successfully."
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
                user_id: props.user_id, // extra
                action: "Delete Category Failed",
                entity: "Categories",
                details: `Failed to delete category records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            }); 
        }
    }


}

module.exports = CategoriesModel
