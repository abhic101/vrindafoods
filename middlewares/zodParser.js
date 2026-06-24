const { ZodError } = require('zod');
const { ValidationError } = require('../errors/app.errors');

/**
 * HOF to provide zod validation
 * 
 * @param {import('zod').ZodObject} schema Schema to validate against the request
 * @param {string} shape Shape of the request to validate. Default is 'body'
 * @returns Actual parsing method with schema lexically inherited
 * @throws {ValidationError} If the shape is not validated
 */
const zodParser = (schema, shape = 'body') => ((req, res, next) => {
    try {
    req[shape] = schema.parse(req[shape]);
    next();
    } catch(err) {
        if (err instanceof ZodError) {
            const details = err.issues.map(issue => ({  // Map details of the fields that failed validation
                field: issue.path.join('.'),
                message: issue.message
            }));
            next(new ValidationError('Validation Error', details));
        }
        next(err);
    }
});

module.exports = zodParser;