"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const errors_1 = require("../utils/errors");
class AccountService {
    constructor(app) {
        this.app = app;
    }
    async createAccount(data) {
        try {
            return await this.app.db.account.create({
                data: {
                    name: data.name,
                    email: data.email,
                    balance: data.balance
                }
            });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create account');
        }
    }
    async getAccount(id) {
        const account = await this.app.db.account.findUnique({ where: { id } });
        if (!account) {
            throw new errors_1.NotFoundError('Account not found');
        }
        return account;
    }
    async updateBalance(id, amount) {
        const account = await this.getAccount(id);
        const newBalance = account.balance + amount;
        if (newBalance < 0) {
            throw new errors_1.ValidationError('Insufficient funds');
        }
        try {
            return await this.app.db.account.update({
                where: { id },
                data: { balance: newBalance }
            });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update balance');
        }
    }
}
exports.AccountService = AccountService;
