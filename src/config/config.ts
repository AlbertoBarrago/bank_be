import dotenv from "dotenv";

dotenv.config();

/**
 * Configuration object for the application.
 * @property {string} env - The environment the application is running in.
 * @property {number} port - The port the application is running on.
 * @property {string} host - The host the application is running on.
 * @property {string} jwt - The secret used for JWT token generation.
 * @property {string} db - The URL for the database.
 * @property {string} cors - The origin for the CORS policy.
 * @property {string} logLevel - The log level for the application.
 */
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
