async function categoriesRoutes(fastify, options) {
    const categoriesModel = fastify.models.Category;

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await categoriesModel.insert(body);
        }
    )
    
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await categoriesModel.getAll();
        }
    )

    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await categoriesModel.getByPid(pid); 
        }
    );

    // fastify.get(
    //     "/:id",
    //     { preHandler: fastify.authenticate },
    //     async (request, reply) => {
    //         const { id } = request.params;
    //         return await categoriesModel.getById(id);
    //     }
    // );

    fastify.put(    
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => { 
            const { id } = request.params;
            const { body } = request;
            return await categoriesModel.updateById(id, body)
        }
    );

    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await categoriesModel.deleteById(body);
        }
    )
}

module.exports = categoriesRoutes;
 
