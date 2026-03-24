async function careersRoute(fastify, options) {
    const careersModel = fastify.models.CareersModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await careersModel.insert(body)
        }
    );

    fastify.post(
        "/sent-email",
        { preHandler: fastify.authenticate },
        async(request, reply) => {
            const parts = request.parts();
            return await careersModel.sentEmailHr(parts)
        }
    )

    fastify.get(
        "/:job_reference", 
        async (request, reply) => {
            const { job_reference } = request.params;
            return await careersModel.getByRefId(job_reference);
        }
    )

    fastify.get(
        "/:job_reference/public", 
        async (request, reply) => {
            const { job_reference } = request.params;
            return await careersModel.getByJobRefById(job_reference);
        }
    )

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async(request, reply) => { 
            return await careersModel.getAll()
        }
    );

    fastify.get(
        '/public',
        async(request, reply) => {
            return await careersModel.getAllPublic();
        }
    )

    // delete specific companies
    fastify.delete( 
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await careersModel.delete(parts);
        }
    )

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            const { id } = request.params
            return await careersModel.update(id, body);
        }
    )
}

module.exports = careersRoute;