async function ecomCategoryRoute(fastify, options) {
    const ecomCategoryModel = fastify.models.EcomCategoryModel;

    fastify.get(
        "/",
        { preHandler:fastify.authenticate },
        async (request, reply) => {
            return await ecomCategoryModel.getAll();
        } 
    );

    fastify.get(
        "/public",
        { preHandler:fastify.authenticate },
        async (request, reply) => {
            return await ecomCategoryModel.getAllPublic();
        } 
    );

    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params
            return await ecomCategoryModel.getByPid(pid)
        }
    )

    fastify.post(
        '/',
        { preHandler:fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await ecomCategoryModel.insert(body);
        }
    );

    fastify.put(
        '/:id',
        { preHandler:fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await ecomCategoryModel.update(id, body);
        }
    );

    fastify.delete(
        '/:id',
        { preHandler:fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await ecomCategoryModel.delete(id);
        }
    )
}

module.exports = ecomCategoryRoute;