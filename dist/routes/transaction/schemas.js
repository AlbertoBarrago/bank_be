"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const types_1 = require("../../types");
exports.createTransactionSchema = {
    body: typebox_1.Type.Pick(types_1.TransactionSchema, ['type', 'amount', 'fromAccountId', 'toAccountId']),
    response: {
        201: types_1.TransactionSchema
    }
};
