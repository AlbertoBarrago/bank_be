"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.TransactionService = void 0;
var uuid_1 = require("uuid");
var account_service_1 = require("./account.service");
var errors_1 = require("../utils/errors");
var TransactionService = /** @class */ (function () {
    function TransactionService(app) {
        this.app = app;
        this.accountService = new account_service_1.AccountService(app);
    }
    TransactionService.prototype.createTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, transaction, _a, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = (0, uuid_1.v4)();
                        now = new Date().toISOString();
                        transaction = __assign(__assign({ id: id }, data), { status: 'pending', createdAt: now, updatedAt: now });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 11, , 13]);
                        return [4 /*yield*/, this.app.db.transaction.create({ data: transaction })
                            // Process the transaction based on type
                        ];
                    case 2:
                        _b.sent();
                        _a = data.type;
                        switch (_a) {
                            case 'deposit': return [3 /*break*/, 3];
                            case 'withdrawal': return [3 /*break*/, 5];
                            case 'transfer': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.accountService.updateBalance(data.toAccountId, data.amount)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.accountService.updateBalance(data.toAccountId, -data.amount)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        if (!data.fromAccountId) {
                            throw new errors_1.ValidationError('fromAccountId is required for transfers');
                        }
                        return [4 /*yield*/, this.app.db.transaction.runInTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.accountService.updateBalance(data.fromAccountId, -data.amount)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.accountService.updateBalance(data.toAccountId, data.amount)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, this.app.db.transaction.update({
                            where: { id: id },
                            data: {
                                status: 'completed',
                                updatedAt: new Date().toISOString()
                            }
                        })];
                    case 10: 
                    // Update transaction status to completed
                    return [2 /*return*/, _b.sent()];
                    case 11:
                        error_1 = _b.sent();
                        // Update transaction status to failed
                        return [4 /*yield*/, this.app.db.transaction.update({
                                where: { id: id },
                                data: {
                                    status: 'failed',
                                    updatedAt: new Date().toISOString()
                                }
                            })];
                    case 12:
                        // Update transaction status to failed
                        _b.sent();
                        throw error_1;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return TransactionService;
}());
exports.TransactionService = TransactionService;
