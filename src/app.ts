import fastify, {FastifyInstance} from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import authRoutes from "./routes/account";
import transactionRoutes from "./routes/transaction";
import indexRoutes from "./routes/index";
import { join } from 'path';


import {
    configureAuth,
    configureCache,
    configureDb,
    configureEvents,
    configureSwagger,
    configureRateLimit
} from "./plugins";

import {index as config} from "./config";
import fastifyStatic from "@fastify/static";

export async function buildApp(): Promise<FastifyInstance> {
    const app = fastify({
        logger: {
            level: config.logLevel,
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
        secret: config.jwt.secret,
    });
    await app.register(fastifyCors, {
        origin: config.cors.origin,
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

    app.register(fastifyStatic, {
        root: join(__dirname, 'public'),
        prefix: '/'
    });

    return app;
}

if (require.main === module) {
    const start = async () => {
        try {
            const app = await buildApp();
            await app.listen({port: config.port, host: config.host});
            app.log.info(`Server listening on ${config.port}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    };
    start();
}
