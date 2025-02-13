"use strict";
exports.__esModule = true;
exports.createTransactionSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var types_1 = require("../../types");
exports.createTransactionSchema = {
    body: typebox_1.Type.Pick(types_1.TransactionSchema, ['type', 'amount', 'fromAccountId', 'toAccountId']),
    response: {
        201: types_1.TransactionSchema
    }
};
