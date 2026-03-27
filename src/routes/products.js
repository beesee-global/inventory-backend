async function productsRoutes(fastify, options) {
    const productsModel = fastify.models.Product;

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await productsModel.insert(body);
        }
    )
    
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await productsModel.getAll();
        }
    )

    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await productsModel.getByPid(pid); 
        }
    ); 

    fastify.put(    
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => { 
            const { id } = request.params;
            const { body } = request;
            return await productsModel.updateById(id, body)
        }
    );

    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await productsModel.deleteById(body);
        }
    )
}

module.exports = productsRoutes;
 
