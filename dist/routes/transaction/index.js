"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionRoutes;
const transaction_service_1 = require("../../services/transaction.service");
const schemas_1 = require("./schemas");
async function transactionRoutes(app) {
    const transactionService = new transaction_service_1.TransactionService(app);
    app.post('/', { schema: schemas_1.createTransactionSchema }, async (request, reply) => {
        const transaction = await transactionService.createTransaction(request.body);
        return reply.status(201).send(transaction);
    });
}
