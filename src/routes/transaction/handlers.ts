import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TransactionService } from "../../services/transaction-service";
import { Transaction } from "../../types";
import { Prisma } from "@prisma/client";

type CreateTransactionBody = {
  type: Transaction["type"];
  amount: string;
  fromAccountId: string;
  toAccountId: string;
  status?: Transaction["status"];
};

export class TransactionHandlers {
  private transactionsService: TransactionService;

  constructor(private app: FastifyInstance) {
    this.transactionsService = new TransactionService(app);
  }

  async createTransaction(
    request: FastifyRequest<{ Body: CreateTransactionBody }>,
    reply: FastifyReply,
  ) {
    try {
      const { type, amount, fromAccountId, toAccountId, status } = request.body;

      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
        return reply.status(400).send({ error: "Invalid account IDs" });
      }

      const amountDecimal = new Prisma.Decimal(amount);

      const transaction = await this.transactionsService.createTransaction({
        type,
        amount: amountDecimal.toString(),
        fromAccountId,
        toAccountId,
        status: status ?? "pending",
      });

      return reply.status(201).send(transaction);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Transaction creation failed" });
    }
  }

  async getTransactionById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction = await this.transactionsService.getTransactionById(
        request.params.id,
      );

      if (!transaction) {
        return reply.status(404).send({ error: "Transaction not found" });
      }

      return reply.send(transaction);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch transaction" });
    }
  }

  async updateTransaction(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<Transaction>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction = await this.transactionsService.updateTransaction(
        request.params.id,
        request.body,
      );

      if (!transaction) {
        return reply.status(404).send({ error: "Transaction not found" });
      }

      return reply.send(transaction);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to update transaction" });
    }
  }

  async deleteTransaction(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction = await this.transactionsService.deleteTransaction(
        request.params.id,
      );

      if (!transaction) {
        return reply.status(404).send({ error: "Transaction not found" });
      }

      return reply.send({ message: "Transaction deleted successfully" });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to delete transaction" });
    }
  }
}
