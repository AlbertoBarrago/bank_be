"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor(app) {
        this.app = app;
    }
    async hashPassword(password) {
        const salt = await bcrypt_1.default.genSalt(12);
        return bcrypt_1.default.hash(password, salt);
    }
    async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    generateToken(accountId) {
        return jsonwebtoken_1.default.sign({ accountId }, this.app.config.JWT_SECRET, {
            expiresIn: '24h'
        });
    }
}
exports.AuthService = AuthService;
