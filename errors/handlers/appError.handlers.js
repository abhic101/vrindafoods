const registry = require('../registry');

/**
 * 
 * @param {Error} err ValidationError or its sub-class exception object
 * @param {Object} res Express response object
 */
const validationErrorHandler = (err, res) => {
    res.status(err.code).json({
        message: err.message,
        details: err.details,
        success: false
    })
}

registry.set('ValidationError', validationErrorHandler);
registry.set('ConflictError', validationErrorHandler);