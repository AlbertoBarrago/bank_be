import { FastifyInstance } from "fastify";
import { DatabaseError } from "../utils/errors";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  fromAccountId?: string;
  toAccountId?: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionUpdate {
  amount?: number;
  type?: "deposit" | "withdrawal" | "transfer";
  status?: string;
  fromAccountId?: string | null;
  toAccountId?: string | null;
}

export class TransactionService {
  constructor(private app: FastifyInstance) {}
  async createTransaction(data: {
    type: "deposit" | "withdrawal" | "transfer";
    amount: number;
    fromAccountId: string | undefined;
    toAccountId: string;
    accountId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date
  }): Promise<Transaction> {
    try {
      const transaction = await this.app.db.transaction.create({
        data: {
          amount: data.amount,
          type: data.type,
          status: data.status,
          account: {
            connect: {
              id: data.accountId
            }
          },
          fromAccount: data.fromAccountId ? {
            connect: {
              id: data.fromAccountId
            }
          } : undefined,
          toAccount: data.toAccountId ? {
            connect: {
              id: data.toAccountId
            }
          } : undefined,
          updatedAt: new Date(),
        },
        include: {
          account: true,
          fromAccount: true,
          toAccount: true
        }
      });

      return {
        ...transaction,
        fromAccountId: transaction.fromAccountId || undefined,
        toAccountId: transaction.toAccountId || undefined
      };
    } catch (err) {
      throw new DatabaseError(`Failed to process transaction, ${err}`);
    }
  }
  async getTransactionById(id: string): Promise<Transaction | null> {    try {
      const transaction = await this.app.db.transaction.findUnique({
        where: {
          id,
        },
      });

      if (!transaction) return null;

      return {
        ...transaction,
        fromAccountId: transaction.fromAccountId || undefined,
        toAccountId: transaction.toAccountId || undefined
      };
    } catch (err) {
      throw new DatabaseError(`Failed to get transaction, ${err}`);
    }
  }

  async updateTransaction(id: string, data: TransactionUpdate): Promise<Transaction> {
    try {
      const transaction = await this.app.db.transaction.update({
        where: { id },
        data: {
          amount: data.amount,
          type: data.type,
          status: data.status,
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
          updatedAt: new Date()
        }
      });

      return {
        ...transaction,
        fromAccountId: transaction.fromAccountId || undefined,
        toAccountId: transaction.toAccountId || undefined
      };
    } catch (err) {
      throw new DatabaseError(`Failed to update transaction, ${err}`);
    }
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    try {
      const transaction = await this.app.db.transaction.delete({
        where: {
          id,
        },
      });

      return {
        ...transaction,
        fromAccountId: transaction.fromAccountId || undefined,
        toAccountId: transaction.toAccountId || undefined
      };
    } catch (err) {
      throw new DatabaseError(`Failed to delete transaction, ${err}`);
    }
  }
}