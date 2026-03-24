const cors = require("@fastify/cors");
const bcrypt = require("fastify-bcrypt");
const multipart = require("@fastify/multipart");
const jwt = require("@fastify/jwt");
const mysql = require("@fastify/mysql");
const dummy = require("./dummy.js");
require("dotenv").config();
const ApiError = require("../src/apiError");

module.exports = async function buildApp(fastify) {
  /*--------------------------------------------------------------------
  | Cors                                                                |
  ---------------------------------------------------------------------*/
  await fastify.register(cors, { 
    origin: process.env.FRONTEND_URL || '*',
    credentials: true 
  });

  /*--------------------------------------------------------------------
  | Bcrypt                                                              |
  ---------------------------------------------------------------------*/
  await fastify.register(bcrypt, { saltWorkFactor: 12 });

  /*--------------------------------------------------------------------
  | multipart                                                           |
  ---------------------------------------------------------------------*/
  await fastify.register(multipart, {
    limits: { fileSize: 130 * 1024 * 1024 },
  });

  /*--------------------------------------------------------------------
  | jwt                                                                 |
  ---------------------------------------------------------------------*/
  await fastify.register(jwt, {
    secret: process.env.AUTH_JWT_KEY,
    sign: { expiresIn: process.env.AUTH_JWT_EXPIRATION || "24h" },
  });

  /*--------------------------------------------------------------------
  | msyql                                                               |
  ---------------------------------------------------------------------*/
  fastify.register(require("@fastify/mysql"), {
    name: "ticketing-system",
    promise: true,
    connectionString: `mysql://${process.env.SQLUSER}:${process.env.SQLPASS}@${process.env.SQLHOST}/${process.env.SQLDBTICKET}`,
  });

  // fastify.register(require("@fastify/mysql"), {
  //   name: "ecommerce-db",
  //   promise: true,
  //   connectionString: `mysql://${process.env.SQLUSER}:${process.env.SQLPASS}@${process.env.SQLHOST}/${process.env.SQLDBECOMMERCE}`,
  // });

  // fastify.register(require("@fastify/mysql"), {
  //   name: "users-db",
  //   promise: true,
  //   connectionString: `mysql://${process.env.SQLUSER}:${process.env.SQLPASS}@${process.env.SQLHOST}/${process.env.SQLDBUSERS}`,
  // });

  /*--------------------------------------------------------------------
  | Api Routes (using route file name)                                  |
  ---------------------------------------------------------------------*/
  const routes = [
    "auth",
    "tickets",    
    "users",
    "categories",
    "products",
    "faqs",
    "inquiries",
    "positions",
    "dashboard", 
    "issues",
    "careers",
    "applicants",
    "ecom_school_processes",
    "ecom_users",
    "ecom_auth",
    "ecom_category",
    "ecom_products",
    "ecom_featured_product",
    "users_userinfo",
    "audit_logs",
  ]; //register routes and models here

  /*--------------------------------------------------------------------
  | Models                                                              |
  ---------------------------------------------------------------------*/
  const allModels = {};

  routes.forEach((model) => {
    const modelClass = require(`./models/${model}.js`);
    const instance = new modelClass(fastify);
    const className = modelClass.name;
    const altName = className.charAt(0).toLowerCase() + className.slice(1);
    allModels[className] = instance;
    allModels[altName] = instance;
    fastify.log.info(`- fastify.models.${className} = ${altName}`);
  });

  fastify.decorate("models", allModels); //make models accessible in fastify instance

  /*--------------------------------------------------------------------
  | route prefix setup using route file name                            |
  ---------------------------------------------------------------------*/
  routes.forEach((route) => {
    fastify.register(require(`./routes/${route}.js`), {
      prefix: `/api/${route}`,
    });
  });

  /*--------------------------------------------------------------------
  | in dev mode use dummy user to set jwt token for proctected routes   |
  ---------------------------------------------------------------------*/
  fastify.addHook("preHandler", async (request, reply) => {
    if (
      process.env.NODE_ENV === "dev" &&
      !("authorization" in request.headers)
    ) {
      const jwtToken = fastify.jwt.sign(dummy);
      request.headers.authorization = `Bearer ${jwtToken}`;
    }
  });

  /*--------------------------------------------------------------------
  | ADD authenticating users for routes                                 |  
  | to use add preHandler: fastify.authenticate in route                |    
  | for testing set NODE_ENV=prod to check authentication               |
  ---------------------------------------------------------------------*/
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw new ApiError("ACCESS DENIED", 401);
    }
  });
};
