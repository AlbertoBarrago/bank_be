import fp from "fastify-plugin";
import EventEmitter from "node:events";

export default fp(
  async function (fastify) {
    const eventEmitter = new EventEmitter();

    fastify.decorate("events", eventEmitter);

    eventEmitter.on("account:created", (data) => {
      fastify.log.info({ event: "account:created", data });
    });

    eventEmitter.on("balance:changed", (data) => {
      fastify.log.info({ event: "balance:changed", data });
    });
  },
  {
    name: "event-service",
  },
);
