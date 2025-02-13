import { FastifyInstance, FastifyRequest } from 'fastify'
import { TransactionService } from '../../services/transaction.service'
import { createTransactionSchema } from './schemas'
import { Transaction } from '../../types'

type CreateTransactionBody = Pick<Transaction, 'type' | 'amount' | 'fromAccountId' | 'toAccountId'>

export default async function transactionRoutes(app: FastifyInstance) {
  const transactionService = new TransactionService(app)

  app.post('/', { schema: createTransactionSchema }, async (request: FastifyRequest<{
    Body: CreateTransactionBody
  }>, reply) => {
    const transaction = await transactionService.createTransaction(request.body)
    return reply.status(201).send(transaction)
  })
} 