import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifySchema,
  FastifyTypeProviderDefault,
} from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  BothRequiredError,
  InsufficientFundsError,
  InvalidTransactionError,
  RecipientAccountIsRequiredError,
  RecipientAccountNotFoundError,
  SenderAccountNotFoundError,
  SourceAccountNotFoundError,
  TransactionNotFoundError,
} from "../utils/errors";
import { ResolveRequestBody } from "fastify/types/type-provider";
import { Transaction } from "../routes/transaction/schemas";
import {
  TransactionEnum,
  TransactionLimitEnum,
  TransactionTypeEnum,
} from "../types";

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

  private validateTransactionAmount(amount: number | string): Prisma.Decimal {
    const minAmount = new Prisma.Decimal(TransactionLimitEnum.MIN_AMOUNT);
    const maxAmount = new Prisma.Decimal(TransactionLimitEnum.MAX_AMOUNT);
    const decimalAmount = new Prisma.Decimal(amount);

    this.logger.info({
      action: "validate_transaction_amount",
      amount,
      minAmount,
      maxAmount,
      decimalAmount,
    });

    if (
      decimalAmount.lessThan(minAmount) ||
      decimalAmount.greaterThan(maxAmount)
    ) {
      throw new InvalidTransactionError("Amount outside allowed range");
    }
    return decimalAmount;
  }

  async createTransaction(data: Transaction) {
    const amount = new Prisma.Decimal(data.amount);
    return this.db.$transaction(async (tx) => {
      if (data.fromAccountId) {
        const fromAccount = await tx.account.findUnique({
          where: { id: data.fromAccountId },
        });

        this.validateTransactionAmount(data.amount);

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
          status: TransactionEnum.PENDING,
          fromAccountId: data.fromAccountId ?? null,
          toAccountId: data.toAccountId ?? null,
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });

      switch (data.type) {
        case TransactionTypeEnum.DEPOSIT:
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

        case TransactionTypeEnum.WITHDRAWAL:
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

        case TransactionTypeEnum.TRANSFER:
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
        data: { status: TransactionEnum.COMPLETED },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    });
  }

  async getUserTransactions(id: string) {
    try {
      this.logger.info(
        {
          action: "get_user_transaction",
          id,
        },
        "Transaction retrieval request received",
      );

      const userAccount = await this.db.account.findFirst({
        where: {
          id,
        },
      });

      this.logger.info({
        action: "get_user_transaction",
        userAccount,
      });

      return await this.db.transaction.findMany({
        where: {
          OR: [
            { fromAccountId: userAccount?.id },
            { toAccountId: userAccount?.id },
          ],
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (err) {
      throw new TransactionNotFoundError(
        `Failed to get User transactions: ${err}`,
      );
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
