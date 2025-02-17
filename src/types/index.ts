import { Static, Type } from "@sinclair/typebox";

export const AccountSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  balance: Type.Number(),
  status: Type.Union([
    Type.Literal("active"),
    Type.Literal("suspended"),
    Type.Literal("closed"),
  ]),
});

export const TransactionSchema = Type.Object({
  amount: Type.String({ pattern: "^[0-9]+(\\.[0-9]{1,2})?$", examples: ["100.00"] }),
  fromAccountId: Type.Optional(Type.String({ format: "uuid" })),
  toAccountId: Type.String({ format: "uuid" }),
  status: Type.Union([
    Type.Literal("pending"),
    Type.Literal("completed"),
    Type.Literal("failed"),
  ]),
  type: Type.Union([
    Type.Literal("deposit"),
    Type.Literal("withdrawal"),
    Type.Literal("transfer"),
  ]),
});

export type Transaction = Static<typeof TransactionSchema>;
