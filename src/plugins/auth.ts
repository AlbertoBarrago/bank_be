import { FastifyInstance, FastifyRequest } from "fastify";
import { AuthenticationError } from "../utils/errors";

/**
 * Configures the authentication middleware for the Fastify instance.
 * @param app
 */
export async function configureAuth(app: FastifyInstance): Promise<void> {
  const publicPaths = [
    "/api/v1/account/register",
    "/api/v1/account/login",
    "/api/health",
    "/docs",
  ];

  /**
   * Middleware to verify the JWT token in the request.
   * @param request
   * @throws AuthenticationError if the token is invalid or expired
   */
  app.addHook("onRequest", async (request: FastifyRequest) => {
    try {
      if (
        request.url.startsWith("/api") &&
        !publicPaths.some((path) => request.url.startsWith(path))
      ) {
        request.user = await request.jwtVerify();
      }
    } catch (err) {
      throw new AuthenticationError(`Invalid or expired token ${err}`);
    }
  });
}
