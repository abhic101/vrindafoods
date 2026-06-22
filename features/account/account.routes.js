const express = require('express');
const zodParser = require('../../middlewares/zodParser');
const { changePasswordSchema, changeEmailSchema, changeUsernameSchema, updateProfileSchema } = require('./account.schemas');
const auth = require('../../middlewares/auth');

function createAccountRoute(accountController) {
    const router = express.Router();

    // Route's middleware
    router.use(auth);

    // Routes
    router.route('/profile')
        .get(accountController.getProfile)
        .patch(zodParser(updateProfileSchema), accountController.updateProfile);
    router.post('/password', zodParser(changePasswordSchema), accountController.changePassword);
    router.post('/username', zodParser(changeUsernameSchema), accountController.changeUsername);
    router.post('/email', zodParser(changeEmailSchema), accountController.changeEmail);
    router.delete('/', accountController.deleteAccount);

    return router;
}

module.exports = createAccountRoute;