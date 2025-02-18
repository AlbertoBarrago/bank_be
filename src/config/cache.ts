import NodeCache from "node-cache";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

export default fp(async (app: FastifyInstance) => {
  app.decorate("cache", cache);

  app.decorateRequest("cache", null);
});
