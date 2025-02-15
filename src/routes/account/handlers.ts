import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AccountService } from "../../services/account.service";

export class AuthHandlers {
  private accountService: AccountService;

  constructor(private app: FastifyInstance) {
    this.accountService = new AccountService(app);
  }

  async register(
    request: FastifyRequest<{
      Body: { name: string; email: string; password: string };
    }>,
    reply: FastifyReply,
  ) {
    const account = await this.accountService.createAccount({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      balance: 0,
      status: "active",
    });
    return reply.status(201).send(account);
  }

  async login(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;
    const result = await this.accountService.login(email, password);
    return reply.send(result);
  }

  async getAccount(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const account = await this.accountService.getAccount(request.params.id);
    return reply.send(account);
  }
}
