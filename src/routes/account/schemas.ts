import { Type } from "@sinclair/typebox";

/**
 * Register Schema
 */
export const registerSchema = {
  tags: ["Registration"],
  body: Type.Object({
    name: Type.String(),
    email: Type.String({ format: "email" }),
    password: Type.String({
      minLength: 6,
      description: "Account password",
      examples: ["******"],
    }),
  }),
  response: {
    201: Type.Object({
      id: Type.String(),
      name: Type.String(),
      email: Type.String(),
      role: Type.Optional(Type.String()),
      balance: Type.Number(),
      status: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  },
};
export const loginSchema = {
  tags: ["Authorization"],
  description: "Authenticate user and receive access token",
  body: Type.Object(
    {
      email: Type.String({
        format: "email",
        description: "User email address",
        examples: ["user@example.com"],
      }),
      password: Type.String({
        description: "User password",
        minLength: 6,
        examples: ["******"],
      }),
    },
    {
      additionalProperties: false,
      description: "Login credentials",
    },
  ),
  response: {
    200: Type.Object(
      {
        token: Type.String({
          description: "JWT access token",
          examples: ["eyJhbGciOiJIUzI1NiIs..."],
        }),
        account: Type.Object(
          {
            id: Type.String(),
            name: Type.String(),
            email: Type.String(),
            balance: Type.Number(),
            status: Type.String(),
            role: Type.Optional(Type.String()),
            createdAt: Type.String(),
            updatedAt: Type.String(),
          },
          {
            description: "User account information",
          },
        ),
      },
      {
        description: "Successful login response",
      },
    ),
    400: Type.Object({
      statusCode: Type.Number(),
      error: Type.String(),
      message: Type.String(),
    }),
  },
};
export const getAccountSchema = {
  tags: ["Authorization"],
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      email: Type.String(),
      role: Type.Optional(Type.String()),
      balance: Type.Number(),
      status: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  },
};
