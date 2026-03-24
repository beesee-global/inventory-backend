async function schoolProcessesRoute(fastify, options) {
    const schoolProcessesModel = fastify.models.SchoolProcessesModel;

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await schoolProcessesModel.getAll();
        }
    )

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await schoolProcessesModel.insert(parts);
        }
    )
}

module.exports = schoolProcessesRoute;