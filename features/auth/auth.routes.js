const express = require('express');
const zodParser = require('../../middlewares/zodParser');
const { loginSchema, signupSchema } = require('./auth.schemas');

// '/auth' route factory
function createAuthRoute(authController) {
    const router = express.Router();
    
    router.post('/login', zodParser(loginSchema), authController.login);
    router.post('/signup', zodParser(signupSchema), authController.signup);
    
    return router;
}

module.exports = createAuthRoute;

/* FEATURES THAT CAN BE ADDED
    quick lookup for username availability
    email validation using third party service (if possible before zod Validation, or in services)
    email availability
*/