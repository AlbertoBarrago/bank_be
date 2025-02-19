import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AccountService } from "../../services/account-service";
import {
  GetAccountBody,
  LoginBody,
  RegisterBody,
  TransactionEnum,
} from "../../types";

/**
 * Handles requests to the auth routes
 * @param app
 */
export class AuthHandlers {
  private accountService: AccountService;

  constructor(private app: FastifyInstance) {
    this.accountService = new AccountService(app);
  }

  async register(
    request: FastifyRequest<{
      Body: RegisterBody;
    }>,
    reply: FastifyReply,
  ) {
    const account = await this.accountService.createAccount({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      balance: request.body.balance,
      status: TransactionEnum.PENDING,
    });
    return reply.status(201).send(account);
  }

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;
    const result = await this.accountService.login(email, password);
    return reply.send(result);
  }

  async getAccount(
    request: FastifyRequest<{ Params: GetAccountBody }>,
    reply: FastifyReply,
  ) {
    const { accountId } = request.user as { accountId: string };
    const account = await this.accountService.getAccount(accountId);
    return reply.send(account);
  }
}
