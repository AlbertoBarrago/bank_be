"use strict";
exports.__esModule = true;
exports.config = void 0;
var typebox_1 = require("@sinclair/typebox");
var env_var_1 = require("env-var");
var envSchema = typebox_1.Type.Object({
    NODE_ENV: typebox_1.Type.String(),
    PORT: typebox_1.Type.Number(),
    HOST: typebox_1.Type.String(),
    JWT_SECRET: typebox_1.Type.String(),
    DB_URL: typebox_1.Type.String(),
    CORS_ORIGIN: typebox_1.Type.String(),
    LOG_LEVEL: typebox_1.Type.String()
});
exports.config = {
    env: env_var_1["default"].get('NODE_ENV').required().asString(),
    port: env_var_1["default"].get('PORT').required().asPortNumber(),
    host: env_var_1["default"].get('HOST').required().asString(),
    jwt: {
        secret: env_var_1["default"].get('JWT_SECRET').required().asString()
    },
    db: {
        url: env_var_1["default"].get('DATABASE_URL').required().asString()
    },
    cors: {
        origin: env_var_1["default"].get('CORS_ORIGIN').required().asString()
    },
    logLevel: env_var_1["default"].get('LOG_LEVEL')["default"]('info').asString()
};
