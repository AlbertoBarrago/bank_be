import {FastifyInstance} from 'fastify'
import {createTransactionSchema} from './schemas'
import {TransactionHandlers} from "./handlers";

export default async function transactionRoutes(app: FastifyInstance) {
    const handlers = new TransactionHandlers(app)

    app.post('/', {schema: createTransactionSchema}, handlers.createTransaction.bind(handlers))
} 