import { FastifyReply, FastifyRequest } from "fastify";

export class IndexHandlers {
  async healthCheck(request: FastifyRequest, reply: FastifyReply) {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
    };
  }
}
