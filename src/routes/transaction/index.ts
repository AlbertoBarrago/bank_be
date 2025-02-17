import { FastifyInstance } from "fastify";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
} from "./schemas";
import { TransactionHandlers } from "./handlers";

/**
 * Register routes for the transaction module
 * @param app
 */
export default async function transactionRoutes(app: FastifyInstance) {
  const handlers = new TransactionHandlers(app);

  app.post(
    "/",
    { schema: createTransactionSchema },
    handlers.createTransaction.bind(handlers),
  );
  app.get(
    "/:id",
    { schema: getTransactionSchema },
    handlers.getTransactionById.bind(handlers),
  );
  app.put(
    "/:id",
    { schema: updateTransactionSchema },
    handlers.updateTransaction.bind(handlers),
  );
  app.delete(
    "/:id",
    { schema: deleteTransactionSchema },
    handlers.deleteTransaction.bind(handlers),
  );
}
