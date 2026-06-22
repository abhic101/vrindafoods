const registry = require('../errors/registry');

function errorHandler(err, req, res, next) {

    // Logging
    console.error('An Error has occurred: ', err.stack);
    console.error("Occurred here: ", err.cause);
    if (process.env.STAGE == 'dev') {
        // logger
    }

    // Run handlers
    const handler = registry.get(err.name);
    if (handler) {
        handler(err, res);
        return;
    } 
    
    // Fallback
    res.status(err.code || 500).json({
        message: err.message,
        success: false
    })
}

module.exports = errorHandler;