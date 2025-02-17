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

export enum StatusEnum {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
