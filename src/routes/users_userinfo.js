async function userUserInfo (fastify, options) {
    const userUserInfoModel = fastify.models.UserUserInfoModel

    fastify.post(
        "/",
        async (request, reply) => {
            const { body } = request; 
            return await userUserInfoModel.insert(body);
        }
    )
}

module.exports = userUserInfo