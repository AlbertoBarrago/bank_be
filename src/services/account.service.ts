import {FastifyInstance} from 'fastify'
import {DatabaseError, NotFoundError, ValidationError} from '../utils/errors'
import {AuthService} from './auth.service'
import {Account as PrismaAccount} from "@prisma/client";

interface Account {
    id: string
    name: string
    email: string
    balance: number
    password: string
    createdAt: Date
    updatedAt: Date
    status: string
}

interface FastifyInstanceWithConfig extends FastifyInstance {
    config: any
    db: any
}

export class AccountService {
    private authService: AuthService

    constructor(private app: FastifyInstance) {
      this.authService = new AuthService(app)
    }

    async createAccount(data: {
        name: string;
        email: string;
        password: string;
        balance: number;
        status: string
    }): Promise<Omit<Account, "password">> {
      try {
        const hashedPassword = await this.authService.hashPassword(data.password)
          const account = await this.app.db.account.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                balance: data.balance,
                status: data.status,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            select: {
                id: true,
                name: true,
                email: true,
                balance: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return {
          ...account,
          balance: Number(account.balance)
        }
      } catch (error) {
        throw new DatabaseError('Failed to create account')
      }
    }

    async getAccount(id: string): Promise<Account> {
      const account = await this.app.db.account.findUnique({where: {id}})
      if (!account) {
        throw new NotFoundError('Account not found')
      }
      return {
        ...account,
        balance: Number(account.balance)
      }
    }

    async updateBalance(id: string, amount: number): Promise<Account> {
      const account = await this.getAccount(id)
      const newBalance = account.balance + amount

      if (newBalance < 0) {
        throw new ValidationError('Insufficient funds')
      }

      try {
        const updatedAccount = await this.app.db.account.update({
          where: {id},
          data: {
            balance: newBalance,
            updatedAt: new Date()
          }
        })
        return {
          ...updatedAccount,
          balance: Number(updatedAccount.balance)
        }
      } catch (error) {
        throw new DatabaseError('Failed to update balance')
      }
    }

    async login(email: string, password: string): Promise<{
        token: string;
        account: Omit<PrismaAccount, "password">
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
          updatedAt: true
        }
      })

      if (!account) {
        throw new Error('Invalid credentials')
      }

      const isValid = await this.authService.verifyPassword(password, account.password)
      if (!isValid) {
        throw new Error('Invalid credentials')
      }

      const token = this.authService.generateToken(account.id)

      const { password: _, ...accountWithoutPassword } = account
      return {
        token,
        account: {
          ...accountWithoutPassword,
          balance: Number(accountWithoutPassword.balance)
        }
      }
    }
}