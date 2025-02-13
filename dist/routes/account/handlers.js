"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHandlers = void 0;
const account_service_1 = require("../../services/account.service");
class AccountHandlers {
    constructor(app) {
        this.app = app;
        this.accountService = new account_service_1.AccountService(app);
    }
    async createAccount(request, reply) {
        const account = await this.accountService.createAccount({
            ...request.body,
            balance: 0
        });
        return reply.status(201).send(account);
    }
    async getAccount(request, reply) {
        const account = await this.accountService.getAccount(request.params.id);
        return reply.send(account);
    }
}
exports.AccountHandlers = AccountHandlers;
