const BaseModel = require("../base.js");
const ApiError = require("../apiError.js"); 
const { sendEmailWithTemplate } = require('../helper/postmarkClient.js');
 
class ApplicantsModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "applicants", // table name
            "id",   // primary key
            []
        );
    }

    async getAllClosed(status, job_applicant) {
        try {
            const sql = `
                SELECT 
                    a.*,
                    aa.attachment_url   
                FROM applicants a
                LEFT JOIN applicants_attachment aa
                    ON a.id = aa.applicants_id
                WHERE a.status = ? 
                AND a.job_number = ?  
                AND a.is_deleted = 0
                ORDER BY a.created_at DESC;
            `;

            const result = await this.mysql("query", null, sql, [status, job_applicant]);

            return {        
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result
                }
            };
        }
        catch (error) {
            throw new ApiError(error, 400);
        }               
    }

    async getAll(job_applicant) {
        try {
            const job_applicants = job_applicant.split(",")

            const placeholders = job_applicants.map(() => '?').join(',');
            const sql = `
                SELECT 
                    a.*,
                    aa.attachment_url 
                FROM applicants a
                LEFT JOIN applicants_attachment aa
                    ON a.id = aa.applicants_id
                WHERE a.job_number IN (${placeholders})  
                AND a.is_deleted = 0
                ORDER BY a.created_at DESC;
            `;

            const result = await this.mysql("query", null, sql, job_applicants);

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

    async getAllRejected(status, job_applicant) {
        try {
            let sql = `
                SELECT 
                    a.*,
                    aa.attachment_url
                FROM applicants a
                LEFT JOIN applicants_attachment aa
                    ON a.id = aa.applicants_id
                WHERE a.status = ?
                AND a.job_number = ? 
                AND a.is_deleted = 0
                ORDER BY a.created_at DESC
            `

            const result = await this.mysql("query", null, sql, [status, job_applicant]);
            return {
                data: {
                    success: true,
                    message: "Retrieve rejected successfully",
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async getAllShortListed(status, job_applicant) {
        try {
            const sql = `
                SELECT 
                    a.*,
                    aa.attachment_url 
                FROM applicants a
                LEFT JOIN applicants_attachment aa
                    ON a.id = aa.applicants_id
                WHERE a.status = ? 
                AND a.job_number = ?  
                AND a.is_deleted = 0
                ORDER BY a.created_at DESC;
            `;

            const result = await this.mysql("query", null, sql, [status, job_applicant]);

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

    async getApplicantInformationByPid (pid) {
        try {
            let sql = `
                SELECT 
                    a.*,
                    aa.attachment_url,
                    aa.file_type,
                    aa.file_size 
                FROM applicants a
                LEFT JOIN applicants_attachment aa
                    ON a.id = aa.applicants_id
                WHERE a.pid = ?
                AND a.is_deleted = 0
            `

            const value = [pid]

            const result = await this.mysql("query", null, sql, value);

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: result[0]
                }
            }
        } catch (error) {
            throw new ApiError (error, 400)
        }
    }

    // updated short listed
    async updateById (id, body) {
        try {
            let sql = `
                UPDATE applicants
                SET status = "SHORTLISTED"
                WHERE id = ?
            `

            const value = [id]

            const result = await this.mysql("execute", null, sql, value);

            const logsData = {
                user_id: body.user_id,
                action: "Update Status",
                entity: "Applicants",
                details: `Applicant status updated to SHORTLISTED.`,
                status_message: `Applicant status updated to SHORTLISTED.`,
                created_at: new Date()
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logsData);

            return {
                data: {
                    success: true,
                    data: {
                        result
                    }
                }
            }
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Update Status Failed",
                entity: "Applicants",
                details: `Failed to update applicant ID status to SHORTLISTED.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            })
        }
    }

    async updateClosedById (id, body) {
        try {
            let sql = `
                UPDATE applicants
                SET status = "CLOSED"
                WHERE id = ?
            `
            const value = [id]

            const result = await this.mysql("execute", null, sql, value);
           
            const logsData = {
                user_id: body.user_id,
                action: "Update Status",
                entity: "Applicants",
                details: `Applicant status updated to CLOSED.`,
                status_message: `Applicant status updated to CLOSED.`,
                created_at: new Date()
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logsData);
            
            return {
                data: {
                    success: true,
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Update Status Failed",
                entity: "Applicants",
                details: `Failed to update applicant ID status to CLOSED.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            })
        }
    }

    async updateRejectedById (id, body) {
        try {
            let sql = `
                UPDATE applicants
                SET status = "REJECTED"
                WHERE id = ?
            `

            const value = [id]

            const result = await this.mysql("execute", null, sql, value);

            const logsData = {
                user_id: body.user_id,
                action: "Update Status",
                entity: "Applicants",
                details: `Applicant status updated to REJECTED.`,
                status_message: `Applicant status updated to REJECTED.`,
                created_at: new Date()
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logsData);

            return {
                data: {
                    success: true,
                    data: {
                        result
                    }
                }
            }
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Update Status Failed",
                entity: "Applicants",
                details: `Failed to update status to SHORTLISTED.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            })
        }
    }

    async undoRejectedById (id, body) {
        try {
            let sql = `
                UPDATE applicants 
                SET status = "NEW_APPLICANT"
                WHERE id = ?
            `
            const value = [id]

            const result = await this.mysql("execute", null, sql, value);

            const logsData = {
                user_id: body.user_id,
                action: "Update Status",
                entity: "Applicants",
                details: `Applicant status updated to NEW_APPLICANT.`,
                status_message: `Applicant status updated to NEW_APPLICANT.`,
                created_at: new Date()
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logsData);

            return {
                data: {
                    success: true,
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Update Status Failed",
                entity: "Applicants",
                details: `Failed to update applicant status to NEW_APPLICANT.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
            })
        }
    }
 
    async delete (body) {
        try {
            const ids = body.ids;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new ApiError("No IDs provided for deletion.", 400);
            }

            // prepare Sql query
            const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
            const sql = `
                UPDATE applicants SET is_deleted = 1
                WHERE id IN (${placeholders})
            `

            const value = [ids]
            await this.mysql("query", null, sql, value)

            const logsData = {
                user_id: body.user_id,
                action: "Delete",
                entity: "Applicants",
                details: `Applicants deleted.`,
                status_message: `Applicants deleted.`,
                created_at: new Date()
            }

                // Insert audit log

            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logsData);
            
            return {
                data: {
                    success: true,
                    message: "Successfully deleted.", 
                }
            }
        } catch (error) {
            throw new ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body.user_id,
                action: "Delete Failed",
                entity: "Applicants",
                details: `Failed to delete applicants.`,
                status_message: `Error: ${ApiError.getMessage(error)}`
             })
        }
    }

    async sentInterview (body) {
        try {
            const templateModel = {
                name: body.name,
                date_schedule: this.formatDateLong(body.date),
                time: this.to12Hour(body.time, body.duration),
                location: body.location,
                schedule_details: body.schedule_details,
                position: body.position,
                format: body.format,
                current_year: new Date().getFullYear()
            }
            
            const templateId = 43242233 //43167768

            await sendEmailWithTemplate({
                to: body.email,
                templateId,  
                templateModel,
                replyTo: "no-reply@beesee.ph"
            });

            return {
                data: {
                    success: true,
                    templateModel
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    formatDateLong(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })
    }

    to12Hour(time, duration) {
        // Parse hour, minute, and AM/PM
        const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
        if (!timeMatch) return time; // fallback if format is wrong

        let [, hourStr, minuteStr, ampm] = timeMatch;
        let hour = Number(hourStr);
        let minute = Number(minuteStr);

        // Convert to 24-hour
        if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
        if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

        const durationMinutes = Number(duration) || 0;

        // Compute end time
        const totalMinutes = hour * 60 + minute + durationMinutes;
        const endHour24 = Math.floor(totalMinutes / 60) % 24;
        const endMinute = totalMinutes % 60;

        // Format start time in 12-hour
        const startAmPm = hour >= 12 ? "PM" : "AM";
        const startHour12 = hour % 12 || 12;

        // Format end time in 12-hour
        const endAmPm = endHour24 >= 12 ? "PM" : "AM";
        const endHour12 = endHour24 % 12 || 12;

        return `${startHour12}:${minute.toString().padStart(2, "0")} ${startAmPm} - ${endHour12}:${endMinute.toString().padStart(2, "0")} ${endAmPm}`;
    }

    async jobDetails (id) {
        try {
            let sql = `
                SELECT
                    title,
                    job_reference_number
                FROM careers
                WHERE job_reference_number = ?
            `

            const result = await this.mysql("query", null, sql, id)

            return {
                data: {
                    success: true,
                    message: "Retrieve Success",
                    data: result[0]
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }
}

module.exports = ApplicantsModel;
