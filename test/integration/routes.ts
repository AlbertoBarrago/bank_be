import { test } from "tap";
import { build } from "../helper";

test("All (account,transaction) endpoints", async (t) => {
  const app = await build(t);
  let token: string;

  await t.test("POST /login - Access with user test", async (t) => {
    const loginResponse = await app.inject({
      method: "POST",
      url: "api/v1/account/login",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    token = loginResponse.json().token;

    t.equal(loginResponse.statusCode, 200, "should return 200");
    t.ok(loginResponse.json().token, "should return a token");
    t.equal(
      loginResponse.json().account.email,
      "test@example.com",
      "should return the correct email",
    );
    t.equal(
      loginResponse.json().account.name,
      "Test User",
      "should return the correct name",
    );
    t.equal(
      loginResponse.json().account.status,
      "active",
      "should return the correct status",
    );
  });

  await t.test("GET /account/user-data - Access with user test", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: `api/v1/account/user-data`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    t.equal(response.statusCode, 200, "should return 200");
    t.equal(
      response.json().email,
      "test@example.com",
      "should return the correct email",
    );
    t.equal(
      response.json().name,
      "Test User",
      "should return the correct name",
    );
  });

  await t.test("POST /transaction/create - Create Transaction", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "api/v1/transactions/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        amount: 100,
        type: "deposit",
        toAccountId: "db08cf67-a4c5-405e-9e7b-f584af785554",
      },
    });
    t.equal(response.statusCode, 200, "should return 200");
  });

  await t.test("GET /transaction/list - Get Transactions", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "api/v1/transactions/list",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    t.equal(response.statusCode, 200, "should return 200");
  });

  t.teardown(async () => {
    await app.close();
  });
});
