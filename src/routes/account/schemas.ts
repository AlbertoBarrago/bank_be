import {Type} from '@sinclair/typebox'
import {AccountSchema} from '../../types'

export const createAccountSchema = {
    body: Type.Pick(AccountSchema, ['name', 'email']),
    response: {
        201: AccountSchema
    }
}

export const getAccountSchema = {
    params: Type.Object({
        id: Type.String({format: 'uuid'})
    }),
    response: {
        200: AccountSchema
    }
}

export const loginSchema = {
    body: Type.Object({
        email: Type.String({format: 'email'}),
        password: Type.String()
    }),
    response: {
        200: Type.Object({
            token: Type.String(),
            account: Type.Omit(AccountSchema, ['password'])
        })
    }
}


