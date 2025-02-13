"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSwagger = configureSwagger;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
async function configureSwagger(app) {
    await app.register(swagger_1.default, {
        swagger: {
            info: {
                title: 'Fastify Bank Service API',
                description: 'Banking service API documentation',
                version: '1.0.0',
            },
            tags: [
                { name: 'accounts', description: 'Account related endpoints' },
                { name: 'transactions', description: 'Transaction related endpoints' }
            ],
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: '/docs'
    });
}
