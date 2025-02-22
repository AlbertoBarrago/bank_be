import fastifySwagger from "@fastify/swagger";
import { FastifyInstance } from "fastify";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { loginSchema, registerSchema } from "../routes/account/schemas";
import { createTransactionSchema } from "../routes/transaction/schemas";

/**
 * Configures the Swagger documentation for the Fastify instance.
 * @param app
 */
export async function configureSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify Bank Service API",
        description: "Banking service API documentation",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Health",
          description: "Health related endpoints",
        },
        {
          name: "Account",
          description: "Account related endpoints",
        },
        {
          name: "Transactions",
          description: "Transaction related endpoints",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          Login: loginSchema.body,
          Account: registerSchema.response[201],
          Transaction: createTransactionSchema.body,
        },
      },
      security: [{ bearerAuth: [] }],
    },
    hideUntagged: true,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}
