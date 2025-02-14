import {FastifyInstance} from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function configureSwagger(app: FastifyInstance) {
    await app.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Fastify Bank Service API',
                description: 'Banking service API documentation',
                version: '1.0.0',
            },
            tags: [
                {name: 'auth', description: 'Authentication related endpoints'},
                {name: 'transactions', description: 'Transaction related endpoints'}
            ],
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    })

    await app.register(fastifySwaggerUi, {
        routePrefix: '/docs'
    })
}