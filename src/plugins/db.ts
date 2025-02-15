import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

export async function configureDb(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient();
  await prisma.$connect();

  // Add prisma to fastify instance
  app.decorate("db", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
