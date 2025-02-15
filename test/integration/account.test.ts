import { test } from "tap";
import { FastifyInstance } from "fastify";
import { build } from "../helper";

test("account endpoints", async (t) => {
  const app: FastifyInstance = await build(t);

  t.test("POST /account - create account", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/account",
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

  t.test("GET /account/:id - get account by id", async (t) => {
    // First create an account
    const createResponse = await app.inject({
      method: "POST",
      url: "/account",
      payload: {
        name: "Get Test User",
        email: "get.test@example.com",
        password: "password123",
      },
    });
    const { id } = JSON.parse(createResponse.payload);

    // Then test getting it
    const response = await app.inject({
      method: "GET",
      url: `/account/${id}`,
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.id, id);
  });

  t.test("PUT /account/:id - update account", async (t) => {
    // First create an account
    const createResponse = await app.inject({
      method: "POST",
      url: "/account",
      payload: {
        name: "Update Test User",
        email: "update.test@example.com",
        password: "password123",
      },
    });
    const { id } = JSON.parse(createResponse.payload);

    const response = await app.inject({
      method: "PUT",
      url: `/account/${id}`,
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
