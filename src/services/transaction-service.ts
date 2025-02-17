import {FastifyInstance} from "fastify";
import {Prisma, PrismaClient} from "@prisma/client";
import {DatabaseError} from "../utils/errors";


export class TransactionService {
    private db: PrismaClient;

    constructor(private app: FastifyInstance) {
        this.db = this.app.db;
    }

    /**
     * Creates a new transaction
     * @param data Transaction data containing type, amount, fromAccountId, toAccountId and status
     * @returns The created transaction with associated accounts
     * @throws Error if required account IDs are missing or if there are insufficient funds
     */
    async createTransaction(data: {
        type: "deposit" | "withdrawal" | "transfer";
        amount: number | string;
        fromAccountId?: string | null;
        toAccountId?: string | null;
        status?: string;
    }) {
        const amount = new Prisma.Decimal(data.amount);

        return this.db.$transaction(async (tx) => {
            if (data.type === "withdrawal" || data.type === "transfer") {
                if (!data.fromAccountId) {
                    throw new Error("A fromAccountId is required for this transaction type");
                }

                const fromAccount = await tx.account.findUnique({
                    where: {id: data.fromAccountId},
                });

                if (!fromAccount) {
                    throw new Error("Sender account not found");
                }

                if (fromAccount.balance.lessThan(amount)) {
                    throw new Error("Insufficient funds");
                }
            }

            const transaction = await tx.transaction.create({
                data: {
                    amount,
                    type: data.type,
                    status: data.status ?? "pending",
                    fromAccountId: data.fromAccountId ?? null,
                    toAccountId: data.toAccountId ?? null,
                },
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });

            if (data.type === "deposit" && data.toAccountId) {
                await tx.account.update({
                    where: {id: data.toAccountId},
                    data: {balance: {increment: amount}}
                });

                await tx.transaction.update({
                    where: {id: transaction.id},
                    data: {status: "completed"}
                });
            }

            if (data.type === "withdrawal" && data.fromAccountId) {
                await tx.account.update({
                    where: {id: data.fromAccountId},
                    data: {balance: {decrement: amount}}
                });

                await tx.transaction.update({
                    where: {id: transaction.id},
                    data: {status: "completed"}
                });
            }

            if (data.type === "transfer") {
                if (!data.fromAccountId || !data.toAccountId) {
                    throw new Error("Both fromAccountId and toAccountId are required for transfers");
                }

                await tx.account.update({
                    where: {id: data.fromAccountId},
                    data: {balance: {decrement: amount}}
                });

                await tx.account.update({
                    where: {id: data.toAccountId},
                    data: {balance: {increment: amount}}
                });

                await tx.transaction.update({
                    where: {id: transaction.id},
                    data: {status: "completed"}
                });
            }

            return transaction;
        });
    }

    /**
     * Retrieves a transaction by its ID
     * @param id The transaction ID
     * @returns The transaction with associated accounts or null if not found
     * @throws DatabaseError if the operation fails
     */
    async getTransactionById(id: string) {
        try {
            return await this.db.transaction.findUnique({
                where: {id},
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });
        } catch (err) {
            throw new DatabaseError(`Failed to get transaction: ${err}`);
        }
    }

    /**
     * Updates an existing transaction
     * @param id The transaction ID to update
     * @param data The data to update the transaction with
     * @returns The updated transaction with associated accounts
     * @throws DatabaseError if the operation fails
     */
    async updateTransaction(id: string, data: any) {
        try {
            return await this.db.transaction.update({
                where: {id},
                data: {
                    amount: data.amount ? new Prisma.Decimal(data.amount) : undefined,
                    type: data.type ?? undefined,
                    status: data.status ?? undefined,
                    fromAccountId: data.fromAccountId ?? null,
                    toAccountId: data.toAccountId ?? null,
                    updatedAt: new Date(),
                },
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });
        } catch (err) {
            throw new DatabaseError(`Failed to update transaction: ${err}`);
        }
    }

    /**
     * Deletes a transaction
     * @param id The transaction ID to delete
     * @returns The deleted transaction with associated accounts
     * @throws DatabaseError if the operation fails
     */
    async deleteTransaction(id: string) {
        try {
            return await this.db.transaction.delete({
                where: {id},
                include: {
                    fromAccount: true,
                    toAccount: true,
                },
            });
        } catch (err) {
            throw new DatabaseError(`Failed to delete transaction: ${err}`);
        }
    }
}