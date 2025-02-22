import { FastifyInstance } from "fastify";
import NodeCache from "node-cache";

export async function configureCache(app: FastifyInstance): Promise<void> {
  const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

  app.decorate("cache", cache);
  app.decorateRequest("cache", null);

  app.addHook("onClose", async () => {
    cache.close();
  });
}
