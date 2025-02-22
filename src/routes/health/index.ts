import { healthCheckSchema } from "./schemas";
import { IndexHandlers } from "./handlers";
import { FastifyInstance } from "fastify";

export default async function healthRoutes(app: FastifyInstance) {
  const handlers = new IndexHandlers();

  app.get("/", {
    schema: healthCheckSchema,
    handler: handlers.healthCheck,
  });
}
