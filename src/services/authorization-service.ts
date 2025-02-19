import { FastifyBaseLogger, FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export class AuthorizationService {
  private logger: FastifyBaseLogger;
  constructor(private app: FastifyInstance) {
    this.logger = this.app.log.child({ service: "AuthorizationService" });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    this.logger.debug(
      {
        action: "hash_password",
        password,
        salt,
      },
      "Hashing password",
    );
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    this.logger.debug({
      action: "verify_password",
      password,
      hash,
    });
    return bcrypt.compare(password, hash);
  }

  generateToken(accountId: string): string {
    this.logger.debug(
      {
        action: "generate_token",
        accountId,
      },
      "Generating JWT",
    );
    return jwt.sign({ accountId }, config.jwt.secret, {
      expiresIn: "24h",
    });
  }
}
