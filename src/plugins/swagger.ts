import fastifySwagger from "@fastify/swagger";
import { FastifyInstance } from "fastify";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function configureSwagger(app: FastifyInstance): Promise<void> {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify Bank Service API",
        description: "Banking service API documentation",
        version: "1.0.0",
      },
      tags: [
        {
          name: "authorization",
          description: "Authentication related endpoints",
        },
        { name: "transactions", description: "Transaction related endpoints" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}
