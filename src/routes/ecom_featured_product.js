async function  ecomFeaturedProductRoute(fastify, options) {
    const ecomFeatureProductModel = fastify.models.EcomFeatureProductModel;

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await ecomFeatureProductModel.getAll();
        }
    );

    fastify.get(
        "/public",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await ecomFeatureProductModel.getSpecificDisplayPublic();
        }
    ); 
    
    fastify.post(
        "/",
        async (request, reply) => {
            const parts = request.parts();
            return await ecomFeatureProductModel.insert(parts);
        }
    );

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const parts = request.parts();
            return await ecomFeatureProductModel.update(id, parts)
        }
    );

    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
         async (request, reply) => {
            const { pid } = request.params; 
            return await ecomFeatureProductModel.getByPid(pid)
        }
    )

    fastify.delete(
        '/:id',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await ecomFeatureProductModel.delete(id) 
        }
    )
}

module.exports = ecomFeaturedProductRoute