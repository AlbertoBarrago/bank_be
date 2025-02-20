import fastify, {FastifyInstance} from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import authRoutes from "./routes/account";
import transactionRoutes from "./routes/transaction";
import indexRoutes from "./routes/index";

import {
    configureAuth,
    configureCache,
    configureDb,
    configureEvents,
    configureSwagger,
    configureRateLimit
} from "./plugins";

import {index} from "./config";

export async function buildApp(): Promise<FastifyInstance> {
    const app = fastify({
        logger: {
            level: index.logLevel,
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l",
                    ignore: "pid,hostname",
                },
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>();

    await app.register(fastifyJwt, {
        secret: index.jwt.secret,
    });
    await app.register(fastifyCors, {
        origin: index.cors.origin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    await app.register(helmet);

    await configureDb(app);
    await configureAuth(app);
    await configureSwagger(app);
    await configureRateLimit(app);
    await configureEvents(app);
    await configureCache(app)

    await app.register(transactionRoutes, {prefix: "/api/v1/transactions"});
    await app.register(authRoutes, {prefix: "/api/v1/account"});
    await app.register(indexRoutes, {prefix: "/"});

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

if (require.main === module) {
    const start = async () => {
        try {
            const app = await buildApp();
            await app.listen({port: index.port, host: index.host});
            app.log.info(`Server listening on ${index.port}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    };
    start();
}
