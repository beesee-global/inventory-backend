async function  auditLogsRoute(fastify, options) {
    const auditLogsModel = fastify.models.auditLogsModel;

    fastify.get(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => { 
            return await auditLogsModel.getAll();
        }
    );
    
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await auditLogsModel.insert(body)
        }
    );  
}

module.exports = auditLogsRoute;