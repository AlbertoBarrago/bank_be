import { test } from 'tap'
import { build } from '../helper'

test('account endpoints', async (t) => {
  const app = await build(t)
  let token: string
  let accountId: any

  await t.test('POST /login - Access with user test', async (t) => {

    const loginResponse = await app.inject({
      method: 'POST',
      url: 'api/v1/account/login',
      payload: {
        email: 'test@example.com',
        password: 'password123'
      }
    })

    token = loginResponse.json().token
    accountId = loginResponse.json().account.id
    t.ok(token, 'should return a token')
    t.equal(loginResponse.statusCode, 200, 'should return 200')
    t.ok(loginResponse.json().token, 'should return a token')
    t.equal(loginResponse.json().account.email, 'test@example.com', 'should return the correct email')
    t.equal(loginResponse.json().account.name, 'Test User', 'should return the correct name')
    t.equal(loginResponse.json().account.balance, 0, 'should return the correct balance')
    t.equal(loginResponse.json().account.status, 'active', 'should return the correct status')
  })

  await t.test('GET /account/:id - Access with user test', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: `api/v1/account/${accountId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    t.equal(response.statusCode, 200, 'should return 200')
    t.equal(response.json().email, 'test@example.com', 'should return the correct email')
    t.equal(response.json().name, 'Test User', 'should return the correct name')
    t.equal(response.json().balance, 0, 'should return the correct balance')
  })

  t.teardown(async () => {
    await app.close();
  });
});