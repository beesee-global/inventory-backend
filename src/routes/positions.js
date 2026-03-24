async function positionsRoute(fastify, options) {
    const positionsModel = fastify.models.PositionsModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await positionsModel.insert(body)
        }
    );
 
    // get all companies
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await positionsModel.getAll();
        }
    )

    // get specific 
    fastify.get(
        "/:pid", 
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { pid } = request.params;
            return await positionsModel.getByPid(pid);
        }
    );

    // update specific companies
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await positionsModel.updateByPid(id, body)
        }
    )

    // delete specific companies
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await positionsModel.delete(parts);
        }
    )
}

module.exports = positionsRoute;