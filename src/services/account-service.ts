import { FastifyInstance } from "fastify";
import {
  AuthorizationError,
  DatabaseError,
  NotFoundError,
} from "../utils/errors";
import { AuthorizationService } from "./authorization-service";
import { Account as PrismaAccount, Prisma } from "@prisma/client";
import { Account } from "../types";

export class AccountService {
  private authService: AuthorizationService;

  constructor(private app: FastifyInstance) {
    this.authService = new AuthorizationService(app);
  }

  async createAccount(
    data: Omit<Account, "id">,
  ): Promise<Omit<Account, "password">> {
    try {
      const hashedPassword = await this.authService.hashPassword(data.password);
      const account = await this.app.db.account.create({
        data: {
          name: data.name,
          email: data.email,
          balance: data.balance,
          password: hashedPassword,
          status: data.status,
          user: {
            create: {
              name: data.name,
              email: data.email,
              password: hashedPassword,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          balance: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        ...account,
        balance: Number(account.balance),
      };
    } catch (err) {
      throw new DatabaseError(`Failed to create account, ${err}`);
    }
  }

  async getAccount(id: string): Promise<Account> {
    const account = await this.app.db.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundError("Account not found");
    }
    return {
      ...account,
      balance: Number(account.balance),
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    account: Omit<PrismaAccount, "password">;
  }> {
    const account = await this.app.db.account.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        password: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!account) {
      throw new AuthorizationError("Insufficient funds");
    }

    const isValid = await this.authService.verifyPassword(
      password,
      account.password,
    );
    if (!isValid) {
      throw new AuthorizationError("Invalid credentials");
    }

    const token = this.authService.generateToken(account.id);

    const { ...accountWithoutPassword } = account;
    return {
      token,
      account: {
        ...accountWithoutPassword,
        balance: new Prisma.Decimal(accountWithoutPassword.balance),
        userId: "",
      },
    };
  }
}
