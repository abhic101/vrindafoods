const registry = require('../registry');

const validationErrorHandler = (err, res) => {
    res.status(err.code).json({
        message: err.message,
        details: err.details,
        success: false
    })
}

registry.set('ValidationError', validationErrorHandler);
registry.set('ConflictError', validationErrorHandler);