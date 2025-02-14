import {FastifyInstance} from 'fastify'
import {DatabaseError, NotFoundError, ValidationError} from '../utils/errors'

interface Transaction {
  id: string
  amount: number
  type: string
}

export class TransactionService {
  constructor(private app: FastifyInstance) {}

  async createTransaction(data: {
      id: string;
      type: "deposit" | "withdrawal" | "transfer";
      amount: number
  }): Promise<Transaction> {
    try {
      return await this.app.db.transaction.create({
        data: {
          amount: data.amount,
          type: data.type
        }
      })
    } catch (error) {
      throw new DatabaseError('Failed to process transaction')
    }
  }
  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      return await this.app.db.transaction.findUnique({
        where: {
          id
        }
      })
    } catch (error) {
      throw new DatabaseError('Failed to get transaction')
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    try {
      return await this.app.db.transaction.update({
        where: {
          id
        },
        data
      })
    } catch (error) {
      throw new DatabaseError('Failed to update transaction')
    }
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    try {
      return await this.app.db.transaction.delete({
        where: {
          id
        }
      })
    } catch (error) {
      throw new DatabaseError('Failed to delete transaction')
    }
  }

}