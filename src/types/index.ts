import { Transaction } from "../routes/transaction/schemas";

export type CreateTransactionBody = {
  type: Transaction["type"];
  amount: string;
  fromAccountId: string;
  toAccountId: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  balance: number;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type GetAccountBody = {
  id: string;
};

export type Account = {
  id: string;
  name: string;
  email: string;
  balance: number;
  password: string;
  status: string;
};

export enum TransactionEnum {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TransactionTypeEnum {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}

export enum TransactionLimitEnum {
  MIN_AMOUNT = 0.01,
  MAX_AMOUNT = 10000,
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  CEO = "CEO",
}
