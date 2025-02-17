import { Transaction } from "../routes/transaction/schemas";

export type CreateTransactionBody = {
  type: Transaction["type"];
  amount: string;
  fromAccountId: string;
  toAccountId: string;
  status?: Transaction["status"];
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

export enum StatusEnum {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
