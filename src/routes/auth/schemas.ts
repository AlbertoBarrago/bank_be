import { Type } from '@sinclair/typebox'
import { AccountSchema } from '../../types'

export const registerSchema = {
  body: Type.Pick(AccountSchema, ['name', 'email', 'password']),
  response: {
    201: Type.Omit(AccountSchema, ['password'])
  }
}

export const loginSchema = {
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
  }),
  response: {
    200: Type.Object({
      token: Type.String(),
      account: Type.Omit(AccountSchema, ['password'])
    })
  }
}

export const getAccountSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: Type.Omit(AccountSchema, ['password'])
  }
}