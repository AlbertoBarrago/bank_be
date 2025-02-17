import { Type } from "@sinclair/typebox";
import { TransactionSchema } from "../../types";

const TransactionType = Type.Union([
  Type.Literal("deposit"),
  Type.Literal("withdrawal"),
  Type.Literal("transfer"),
]);

const TransactionStatus = Type.Union([
  Type.Literal("pending"),
  Type.Literal("completed"),
  Type.Literal("failed"),
]);

export const createTransactionSchema = {
  tags: ["transactions"],
  body: Type.Object({
    type: TransactionType,
    amount: Type.String({ pattern: "^[0-9]+(\\.[0-9]{1,2})?$", examples: ["100.00"] }),
    fromAccountId: Type.Optional(Type.String({ format: "uuid" })),
    toAccountId: Type.Optional(Type.String({ format: "uuid" })),
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
    status: Type.Optional(TransactionStatus),
    amount: Type.Optional(Type.String({ pattern: "^[0-9]+(\\.[0-9]{1,2})?$" })),
    type: Type.Optional(TransactionType),
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
