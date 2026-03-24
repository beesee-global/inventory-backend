const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class EcomFeatureProductModel extends BaseModel {
  constructor(fastify) {
    super(fastify, "feature_products", "id", []);
  }

  async insert(parts) {
    try {
      const { files, props } = await this.processFile(parts);

      await this.requireFields(props, ["title"]);

      const products =
        typeof props.products === "string"
          ? JSON.parse(props.products)
          : props.products;

      const techStats =
        typeof props.techStats === "string"
          ? JSON.parse(props.techStats)
          : props.techStats;

      // ===============================
      // INSERT MAIN FEATURE SECTION
      // ===============================
      const featureData = {
        title: props.title,
        name: props.description || null,
        pid: uuidv4(),
        created_at: new Date(),
      };

      const result = await super.create(
        featureData,
        "features",
        null,
        "ecommerce-db",
      );

      const feature_id = result.insertId;

      // ===============================
      // LOOP PRODUCTS
      // ===============================
      for (const item of products) {
        if (!item.product_id) continue;

        // insert feature_products
        const fp = await super.create(
          {
            feature_id: feature_id,
            product_id: item.product_id,
          },
          "feature_products",
          null,
          "ecommerce-db",
        );

        const feature_product_id = fp.insertId;

        // ================= BADGES =================
        if (item.badges?.length) {
          for (const badge of item.badges) {
            await super.create(
              {
                feature_product_id,
                text: badge.text,
              },
              "feature_badges",
              null,
              "ecommerce-db",
            );
          }
        }

        // ================= IMAGES =================
        const productFiles = files.filter((f) => {
          const match = f.fieldname.match(/gallery\[(\d+)\]/);
          return match && parseInt(match[1]) === item.product_id;
        });

        if (productFiles.length) {
          await this.image(productFiles, feature_product_id);
        }
      }

      // ===============================
      // TECH STATS
      // ===============================
      for (const stat of techStats) {
        await super.create(
          {
            feature_id,
            label: stat.label,
            value: stat.value,
          },
          "feature_tech_stats",
          null,
          "ecommerce-db",
        );
      }

      return { success: true, message: "Feature section created successfully" };
    } catch (error) {
      throw new ApiError(error.message || error, 400);
    }
  }

  async getAll() {
    try {
      let sql = `
            SELECT 
                f.id,
                f.pid,
                f.title,
                f.name
            FROM features AS f
            ORDER BY f.created_at DESC
        `;

      const result = await this.mysql("query", null, sql, [], "ecommerce-db");
      return result;
    } catch (error) {
      throw new ApiError(error, 400);
    }
  }

  async getByPid(pid) {
    try {
      // ===============================
      // 1. Get the feature by pid
      // ===============================
      const featureSql = `
        SELECT id, title, name AS description, pid
        FROM features
        WHERE pid = ?
        LIMIT 1
        `;
      const features = await this.mysql(
        "query",
        null,
        featureSql,
        [pid],
        "ecommerce-db",
      );

      if (!features.length) return null;

      const feature = features[0];
      const feature_id = feature.id;

      // ===============================
      // 2. Get feature products
      // ===============================
      const productsSql = `
        SELECT 
            fp.id AS feature_product_id, 
            fp.product_id, 
            p.name AS product_name
        FROM feature_products fp
        JOIN products p ON fp.product_id = p.id
        WHERE fp.feature_id = ?
        ORDER BY fp.id ASC
        `;
      const featureProducts = await this.mysql(
        "query",
        null,
        productsSql,
        [feature_id],
        "ecommerce-db",
      );

      const featureProductIds = featureProducts.map(
        (p) => p.feature_product_id,
      );

      // ===============================
      // 3. Get badges
      // ===============================
      const badgesSql = `
        SELECT 
            fb.feature_product_id, 
            fb.id AS badge_id, 
            fb.text
        FROM feature_badges fb
        WHERE fb.feature_product_id IN (?)
        ORDER BY fb.id ASC
        `;
      const badges = await this.mysql(
        "query",
        null,
        badgesSql,
        [featureProductIds],
        "ecommerce-db",
      );

      // ===============================
      // 4. Get images
      // ===============================
      const imagesSql = `
        SELECT  
            fpi.feature_product_id,
            fpi.attachment_url AS imageUrl
        FROM feature_product_images fpi
        WHERE fpi.feature_product_id IN (?)
        ORDER BY fpi.id ASC
        `;
      const images = await this.mysql(
        "query",
        null,
        imagesSql,
        [featureProductIds],
        "ecommerce-db",
      );

      // ===============================
      // 5. Get tech stats
      // ===============================
      const techStatsSql = `
        SELECT id AS stat_id, label, value
        FROM feature_tech_stats
        WHERE feature_id = ?
        ORDER BY id ASC
        `;
      const techStats = await this.mysql(
        "query",
        null,
        techStatsSql,
        [feature_id],
        "ecommerce-db",
      );

      // ===============================
      // 6. Combine products, badges, images
      // ===============================
      const products = featureProducts.map((fp, index) => ({
        id: `product-${index + 1}`,
        name: fp.product_name,
        imageUrl:
          images.find((img) => img.feature_product_id === fp.feature_product_id)
            ?.imageUrl || null,
        position: index + 1,
        badges: badges
          .filter((b) => b.feature_product_id === fp.feature_product_id)
          .map((b, idx) => ({
            id: `badge-${idx + 1}`,
            text: b.text,
            position: idx + 1,
          })),
      }));

      // ===============================
      // 7. Format tech stats
      // ===============================
      const formattedStats = techStats.map((stat, idx) => ({
        id: `stat-${idx + 1}`,
        value: stat.value,
        label: stat.label,
        order: idx + 1,
      }));

      // ===============================
      // 8. Return display-ready JSON
      // ===============================
      return {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        products,
        techStats: formattedStats,
      };
    } catch (error) {
      throw new ApiError(error.message || error, 400);
    }
  }

  async getSpecificDisplayPublic() {
    try {
      // 1. Get random feature section
      const featureSql = `
            SELECT id, title, name AS description, pid
            FROM features
            ORDER BY RAND()
            LIMIT 1
            `;
      const features = await this.mysql(
        "query",
        null,
        featureSql,
        [],
        "ecommerce-db",
      );
      if (!features.length) return null;
      const feature = features[0];
      const feature_id = feature.id;

      // 2. Get feature products
      const productsSql = `
            SELECT 
                fp.id AS feature_product_id, 
                fp.product_id, 
                p.name AS product_name
            FROM feature_products fp
            JOIN products p ON fp.product_id = p.id
            WHERE fp.feature_id = ?
            ORDER BY fp.id ASC
            `;
      const featureProducts = await this.mysql(
        "query",
        null,
        productsSql,
        [feature_id],
        "ecommerce-db",
      );

      const featureProductIds = featureProducts.map(
        (p) => p.feature_product_id,
      );

      // 3. Get badges
      const badgesSql = `
            SELECT 
                fb.feature_product_id, 
                fb.id AS badge_id, 
                fb.text
            FROM feature_badges fb
            WHERE fb.feature_product_id IN (?)
            ORDER BY fb.id ASC
            `;
      const badges = await this.mysql(
        "query",
        null,
        badgesSql,
        [featureProductIds],
        "ecommerce-db",
      );

      // 4. Get images correctly by feature_product_id
      const imagesSql = `
            SELECT  
                fpi.feature_product_id,
                fpi.attachment_url AS imageUrl
            FROM feature_product_images fpi
            WHERE fpi.feature_product_id IN (?)
            ORDER BY fpi.id ASC
            `;
      const images = await this.mysql(
        "query",
        null,
        imagesSql,
        [featureProductIds],
        "ecommerce-db",
      );

      // 5. Get tech stats
      const techStatsSql = `
            SELECT id AS stat_id, label, value
            FROM feature_tech_stats
            WHERE feature_id = ?
            ORDER BY id ASC
            `;
      const techStats = await this.mysql(
        "query",
        null,
        techStatsSql,
        [feature_id],
        "ecommerce-db",
      );

      // 6. Combine products, badges, images
      const products = featureProducts.map((fp, index) => ({
        id: `product-${index + 1}`,
        name: fp.product_name,
        imageUrl:
          images.find((img) => img.feature_product_id === fp.feature_product_id)
            ?.imageUrl || null,
        position: index + 1,
        badges: badges
          .filter((b) => b.feature_product_id === fp.feature_product_id)
          .map((b, idx) => ({
            id: `badge-${idx + 1}`,
            text: b.text,
            position: idx + 1,
          })),
      }));

      // 7. Format tech stats
      const formattedStats = techStats.map((stat, idx) => ({
        id: `stat-${idx + 1}`,
        value: stat.value,
        label: stat.label,
        order: idx + 1,
      }));

      // 8. Return display-ready JSON
      return {
        title: feature.title,
        description: feature.description,
        products,
        techStats: formattedStats,
      };
    } catch (error) {
      throw new ApiError(error.message || error, 400);
    }
  }

  async update(feature_id, parts) {
    try {
      const { files, props } = await this.processFile(parts);

      const products =
        typeof props.products === "string"
          ? JSON.parse(props.products)
          : props.products;

      const techStats =
        typeof props.techStats === "string"
          ? JSON.parse(props.techStats)
          : props.techStats;

      // ===============================
      // UPDATE MAIN FEATURE SECTION
      // ===============================
      await super.update(
        {
          id: feature_id,
          title: props.title,
          name: props.description || null,
          updated_at: new Date(),
        },
        "features",
        null,
        "ecommerce-db",
      );

      // ===============================
      // UPDATE PRODUCTS
      // ===============================
      if (products && products.length) {
        const existingProducts = await this.mysql(
          "query",
          null,
          "SELECT id, product_id FROM feature_products WHERE feature_id = ?",
          [feature_id],
          "ecommerce-db",
        );

        // Insert new products
        for (const item of products) {
          if (!item.product_id) continue;

          const existing = existingProducts.find(
            (p) => p.product_id === item.product_id,
          );

          let feature_product_id = existing?.id;
          if (!feature_product_id) {
            const result = await super.create(
              {
                feature_id,
                product_id: item.product_id,
              },
              "feature_products",
              null,
              "ecommerce-db",
            );
            feature_product_id = result.insertId;
          }

          // Insert badges
          if (item.badges?.length) {
            await this.mysql(
              "query",
              null,
              "DELETE FROM feature_badges WHERE feature_product_id = ?",
              [feature_product_id],
              "ecommerce-db",
            );

            for (const badge of item.badges) {
              await super.create(
                {
                  feature_product_id,
                  text: badge.text,
                },
                "feature_badges",
                null,
                "ecommerce-db",
              );
            }
          }

          // Insert images (files filtered by product_id)
          if (files?.length) {
            const productFiles = files.filter(
              (file) => file.fieldname === `gallery[${item.product_id}]`,
            );

            if (productFiles.length) {
              await this.image(productFiles, feature_product_id);
            }
          }
        }
      }

      // ===============================
      // UPDATE TECH STATS
      // ===============================
      // Delete old tech stats
      await this.mysql(
        "query",
        null,
        "DELETE FROM feature_tech_stats WHERE feature_id = ?",
        [feature_id],
        "ecommerce-db",
      );

      // Insert new tech stats
      if (techStats && techStats.length) {
        for (const stat of techStats) {
          await super.create(
            { feature_id, label: stat.label, value: stat.value },
            "feature_tech_stats",
            null,
            "ecommerce-db",
          );
        }
      }

      return { success: true, message: "Feature section updated successfully" };
    } catch (error) {
      throw new ApiError(error.message || error, 400);
    }
  }

  // =====================================================
  // IMAGE UPLOAD PER PRODUCT
  // =====================================================
  async image(files, feature_product_id) {
    try {
      if (!files?.length) return;

      // Delete existing images for this product in this feature
      await this.mysql(
        "query",
        null,
        `DELETE FROM feature_product_images WHERE feature_product_id= ?`,
        [feature_product_id],
        "ecommerce-db",
      );

      for (const file of files) {
        const attachment_url = await this.uploadToR2(file);

        await super.create(
          {
            feature_product_id,
            attachment_url,
            file_name: file.original_name,
            file_size: file.file_size,
            file_type: file.mimetype,
          },
          "feature_product_images",
          null,
          "ecommerce-db",
        );
      }
    } catch (err) {
      throw new ApiError(err.message || err, 400);
    }
  }

  async delete(id) {
    try {
      let sql = `
                DELETE FROM features WHERE id = ?
            `;
      const values = [id];

      await this.mysql("query", null, sql, values, "ecommerce-db");

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EcomFeatureProductModel;
