async function inquiriesRoute(fastify, options) {
    const inquiriesModel = fastify.models.InquiriesModel;

    // insert route
    fastify.post(
        "/", 
        async (request, reply) => {
            const { body } = request;
            return await inquiriesModel.insert(body)
        }
    );

    // get all companies
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { status } = request.query;
            return await inquiriesModel.getAll(status);
        }
    )

    // get specific 
    fastify.get(
        "/:pid", 
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { pid } = request.params;
            return await inquiriesModel.getByPid(pid);
        }
    );

    fastify.post(
        "/closed",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await inquiriesModel.closedInquiries(body);
        }
    )

    fastify.get(
        "/:id/inquiries",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await inquiriesModel.getById(id) 
        }
    )

    // update specific companies
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await inquiriesModel.inquiriesModel(id, body)
        }
    )

    // delete specific companies
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await inquiriesModel.delete(parts);
        }
    );

    // sending inquiries
    fastify.post(
        "/reply",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await inquiriesModel.sentReply(parts)
        }
    )
}

module.exports = inquiriesRoute;