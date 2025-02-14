import { Type } from '@sinclair/typebox'
import { AccountSchema } from '../../types'

export const registerSchema = {
  tags: ['authorization'],
  body: Type.Pick(AccountSchema, ['name', 'email', 'password']),
  response: {
    201: Type.Omit(AccountSchema, ['password'])
  }
}

export const loginSchema = {
  tags: ['authorization'],
  description: 'Authenticate user and receive access token',
  body: Type.Object({
    email: Type.String({
      format: 'email',
      description: 'User email address',
      examples: ['user@example.com']
    }),
    password: Type.String({
      description: 'User password',
      minLength: 4,
      examples: ['****']
    })
  }, {
    additionalProperties: false,
    description: 'Login credentials'
  }),
  response: {
    200: Type.Object({
      token: Type.String({
        description: 'JWT access token',
        examples: ['eyJhbGciOiJIUzI1NiIs...']
      }),
      account: Type.Omit(
          AccountSchema,
          ['password'],
          {
            description: 'User account information'
          }
      )
    }, {
      description: 'Successful login response'
    }),
    400: Type.Object({
      statusCode: Type.Number(),
      error: Type.String(),
      message: Type.String()
    })
  }
}


export const getAccountSchema = {
  tags: ['authorization'],
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: Type.Omit(AccountSchema, ['password'])
  }
}