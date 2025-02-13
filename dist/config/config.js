"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const typebox_1 = require("@sinclair/typebox");
const env_var_1 = __importDefault(require("env-var"));
const envSchema = typebox_1.Type.Object({
    NODE_ENV: typebox_1.Type.String(),
    PORT: typebox_1.Type.Number(),
    HOST: typebox_1.Type.String(),
    JWT_SECRET: typebox_1.Type.String(),
    DATABASE_URL: typebox_1.Type.String(),
    CORS_ORIGIN: typebox_1.Type.String(),
    LOG_LEVEL: typebox_1.Type.String(),
});
exports.config = {
    env: env_var_1.default.get('NODE_ENV').required().asString(),
    port: env_var_1.default.get('PORT').required().asPortNumber(),
    host: env_var_1.default.get('HOST').required().asString(),
    jwt: {
        secret: env_var_1.default.get('JWT_SECRET').required().asString(),
    },
    db: {
        url: env_var_1.default.get('DATABASE_URL').required().asString(),
    },
    cors: {
        origin: env_var_1.default.get('CORS_ORIGIN').required().asString(),
    },
    logLevel: env_var_1.default.get('LOG_LEVEL').default('info').asString(),
};
