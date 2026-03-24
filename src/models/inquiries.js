const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');
const { sendEmailWithTemplate } = require('../helper/postmarkClient.js')

class InquiriesModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "inquiries", // table name
            "id",   // primary key
            []
        );
    }

    async insert (body) {   
        try {
            await this.requireFields(body, [
                "name", 
                "email",
                "company",
                "position",
                "contact_number",
                "subject",
                "description",
            ]);

            const userDetails = {
                name: body.name,
                email: body.email,
                company: body.company,
                position: body.position,
                contact_number: body.contact_number,
                pid: uuidv4(),
                created_at: new Date(),
                status: "Unsettled"
            }
 
            const result = await this.create(userDetails);

            const inquiriesConversation = {
                subject: body.subject,
                sender_name: body.name,
                message_body: body.description,
                user_role : "Customer",
                is_inbound: true,
                created_at: new Date(),
                inquiries_id: result.insertId
            }

            await this.create(
                inquiriesConversation,
                "inquiries_reply"
            )

            // // insert notification
            // const notification = {
            //     pid: userDetails.pid,
            //     type: "inquiries",
            //     is_read: 0,
            //     created_at: new Date()
            // }
 
            // // Emit **global notification**
            // if (this.fastify.io) {
            //     this.fastify.io.emit("inquiry-updated", {
            //         message: "New inquiry created",
            //         inquiries_id: result.insertId,
            //     });
            // }

            // await this.create(notification, "notifications")

            return {
              data: {
                    success: true,
                    message: "Inquiries created successfully.",
                    data: result
              }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Create Inquiry Failed",
                entity: "Inquiry",
                details: `Error inserting inquiry`,
                status_message: `Error: ${ApiError.getMessage(error)}`,
            });
        }
    } 

    async closedInquiries (body) {
        try { 
            await this.requireFields(body, [
                "id",
            ]);

            let sql = `
                UPDATE inquiries
                SET status = ?
                WHERE id = ?
            `
            const values = ["Closed", body.id];

            await this.mysql("query", null, sql, values);

            // const logs = {
            //     created_at: new Date(),
            //     user_id: body.user_id, 
            //     action: "Update",
            //     entity: "Inquiry",
            //     details: "Inquiry status updated to Closed."
            // }

            // // Insert audit log
            // const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            // await auditLogsModel.insert(logs);

            return {
                data: {
                    success: true,
                    message: "Inquiries closed successfully.",
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async getAll (status) {
        try {
            let sql = `
                SELECT i.*,
                ir.message_body AS description  ,
                ir.subject
                FROM inquiries i
                LEFT JOIN (
                    SELECT * FROM inquiries_reply
                    WHERE id IN (
                        SELECT MIN(id)
                        FROM inquiries_reply
                        GROUP BY inquiries_id
                    )
                ) ir ON i.id = ir.inquiries_id
                WHERE i.status = ?
                ORDER BY i.created_at DESC
            `
            const value = [status];
            const result = await this.mysql("query", null, sql, value);
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Get Inquiries Failed",
                entity: "Inquiry",
                details: `Failed to retrieve inquiries`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async getByPid (pid) {
        try {
            let sql = `
                SELECT * FROM inquiries
                WHERE pid = ?
            `

            const value = [pid];
            const result = await this.mysql("query", null, sql, value);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result[0],

                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Get Inquiry By PID Failed",
                entity: "Inquiry",
                details: `Failed to retrieve inquiry with pid`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }   
    }

    async getById (id) {
        try {
            let sql = `
                SELECT
                    ir.*,
                    COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                "id", ia.id,
                                "name", ia.file_name,
                                "size", ia.file_size,
                                "type", ia.file_type,
                                "attachment_url", ia.attachment_url
                            )
                        ), JSON_ARRAY()
                    ) AS attachments
                FROM inquiries_reply ir
                LEFT JOIN inquiries_reply_attachment ia
                    ON ir.id = ia.inquiries_reply_id
                WHERE ir.inquiries_id = ?
                GROUP BY ir.id;

            `

            const value = [id];
            const result = await this.mysql("query", null, sql, value);

            // Ensure attachments are always arrays (extra safety)
            const formattedResult = result.map(row => ({
            ...row,
            attachments: Array.isArray(row.attachments)
                ? row.attachments.filter(att => att.id) // remove null attachments
                : []
            }));

                    
            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: formattedResult  
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Get Inquiry Replies Failed",
                entity: "Inquiry",
                details: `Failed to retrieve inquiry replies for inquiry`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
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

            body.updated_at = new Date();
            body.id = id;

            const result = await this.update(body);
            return {  
                data : {
                    success: true,
                    message: "Inquiries updated successfully",
                    result
                }
            };
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Update Inquiry Failed",
                entity: "Inquiry",
                details: `Failed to update inquiry`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async delete (parts) {
        let auditUserId = null;
        try {
           const response = await this.processFile(parts);
            const { props = {} } = response;
            auditUserId = props.user_id || null;

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

            // prepare Sql query
            const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
            const sql = `
                DELETE FROM inquiries
                WHERE id IN (${placeholders})
            `

            const value = [ids]
             await this.mysql("query", null, sql, value)
            
             const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "Inquiry",
                details: "Inquiry records deleted.",
                status_message: `Successfully deleted inquiries.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

             return {
                data: {
                    success: true,
                    message: "Successfully deleted.", 
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: auditUserId,
                action: "Delete Inquiry Failed",
                entity: "Inquiry",
                details: `Failed to delete inquiries.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async sentReply(parts) {
        let auditUserId = null;
        let inquiryId = null;
        try {
            const response = await this.processFile(parts);
            const { files = [], props } = response;
            auditUserId = props.user_id || null;
            inquiryId = props.inquiries_id || null;

            if (!props.sender_email) {
                throw new ApiError("Recipient email is missing.", 400);
            }

            const inquiries = await this.findOne({ id: props.inquiries_id })
            if (!inquiries) {
                throw new ApiError("No data found", 400);
            }

            // Save message in DB
            const saveInquiries = {
                message_body: props.message_body,
                user_role: props.user_role,
                subject: props.subject,
                sender_name: props.sender_name,
                inquiries_id: props.inquiries_id,
                is_inbound: props.is_inbound,
                created_at: new Date(),
            };

            const replyResult = await this.create(saveInquiries, "inquiries_reply");

            // Prepare Postmark template
            const templateModel = {
                name: inquiries.name,
                url_ticket: `${process.env.VITE_API_URL_FRONTEND}/customer-support`,
                message: props.message_body,
                sender_name: "BEESEE INQUIRIES",
                current_year: new Date().getFullYear(),
            };

            // Convert files to Postmark attachments
            const attachments = files.length
            ? files.map((file) => ({
                Name: file.original_name,
                Content: file.file.toString("base64"), // must be base64
                ContentType: file.mimetype,
                }))
            : undefined;

            // Send email with Postmark
            await sendEmailWithTemplate({
            to: props.sender_email,
                templateModel,
                templateId: 42489259,
                replyTo: "no-reply@beesee.ph",
                attachments,
            });

            // Upload to R2 for storage
            if (files.length > 0) {
                for (const file of files) {
                    file.filename = `inquiries_attachment/${file.filename}`;
                    const imageUrl = await this.uploadToR2(file);

                        const payload = {
                            inquiries_reply_id: replyResult.insertId,
                            attachment_url: imageUrl,
                            file_name: file.original_name,
                            file_size: file.file_size,
                            file_type: file.mimetype,
                            created_at: new Date(),
                        };

                    await this.create(payload, "inquiries_reply_attachment");
                }
            }

            // Update inquiry status
            await this.mysql("query", null, `
                UPDATE inquiries
                SET status = ?
                WHERE id = ?
                `, ["Settled", props.inquiries_id]);
 
            // emit event to all connected clients
            if (this.fastify.io) {
                this.fastify.io 
                .emit('inquiry-updated', {
                    message: 'New inquiry created',  
                });
            }

            const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Sent Reply",
                entity: "Inquiry",
                details: `Sent a reply for inquiry.`,
                status_message: `Reply sent successfully for inquiry.`
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);
 
            return { data: { success: true } };
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: auditUserId,
                action: "Send Inquiry Reply Failed",
                entity: "Inquiry",
                details: "Failed to send inquiry reply.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }


/*     async sent (body) {
        try {
            if (!body || !body.pid) {
                throw new ApiError("pid is required", 400)
            }

            const inquiries = await this.findOne({ pid: body.pid });
            if (!inquiries) {
                throw new ApiError("Pid not found", 400)
            }

            if (!inquiries.email) {
                throw new ApiError("Recipient email not found for this inquiry", 400)
            }

            if (!body.message_body) {
                throw new ApiError("message_body is required", 400)
            }

            // Prepare the template model for Postmark
            const templateModel = {
                name: inquiries.name || "Customer",
                url_ticket: `${process.env.VITE_API_URL_FRONTEND}/customer-support`,
                message: body.message_body,
                sender_name: process.env.POSTMARK_FROM_NAME || "BEESEE Support",
                current_year: new Date().getFullYear()
            };

            // Send email via Postmark
            await sendEmailWithTemplate({
                to: inquiries.email,
                templateModel,
                templateId: 42489259, 
                replyTo: "no-reply@beesee.ph",
            });

            let sql = `
                UPDATE inquiries
                SET status = ?
                WHERE id = ?
            `
            const values = ["Completed", inquiries.id];

            await this.mysql("query", null, sql, values);

            // save inquiries conversation
            const inquiriesConversation = {
                sender_email: inquiries.email,
                sender_name: inquiries.name,
                message_body: body.message_body,
                inquiries_id: inquiries.id,
                created_at: new Date()
            }

            await this.create(
                inquiriesConversation,
                "inquiries_attachment"
            )

            return {
                data: {
                    success: true, 
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    } */
}

module.exports = InquiriesModel
