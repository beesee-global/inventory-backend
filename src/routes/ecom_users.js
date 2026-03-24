async function ecomUsersRoute(fastify, options) {
    const ecomUserModel = fastify.models.EcomUserModel;

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await ecomUserModel.insert(body);
        }
    ); 

    fastify.post(
        "/:id/image",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const fileParts = request.parts();

            return await ecomUserModel.images(id, fileParts)
        }
    );

    fastify.get(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await ecomUserModel.getById(id);
        }
    );

    fastify.put(
        "/:id/my-account",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            const { id } = request.params;
            return await ecomUserModel.updatedByIdMyAccount(id, parts);
        }
    )

}

module.exports = ecomUsersRoute;