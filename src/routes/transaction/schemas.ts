import { Type } from '@sinclair/typebox'
import { TransactionSchema } from '../../types'

export const createTransactionSchema = {
  body: Type.Pick(TransactionSchema, ['type', 'amount', 'fromAccountId', 'toAccountId']),
  response: {
    201: TransactionSchema
  }
} 