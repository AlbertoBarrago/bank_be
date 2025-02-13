"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = exports.AccountSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.AccountSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ format: 'uuid' }),
    name: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: 'email' }),
    balance: typebox_1.Type.Number(),
    status: typebox_1.Type.Union([
        typebox_1.Type.Literal('active'),
        typebox_1.Type.Literal('suspended'),
        typebox_1.Type.Literal('closed')
    ]),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.String({ format: 'date-time' })
});
exports.TransactionSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ format: 'uuid' }),
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal('deposit'),
        typebox_1.Type.Literal('withdrawal'),
        typebox_1.Type.Literal('transfer')
    ]),
    amount: typebox_1.Type.Number(),
    fromAccountId: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'uuid' })),
    toAccountId: typebox_1.Type.String({ format: 'uuid' }),
    status: typebox_1.Type.Union([
        typebox_1.Type.Literal('pending'),
        typebox_1.Type.Literal('completed'),
        typebox_1.Type.Literal('failed')
    ]),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.String({ format: 'date-time' })
});
