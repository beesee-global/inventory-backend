async function issuesRoute(fastify, options) {
    const issuesModel = fastify.models.IssuesModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await issuesModel.insert(body)
        }
    );

    fastify.get(
        "/fetch-name",
        { preHandler: fastify.authenticate },
        async (req, rep) => {
            const { name, categories_id } = req.query;
            return await issuesModel.getByName(name, categories_id);
        }
    )

    // get all products
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await issuesModel.getAll();
        }
    )

    // get specific
    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await issuesModel.getByPid(pid);
        }
    );

    // get all specific product by id
    fastify.get(
        "/:id/public",
        async (request, reply) => {
            const { id } = request.params
            return await issuesModel.getAllById(id)
        }
    )

    // update specific products
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await issuesModel.updateById(id, body)
        }
    )

    // delete specific products
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
             const body = request.body ?? request.query ?? {};
            return await issuesModel.delete(body);
        }
    )
}

module.exports = issuesRoute;
