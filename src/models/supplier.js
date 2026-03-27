const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class Supplier extends BaseModel {
    constructor(fastify) {
        super(
            fastify,
            "suppliers",
            "id",
            []
        );
    }

    async insert(body) {
        try {
            await this.requireFields(body, [
                "name",
                "contact_person",
                "phone",
                "email",
                "address",
            ]);

            const existingSupplier = await this.checkIfExists({ name: body.name }, "suppliers");

            if (existingSupplier) {
                throw new ApiError("Supplier with the same name already exists", 400);
            }

            body.pid = uuidv4();
            body.created_at = new Date();

            await this.create(body);

            return {
                success: true,
                message: "Successfully created"
            }
        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        }
    }

    async updateById(id, body) {
        try {
            await this.requireFields(body, [
                "name",
                "contact_person",
                "phone",
                "email",
                "address",
            ]);

            body.updated_at = new Date();
            body.id = id;
            await this.update(body);

            return {
                success: true,  
                message: "Successfully updated"
            }
        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        }
    }

    async getAll() {
        try {
            let sql = `
                SELECT * FROM ${this.table}
            `
            const result = await this.mysql("query", null, sql, [])
            return {
                success: true,
                data: result
            };
        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);    
        }
    }

    async getByPid(pid) {
        try {
            let sql = `
                SELECT * FROM ${this.table} WHERE pid = ?
            `
            const result = await this.mysql("query", null, sql, [pid]);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        } 
    }
 
    async deleteById (body) {
        try {
            let sql = `
                DELETE FROM ${this.table} WHERE id IN (?)
            `

            await this.mysql("query", null, sql, [body.id]);

            return {    
                success: true,
                message: "Successfully deleted"
            }

        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        }
    }
}

module.exports = Supplier;