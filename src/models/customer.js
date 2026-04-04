const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class Customer extends BaseModel {
    constructor(fastify) {
        super(
            fastify,
            "customers",
            "id",
            []
        );
    }

    async insert(body) {
        try {
            // Validate the required payload early so bad requests fail clearly.
            await this.requireFields(body, [
                "name",
                "phone",
                "email",
                "address"
            ]);

            // Keep active customer emails unique to avoid ambiguous lookups later.
            const emailExists = await this.checkIfExists({ email: body.email }, this.table);
            if (emailExists) {
                throw new ApiError("Customer email already exists", 400);
            }

            // Only persist the supported customer fields to keep writes predictable.
            const customerData = {
                name: body.name,
                phone: body.phone,
                email: body.email,
                address: body.address,
                is_deleted: 0,
                pid: uuidv4(),
                created_at: new Date()
            };

            const result = await this.create(customerData, this.table);

            return {
                success: true,
                message: "Customer created successfully.",
                data: {
                    customer_id: result.insertId
                }
            };
        } catch (error) {
            throw new ApiError(error.message || error, error?.statusCode || 400);
        }
    }

    async getAll() {
        try {
            const sql = `
                SELECT
                    id,
                    pid,
                    name,
                    phone,
                    email,
                    address,
                    is_deleted,
                    created_at,
                    updated_at
                FROM ${this.table}
                WHERE is_deleted = 0
                ORDER BY created_at DESC
            `;

            const result = await this.mysql("query", null, sql, []);

            return {
                success: true,
                message: "Retrieved successfully.",
                data: result
            };
        } catch (error) {
            throw new ApiError(error.message || error, error?.statusCode || 400);
        }
    }

    async getById(id) {
        try {
            const sql = `
                SELECT
                    id,
                    pid,
                    name,
                    phone,
                    email,
                    address,
                    is_deleted,
                    created_at,
                    updated_at
                FROM ${this.table}
                WHERE id = ?
                    AND is_deleted = 0
                LIMIT 1
            `;

            const result = await this.mysql("query", null, sql, [id]);

            return {
                success: true,
                message: result[0] ? "Retrieved successfully." : "Customer not found.",
                data: result[0] || null
            };
        } catch (error) {
            throw new ApiError(error.message || error, error?.statusCode || 400);
        }
    }

    async updateById(id, body) {
        try {
            // Reuse the same required fields as create so updates stay complete.
            await this.requireFields(body, [
                "name",
                "phone",
                "email",
                "address"
            ]);

            // Soft-deleted customers should behave like missing records in the API.
            const existsSql = `
                SELECT id
                FROM ${this.table}
                WHERE id = ?
                    AND is_deleted = 0
                LIMIT 1
            `;
            const existingCustomer = await this.mysql("query", null, existsSql, [id]);

            if (!existingCustomer[0]) {
                throw new ApiError("Customer not found", 400);
            }

            // Ignore the current row when checking for duplicate emails during updates.
            const duplicateEmailSql = `
                SELECT id
                FROM ${this.table}
                WHERE email = ?
                    AND id != ?
                    AND is_deleted = 0
                LIMIT 1
            `;
            const duplicateEmail = await this.mysql("query", null, duplicateEmailSql, [body.email, id]);

            if (duplicateEmail[0]) {
                throw new ApiError("Customer email already exists", 400);
            }

            const result = await this.update(
                {
                    id,
                    name: body.name,
                    phone: body.phone,
                    email: body.email,
                    address: body.address,
                    updated_at: new Date()
                },
                this.table
            );

            return {
                success: true,
                message: "Customer updated successfully.",
                data: result
            };
        } catch (error) {
            throw new ApiError(error.message || error, error?.statusCode || 400);
        }
    }

    async deleteById(id) {
        try {
            // Soft delete preserves history while removing the customer from normal reads.
            const result = await this.update(
                {
                    id,
                    is_deleted: 1,
                    updated_at: new Date()
                },
                this.table
            );

            return {
                success: true,
                message: "Customer deleted successfully.",
                data: result
            };
        } catch (error) {
            throw new ApiError(error.message || error, error?.statusCode || 400);
        }
    }
}

module.exports = Customer;
