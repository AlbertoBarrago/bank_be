import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000"),
  host: process.env.HOST || "localhost",
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  logLevel: process.env.LOG_LEVEL || "info",
};
