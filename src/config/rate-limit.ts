import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

/**
 * Rate limit middleware for Fastify.
 * @module config/rate-limit
 * @param app
 */
export default async function rateLimit(app: FastifyInstance) {
  await app.register(fastifyRateLimit, {
    global: false,
    max: 100,
    timeWindow: "1 minute",
  });

  app.addHook("onRoute", (routeOptions) => {
    if (routeOptions.path.includes("/accounts")) {
      routeOptions.config = {
        rateLimit: {
          max: 30,
          timeWindow: "1 minute",
        },
      };
    }
  });

  app.addHook("onRoute", (routeOptions) => {
    if (routeOptions.path.includes("/transactions")) {
      routeOptions.config = {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      };
    }
  });
}
