import { Type } from "@sinclair/typebox";
import { TransactionSchema } from "../../types";

export const createTransactionSchema = {
  tags: ["transactions"],
  body: Type.Object({
    type: Type.String(),
    amount: Type.Number(),
    fromAccountId: Type.Optional(Type.String({ format: "uuid" })),
    toAccountId: Type.Optional(Type.String({ format: "uuid" })),
    accountId: Type.String({ format: "uuid" }),
    status: Type.Optional(Type.String())
  }),
  response: {
    201: TransactionSchema,
  },
  security: [{ bearerAuth: [] }],
};

export const getTransactionSchema = {
  tags: ["transactions"],
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    200: TransactionSchema,
  },
  security: [{ bearerAuth: [] }],
};

export const updateTransactionSchema = {
  tags: ["transactions"],
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    status: Type.Optional(Type.String()),
    amount: Type.Optional(Type.Number()),
    type: Type.Optional(Type.String())
  }),
  response: {
    200: TransactionSchema,
  },
  security: [{ bearerAuth: [] }],
};

export const deleteTransactionSchema = {
  tags: ["transactions"],
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    204: Type.Null(),
  },
  security: [{ bearerAuth: [] }],
};