const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require("../helper/hash.js")

class UsersModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "users",
            "id",
            []
        )
    }

    async insert (body) {
        try {
            // Validate that body contains the required nested objects
            if (!body.details) {
                throw new ApiError("details object is required", 400);
            }

            await this.requireFields(body, [
                "first_name",
                "last_name",
                "email",
                "password", 
                "contact_number"
            ]);

            await this.requireFields(body.details, [
                "employment_status",
                "positions_id",
            ]);

            // check if email already exists
            const emailExists = await this.checkIfExists({ email: body.email }, this.table);
            if (emailExists.is_deleted == 0) {
                throw new ApiError("Email already exists", 400);
            }

            const { details, user_id: actorUserId, ...userFields } = body;
            userFields.password = await hashPassword(userFields.password);

            // prepare users data
            const userData = {
                ...userFields,
                pid: uuidv4(),
                created_at: new Date()
            };

            // insert user
            const userResult = await this.create(userData, "users");

            // prepare users_details data
            const userDetailsData = {
                ...details,
                users_id: userResult.insertId,
                created_at: new Date()
            };

            // insert user details
            await this.create(userDetailsData, "users_details");

            const logs = {
                created_at: new Date(),
                user_id: actorUserId, 
                action: "Create",
                entity: "User",
                details: `User account created for ${userFields.first_name} ${userFields.last_name}.`,
                status_message: "User Created Successfully"
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
                success: true,
                message: "User created successfully.",
                data: {
                    user_id: userResult.insertId,
                }
            };
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: body?.user_id || null,
                action: "Create User Failed",
                entity: "User",
                details: "Failed to create user account.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async images(id, fileParts) {
        try {
            const response = await this.processFile(fileParts);
            const { files, props } = response
            
            if (files.length > 0) {
                if (props && props.status === "update") {
                    for(const file of files) {
                        file.filename = `users/${file.filename}`;
                        const imageUrl = await this.uploadToR2(file);

                        let sql = `
                            UPDATE users_images 
                                SET image_url = ?, 
                                updated_at = ? 
                                WHERE users_id = ?`;
                        let values = [imageUrl, new Date(), id]; 
                        await this.mysql("query", null, sql, values);
                    }

                    return {
                        data: {
                            status: 201,
                            message: "Users updated successfully."
                        }
                    }
                } else {
                    for (const file of files) {
                        file.filename = `users/${file.filename}`;
                        const imageUrl = await this.uploadToR2(file);

                        await this.create(
                            {
                                users_id: id,
                                image_url: imageUrl,
                                created_at: new Date()
                            },
                            "users_images"
                        )
                    }

                    return {
                        data: {
                            status: 201,
                            message: "Users created successfully."
                        }
                    }
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Upload User Image Failed",
                entity: "User",
                details: "Failed to upload user image.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async getAll(id) {
        try {
            const sql = `
            SELECT
                u.id,
                u.pid,
                u.first_name,
                u.last_name,
                u.email,
                u.created_at,
                u.updated_at,
                ud.employment_status,
                p.name as position,
                p.is_protected,
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id
            LEFT JOIN positions as p
                ON p.id = ud.positions_id 
                AND (p.is_protected = 0 OR p.is_protected IS NULL)  -- 👈 only non-protected positions
            WHERE u.id != ?
                AND u.is_deleted = 0 
                AND u.id != 24
            ORDER BY u.created_at DESC
            ;`;

            const values = [id];
            const result = await this.mysql("query", null, sql, values);

            // Transform the result
            const transformedData = result.map(user => ({
            id: user.id,
            pid: user.pid,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            details: {
                employment_status: user.employment_status,
                position: user.position
            },
                image_url: user.image_url
            }));

            return {
            data: {
                success: true,
                message: "Retrieved successfully",
                data: transformedData
            }
            };
        } catch (error) {
            throw new ApiError(error, 400);
        }
    }


    async getById (id) {
        try {
            let sql = `
            SELECT
                u.id,
                u.pid,
                u.first_name,
                u.last_name,
                u.contact_number,
                u.email, 
                u.created_at,
                u.updated_at,
                ud.employment_status,
                p.name as position,
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id
            LEFT JOIN positions as p
                ON p.id = ud.positions_id
            WHERE u.id = ?
            `

            const value = [id];
            const result = await this.mysql("query", null, sql, value)

            if (result[0]) {
                // Transform the result to match the new payload structure
                const user = result[0];
                const transformedData = {
                    id: user.id,
                    pid: user.pid,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    contact_number: user.contact_number,
                    email: user.email, 
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    details: {
                        employment_status: user.employment_status,
                        position: user.position
                    },
                    image_url: user.image_url
                };

                return {
                    data: {
                        success: true,
                        message: "Retrieved successfully",
                        data: transformedData
                    }
                }
            } else {
                return {
                    data: {
                        success: true,
                        message: "User not found",
                        data: null
                    }
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Get User Failed",
                entity: "User",
                details: "Failed to retrieve user by ID.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async getByPid (pid) {
        try {
            let sql = `
            SELECT
                u.id,
                u.pid,
                u.first_name,
                u.last_name,
                u.contact_number,
                u.email, 
                u.created_at,
                u.updated_at,
                ud.employment_status,
                ud.positions_id as position,
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id
            WHERE pid = ?
            `

            const value = [pid];
            const result = await this.mysql("query", null, sql, value)

            if (result[0]) {
                // Transform the result to match the new payload structure
                const user = result[0];
                const transformedData = {
                    id: user.id,
                    pid: user.pid,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    contact_number: user.contact_number,
                    email: user.email, 
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    details: {
                        employment_status: user.employment_status,
                        position: user.position
                    },
                    image_url: user.image_url
                };

                return {
                    data: {
                        success: true,
                        message: "Retrieved successfully",
                        data: transformedData
                    }
                }
            } else {
                return {
                    data: {
                        success: true,
                        message: "User not found",
                        data: null
                    }
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: null,
                action: "Get User By PID Failed",
                entity: "User",
                details: "Failed to retrieve user by PID.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async updateById(id, body) {
        try {
            // Validate body
            if (!body.details) {
                throw new ApiError("details object is required", 400);
            }

            await this.requireFields(body, [
                "first_name", 
                "last_name", 
                "email",
                "contact_number"
            ]);
            await this.requireFields(body.details, [
                "employment_status", 
                "positions_id"
            ]);

            // Check if user exists
            const userExists = await this.checkIfExists({ id }, "users");
            if (!userExists) {
                throw new ApiError("User not found", 400);
            }

            // Handle optional password
            if (body.password && body.password.trim() !== "") {
                body.password = await hashPassword(body.password);
            } else {
                delete body.password; // Remove if empty
            }

            // Separate user fields from nested details
           const { details, user_id: actorUserId, ...userFields } = body;

            // Prepare user table data
            const userData = {
                ...userFields,
                id,
                updated_at: new Date(),
            };

            // Update users table
            await this.update(userData, "users");

            // Fetch existing users_details row
            const detailsResult = await this.mysql(
                "query",
                null,
                `SELECT * FROM users_details WHERE users_id = ?`,
                [id]
            );
            const existingDetails = detailsResult[0];
            if (!existingDetails) {
                throw new ApiError("User details not found", 400);
            }

            // Prepare users_details table data
            const userDetailsData = {
                ...details,
                id: existingDetails.id,
                updated_at: new Date(),
            };

            // Update users_details table
            const result = await this.update(userDetailsData, "users_details");

            const logs = {
                created_at: new Date(),
                user_id: actorUserId,
                action: "Update",
                entity: "User",
                details: `User account updated for ${userFields.first_name} ${userFields.last_name}.`,
                status_message: "User Updated Successfully"
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);
            return {
                data: {
                    success: true,
                    message: "User updated successfully.",
                    result,
                },
            };
        } catch (error) {
            // Wrap and throw as API error 
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: auditUserId,
                action: "Update User Failed",
                entity: "User",
                details: "Failed to update user account.",
                status_message: `Error: ${ApiError.getMessage(error)}`
            });
        }
    }

    async updateByIdMyAccount(id, fileParts) {
        let auditUserId = null;
        try {
            const response = await this.processFile(fileParts);
            const { files, props } = response
            auditUserId = props.user_id || null;

            const userData = {
                first_name: props.first_name,
                last_name: props.last_name,
                email: props.email,
                contact_number: props.contact_number,
                updated_at: new Date(),
            };

            if (props.password && props.password.trim() !== "") {
                userData.password = await hashPassword(props.password);
            }

            // Update users table
            await this.update(
                {
                    ...userData,
                    id,
                },
                "users"
            );
            
            if (files.length > 0) {
                for(const file of files) {
                    file.filename = `users/${file.filename}`
                    const imageUrl = await this.uploadToR2(file);
                    let sql = `
                        UPDATE users_images 
                            SET image_url = ?, 
                            updated_at = ? 
                            WHERE users_id = ?`;
                    let values = [imageUrl, new Date(), id]; 
                    await this.mysql("query", null, sql, values);
                }
            }
 
            const logs = {
                created_at: new Date(),
                user_id: props.user_id,
                action: "Update",
                entity: "User",
                details: "User profile updated.",
                status_message: "User Updated Successfully"
            }

            // Insert audit log
            const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
            await auditLogsModel.insert(logs);

            return {
                data: {
                    status: 201,
                    message: "Users updated successfully."
                }
            }
        } catch (error) {
            throw await ApiError.logAndCreate(error, 400, this.fastify, {
                user_id: auditUserId,
                action: "Update My Account Failed",
                entity: "User",
                details: "Failed to update user profile.",
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
        
            
            // Prepare SQL query
            const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
            const sql = `
                UPDATE users SET is_deleted = 1  
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids); 
            
            const logs = {
                created_at: new Date(),
                user_id: props.user_id, // extra
                action: "Delete",
                entity: "User",
                details: "User records deleted.",
                status_message: "Users Deleted Successfully"
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
                user_id: auditUserId,
                action: "Delete User Failed",
                entity: "User",
                details: "Failed to delete user records.",
                status_message:`Error: ${ApiError.getMessage(error)}`
            });
        }
    }
}

module.exports = UsersModel
