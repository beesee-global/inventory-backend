async function customerRoute(fastify) {
    const customerModel = fastify.models.Customer;

    // Create a new customer record.
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request) => {
            return await customerModel.insert(request.body);
        }
    );

    // List active customers only.
    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async () => {
            return await customerModel.getAll();
        }
    );

    // Fetch one active customer by numeric id.
    fastify.get(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request) => {
            const { id } = request.params;
            return await customerModel.getById(id);
        }
    );

    // Update the editable customer fields.
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request) => {
            const { id } = request.params;
            return await customerModel.updateById(id, request.body);
        }
    );

    // Soft delete a customer instead of removing the row permanently.
    fastify.delete(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request) => {
            const { id } = request.params;
            return await customerModel.deleteById(id);
        }
    );
}

module.exports = customerRoute;
