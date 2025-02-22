import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TransactionService } from "../../services/transaction-service";
import { Prisma } from "@prisma/client";
import { Transaction } from "./schemas";
import { CreateTransactionBody } from "../../types";

/**
 * Handles requests to the transaction routes
 */
export class TransactionHandlers {
  private transactionsService: TransactionService;

  constructor(private app: FastifyInstance) {
    this.transactionsService = new TransactionService(app);
  }

  async createTransaction(
    request: FastifyRequest<{ Body: CreateTransactionBody }>,
    reply: FastifyReply,
  ) {
    const { type, amount, fromAccountId, toAccountId } = request.body;

    const transaction = await this.transactionsService.createTransaction({
      type,
      amount: new Prisma.Decimal(amount).toString(),
      fromAccountId,
      toAccountId,
    });

    const response = {
      type: transaction.type,
      amount: transaction.amount,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    return reply.send(response);
  }

  async getUserTransactions(request: FastifyRequest, reply: FastifyReply) {
    const { accountId } = request.user as { accountId: string };

    const transactions =
      await this.transactionsService.getUserTransactions(accountId);

    return reply.send(transactions);
  }

  async updateTransaction(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<Transaction>;
    }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.updateTransaction(
      request.params.id,
      request.body,
    );

    return reply.send(transaction);
  }

  async deleteTransaction(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.deleteTransaction(
      request.params.id,
    );

    return reply.send(transaction);
  }
}
