import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Define interface to extend FastifyInstance
interface FastifyInstanceWithConfig extends FastifyInstance {
  config: {
    JWT_SECRET: string
  }
}

export class AuthService {
    constructor(private app: FastifyInstanceWithConfig) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12)
        return bcrypt.hash(password, salt)
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    generateToken(accountId: string): string {
        return jwt.sign({ accountId }, this.app.config.JWT_SECRET, {
            expiresIn: '24h'
        })
    }
}