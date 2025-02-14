"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHandlers = void 0;
const transaction_service_1 = require("../../services/transaction.service");
class TransactionHandlers {
    constructor(app) {
        this.app = app;
        this.transactionsService = new transaction_service_1.TransactionService(app);
    }
    async createTransaction(request, reply) {
        const transaction = await this.transactionsService.createTransaction({
            id: request.body.id,
            type: request.body.type,
            amount: request.body.amount,
        });
        return reply.status(201).send(transaction);
    }
}
exports.TransactionHandlers = TransactionHandlers;
