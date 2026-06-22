const { ZodError } = require('zod');
const { ValidationError } = require('../errors/app.errors');

// HOF to provide zod validation while catching zodError and throwing custom Validation error
const zodParser = (schema, shape = 'body') => ((req, res, next) => {
    try {
    req[shape] = schema.parse(req[shape]);
    next();
    } catch(err) {
        if (err instanceof ZodError) {
            const details = err.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }));
            next(new ValidationError('Validation Error', details));
        }
        next(err);
    }
});

module.exports = zodParser;