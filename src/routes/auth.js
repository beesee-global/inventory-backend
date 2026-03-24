const ApiError = require("../apiError");

async function AuthRoute(fastify, options) {
	const authModel = fastify.models.AuthModel;

	//login route
	fastify.post("/login", async (request, reply) => {
		const {body} = request;
		return await authModel.getByLogin(body)
	});

	fastify.post("/verify-password", 
		{ preHandler: fastify.authenticate },
		async (request, reply) => {
		const { body } = request
		return await authModel.getByPassword(body)
	})

	// logout route
	fastify.post(
		"/:id/logout",
		{ preHandler: fastify.authenticate },
		async (request, reply) => {
			const { id } = request.params;
			return await authModel.logout(id);
		}
	)

	// forget password
	fastify.post(
		"/forget-password",
		async(request, reply) => {
			const { body } = request;
			return await authModel.forgetPassword(body);
		}
	);

	fastify.post(
		"/change-password",
		async(request, reply) => {
			const { body } = request
			return await authModel.changePassword(body)
		}
	)

	//PIN login route
	fastify.post("/pin-login", async (request, reply) => {
		const {body} = request;
		await authModel.requireFields(body, ["pin"]);
		const pin = parseInt(body["pin"]);

		// Validate PIN format (4 digits)
		if (!pin || pin < 1000 || pin > 9999) {
			throw new ApiError("Invalid PIN format. PIN must be 4 digits.", 400);
		}

		// Find user by PIN
		const user = await authModel.findOne({pin});
		if (!user) {
			throw new ApiError("Invalid PIN", 400);
		}

		// Generate JWT token
		const token = fastify.jwt.sign({
			id: user.id,
			full_name: user.firstName + " " + user.middleName + " " + user.lastName,
			sys_id: user.sys_id,
			position: user.position,
			role: user.role,
		});

		return {
			token,
			id: user.id,
			username: user.username,
			full_name: user.firstName + " " + user.middleName + " " + user.lastName,
			sys_id: user.sys_id,
			position: user.position,
			role: user.role,
			permissions: user.permissions || [],
		};
	});
}

module.exports = AuthRoute;
