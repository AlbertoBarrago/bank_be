import { Transaction } from "../routes/transaction/schemas";

export type CreateTransactionBody = {
  type: Transaction["type"];
  amount: string;
  fromAccountId: string;
  toAccountId: string;
  status?: Transaction["status"];
};
