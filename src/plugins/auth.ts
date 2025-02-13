import { FastifyInstance, FastifyRequest } from 'fastify'
import { AuthenticationError } from '../utils/errors'

export async function configureAuth(app: FastifyInstance) {
  app.addHook('onRequest', async (request: FastifyRequest) => {
    try {
      if (request.url.startsWith('/api')) {
        await request.jwtVerify()
      }
    } catch (err) {
      throw new AuthenticationError('Invalid token')
    }
  })
} 