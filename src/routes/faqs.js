async function faqsRoute(fastify, options) {
    const faqsModel = fastify.models.FaqsModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await faqsModel.insert(body)
        }
    );

    // get all companies
    fastify.get(
        "/public", 
        async (request, reply) => {
            return await faqsModel.getAllPublic();
        }
    )

    
    // get all companies
    fastify.get(
        "/", 
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await faqsModel.getAll();
        }
    )


    // get specific 
    fastify.get(
        "/:pid", 
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { pid } = request.params;
            return await faqsModel.getByPid(pid);
        }
    );

    // update specific companies
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await faqsModel.updateById(id, body)
        }
    )

    // delete specific companies
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await faqsModel.delete(parts);
        }
    )
}

module.exports = faqsRoute;