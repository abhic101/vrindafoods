class AppError extends Error {
    code = 500;
    constructor(message, options = {}) {
        super(message, {cause: options.cause});
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    code = 400;
}
class UnauthorizedError extends AppError {
    code = 401;
}
class TokenExpiredError extends UnauthorizedError {}
class InvalidTokenError extends UnauthorizedError {}
class ForbiddenError extends AppError {
    code = 403;
}
class NotFoundError extends AppError {
    code = 404;
}
class ValidationError extends BadRequestError {
    code = 422;
    constructor (message, details = {}, options = {}) {
        super(message, {cause: options.cause});
        this.details = details;
    }
}
class ConflictError extends ValidationError {}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    TokenExpiredError,
    InvalidTokenError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    ConflictError
}