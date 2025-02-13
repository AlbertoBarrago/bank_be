import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { AccountService } from '../../services/account.service'
import { Account } from '../../types'

export class AccountHandlers {
  private accountService: AccountService

  constructor(private app: FastifyInstance) {
    this.accountService = new AccountService(app)
  }

  async createAccount(
    request: FastifyRequest<{ Body: Pick<Account, 'name' | 'email'> }>,
    reply: FastifyReply
  ) {
    const account = await this.accountService.createAccount({
      ...request.body,
      balance: 0
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