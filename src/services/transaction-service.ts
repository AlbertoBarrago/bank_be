import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifySchema,
  FastifyTypeProviderDefault,
} from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  BothRequiredError,
  DatabaseError,
  InsufficientFundsError,
  InvalidTransactionError,
  RecipientAccountIsRequiredError,
  RecipientAccountNotFoundError,
  SenderAccountNotFoundError,
  SourceAccountNotFoundError,
  TransactionNotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { ResolveRequestBody } from "fastify/types/type-provider";
import { Transaction } from "../routes/transaction/schemas";

/**
 * Handles requests to the transaction routes
 * @param app
 */
export class TransactionService {
  private db: PrismaClient;
  private logger: FastifyBaseLogger;

  constructor(private app: FastifyInstance) {
    this.db = this.app.db;
    this.logger = this.app.log.child({ service: "TransactionService" });
  }

  async createTransaction(data: Transaction) {
    const amount = new Prisma.Decimal(data.amount);

    return this.db.$transaction(async (tx) => {
      if (data.fromAccountId) {
        const fromAccount = await tx.account.findUnique({
          where: { id: data.fromAccountId },
        });

        if (!fromAccount) {
          throw new SenderAccountNotFoundError("Sender account not found");
        }

        if (data.type !== "deposit" && fromAccount.balance.lessThan(amount)) {
          throw new InsufficientFundsError("Insufficient funds");
        }
      }

      if (data.toAccountId) {
        const toAccount = await tx.account.findUnique({
          where: { id: data.toAccountId },
        });

        if (!toAccount) {
          throw new RecipientAccountNotFoundError(
            "Recipient account not found",
          );
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
            throw new RecipientAccountIsRequiredError(
              "Recipient account is required for deposits",
            );
          }
          await tx.account.update({
            where: { id: data.toAccountId },
            data: { balance: { increment: amount } },
          });
          break;

        case "withdrawal":
          if (!data.fromAccountId) {
            throw new SourceAccountNotFoundError(
              "Source account is required for withdrawals",
            );
          }
          await tx.account.update({
            where: { id: data.fromAccountId },
            data: { balance: { decrement: amount } },
          });
          break;

        case "transfer":
          if (!data.fromAccountId || !data.toAccountId) {
            throw new BothRequiredError(
              "Both accounts are required for transfers",
            );
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

      this.logger.info(
        {
          action: "create_transaction",
          type: data.type,
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
          amount: data.amount,
        },
        "New transaction creation request received",
      );

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
      this.logger.info(
        {
          action: "get_transaction",
          id,
        },
        "Transaction retrieval request received",
      );
      return await this.db.transaction.findUnique({
        where: { id },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new TransactionNotFoundError(`Failed to get transaction: ${err}`);
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
      this.logger.info(
        {
          action: "update_transaction",
          id,
          data,
        },
        "Transaction update request received",
      );
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
      throw new InvalidTransactionError(`Failed to update transaction: ${err}`);
    }
  }

  async deleteTransaction(id: string) {
    try {
      this.logger.info(
        {
          action: "delete_transaction",
          id,
        },
        "Transaction deletion request received",
      );
      return await this.db.transaction.delete({
        where: { id },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new InvalidTransactionError(`Failed to delete transaction: ${err}`);
    }
  }
}
