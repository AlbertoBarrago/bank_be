import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import {index as config} from ".././config";

/**
 * Rate limit middleware for Fastify.
 * @module config/rate-limit
 * @param app
 */
export default async function configureRateLimit(app: FastifyInstance) {
  await app.register(fastifyRateLimit, {
    global: false,
    max: 100,
    timeWindow: config.rateLimit.timeWindow,
  });

  app.addHook("onRoute", (routeOptions) => {
    if (routeOptions.path.includes("/accounts")) {
      routeOptions.config = {
        rateLimit: {
          max: 30,
          timeWindow: config.rateLimit.timeWindow,
        },
      };
    }
  });

  app.addHook("onRoute", (routeOptions) => {
    if (routeOptions.path.includes("/transactions")) {
      routeOptions.config = {
        rateLimit: {
          max: 10,
          timeWindow: config.rateLimit.timeWindow,
        },
      };
    }
  });
}
