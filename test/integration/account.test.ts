import { test } from 'tap';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';

test('account routes', async (t) => {
  const app: FastifyInstance = await buildApp();

  t.teardown(() => app.close());

  t.test('POST /api/v1/accounts - create account', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/accounts',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        initialBalance: 1000,
      },
    });

    t.equal(response.statusCode, 201);
    t.match(JSON.parse(response.payload), {
      id: /\d+/,
      name: 'John Doe',
      email: 'john@example.com',
      balance: 1000,
    });
  });
}); 