const registry = require('../registry');

/**
 * 
 * @param {Error} err Relevent exception object
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