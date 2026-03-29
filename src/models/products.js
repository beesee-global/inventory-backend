const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class Product extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "products",
            "id",
            []
        );
    }

    async insert(body) {
        try {
            await this.requireFields(body , [
                "name",
                "sku",
                "category_id",
                "supplier_id",
                "cost_price",
                "retail_price",
                "reorder_level",
                "stock_quantity",
                "expiry_date", 
            ]); 

            const existingProduct = await this.checkIfExists({ name: body.name }, "products");  

            if (existingProduct) { 
                throw new ApiError("Product with the same name already exists", 400);
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
            await this.requireFields(body , [
                "name",
                "sku",
                "category_id",
                "supplier_id",
                "cost_price",
                "retail_price",
                "reorder_level",
                "stock_quantity",
                "expiry_date",
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
                SELECT 
                    p.*, 
                    c.name as category_name, 
                    s.name as supplier_name 
                FROM ${this.table} as p
                LEFT JOIN categories as c ON p.category_id = c.id
                LEFT JOIN suppliers as s ON p.supplier_id = s.id
                ORDER BY p.created_at DESC
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
                SELECT 
                    p.*, 
                    c.name as category_name, 
                    s.name as supplier_name 
                FROM ${this.table} as p
                LEFT JOIN categories as c ON p.category_id = c.id
                LEFT JOIN suppliers as s ON p.supplier_id = s.id
                WHERE p.pid = ?
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

    async getById(id) {
        try {
            const result = await this.findById(id);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        }
    }

    async deleteById (id) {
        try {
            let sql = `
                DELETE FROM ${this.table} WHERE id IN (?)
            `

            await this.mysql("query", null, sql, [id]);

            return {    
                success: true,
                message: "Successfully deleted"
            }

        } catch (error) {
            throw new ApiError(error, error?.statusCode || 400);
        }
    }

}

module.exports = Product;
