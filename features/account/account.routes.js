const express = require('express');
const zodParser = require('../../middlewares/zodParser');
const { changePasswordSchema, changeEmailSchema, changeUsernameSchema, updateProfileSchema } = require('./account.schemas');
const auth = require('../../middlewares/auth');

/**
 * '/account' route factory
 * 
 * @param {import('./account.controller')} accountController - Controller for the account routes 
 * @returns Router object for account route
 */
function createAccountRoute(accountController) {
    const router = express.Router();

    // Routes
    router.route('/profile')
        .get(auth('read:user:self'), accountController.getProfile)
        .patch(zodParser(updateProfileSchema), auth('update:profile:self'), accountController.updateProfile);
    router.post('/password', zodParser(changePasswordSchema), auth('update:credentials:self'), accountController.changePassword);
    router.post('/username', zodParser(changeUsernameSchema), auth('update:credentials:self'), accountController.changeUsername);
    router.post('/email', zodParser(changeEmailSchema), accountController.changeEmail);
    router.delete('/', accountController.deleteAccount);

    return router;
}

module.exports = createAccountRoute;