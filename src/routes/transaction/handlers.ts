import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TransactionService } from "../../services/transaction-service";
import { Transaction } from "../../types";

type CreateTransactionBody = Pick<
  Transaction,
  "id" | "type" | "amount" | "fromAccountId" | "toAccountId"
>;

export class TransactionHandlers {
  private transactionsService: TransactionService;

  constructor(private app: FastifyInstance) {
    this.transactionsService = new TransactionService(app);
  }

  async createTransaction(
    request: FastifyRequest<{ Body: CreateTransactionBody }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.createTransaction({
      id: request.body.id,
      type: request.body.type,
      amount: request.body.amount,
    });
    return reply.status(201).send(transaction);
  }

  async getTransactionById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const transaction = await this.transactionsService.getTransactionById(
      request.params.id,
    );
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
