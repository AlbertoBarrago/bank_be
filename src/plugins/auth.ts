import { FastifyInstance, FastifyRequest } from 'fastify'
import { AuthenticationError } from '../utils/errors'

export async function configureAuth(app: FastifyInstance) {
  const publicPaths = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/health',
    '/documentation'
  ]

  app.addHook('onRequest', async (request: FastifyRequest) => {
    try {
      if (request.url.startsWith('/api') &&
          !publicPaths.some(path => request.url.startsWith(path))) {
        await request.jwtVerify()
      }
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token')
    }
  })
}