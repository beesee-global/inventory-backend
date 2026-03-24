const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class IssuesModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "issues", // table name
            "id",   // primary key
            []
        );
    }

    async insert (body) {
        let actorUserId;
        let issueFields = {};
        let result;
        try {
            await this.requireFields(body, [
                "name",  
                "product_id",
                "categories_id",
                "possible_solutions",
                "is_publish"
            ]);

            ({ user_id: actorUserId, ...issueFields } = body);
            
            console.log("das", 
                issueFields
            )

            for (const prodId of issueFields.product_id) {
                // check if name is exist
                const exists = await this.checkIfExists(
                    {
                        name: issueFields.name,
                        product_id: prodId,
                        is_deleted: 0,
                    },
                    this.table,
                );
                if (exists) {
                    throw new ApiError("Issue name already exists", 400);
                }
    
                const publishSet = Array.isArray(issueFields.is_publish)
                    ? issueFields.is_publish.map((id) => String(id))
                    : [];

                const issuePayload = {
                    pid: uuidv4(),
                    name: issueFields.name,
                    possible_solutions: issueFields.possible_solutions, 
                    categories_id: issueFields.categories_id,
                    product_id: prodId,
                    is_publish: publishSet.includes(String(prodId)) ? 1 : 0,
                    created_at: new Date(),
                };

                result = await this.create(issuePayload); 
            }
            
            if (Array.isArray(issueFields.is_publish) && issueFields.is_publish.length > 0) {
                for (const publishId of issueFields.is_publish) {
                    const faqs = {
                        pid: uuidv4(),
                        title: issueFields.name,
                        issue_id: result.insertId,
                        explanation: issueFields.possible_solutions,
                        products_id: publishId,
                        categories_id: issueFields.categories_id,
                        created_at: new Date(),
                    };

                    await this.create(faqs, "faqs");
                }
            }

            // inserting logs for issue creation
            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Create",
                entity: "Issue",
                details: `Issue created: ${issueFields.name}.`,
                status_message: `Issue created successfully.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
                data: {
                    success: true,
                    message: "Issues created successfully.",
                },
            };
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: actorUserId,
                action: "Create Issue Failed",
                entity: "Issues",
                details: `Failed to create issue: ${issueFields.name || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`,
            });
        }
    } 
 
     async getAll () {
        try {
            let sql = `
                SELECT 
                    i.id,
                    i.pid,
                    i.name AS name,  
                    i.product_id, 
                    i.categories_id,
                    i.is_publish,
                    i.possible_solutions,
                    p.name AS product_name,
                    c.name AS categories_name,
                    i.created_at,
                    i.updated_at
                FROM issues i 
                LEFT JOIN products p
                    ON p.id = i.product_id
                LEFT JOIN categories c
                    ON c.id = i.categories_id
                WHERE i.is_deleted = 0
                AND p.is_deleted = 0
                AND c.is_deleted = 0
                ORDER BY i.created_at DESC;
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
                i.id,
                i.name
            FROM issues i
            WHERE i.product_id = ?
            AND i.is_deleted = 0
            ORDER BY i.name ASC
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

    async getByName (name, categories_id) {
        try {
            if (!name) {
                throw new ApiError("Field name is required", 400);
            }

            if (categories_id === undefined || categories_id === null) {
                throw new ApiError("Field categories_id is required", 400);
            }

            const sql = `
                SELECT
                    i.*
                FROM issues i
                WHERE i.name = ?
                AND i.is_deleted = 0
                AND i.categories_id = ?
                ORDER BY i.created_at DESC
            `;

            const value = [name, categories_id];
            const rows = await this.mysql("query", null, sql, value);

            if (!rows.length) {
                return {
                    data: {
                        success: true,
                        message: "Retrieved successfully",
                        data: null
                    }
                };
            }

            const firstRow = rows[0];
            const data = {
                name: firstRow.name,
                product_id: rows.map((row) => row.product_id),
                id: rows.map((row) => row.id),
                categories_id: firstRow.categories_id,
                possible_solutions: firstRow.possible_solutions,
                user_id: firstRow.user_id ?? null,
                is_publish: rows.map((row) => row.is_publish)
            };

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    result: data
                }
            };
        } catch (error) {
            throw new ApiError(error, 400);
        }
     }

     async getByPid (pid) {
        try {
            let sql = `
            SELECT 
                i.id,
                i.pid,
                i.name AS issue_name,  
                c.name AS category_name
            FROM issues i 
            LEFT JOIN categories c
                ON c.id = i.categories_id
            WHERE i.is_deleted = 0
            WHERE i.pid = ?
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
        let actorUserId;
        let issueFields = {};
        let bodyId;
        let detail_ids = [];
        try {
            await this.requireFields(body, [
                "name",  
                "categories_id",
                "product_id",
                'is_publish',
                'possible_solutions'
            ]);

            const productSet = Array.isArray(body.product_id)
                ? body.product_id.map((id) => String(id))
                : [];
            const publishSet = Array.isArray(body.is_publish)
                ? body.is_publish.map((id) => String(id))
                : [];

            const invalidPublish = publishSet.filter((id) => !productSet.includes(id));
            if (invalidPublish.length > 0) {
                throw new ApiError(
                    `Cannot update because some items in the publish list are not in the selected products.`,
                    400,
                );
            }

            // get all existing issues
            const sql = `
                SELECT 
                    * 
                FROM issues
                WHERE id = ?
            `

            const value = [id];

            const rows  = await this.mysql("query", null, sql, value);
            const currentIssue = rows[0];

            if (!currentIssue) {
                throw new ApiError("Issue not found", 404);
            }

            // Keep FAQ in sync with issue
            if (publishSet.length === 0) {
                const sql = `DELETE FROM faqs WHERE title = ?`;
                const value = [currentIssue.name];
                await this.mysql("query", null, sql, value);
            } else {
                // Delete FAQs that are no longer published
                const placeholders = publishSet.map(() => "?").join(", ");
                const deleteSql = `
                    DELETE FROM faqs
                    WHERE title = ?
                    AND products_id NOT IN (${placeholders})
                `;
                await this.mysql("query", null, deleteSql, [currentIssue.name, ...publishSet]);

                // Delete FAQs that will be re-created (avoid duplicates)
                const deletePublishedSql = `
                    DELETE FROM faqs
                    WHERE title = ?
                    AND products_id IN (${placeholders})
                `;
                await this.mysql("query", null, deletePublishedSql, [currentIssue.name, ...publishSet]);

                // Create FAQs only for published product_ids
                for (const prodId of publishSet) {
                    const faqs = {
                        pid: uuidv4(),
                        title: body.name,
                        issue_id: id,
                        explanation: body.possible_solutions,
                        products_id: prodId,
                        categories_id: body.categories_id,
                        created_at: new Date(),
                    };

                    await this.create(faqs, "faqs");
                }
            }

            ({
                id: bodyId,
                user_id: actorUserId,
                detail_ids = [],
                ...issueFields
            } = body);

            if (detail_ids.length > 0) {
                const placeholders = detail_ids.map(() => "?").join(", ");

                // Soft-delete removed issue rows and mark as unpublished.
                const sqlUpdateIsDeleted = `
                    UPDATE issues
                    SET is_deleted = 1,
                        is_publish = 0
                    WHERE id IN (${placeholders})
                `;
                await this.mysql("query", null, sqlUpdateIsDeleted, detail_ids);

                // Remove related FAQs for those issues.
                const sqlDeleteFaqs = `
                    DELETE FROM faqs
                    WHERE issue_id IN (${placeholders})
                `;
                await this.mysql("query", null, sqlDeleteFaqs, detail_ids);
            }
 
            const issuePublishSet = Array.isArray(issueFields.is_publish)
                ? issueFields.is_publish.map((id) => String(id))
                : [];

            // check if existing name with different id
            for (const prodId of issueFields.product_id) { 
                const exists = await this.checkIfExists({
                    name: currentIssue.name,
                    product_id: prodId, 
                }, this.table);

                if (exists) {
                    // update all data information for the existing issue
                    let sqlUpdate = `
                        UPDATE issues
                        SET 
                            name = ?,
                            categories_id = ?,
                            possible_solutions = ?,
                            is_publish = ?,
                            is_deleted = 0,
                            updated_at = ?
                        WHERE product_id = ?
                        AND name = ?
                    `;

                    const isPublishValue = issuePublishSet.includes(String(prodId)) ? 1 : 0;
                    await this.mysql("query", null, sqlUpdate, [
                        issueFields.name,
                        issueFields.categories_id,  
                        issueFields.possible_solutions,
                        isPublishValue,
                        new Date(),
                        prodId,
                        currentIssue.name
                    ]);
                } else {
                    // if not exist, create new issue
                    const issuePayload = {
                        ...issueFields,
                        product_id: prodId,
                        pid: uuidv4(),
                        is_publish: issuePublishSet.includes(String(prodId)) ? 1 : 0,
                        created_at: new Date()
                    };

                    await this.create(issuePayload);
                }
            }  
            
            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "Issue",
                details: `Issue updated: ${issueFields.name}.`,
                status_message: `Issue updated successfully.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);
 
            return {  
                data : {
                    success: true,
                    message: "Issue updated successfully", 
                }
            };
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: actorUserId || body?.user_id,
                action: "Update Issue Failed",
                entity: "Issues",
                details: `Failed to update issue: ${issueFields.name || "N/A"}.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async delete (body = {}) {
        try {
            let ids = body.ids;

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
                UPDATE issues SET is_deleted = 1
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids);

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
                user_id: body.user_id, // extra
                action: "Delete",
                entity: "Issue",
                details: "Issue records deleted.",
                status_message: "Issue records deleted successfully."
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
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id, // extra
                action: "Delete Issue Failed",
                entity: "Issues",
                details: `Failed to delete issue records.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
             });
        }
    }

}

module.exports = IssuesModel       
