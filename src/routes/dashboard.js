async function dashboardRoute(fastify, options) {
    const dashboardModel = fastify.models.DashboardModel;

    fastify.get(
        "/stats-category",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await dashboardModel.getStatsCategory();
        }
    );

    fastify.get(
        "/stats-device",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await dashboardModel.getStatsDevice();
        }
    )

    fastify.get(
        "/applicants",
        { preHandler: fastify.authenticate }, 
        async (request, reply) => {
            return await dashboardModel.getCountNewApplicants();
        }
    )

    fastify.get(
        "/overview",
        { preHandler: fastify.authenticate },
        async (request, reply) => {
            return await dashboardModel.getOverview();
        }
    );

    fastify.get(
        "/count-status",
        { preHandler: fastify.authenticate },
        async () => {
            return await dashboardModel.getCountStatus()
        }
    )

    fastify.get(
        "/count-mostly-issue",
        { preHandler: fastify.authenticate },
        async () => {
            return await dashboardModel.getCountMostlyIssue()
        }
    )

    fastify.get(
        "/count-status-by-month",
        { preHandler: fastify.authenticate },
        async () => {
            return await dashboardModel.getCountStatusByMonth()
        }
    )
}

module.exports = dashboardRoute;
