import { FastifyInstance } from "fastify";
import { Test } from "tap";
import { buildApp } from "../src/app";

export async function build(t: Test): Promise<FastifyInstance> {
  const app = await buildApp();

  t.teardown(() => app.close());

  return app;
}
