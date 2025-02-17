import {
  FastifyInstance,
  FastifySchema,
  FastifyTypeProviderDefault,
} from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { DatabaseError } from "../utils/errors";
import { ResolveRequestBody } from "fastify/types/type-provider";
import { Transaction } from "../routes/transaction/schemas";

/**
 * Handles requests to the transaction routes
 * @param app
 */
export class TransactionService {
  private db: PrismaClient;

  constructor(private app: FastifyInstance) {
    this.db = this.app.db;
  }

  async createTransaction(data: Transaction) {
    const amount = new Prisma.Decimal(data.amount);

    return this.db.$transaction(async (tx) => {
      if (data.fromAccountId) {
        const fromAccount = await tx.account.findUnique({
          where: { id: data.fromAccountId },
        });

        if (!fromAccount) {
          throw new Error("Sender account not found");
        }

        if (data.type !== "deposit" && fromAccount.balance.lessThan(amount)) {
          throw new Error("Insufficient funds");
        }
      }

      if (data.toAccountId) {
        const toAccount = await tx.account.findUnique({
          where: { id: data.toAccountId },
        });

        if (!toAccount) {
          throw new Error("Recipient account not found");
        }
      }

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: data.type,
          status: "pending",
          fromAccountId: data.fromAccountId ?? null,
          toAccountId: data.toAccountId ?? null,
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });

      switch (data.type) {
        case "deposit":
          if (!data.toAccountId) {
            throw new Error("Recipient account is required for deposits");
          }
          await tx.account.update({
            where: { id: data.toAccountId },
            data: { balance: { increment: amount } },
          });
          break;

        case "withdrawal":
          if (!data.fromAccountId) {
            throw new Error("Source account is required for withdrawals");
          }
          await tx.account.update({
            where: { id: data.fromAccountId },
            data: { balance: { decrement: amount } },
          });
          break;

        case "transfer":
          if (!data.fromAccountId || !data.toAccountId) {
            throw new Error("Both accounts are required for transfers");
          }
          await tx.account.update({
            where: { id: data.fromAccountId },
            data: { balance: { decrement: amount } },
          });
          await tx.account.update({
            where: { id: data.toAccountId },
            data: { balance: { increment: amount } },
          });
          break;
      }

      return tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "completed" },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    });
  }

  async getTransactionById(id: string) {
    try {
      return await this.db.transaction.findUnique({
        where: { id },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(`Failed to get transaction: ${err}`);
    }
  }

  async updateTransaction(
    id: string,
    data: ResolveRequestBody<
      FastifyTypeProviderDefault,
      FastifySchema,
      {
        Params: { id: string };
        Body: Partial<Transaction>;
      }
    >,
  ) {
    try {
      return await this.db.transaction.update({
        where: { id },
        data: {
          amount: data.amount ? new Prisma.Decimal(data.amount) : undefined,
          type: data.type ?? undefined,
          fromAccountId: data.fromAccountId ?? null,
          toAccountId: data.toAccountId ?? null,
          updatedAt: new Date(),
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(`Failed to update transaction: ${err}`);
    }
  }

  async deleteTransaction(id: string) {
    try {
      return await this.db.transaction.delete({
        where: { id },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(`Failed to delete transaction: ${err}`);
    }
  }
}
