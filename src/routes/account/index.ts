import { FastifyInstance } from 'fastify'
import { AccountHandlers } from './handlers'
import { createAccountSchema, getAccountSchema } from './schemas'

export default async function accountRoutes(app: FastifyInstance) {
  const handlers = new AccountHandlers(app)

  app.post('/', { schema: createAccountSchema }, handlers.createAccount.bind(handlers))
  app.get('/:id', { schema: getAccountSchema }, handlers.getAccount.bind(handlers))
} 