import { FastifyBaseLogger, FastifyInstance } from "fastify";
import {
  AuthorizationError,
  DatabaseError,
  NotFoundError,
} from "../utils/errors";
import { AuthorizationService } from "./authorization-service";
import {Account, AccountEnum} from "../types";
import NodeCache from "node-cache";

export class AccountService {
  private authService: AuthorizationService;
  private logger: FastifyBaseLogger;
  private CACHE_TTL = 300;

  constructor(private app: FastifyInstance) {
    this.authService = new AuthorizationService(app);
    this.logger = this.app.log.child({ service: "AccountService" });
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
          status: AccountEnum.ACTIVE,
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

      this.logger.info(
        {
          action: "create_account",
          email: data.email,
          name: data.name,
          status: AccountEnum.ACTIVE,
        },
        "Creation of account initialized",
      );

      this.app.events.emit("account:created", {
        id: account.id,
        email: account.email,
        timestamp: new Date(),
      });

      return {
        ...account,
        balance: Number(account.balance),
      };
    } catch (err) {
      throw new DatabaseError(`Failed to create account, ${err}`);
    }
  }

  async getAccount(accountId: string) {
    const userAccount = await this.app.db.account.findFirst({
      where: {
        id: accountId,
      },
      include: {
        user: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!this.app.cache) {
      this.app.cache = new NodeCache({ stdTTL: this.CACHE_TTL });
    }
    const cacheKey = `account:${userAccount?.id}`;
    const cached = this.app.cache.get(cacheKey);
    const id =userAccount?.id

    if (cached) {
      this.logger.info(
        { action: "cache_hit", accountId: id },
        "Account found in cache",
      );
      return cached;
    }
    const account = await this.app.db.account.findUnique({ where: { id }});

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    this.app.cache.set(cacheKey, account, this.CACHE_TTL);

    this.logger.info(
      {
        action: "cache_set",
        accountId: id,
      },
      "Account saved in cache",
    );
    this.logger.info(
      {
        action: "get_account",
        accountId: id,
      },
      "Account retrieval request received",
    );

    return account;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    account: Omit<Account, "password">;
  }> {
    const account = await this.app.db.account.findUnique({
      where: { email },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        balance: true,
        password: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.info(
      {
        action: "login",
        email,
        name: account?.name,
        status: account?.status,
      },
      "Login initialized",
    );

    if (!account) {
      throw new AuthorizationError("User Not Found");
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
        balance: Number(account.balance),
      },
    };
  }
}
