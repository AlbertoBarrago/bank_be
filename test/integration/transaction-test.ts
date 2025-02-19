import { test } from 'tap'
import { build } from '../helper'

test('transaction endpoints', async (t) => {
    const app = await build(t)

    await t.test('POST /transaction - create new transaction', async (t) => {
        const response = await app.inject({
            method: 'POST',
            url: '/transaction',
            payload: {
                type: 'TRANSFER',
                amount: 100,
                fromAccountId: '123',
                toAccountId: '456'
            }
        })
        t.equal(response.statusCode, 200)
        t.ok(response.json().amount)
    })
})
