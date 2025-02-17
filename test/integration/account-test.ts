import { test } from "tap";
import { build } from "../helper";
import { FastifyInstance } from "fastify";

test("account endpoints", async (t) => {
  const app: FastifyInstance = await build(t);

  await t.test("POST /api/v1/account - create account", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/account",
      payload: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    });

    t.equal(response.statusCode, 201);
    const payload = JSON.parse(response.payload);
    t.type(payload.id, "string");
    t.equal(payload.name, "Test User");
    t.equal(payload.email, "test@example.com");
  });

  await t.test("GET /api/v1/account/:id - get account by id", async (t) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/account",
      payload: {
        name: "Get Test User",
        email: "get.test@example.com",
        password: "password123",
      },
    });
    const { id } = JSON.parse(createResponse.payload);

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/account/${id}`,
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.id, id);
  });

  await t.test("PUT /api/v1/account/:id - update account", async (t) => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/account",
      payload: {
        name: "Update Test User",
        email: "update.test@example.com",
        password: "password123",
      },
    });
    const { id } = JSON.parse(createResponse.payload);

    const response = await app.inject({
      method: "PUT",
      url: `/api/v1/account/${id}`,
      payload: {
        name: "Updated Name",
      },
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.name, "Updated Name");
  });

  t.teardown(async () => {
    await app.close();
  });
});
