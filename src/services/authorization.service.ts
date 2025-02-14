import {FastifyInstance} from 'fastify'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {config} from "../config/config";


export class AuthorizationService {
    constructor(private app: FastifyInstance) {
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12)
        return bcrypt.hash(password, salt)
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    generateToken(accountId: string): string {
        return jwt.sign({accountId}, config.jwt.secret, {
            expiresIn: '24h'
        })
    }
}