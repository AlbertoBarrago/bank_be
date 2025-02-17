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
    const { type, amount, fromAccountId, toAccountId, status } = request.body;

    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      return reply.status(400).send({ error: "Invalid account IDs" });
    }

    const transaction = await this.transactionsService.createTransaction({
      type,
      amount: new Prisma.Decimal(amount).toString(),
      fromAccountId,
      toAccountId,
      status: status ?? "pending",
    });

    return reply.send(transaction);
  }

  async getTransactionById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.getTransactionById(
      request.params.id,
    );

    if (!transaction) {
      return reply.status(404).send({ error: "Transaction not found" });
    }

    return reply.send(transaction);
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

    if (!transaction) {
      return reply.status(404).send({ error: "Transaction not found" });
    }

    return reply.send(transaction);
  }

  async deleteTransaction(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.deleteTransaction(
      request.params.id,
    );

    if (!transaction) {
      return reply.status(404).send({ error: "Transaction not found" });
    }

    return reply.send(transaction);
  }
}
