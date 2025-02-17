import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { configureAuth } from "./plugins/auth";
import { configureDb } from "./plugins/db";
import { configureSwagger } from "./plugins/swagger";

import authRoutes from "./routes/account";
import transactionRoutes from "./routes/transaction";
import indexRoutes from "./routes/index";

import { config } from "./config/config";

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: config.logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  await app.register(fastifyJwt, {
    secret: config.jwt.secret,
  });
  await app.register(fastifyCors, {
    origin: config.cors.origin,
    credentials: true,
  });
  await app.register(helmet);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Configure custom plugins
  await configureSwagger(app);
  await configureAuth(app);
  await configureDb(app);

  // Register routes
  await app.register(transactionRoutes, { prefix: "/api/v1/transactions" });
  await app.register(authRoutes, { prefix: "/api/v1/account" });
  await app.register(indexRoutes, { prefix: "/" });
  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  });

  return app;
}

// Start the server if this file is run directly
if (require.main === module) {
  const start = async () => {
    try {
      const app = await buildApp();
      await app.listen({ port: config.port, host: config.host });
      app.log.info(`Server listening on ${config.port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  start();
}
