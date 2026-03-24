async function productsRoute(fastify, options) {
    const productsModel = fastify.models.ProductModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await productsModel.insert(body)
        }
    );

    // get all products
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await productsModel.getAll();
        }
    )

    // get specific
    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await productsModel.getByPid(pid);
        }
    );

    // get all specific product by id
    fastify.get(
        "/:id/public",
        async (request, reply) => {
            const { id } = request.params
            return await productsModel.getAllById(id)
        }
    )

    // update specific products
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await productsModel.updateById(id, body)
        }
    )

    // delete specific products
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await productsModel.delete(parts);
        }
    )
}

module.exports = productsRoute;
