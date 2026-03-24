const BaseModel = require('../base');
const ApiError = require("../apiError.js"); 
class AuditLogsModel extends BaseModel {
    constructor(fastify) {
        super(
            fastify,
            "audit_logs", // table name
            "id",   // primary key
            []
        );
    }
    
    async getAll() {
       try {
         const sql = `
            SELECT
                al.*,
                -- Keep a readable fallback when the audit log was created without a linked user_id.
                COALESCE(NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''), 'System') AS user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
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
        throw new ApiError (error.message, 400)
       }
    }

    async insert(logData) {
        const sql = `
            INSERT INTO audit_logs (user_id, action, entity, details, status_message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ` 
        const values =  [logData.user_id, logData.action, logData.entity, logData.details, logData.status_message, logData.created_at]
        const result = await this.mysql("query", null, sql, values);
        return {
            data: { 
                success: true,
                message: "Log inserted successfully",
                data: {
                    id: result.insertId,
                    ...logData
                }
            }
        };  
    }
   
}

module.exports = AuditLogsModel;
