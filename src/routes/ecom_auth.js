async function ecomAuth(fastify, options) {
    const ecomAuthModel = fastify.models.EcomAuthModel;

    fastify.post(
        "/login",
        async (request, reply) => {
            const { body } = request;
            return await ecomAuthModel.getByLogin(body);
        }
    );

}

module.exports = ecomAuth;