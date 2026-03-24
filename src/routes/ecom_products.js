async function ecomProductsRoute(fastify, options) {
    const ecomProductModel = fastify.models.EcomProductModel;

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request ,reply) => {
            return await ecomProductModel.getAll();
        }
    )

    fastify.get(
        "/:pid",
        async (request, reply) => {
            const { pid } = request.params;
            return await ecomProductModel.getByPid(pid)
        }
    )

    fastify.get(
        "/public",
        async (request, reply) => {
            return await ecomProductModel.getAllPublic();
        }
    )

    fastify.get(
        "/:pid/public",
        async (request, reply) => {
            const { pid } = request.params;
            return await ecomProductModel.getByPidPublic(pid);
        }
    )

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await ecomProductModel.insert(parts);
        }
    );

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const parts = request.parts();
            return await ecomProductModel.update(id, parts);
        }
    );

    fastify.delete(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await ecomProductModel.delete(id);
        }
    )
}

module.exports = ecomProductsRoute;