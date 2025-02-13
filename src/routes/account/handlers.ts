import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { AccountService } from '../../services/account.service'

interface FastifyInstanceWithConfig extends FastifyInstance {
  config: any
}

export class AccountHandlers {
  private accountService: AccountService

  constructor(private app: FastifyInstanceWithConfig) {
    this.accountService = new AccountService(app)
  }

  async createAccount(
    request: FastifyRequest<{ Body: { name: string; email: string; password: string } }>,
    reply: FastifyReply
  ) {
    const account = await this.accountService.createAccount({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      balance: 0,
    })
    return reply.status(201).send(account)
  }

  async getAccount(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const account = await this.accountService.getAccount(request.params.id)
    return reply.send(account)
  }
}