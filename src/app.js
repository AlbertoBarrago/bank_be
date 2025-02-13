"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.buildApp = void 0;
// External dependencies
var fastify_1 = require("fastify");
var cors_1 = require("@fastify/cors");
var jwt_1 = require("@fastify/jwt");
var helmet_1 = require("@fastify/helmet");
var rate_limit_1 = require("@fastify/rate-limit");
// Internal plugins
var auth_1 = require("./plugins/auth");
var db_1 = require("./plugins/db");
var swagger_1 = require("./plugins/swagger");
// Routes
var account_1 = require("./routes/account");
var transaction_1 = require("./routes/transaction");
// Configuration
var config_1 = require("./config/config");
function buildApp() {
    return __awaiter(this, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, fastify_1["default"])({
                        logger: {
                            level: config_1.config.logLevel,
                            transport: {
                                target: 'pino-pretty',
                                options: {
                                    translateTime: 'HH:MM:ss Z',
                                    ignore: 'pid,hostname'
                                }
                            }
                        }
                    }).withTypeProvider();
                    // Register plugins
                    return [4 /*yield*/, app.register(jwt_1["default"], {
                            secret: config_1.config.jwt.secret
                        })];
                case 1:
                    // Register plugins
                    _a.sent();
                    return [4 /*yield*/, app.register(cors_1["default"], {
                            origin: config_1.config.cors.origin,
                            credentials: true
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, app.register(helmet_1["default"])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, app.register(rate_limit_1["default"], {
                            max: 100,
                            timeWindow: '1 minute'
                        })];
                case 4:
                    _a.sent();
                    // Configure custom plugins
                    return [4 /*yield*/, (0, swagger_1.configureSwagger)(app)];
                case 5:
                    // Configure custom plugins
                    _a.sent();
                    return [4 /*yield*/, (0, auth_1.configureAuth)(app)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, db_1.configureDb)(app)];
                case 7:
                    _a.sent();
                    // Register routes
                    return [4 /*yield*/, app.register(account_1["default"], { prefix: '/api/v1/accounts' })];
                case 8:
                    // Register routes
                    _a.sent();
                    return [4 /*yield*/, app.register(transaction_1["default"], { prefix: '/api/v1/transactions' })];
                case 9:
                    _a.sent();
                    // Global error handler
                    app.setErrorHandler(function (error, request, reply) {
                        app.log.error(error);
                        reply.status(error.statusCode || 500).send({
                            error: error.name,
                            message: error.message,
                            statusCode: error.statusCode || 500
                        });
                    });
                    return [2 /*return*/, app];
            }
        });
    });
}
exports.buildApp = buildApp;
// Start the server if this file is run directly
if (require.main === module) {
    var start = function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, buildApp()];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, app.listen({ port: config_1.config.port, host: config_1.config.host })];
                case 2:
                    _a.sent();
                    app.log.info("Server listening on ".concat(config_1.config.port));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    start();
}
