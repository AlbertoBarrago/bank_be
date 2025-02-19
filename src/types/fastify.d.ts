import { PrismaClient } from "@prisma/client";

/**
 * Type definitions for Fastify with custom plugins and decorators
 * @module types/fastify
 */
declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
    cache: NodeCache;
    events: EventEmitter;
    getTestToken: (accountId: string) => string;
  }
}
