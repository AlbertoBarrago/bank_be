"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionRoutes;
const schemas_1 = require("./schemas");
const handlers_1 = require("./handlers");
async function transactionRoutes(app) {
    const handlers = new handlers_1.TransactionHandlers(app);
    app.post('/', { schema: schemas_1.createTransactionSchema }, handlers.createTransaction.bind(handlers));
}
