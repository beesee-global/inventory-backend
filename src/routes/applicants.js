async function applicantsRoute(fastify, options) {
    const applicantsModel = fastify.models.ApplicantsModel;

/*     // insert route
    fastify.post(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await applicantsModel.insert(body)
        }
    );  */

    // 
    fastify.get(
        "/",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            const { job_applicant } = request.query
            return await applicantsModel.getAll(job_applicant);
        }
    );

    // get all companies
    fastify.get(
        "/short-list",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { status, job_applicant } = request.query;
            return await applicantsModel.getAllShortListed(status, job_applicant);
        }
    )

    fastify.get(
        "/:pid/applicantInfo",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { pid } = request.params
            return await applicantsModel.getApplicantInformationByPid(pid)
        }
    )

    fastify.get(
        '/rejected',
        { preHandler: fastify.authenticate },
        async (request, reply) =>{
            const { status, job_applicant } = request.query;
            return await applicantsModel.getAllRejected(status, job_applicant)
        }
    );

    fastify.get(
        '/closed',
        { preHandler: fastify.authenticate },
        async (request, reply) =>{
            const { status, job_applicant } = request.query;
            return await applicantsModel.getAllClosed(status, job_applicant)
        }
    )

    fastify.put(
        "/:id",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
             const { id } = request.params;
             const { body } = request;
            return await applicantsModel.updateById(id, body);
        }
    );

    fastify.put(
        '/:id/rejected',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await applicantsModel.updateRejectedById(id, body)
        }
    );

    fastify.put(
        '/:id/closed',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await applicantsModel.updateClosedById(id, body)
        }
    )

    fastify.put(
        '/:id/undo',
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            const { body } = request;
            return await applicantsModel.undoRejectedById(id, body)
        }
    )

    // delete specific companies
    fastify.delete(
        "/",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await applicantsModel.delete(body);
        }
    );

    fastify.post(
        "/sending-interview",
         { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { body } = request;
            return await applicantsModel.sentInterview(body)
        }
    )

    fastify.post(
        "/:id/job-details",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            const { id } = request.params;
            return await applicantsModel.jobDetails(id);
        }
    )
}

module.exports = applicantsRoute;