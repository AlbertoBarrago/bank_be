import {FastifyInstance} from "fastify"
import {EventEmitter} from "events"
import {MetricsCounter} from "../types";

export async function configureEvents(app: FastifyInstance): Promise<void> {
    const eventEmitter = new EventEmitter()
    const metricsCounter: MetricsCounter = {
        login: {success: 0, failure: 0},
        accounts: {created: 0, updated: 0},
        transactions: {total: 0, successful: 0, failed: 0}
    }

    app.decorate("events", eventEmitter)
    app.decorate("metrics", metricsCounter)

    eventEmitter.on("account:login", (data) => {
        app.log.info({event: "account:success", data})
        metricsCounter.login.success++
    })

    eventEmitter.on("account:failure", (data) => {
        app.log.info({event: "account:failure", data})
        metricsCounter.login.failure++
    })

    eventEmitter.on("account:created", (data) => {
        app.log.info({event: "account:created", data})
        metricsCounter.accounts.created++
    })

    eventEmitter.on("account:updated", (data) => {
        app.log.info({event: "account:updated", data})
        metricsCounter.accounts.updated++
    })

    eventEmitter.on("balance:changed", (data) => {
        app.log.info({event: "balance:changed", data})
        metricsCounter.transactions.total++
        metricsCounter.transactions.successful++
    })

    eventEmitter.on("transaction:failed", (data) => {
        app.log.info({event: "transaction:failed", data})
        metricsCounter.transactions.total++
        metricsCounter.transactions.failed++
    })

    app.get('/metrics', () => metricsCounter)

}