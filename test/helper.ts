import { FastifyInstance } from "fastify";
import { Test } from "tap";
import { buildApp } from "../src/app";
import { AuthorizationService } from "../src/services/authorization-service";

declare module 'fastify' {
  interface FastifyInstance {
    getTestToken: (accountId: string) => string
    testAccount: {
      id: string;
      name: string;
      email: string;
      balance: string;
      status: string;
  }}
}

export async function build(t: Test): Promise<FastifyInstance> {
  const app = await buildApp();
  const authService = new AuthorizationService(app);

  // Create test token generator
  const getTestToken = (accountId: string) => authService.generateToken(accountId);
  app.decorate('getTestToken', getTestToken);

  // Create test account data
  const testAccount = {
    id: 'test-account-id',
    name: 'Test User',
    email: 'test@example.com',
    balance: '1000',
    status: 'active'
  };
  app.decorate('testAccount', testAccount);

  t.teardown(() => app.close());

  return app;
}
