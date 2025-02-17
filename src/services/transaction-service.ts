import {FastifyInstance} from "fastify";
import {Prisma, PrismaClient} from "@prisma/client";
import {DatabaseError} from "../utils/errors";


export class TransactionService {
  private db: PrismaClient;

  constructor(private app: FastifyInstance) {
    this.db = this.app.db;
  }

  async createTransaction(data: {
    type: "deposit" | "withdrawal" | "transfer";
    amount: Prisma.Decimal;
    status?: string;
    fromAccountId?: string | null;
    toAccountId?: string | null;
  }) {
    try {
      return await this.db.transaction.create({
        data: {
          type: data.type,
          amount: new Prisma.Decimal(data.amount),
          status: data.status ?? "pending",
          fromAccountId: data.fromAccountId ?? null,
          toAccountId: data.toAccountId ?? null,
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(`Failed to process transaction: ${err}`);
    }
  }

  async getTransactionById(id: string){
    try {
      return await this.db.transaction.findUnique({
        where: {id},
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (err) {
      throw new DatabaseError(`Failed to get transaction: ${err}`);
    }
  }

  async updateTransaction(id: string, data: any) {
    try {
      return await this.db.transaction.update({
        where: {id},
        data: {
          amount: data.amount ? new Prisma.Decimal(data.amount) : undefined,
          type: data.type ?? undefined,
          status: data.status ?? undefined,
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
        where: {id},
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
