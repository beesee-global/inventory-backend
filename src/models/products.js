const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class ProductModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "products", // table name
            "id",   // primary key
            []
        );
    }

    async insert (body) {
        try {
            await this.requireFields(body, [
                "name", 
                "categories_id"
            ]);

             const { user_id: actorUserId, ...productFields } = body;

            // check if name is exist
            const exists = await this.checkIfExists({ name: productFields.name, categories_id: body.categories_id }, this.table);
            if (exists.is_deleted === 0) {
                throw new ApiError(
                    "Model name already exists",
                    400,
                )
            }
 
            productFields.pid = uuidv4();
            productFields.created_at = new Date();
            const result = await this.create(productFields);

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Create",
                entity: "Product",
                details: `Product created: ${productFields.name}.`,
                status_message: `Product created successfully.`
            }

            // // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
              data: {
                    success: true,
                    message: "Product created successfully.",
                    data: result
              }
            }
            } catch (error) {
                throw new ApiError.logAndCreate(error, 400, this.fastify, {
                    user_id: actorUserId,
                    action: "Create Product Failed",
                    entity: "Products",
                    details: `Failed to create product: ${productFields.name || "N/A"}.`,
                    status_message: `Error: ${ApiError.getMessage(error)}`
                });
        }
    } 

     async getAll () {
        try {
            let sql = `
            SELECT 
                p.id,
                p.pid,
                p.name AS product_name, 
                p.categories_id,
                c.name AS category_name,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN categories c
                ON c.id = p.categories_id
            WHERE p.is_deleted = 0
            AND c.is_deleted = 0
            ORDER BY p.created_at DESC;
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

     async getAllById (id) {
        try  {
            let sql = `
            SELECT 
                p.id,
                p.pid,
                p.name AS product_name
            FROM products p
            WHERE p.categories_id = ?
            AND p.is_deleted = 0
            ORDER BY p.name ASC
            `
            const value = [id]
            const result = await this.mysql("query", null, sql, value)
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error , 400)
        }
     }

     async getByPid (pid) {
        try {
            let sql = `
            SELECT 
                p.id,
                p.pid,
                p.name AS product_name, 
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
                ON c.id = p.categories_id
            WHERE p.pid = ?
            AND p.is_deleted = 0
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
                "categories_id"
            ]);

            const { user_id: actorUserId, ...productFields } = body;

            // check duplicate name in same category, excluding current record
            const duplicateSql = `
                SELECT id
                FROM products
                WHERE name = ?
                  AND categories_id = ?
                  AND id != ?
                  AND is_deleted = 0
                LIMIT 1
            `;
            const duplicateRows = await this.mysql("query", null, duplicateSql, [
                productFields.name,
                productFields.categories_id,
                id
            ]);
            if (duplicateRows.length > 0) {
                throw new ApiError(
                    "Product name already exists",
                    400,
                )
            }

            productFields.updated_at = new Date();
            productFields.id = id;

            const result = await this.update(productFields);
            
            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "Product",
                details: `Product updated: ${productFields.name}.`,
                status_message: `Product updated successfully.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);
            
            return {  
                data : {
                    success: true,
                    message: "Product updated successfully",
                    result
                }
            };
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: props.user_id,
                action: "Update Product Failed",
                entity: "Products",
                details: `Failed to update product: ${productFields.name || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
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
                UPDATE products SET is_deleted = 1
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids);

            // Issues
            const sqlIssues = `
                UPDATE issues SET is_deleted = 1 
                WHERE product_id IN (${placeholders})
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
            // await this.mysql('query', null, sqTickets, ids)

            const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "Product",
                details: "Product records deleted.",
                status_message: "Product records deleted successfully."
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
                action: "Delete Product Failed",
                entity: "Products",
                details: `Failed to delete product records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
             }); 
        }
    }

}

module.exports = ProductModel       
