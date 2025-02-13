"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const auth_1 = require("./plugins/auth");
const db_1 = require("./plugins/db");
const swagger_1 = require("./plugins/swagger");
const account_1 = __importDefault(require("./routes/account"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const config_1 = require("./config/config");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: {
            level: config_1.config.logLevel,
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        },
    }).withTypeProvider();
    // Register plugins
    await app.register(jwt_1.default, {
        secret: config_1.config.jwt.secret,
    });
    await app.register(cors_1.default, {
        origin: config_1.config.cors.origin,
        credentials: true,
    });
    await app.register(helmet_1.default);
    await app.register(rate_limit_1.default, {
        max: 100,
        timeWindow: '1 minute',
    });
    // Configure custom plugins
    await (0, swagger_1.configureSwagger)(app);
    await (0, auth_1.configureAuth)(app);
    await (0, db_1.configureDb)(app);
    // Register routes
    await app.register(account_1.default, { prefix: '/api/v1/accounts' });
    await app.register(transaction_1.default, { prefix: '/api/v1/transactions' });
    // Global error handler
    app.setErrorHandler((error, request, reply) => {
        app.log.error(error);
        reply.status(error.statusCode || 500).send({
            error: error.name,
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    });
    return app;
}
// Start the server if this file is run directly
if (require.main === module) {
    const start = async () => {
        try {
            const app = await buildApp();
            await app.listen({ port: config_1.config.port, host: config_1.config.host });
            app.log.info(`Server listening on ${config_1.config.port}`);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    };
    start();
}
