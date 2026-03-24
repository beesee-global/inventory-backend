const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class EcomProductModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "products", // table name
            "id",   // primary key
            []
        )
    }

    async insert (parts) {
        try { 
            const response = await this.processFile(parts);
            const { files, props } = response;
            await this.requireFields(props, [
                "name",
                "description", 
                "category_id",
                "tagline",
                "quantity"
            ]); 

            const exist = await this.checkIfExists({ name: props.name }, this.table, null, "ecommerce-db");
            if (exist) {
                throw new ApiError("Product with the same name already exists", 400);
            };

            const existTagline = await this.checkIfExists({ tagline: props.tagline }, this.table, null, "ecommerce-db");
            if (existTagline) {
                throw new ApiError("Product with the same tagline already exists", 400);
            }

            const existDescription = await this.checkIfExists({ description: props.description }, this.table, null, "ecommerce-db");
            if (existDescription) {
                throw new ApiError("Product with the same description already exists", 400);
            }

            const products = {
                name: props.name,
                description: props.description,
                quantity: props.quantity,
                category_id: props.category_id,
                tagline: props.tagline,
                pid: uuidv4(),
                created_at: new Date()
            }

            const result = await super.create(
                products,
                this.table,
                null,
                "ecommerce-db"
            )
 
            const hoverSpecsObj =
                typeof props.hoverSpecs === "string"
                    ? JSON.parse(props.hoverSpecs)
                    : props.hoverSpecs;
 
           // ✅ Convert object → iterable
            for (const [key, obj] of Object.entries(hoverSpecsObj)) {
                    const spec = {
                        product_id: result.insertId,
                        spec_key: key,
                        spec_value: obj.value,
                        icon: obj.icon
                    };

                await super.create(
                    spec,
                    "product_hover_specs",
                    null,
                    "ecommerce-db"
                );
            } 

            const detailedSpecsObj = 
                typeof props.detailedSpecs === "string"
                    ? JSON.parse(props.detailedSpecs)
                    : props.detailedSpecs;

            // ✅ Convert object → iterable
            for (const [sectionName, items] of Object.entries(detailedSpecsObj)) {
                const sectionData = {
                    product_id: result.insertId,
                    name: sectionName
                }

                const sectionResult = await super.create(
                    sectionData,
                    "product_spec_sections",
                    null,
                    "ecommerce-db"
                );

                // Now loop each item inside the section
                for (const [itemName, itemValue] of Object.entries(items)) {
                    const itemData = {
                        product_section_id: sectionResult.insertId,
                        spec_key: itemName,
                        spec_value: itemValue
                    };

                    await super.create(
                        itemData,
                        "product_spec_items",
                        null,
                        "ecommerce-db"
                    );
                }
            }

            await this.image(files, result.insertId);
         
            return { message: "Product created successfully" };
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async getAll () {
        try {
            let sql = `
                SELECT 
                    p.id,
                    p.pid,
                    p.name,
                    p.tagline,
                    p.description,
                    p.quantity,                    
                    c.name as category_name,

                    -- main image (sort_order = 1)
                    MAX(
                        CASE 
                            WHEN pi.sort_order = 1 THEN pi.attachment_url 
                        END
                    ) AS image_url,

                    p.created_at
                FROM ${this.table} AS p
                LEFT JOIN categories AS c
                    ON c.id = p.category_id
                LEFT JOIN product_images AS pi
                    on p.id = pi.product_id
                GROUP BY 
                    p.id,
                    p.pid,
                    p.name,
                    p.tagline,
                    p.description,
                    p.quantity,
                    c.name,
                    p.created_at
                ORDER BY p.created_at DESC
            `
            const result = await this.mysql("query", null, sql, [], "ecommerce-db")
            return {
                data: result
            }
        } catch (error) {
            throw new ApiError(error.message || "Failed to get products", error.statusCode || 500);
        }
    }

    async getByPid(pid) {
        try {
            let sql= `
                SELECT 
                    p.id,
                    p.name,
                    p.tagline,
                    p.description,
                    p.quantity,
                    c.name AS category_id,

                    -- ✅ images sorted by sort_order
                    (
                        SELECT JSON_ARRAYAGG(img)
                        FROM (
                            SELECT JSON_OBJECT(
                                'image_url', pi.attachment_url,
                                'sort_order', pi.sort_order
                            ) AS img
                            FROM product_images pi
                            WHERE pi.product_id = p.id
                            ORDER BY pi.sort_order ASC
                        ) AS ordered_images
                    ) AS images,

                    -- ✅ hover specs as ARRAY of objects  
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'key', phs.spec_key,
                                'value', phs.spec_value,
                                'icon', phs.icon
                            )
                        )
                        FROM product_hover_specs phs
                        WHERE phs.product_id = p.id
                    ) AS hover_specs,

                    -- ✅ detailed specs grouped by section
                    (
                        SELECT JSON_OBJECTAGG(
                            pss.name,
                            (
                                SELECT JSON_OBJECTAGG(
                                    psi.spec_key,
                                    psi.spec_value
                                )
                                FROM product_spec_items AS psi
                                WHERE psi.product_section_id = pss.id
                            )
                        )
                        FROM product_spec_sections pss
                        WHERE pss.product_id = p.id
                    ) AS detailed_specs

                FROM products AS p
                LEFT JOIN categories AS c
                    ON p.category_id = c.id
                WHERE p.pid = ?;
            `

            let values = [pid]

            const result = await this.mysql("query", null, sql, values, "ecommerce-db");

            return result[0]
        } catch (error) { 
            throw new ApiError(error.message || "Failed to get product by pid", error.statusCode || 500);
        }
    }

    async getAllPublic () {
        try {
            let sql = `
                SELECT 
                    p.pid,
                    p.name,
                    p.tagline,
                    c.name AS category_name,

                    -- ✅ main image
                    MAX(CASE WHEN pi.sort_order = 1 THEN pi.attachment_url END) AS image_url,

                    -- ✅ hover specs as ARRAY of objects  
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'key', phs.spec_key,
                                'value', phs.spec_value,
                                'icon', phs.icon
                            )
                        )
                        FROM product_hover_specs phs
                        WHERE phs.product_id = p.id
                    ) AS hover_specs

                FROM products p
                LEFT JOIN product_images pi ON p.id = pi.product_id
                LEFT JOIN categories c ON p.category_id = c.id
                GROUP BY p.id;
            `

            const result = await this.mysql("query", null, sql, [], 'ecommerce-db');

            return result;
        } catch (error) {
            throw new ApiError(error.message || "Failed to get public products", error.statusCode || 500);
        }
    }

    async getByPidPublic (pid) {
        try {
            let sql = `
                SELECT 
                    p.pid,
                    p.name,
                    p.tagline,
                    p.description,
                    c.name AS category_name,

                    -- ✅ images sorted by sort_order
                    (
                        SELECT JSON_ARRAYAGG(img)
                        FROM (
                            SELECT JSON_OBJECT(
                                'image_url', pi.attachment_url,
                                'sort_order', pi.sort_order
                            ) AS img
                            FROM product_images pi
                            WHERE pi.product_id = p.id
                            ORDER BY pi.sort_order ASC
                        ) AS ordered_images
                    ) AS images,


                    -- ✅ detailed specs grouped by section
                    (
                        SELECT JSON_OBJECTAGG(
                            pss.name,
                            (
                                SELECT JSON_OBJECTAGG(
                                    psi.spec_key,
                                    psi.spec_value
                                )
                                FROM product_spec_items AS psi
                                WHERE psi.product_section_id = pss.id
                            )
                        )
                        FROM product_spec_sections AS pss
                        WHERE pss.product_id = p.id
                    ) AS detailed_specs

                FROM products AS p
                LEFT JOIN categories AS c
                    ON p.category_id = c.id
                WHERE p.pid = ?;
            `

            const values = [pid];

            const result = await this.mysql("query", null, sql, values, 'ecommerce-db')

            return result[0]
        } catch (error) {
            throw new ApiError(error.message || "Failed to get product by pid", error.statusCode || 500);
        }
    }

    async update(id, parts) {
        try {
            const response = await this.processFile(parts);
            const { files, props } = response;

            await this.requireFields(props, [
                "name",
                "description",
                'quantity',
                'category_id',
                'tagline'
            ]);
 
            // Update main product fields
            const updateData = {
                id,
                name: props.name,
                description: props.description,
                quantity: props.quantity,
                category_id: props.category_id,
                tagline: props.tagline,
                updated_at: new Date()
            };

            await super.update(updateData, this.table, null, 'ecommerce-db');

            // Update hover specs
            if (props.hoverSpecs) {
                const hoverSpecsObj = typeof props.hoverSpecs === "string"
                    ? JSON.parse(props.hoverSpecs)
                    : props.hoverSpecs;

                // Remove existing hover specs
                let sql = `
                    DELETE FROM product_hover_specs
                    WHERE product_id = ?`;
                const value = [id];
                await this.mysql("execute", null, sql, value, 'ecommerce-db');

                // Insert new hover specs
                for (const [key, obj] of Object.entries(hoverSpecsObj)) {
                    await super.create(
                        {
                            product_id: id,
                            spec_key: key,
                            spec_value: obj.value,
                            icon: obj.icon
                        },
                        'product_hover_specs',
                        null,
                        'ecommerce-db'
                    );
                }
            }

            if (props.detailedSpecs) {
                const detailedSpecsObj = typeof props.detailedSpecs === "string"
                    ? JSON.parse(props.detailedSpecs)
                    : props.detailedSpecs;
                
                // Remove existing detailed specs
                let sql = `
                    DELETE FROM product_spec_sections
                    WHERE product_id = ?`;
                const value = [id];
                await this.mysql("execute", null, sql, value, 'ecommerce-db');

                // Insert new detailed specs 
                for (const [sectionName, items] of Object.entries(detailedSpecsObj)) {
                    const sectionData = {
                        product_id: id,
                        name: sectionName
                    }

                    const sectionResult = await super.create(
                        sectionData,
                        "product_spec_sections",
                        null,
                        "ecommerce-db"
                    );

                    // Now loop each item inside the section
                    for (const [itemName, itemValue] of Object.entries(items)) {
                        const itemData = {
                                product_section_id: sectionResult.insertId,
                                spec_key: itemName,
                                spec_value: itemValue
                            };

                            await super.create(
                                itemData,
                                "product_spec_items",
                                null,
                                "ecommerce-db"
                            );
                    }
                }
            }

            // Add new images if provided
            if (files && files.length > 0) {
                await this.image(files, id);
            }

            return { 
                success: true,
                message: "Product updated successfully" 
            };
        } catch (error) {
            throw new ApiError(error.message || "Failed to update product", error.statusCode || 400);
        }
    }

    async delete (id) {
        try {
            let sql = `DELETE FROM ${this.table} WHERE id = ?`;
            const value = [id];
            await this.mysql("query", null, sql, value, 'ecommerce-db');
            return { 
                message: "Product deleted successfully",
                success: true
            };
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async image(files, productId) {
        try {
            if (!files || files.length === 0) return;

            // check if product id existing on product_images
            const existingImages = await this.checkIfExists({ product_id: productId}, "product_images", null, "ecommerce-db");

            if (existingImages) {
                // remove file 
                let sql = `
                    DELETE FROM product_images WHERE product_id = ?
                `
                const value = [productId]

                await this.mysql("query", null, sql, value, 'ecommerce-db')
            }

            for (const file of files) {
                let sort_order = null;  
                // ✅ Ensure fieldname exists
                if (file.fieldname) {
                    const match = file.fieldname.match(/gallery\[(\d+)\]/);
                    if (match) {
                        sort_order = parseInt(match[1]) + 1; // gallery[0] → 1
                    } else if (file.fieldname === "image") {
                        sort_order = 0; // main image
                    }
                } else {
                    // fallback if no fieldname provided
                    sort_order = null;
                }

                // Upload to R2 (or your cloud storage)
                const attachment_url = await this.uploadToR2(file);

                const imageData = {
                    product_id: productId,
                    sort_order,
                    attachment_url,
                    file_name: file.original_name,
                    file_size: file.file_size,
                    file_type: file.mimetype
                };

                await super.create(
                    imageData,
                    "product_images",
                    null,
                    "ecommerce-db"
                );
            }

            return true;
        } catch (error) {
            throw new ApiError(error.message || "Failed to process images", error.statusCode || 500);
        }
    }

 
}

module.exports = EcomProductModel;