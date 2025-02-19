import { FastifyInstance } from "fastify"
import { EventEmitter } from "events"

interface MetricsCounter {
  accounts: {
    created: number
    updated: number
  }
  transactions: {
    total: number
    successful: number
    failed: number
  }
}

export async function events(app: FastifyInstance): Promise<void> {
    const eventEmitter = new EventEmitter()
    const metricsCounter: MetricsCounter = {
        accounts: {created: 0, updated: 0},
        transactions: {total: 0, successful: 0, failed: 0}
    }

    app.decorate("events", eventEmitter)
    app.decorate("metrics", metricsCounter)

    eventEmitter.on("account:created", (data) => {
        app.log.info({event: "account:created", data})
        metricsCounter.accounts.created++
    })

    eventEmitter.on("balance:changed", (data) => {
        app.log.info({event: "balance:changed", data})
        metricsCounter.transactions.total++
        metricsCounter.transactions.successful++
    })
}