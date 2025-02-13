"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const errors_1 = require("../utils/errors");
class TransactionService {
    constructor(app) {
        this.app = app;
    }
    async createTransaction(data) {
        try {
            return await this.app.db.transaction.create({
                data: {
                    amount: data.amount,
                    type: data.type
                }
            });
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to process transaction');
        }
    }
}
exports.TransactionService = TransactionService;
