const ApiError = require("../apiError.js");
const BaseModel = require("../base.js");
const { v4: uuidv4 } = require("uuid");

class EcomCategoryModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "categories",
            "id",
            []
        );
    }

    async getAll() {
        try {
            let sql = `
                SELECT * FROM ${this.table} 
                ORDER BY created_at DESC
            `

            const categories = await this.mysql("query", null, sql, [], 'ecommerce-db');

            return { data: categories }
        } catch (error) {
            throw new ApiError(error.message || "Failed to get categories", error.statusCode || 500);
        }
    }

    async getAllPublic() {
        try {
            let sql = `
                SELECT 
                    p.name,
                    p.icon
                FROM ${this.table} as p
                ORDER BY created_at DESC
            `

            const categories = await this.mysql("query", null, sql, [], 'ecommerce-db');

            return { data: categories }
        } catch (error) {
            throw new ApiError(error.message || "Failed to get categories", error.statusCode || 500);
        }
    }

    async getByPid(pid) {
        try {
            let sql = `
                SELECT * FROM ${this.table} 
                WHERE pid = ?
            `

            const value = [pid];

            const result = await this.mysql("query", null, sql, value, 'ecommerce-db');

            return result[0]
        } catch (error) {
            throw new ApiError(error.message, error.statusCode)
        }
    }

    async insert (body) {
        try {
            await this.requireFields(body, [
                "name",  
                "icon",
            ]);

            const exist = await this.checkIfExists({ name: body.name }, this.table, null, 'ecommerce-db');

            if (exist) {
                throw new ApiError("Category with the same name already exists", 400);
            };

            body.created_at = new Date();
            body.pid = uuidv4();

            await this.create(body, this.table, null, 'ecommerce-db');

            return { 
                success: true,
                message: "Category created successfully" 
            };
        } catch (error) {
            throw new ApiError(error.message || "Failed to insert category", error.statusCode || 500);
        }
    }

    async update (id, body) {
        try {
            await this.requireFields(body,[
                "name",
                "icon"
            ]);

            /* const exist = await this.checkIfExists({ name: body.name }, this.table, null, 'ecommerce-db');
            if (exist) {
                throw new ApiError("Category with the same name already exists", 400);
            } */

            const categories = {
                ...body,
                id,
                updated_at: new Date()
            }
            
            await super.update(
                categories,
                "categories",
                null,
                "ecommerce-db"
            );

            return { message: "Category updated successfully" };
        } catch (error) {
            throw new ApiError(error.message || "Failed to update category", error.statusCode || 500);  
        }
    }

    async delete (id) {
        try {
            let sql = `DELETE FROM ${this.table} WHERE id = ?`;

            const value = [id];

            await this.mysql("query", null, sql, value, 'ecommerce-db');

            return { 
                success: true,
                message: "Category deleted successfully" 
            };
        } catch (error) {
            // ✅ Handle foreign key constraint
            if (error?.errno === 1451) {
                throw new ApiError(
                    "Cannot delete this category because it is being used by existing products.",
                    409 // Conflict
                );
            }

            // Fallback
            throw new ApiError(
                "Failed to delete category",
                500
            );
        }
    }
}

module.exports = EcomCategoryModel;