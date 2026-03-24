const ApiError = require("../apiError");

handler = {
  requireUserSession: async (fastify, validation) => {
    fastify.addHook("preHandler", validation);
  }, //use this to protect whole routes, preventing unauthorized access

  // use this to certain route protection, also we can use the request.user on quries where user data is needed such as outlet email access level
  validateUser: async function (request) {
    //check if it has headers authorization
    if (!request.headers.authorization) {
      throw new ApiError("Authorization headers not found", 401);
    }
    //set user from jwt
    await request.jwtVerify();
    const user = request.user;
    return user;
  },
};
module.exports = handler;
