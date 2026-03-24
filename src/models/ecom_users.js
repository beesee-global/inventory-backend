const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require("../helper/hash.js")

class EcomUserModel extends BaseModel {
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
            ]);

            await this.requireFields(body.details, [
                "employment_status", 
                "url_permission"
            ]);

            // check if email already exists
            const emailExists = await this.checkIfExists({ email: body.email }, this.table, null, 'ecommerce-db');
            if (emailExists) {
                throw new ApiError("Email already exists", 400);
            }

            const { details, ...userFields } = body;
            userFields.password = await hashPassword(userFields.password);

            // prepare users data
            const userData = {
                ...userFields,
                pid: uuidv4(),
                created_at: new Date()
            };

            // insert user
            const userResult = await this.create(userData, "users", null, 'ecommerce-db');

            // prepare users_details data
            const userDetailsData = {
                ...details,
                users_id: userResult.insertId, 
            };

            // insert user details
            await this.create(userDetailsData, "users_details", null, 'ecommerce-db');

            return {
                success: true,
                message: "User created successfully.",
                data: {
                    user_id: userResult.insertId,
                }
            };
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async images(userId, fileParts) {
        try {
            const { files = [], props = {} } = await this.processFile(fileParts);

            if (!files.length) {
                return {
                    data: {
                    status: 400,
                    message: "No files uploaded."
                    }
                };
            }
 
            // check if email already exists
            const isUpdate = await this.checkIfExists({ users_id: userId }, "users_image", null, 'ecommerce-db');
             
            for (const file of files) {
                // Normalize filename
                file.filename = `users/ecom/${file.filename}`;

                // Upload image
                const imageUrl = await this.uploadToR2(file);

                if (isUpdate) {
                    await this.updateUserImage(userId, imageUrl, file);
                } else {
                    await this.createUserImage(userId, imageUrl, file);
                }
            }

            return {
                data: {
                    status: 201,
                    message: isUpdate
                    ? "User image updated successfully."
                    : "User image created successfully."
                }
            };

        } catch (error) {
            throw new ApiError(error, 400);
        }
    }

    async updateUserImage(userId, imageUrl, file) {

        /*  const body = {
            users_id: userId,
            image_url: imageUrl,
            updated_at: new Date(),
            file_name: file.original_name,
            file_size: file.file_size,
            file_type: file.mimetype
        };

        await this.update(body, 'users_images', null, 'ecommerce-db'); */

        const sql = `
            UPDATE users_images
            SET image_url = ?, file_name = ?, file_size = ?, file_type = ?
            WHERE users_id = ?
        `;

        const values = [imageUrl, file.original_name, file.file_size, file.mimetype, userId];

        await this.mysql("execute", null, sql, values, "ecommerce-db");
    }

    async createUserImage(userId, imageUrl, file) {
        await this.create(
            {
                users_id: userId,
                image_url: imageUrl,
                created_at: new Date(),
                file_name: file.original_name,
                file_size: file.file_size,
                file_type: file.mimetype,
            },
            "users_images",
            null,
            "ecommerce-db"
        );
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
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id 
            WHERE u.id != ? 
            ORDER BY u.created_at DESC
            ;`;

            const values = [id];
            const result = await this.mysql("query", null, sql, values, 'ecommerce-db');

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
                u.email, 
                u.created_at,
                u.updated_at,
                ud.employment_status, 
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id 
            WHERE u.id = ?
            `

            const value = [id];
            const result = await this.mysql("query", null, sql, value, 'ecommerce-db')

            if (result[0]) {
                // Transform the result to match the new payload structure
                const user = result[0];
                const transformedData = {
                    id: user.id,
                    pid: user.pid,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email, 
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    details: {
                        employment_status: user.employment_status, 
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
            throw new ApiError(error, 400)
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
                u.email, 
                u.created_at,
                u.updated_at,
                ud.employment_status, 
                ui.image_url
            FROM users as u
            LEFT JOIN users_details as ud
                ON ud.users_id = u.id
            LEFT JOIN users_images as ui
                ON ui.users_id = u.id
            WHERE pid = ?
            `

            const value = [pid];
            const result = await this.mysql("query", null, sql, value, 'ecommerce-db')

            if (result[0]) {
                // Transform the result to match the new payload structure
                const user = result[0];
                const transformedData = {
                    id: user.id,
                    pid: user.pid,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email, 
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    details: {
                        employment_status: user.employment_status, 
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
            throw new ApiError(error, 400)
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
                "email"
            ]);

            await this.requireFields(body.details, [
                "employment_status",  
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
            const { details, ...userFields } = body;

            // Prepare user table data
            const userData = {
                ...userFields,
                id,
                updated_at: new Date(),
            };

            // Update users table
            await this.update(userData, "users", null, 'ecommerce-db');

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

            return {
                data: {
                    success: true,
                    message: "User updated successfully.",
                    result,
                },
            };
        } catch (error) {
            // Wrap and throw as API error
            throw new ApiError(error.message || error, 400);
        }
    }

    async updatedByIdMyAccount(id, fileParts) {
        try {
            const response = await this.processFile(fileParts);
            const { files, props } = response

            const userData = {
                first_name: props.first_name,
                last_name: props.last_name,
                email: props.email,
                updated_at: new Date()
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
                "users",
                null, 
                'ecommerce-db'
            );
            
            if (files.length > 0) {
                for(const file of files) {
                    file.filename = `users/${file.filename}`
                    const imageUrl = await this.uploadToR2(file);
                    let sql = `
                        UPDATE users_images 
                            SET image_url = ?
                            WHERE users_id = ?`;
                    let values = [imageUrl, id]; 
                    await this.mysql("query", null, sql, values, 'ecommerce-db');
                }
            }

            return {
                data: {
                    status: 201,
                    message: "Users updated successfully."
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async delete (body) {
        try {
            const ids = body.ids; // extract array of IDs
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new ApiError("No IDs provided for deletion.", 400);
            }

            // Prepare SQL query
            const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
            const sql = `
                DELETE FROM users
                WHERE id IN (${placeholders})
            `;
            await this.mysql("query", null, sql, ids, 'ecommerce-db');

            return {
                data: {
                    success: true,
                    message: "Successfully deleted."
                }
            };
        } catch (error) {
            throw new ApiError("Cannot delete category because it is used in other records.", 400)
        }
    }
}

module.exports = EcomUserModel