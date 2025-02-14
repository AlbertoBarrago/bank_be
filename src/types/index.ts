import { Static, Type } from '@sinclair/typebox'

export const AccountSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  balance: Type.Number(),
  status: Type.Union([
    Type.Literal('active'),
    Type.Literal('suspended'),
    Type.Literal('closed')
  ]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export const TransactionSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  type: Type.Union([
    Type.Literal('deposit'),
    Type.Literal('withdrawal'),
    Type.Literal('transfer')
  ]),
  amount: Type.Number(),
  fromAccountId: Type.Optional(Type.String({ format: 'uuid' })),
  toAccountId: Type.String({ format: 'uuid' }),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('completed'),
    Type.Literal('failed')
  ]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type Transaction = Static<typeof TransactionSchema>