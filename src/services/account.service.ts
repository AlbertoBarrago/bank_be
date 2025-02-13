import {FastifyInstance} from 'fastify'
import {DatabaseError, NotFoundError, ValidationError} from '../utils/errors'

interface Account {
    id: string
    name: string
    email: string
    balance: number
}

export class AccountService {
    constructor(private app: FastifyInstance) {
    }

    async createAccount(data: Omit<Account, 'id'>): Promise<Account> {
        try {
            return await this.app.db.account.create({
                data: {
                    name: data.name,
                    email: data.email,
                    balance: data.balance
                }
            })
        } catch (error) {
            throw new DatabaseError('Failed to create account')
        }
    }

    async getAccount(id: string): Promise<Account> {
        const account = await this.app.db.account.findUnique({where: {id}})
        if (!account) {
            throw new NotFoundError('Account not found')
        }
        return account
    }

    async updateBalance(id: string, amount: number): Promise<Account> {
        const account = await this.getAccount(id)
        const newBalance = account.balance + amount

        if (newBalance < 0) {
            throw new ValidationError('Insufficient funds')
        }

        try {
            return await this.app.db.account.update({
                where: {id},
                data: {balance: newBalance}
            })
        } catch (error) {
            throw new DatabaseError('Failed to update balance')
        }
    }
}