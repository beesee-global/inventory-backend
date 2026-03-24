async function companiesRoute(fastify, options) {
    const categoriesModel = fastify.models.CategoriesModel;

    // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await categoriesModel.insert(body)
        }
    );

    // get all companies
    fastify.get(
        "/", 
        async (request, reply) => {
            return await categoriesModel.getAll();
        }
    );

        // get all companies
    fastify.get(
        "/public", 
        async (request, reply) => {
            return await categoriesModel.getAllPublic();
        }
    )

    fastify.get(
        "/no_is_active",
        async (request, reply) => {
            return await categoriesModel.getAllWithNoIsActive();
        }
    )

    fastify.get(
        "/select-field", 
        async (request, reply) => {
            return await categoriesModel.getAllSelectField();
        }
    )
 
    fastify.get(
        "/cs/public",
        async(request, reply) => {
            return await categoriesModel.getAllPublicCs();
        }
    )


    // get specific 
    fastify.get(
        "/:pid", 
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { pid } = request.params;
            return await categoriesModel.getByPid(pid);
        }
    );

    // update specific companies
    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await categoriesModel.updateById(id, body)
        }
    )

    // delete specific companies
    fastify.delete( 
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const parts = request.parts();
            return await categoriesModel.delete(parts);
        }
    )
}

module.exports = companiesRoute;
