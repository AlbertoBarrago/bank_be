"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const errors_1 = require("../utils/errors");
const auth_service_1 = require("./auth.service");
class AccountService {
    constructor(app) {
        this.app = app;
        this.authService = new auth_service_1.AuthService(app);
    }
    async createAccount(data) {
        try {
            const hashedPassword = await this.authService.hashPassword(data.password);
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
            });
            return {
                ...account,
                balance: Number(account.balance)
            };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to create account');
        }
    }
    async getAccount(id) {
        const account = await this.app.db.account.findUnique({ where: { id } });
        if (!account) {
            throw new errors_1.NotFoundError('Account not found');
        }
        return {
            ...account,
            balance: Number(account.balance)
        };
    }
    async updateBalance(id, amount) {
        const account = await this.getAccount(id);
        const newBalance = account.balance + amount;
        if (newBalance < 0) {
            throw new errors_1.ValidationError('Insufficient funds');
        }
        try {
            const updatedAccount = await this.app.db.account.update({
                where: { id },
                data: {
                    balance: newBalance,
                    updatedAt: new Date()
                }
            });
            return {
                ...updatedAccount,
                balance: Number(updatedAccount.balance)
            };
        }
        catch (error) {
            throw new errors_1.DatabaseError('Failed to update balance');
        }
    }
    async login(email, password) {
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
        });
        if (!account) {
            throw new Error('Invalid credentials');
        }
        const isValid = await this.authService.verifyPassword(password, account.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        const token = this.authService.generateToken(account.id);
        const { password: _, ...accountWithoutPassword } = account;
        return {
            token,
            account: {
                ...accountWithoutPassword,
                balance: Number(accountWithoutPassword.balance)
            }
        };
    }
}
exports.AccountService = AccountService;
