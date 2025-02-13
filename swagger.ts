import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export default async function swagger(app: FastifyInstance) {
    await app.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Fastify Bank Service API',
                description: 'Banking service API documentation',
                version: '1.0.0'
            },
            tags: [
                { name: 'accounts', description: 'Account related endpoints' },
                { name: 'transactions', description: 'Transaction related endpoints' }
            ],
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    })

    await app.register(fastifySwaggerUi, {
        routePrefix: '/documentation'
    })
}
