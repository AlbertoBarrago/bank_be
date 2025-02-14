import {FastifyInstance} from 'fastify'
import {DatabaseError} from '../utils/errors'

interface TransactionInput {
  amount: number
  type: string
}

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
}