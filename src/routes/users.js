async function usersRoute(fastify, options) {
    const usersModel = fastify.models.UsersModel;

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await usersModel.insert(body);
        }
    )

    fastify.post(
        "/:id/image",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const fileParts = request.parts();

            return await usersModel.images(id, fileParts)
        }
    );

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.query
            return await usersModel.getAll(id);
        }
    )

    fastify.get(
        "/by-pid/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await usersModel.getByPid(pid)
        } 
    );

    fastify.get(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await usersModel.getById(id);
        }
    );

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await usersModel.updateById(id, body)
        }
    );

    fastify.put(
        "/:id/my-account",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const parts = request.parts();
            return await usersModel.updateByIdMyAccount(id, parts)
        }
    );

    fastify.put(
        "/:id/image",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const fileParts = request.parts();

            return await usersModel.images(id, fileParts)
        }
    )

    // update status if employeer
    fastify.delete(
        '/',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await usersModel.delete(parts);        
        }
    )
}

module.exports = usersRoute;