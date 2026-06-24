// Currently not being used--------------------------------
const { TokenExpiredError } = require("../errors/app.errors");

// App errors with their names for registry mapping names
const APP_ERRORS = Object.freeze({
    AppError: 'AppError',
    BadRequestError: 'BadRequestError',
    UnauthorizedError: 'UnauthorizedError',
    TokenExpiredError: 'TokenExpiredError',
    InvalidTokenError: 'InvalidTokenError',
    ForbiddenError: 'ForbiddedError',
    NotFoundError: 'NotFoundError',
    ValidationError: 'ValidationError',
    ConflictError: 'ConflictError'
});

module.exports = {
    APP_ERRORS
}