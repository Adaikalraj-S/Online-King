"use strict";
// importing env data from config file
const { env, sequelize } = require("./config");
// importing routes
const { categoriesValidators } = require("./validators");

const routes = require("./routes");
// importing sequelize file
const seq = require("./config/sequelize");
const Qs = require("qs");

// importing packages
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
// const SocketIO = require('socket.io');
const HapiCors = require("hapi-cors");

// initializing server
const init = async () => {
  // creating a hapi server
  const server = Hapi.server({
    port: env.PORT,
    host: "0.0.0.0" || env.HOST,
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          console.error("Errors: ", err);
          throw err;
        },
      },
      timeout: {
        socket: 60000,
        server: 60000,
      },
    },
  });

  // // Register Hapi CORS plugin
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ["*"], // Adjust as needed for your specific requirements
    },
  });

  // adding swagger dependencies
  const swaggerOptions = {
    info: {
      title: "OnlineKIng API Documentation",
      version: Pack.version,
    },
    sortEndpoints: "ordered",
    grouping: "tags",
    schemes: ["http", "https"],
  };
  // registering swagger
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  //   server.route({
  //     method: 'GET',
  //     path: '/remove-all-sockets',
  //     handler: (request, h) => {
  //         // Loop through connected sockets and disconnect them
  //         Object.keys(connectedUsers).forEach((socketId) => {
  //             const socket = connectedUsers[socketId].socket;
  //             socket.disconnect(true);
  //         });

  //         // Clear the connectedUsers object
  //         Object.keys(connectedUsers).forEach((socketId) => {
  //             delete connectedUsers[socketId];
  //         });

  //         return 'All sockets removed';
  //     },
  //   });
  //   server.route({
  //     method: 'GET',
  //     path: '/remove-socket/{socket_id}',
  //     handler: (request, h) => {
  //         const { socket_id } = request.params

  //         // Loop through connected sockets and disconnect them
  //         const socket = connectedUsers[socket_id].socket;
  //         socket.disconnect(true);
  //         delete connectedUsers[socket_id];

  //         return 'Socket removed';
  //     },
  // });
  await server.register(require("hapi-response-time"));
  server.route({
    method: "GET",
    path: "/uploads/{path}/{image}",
    options: {
      description: "Fetching static files.",
      // tags,
      validate: {
        // headers: headerValidator,
        params: categoriesValidators.category_image,
      },
      handler: async (req, res) => {
        try {
          const { image, path } = req.params;
          console.log(image);
          const filepath = `./uploads/${path}/${image}`;
          return res.file(filepath);
        } catch (error) {
          return res
            .response({
              code: 400,
              status: "error",
              message: error.message,
            })
            .code(200);
        }
      },
    },
  });

  // const io = SocketIO(server.listener,  {
  //   cors: {
  //     origin: '*',
  //     methods: ['GET', 'POST'],
  //   },
  // });
  // // Define Socket.IO events and handling logic
  // io.on('connection', (socket) => {
  //   connectedUsers[socket.id] = {
  //     socket: socket,
  //     role: socket.handshake.query.role
  //     // Add other user-related information as needed
  //   };
  //   // console.log(connectedUsers);
  //   console.log('A user connected');
  //   // console.log(socket.handshake.query.role);
  //   socket.emit('server-connected', {
  //     message: 'You are now connected to the server.',
  //     id: socket.id
  //   });

  //   // Handle incoming messages
  //   socket.on('message', (message) => {
  //       console.log('Received message:', message);

  //       // Send a message back to the client
  //       socket.send('Hello from the server!');
  //   });

  //   // Handle disconnections
  //   socket.on('disconnect', () => {
  //       delete connectedUsers[socket.id];
  //       console.log('A user disconnected');
  //   });
  // });
  // setIoInstance(io);

  // starting the server
  await server.start();
  // registering the server with a prefix
  // so after base route we need to add /api and
  // then the route which needs to be accessed

  await server.register(routes, {
    routes: {
      prefix: "/api",
    },
  });

  (async (sequelize) => {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })(seq);
  // logging the request method, url, payload, query, params
  server.ext("onRequest", (request, h) => {
    console.log(`${request.method.toUpperCase()} || ${request.url}`);
    console.log("--------------*--------------");
    return h.continue;
  });

  // loading Static Data start
  // const loadCategories = async () => {
  //   const { createClient } = require('redis')
  //   const categories = await CategoriesTableAssociation.findAll({
  //     raw: true
  //   })
  //   const client = createClient();
  //   client.on('error', err => console.log('Redis Client Error', err));
  //   await client.connect();
  //   const alreadyAvailabe = await client.get('categories')
  //   if (!alreadyAvailabe) {
  //     await client.set('categories', JSON.stringify(categories));
  //     console.log('Categories added to redis.');
  //   }
  //   console.log('Categories available in redis.');
  // }

  // (async () => {
  //     await loadCategories()
  // })()
  // loading Static Data end
  // subscriptionCron()
  console.log("Server running on %s", server.info.uri);
  console.log("--------------*--------------");
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
