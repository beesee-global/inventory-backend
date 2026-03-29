async function supplierRoutes(fastify, options) {
    const supplierModel = fastify.models.Supplier;

    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await supplierModel.insert(body);
        }
    )

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await supplierModel.getAll();    
        }
    );

    fastify.get(
        "/:pid",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params;
            return await supplierModel.getByPid(pid);
        }
    );

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await supplierModel.updateById(id, body)
        }
    );

    fastify.delete(
        '/:id',
        { preHandler: fastify.authenticate },   
        async (request, reply) => {
            const { id } = request.params;
            return await supplierModel.deleteById(id);
        }
    )
}

module.exports = supplierRoutes;