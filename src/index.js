const Fastify = require("fastify");
const buildApp = require("./app.js");
const { Server } = require("socket.io"); 

const fastify = Fastify({
  bodyLimit: 20 * 1048576,
  logger: true,
});

const SERVER_PORT = process.env.SERVER_PORT || 4003;
const SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";

const start = async () => {
  try {
    await buildApp(fastify); // load plugins, models, routes

    // Set up cron jobs
    const { setupDeletedApplicantCron, markAsClosedCron } = require("./cron/cronJob.js");
    setupDeletedApplicantCron(fastify);
    markAsClosedCron(fastify);

    // Get the underlying Node HTTP server
    const server = fastify.server;

    // Attach Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.VITE_API_URL_FRONTEND || "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      path: "/socket.io/", // explicitly set the path
      transports: ["polling", "websocket"], // start with polling, upgrade to websocket
      pingInterval: 25000,
      pingTimeout: 60000,
      allowEIO3: true, // backward compatibility
      upgradeTimeout: 30000,
      maxHttpBufferSize: 1e8
    });


    // Decorate Fastify BEFORE ready()
    fastify.decorate("io", io);

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join_ticket_room", (ticketId) => {
        socket.join(`ticket_${ticketId}`);
        console.log(`Socket ${socket.id} joined ticket_${ticketId}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    await fastify.ready(); // now safe to call ready()
    await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });
    fastify.log.info(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
