import { Type } from "@sinclair/typebox";
import { TransactionSchema } from "../../types";

export const createTransactionSchema = {
  tags: ["transactions"],
  body: Type.Pick(TransactionSchema, [
    "type",
    "amount",
    "fromAccountId",
    "toAccountId",
  ]),
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
  body: Type.Partial(TransactionSchema),
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
