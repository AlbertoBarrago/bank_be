import { Type } from '@sinclair/typebox';
import env from 'env-var';

const envSchema = Type.Object({
  NODE_ENV: Type.String(),
  PORT: Type.Number(),
  HOST: Type.String(),
  JWT_SECRET: Type.String(),
  DATABASE_URL: Type.String(),
  CORS_ORIGIN: Type.String(),
  LOG_LEVEL: Type.String(),
});

export const config = {
  env: env.get('NODE_ENV').required().asString(),
  port: env.get('PORT').required().asPortNumber(),
  host: env.get('HOST').required().asString(),
  jwt: {
    secret: env.get('JWT_SECRET').required().asString(),
  },
  db: {
    url: env.get('DATABASE_URL').required().asString(),
  },
  cors: {
    origin: env.get('CORS_ORIGIN').required().asString(),
  },
  logLevel: env.get('LOG_LEVEL').default('info').asString(),
}; 