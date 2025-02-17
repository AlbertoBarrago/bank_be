import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

/**
 * Configures the database connection for the Fastify instance.
 * @param app - The Fastify instance.
 */
export async function configureDb(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient();
  await prisma.$connect();

  app.decorate("db", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
