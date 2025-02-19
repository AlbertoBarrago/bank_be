import { test } from 'tap'
import { build } from '../helper'

test('account endpoints', async (t) => {
  const app = await build(t)

  await t.test('POST /api/v1/account - create account', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/account',
      payload: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        balance: '1000',
        status: 'PENDING'
      }
    })

    const account = response.json()
    t.equal(response.statusCode, 201)
    t.type(account.id, 'string')
    t.equal(account.name, 'Test User')
    t.equal(account.email, 'test@example.com')
    t.ok(account.createdAt)
    t.ok(account.updatedAt)
  })

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
    t.equal(payload.name, "Get Test User");
    t.equal(payload.email, "get.test@example.com");
    t.notOk(payload.password, "password should not be returned");
    t.type(payload.createdAt, "string", "should have createdAt timestamp");
    t.type(payload.updatedAt, "string", "should have updatedAt timestamp");
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
    t.equal(payload.email, "update.test@example.com");
    t.notOk(payload.password, "password should not be returned");
    t.type(payload.createdAt, "string", "should have createdAt timestamp");
    t.type(payload.updatedAt, "string", "should have updatedAt timestamp");
    t.not(payload.updatedAt, JSON.parse(createResponse.payload).updatedAt, "updatedAt should be changed");
  });

  t.teardown(async () => {
    await app.close();
  });
});