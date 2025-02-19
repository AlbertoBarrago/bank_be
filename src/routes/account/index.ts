import { FastifyInstance } from "fastify";
import { registerSchema, loginSchema, getAccountSchema } from "./schemas";
import { AuthHandlers } from "./handlers";

/**
 * Register routes for the auth module
 * @param app
 */
export default async function authTransaction(app: FastifyInstance) {
  const handlers = new AuthHandlers(app);

  app.post(
    "/register",
    { schema: registerSchema },
    handlers.register.bind(handlers),
  );
  app.post("/login", { schema: loginSchema }, handlers.login.bind(handlers));
  app.get(
    "/:id",
    { schema: getAccountSchema },
    handlers.getAccount.bind(handlers),
  );
}
