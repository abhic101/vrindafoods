const jwt = require('jsonwebtoken');
const { UnauthorizedError , TokenExpiredError, ForbiddenError } = require('../errors/app.errors');
const { matchPermission } = require('../config/accessRules');

/**
 * 
 * @param {string} granted - The permission string granted to req
 * @returns {Function} Actual Express middleware function
 * @throws {UnauthorizedError} If no token found
 * @throws {ForbiddenError} If user does not have permission to access route
 * @throws {TokenExpiredError} If token has expired
 */
const auth = (granted) => ((req, res, next) => {
    try {
        if (!req.cookies.auth) {
            throw new UnauthorizedError('Please login to proceed');
        }
        const token = req.cookies.auth;
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;

        // Check permission
        const matchedPermission = matchPermission(req.user.role, granted);
        if (!matchedPermission.length > 0) {
            throw new ForbiddenError('You do not have access to do this operation');
        }
        req.user.permission = {
            resource: matchedPermission[0],
            sub_resource: matchedPermission[1],
            action: matchedPermission[2],
            scope: matchedPermission[3]
        }
        next();
    } catch (err) {
        const error = err;
        if (err.name === 'TokenExpiredError') {
            error = new TokenExpiredError('Please login again');
        }
        next(error);
    }
})

module.exports = auth;