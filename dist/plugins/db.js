"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDb = configureDb;
const client_1 = require("@prisma/client");
async function configureDb(app) {
    const prisma = new client_1.PrismaClient();
    await prisma.$connect();
    // Add prisma to fastify instance
    app.decorate('db', prisma);
    app.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
}
