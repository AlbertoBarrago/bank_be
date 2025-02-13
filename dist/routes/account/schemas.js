"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountSchema = exports.createAccountSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const types_1 = require("../../types");
exports.createAccountSchema = {
    body: typebox_1.Type.Pick(types_1.AccountSchema, ['name', 'email']),
    response: {
        201: types_1.AccountSchema
    }
};
exports.getAccountSchema = {
    params: typebox_1.Type.Object({
        id: typebox_1.Type.String({ format: 'uuid' })
    }),
    response: {
        200: types_1.AccountSchema
    }
};
