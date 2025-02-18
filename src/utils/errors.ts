export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

/** Transaction errors
 * @description These errors are thrown when there is a problem with the transaction
 */
export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}
export class InvalidTransactionError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class InsufficientFundsError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class TransactionNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class BothRequiredError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class SourceAccountNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class RecipientAccountIsRequiredError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class RecipientAccountNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class SenderAccountNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
