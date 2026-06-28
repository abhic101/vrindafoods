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
        .get(auth('user:*:read:self'), accountController.getProfile)
        .patch(zodParser(updateProfileSchema), auth('user:profile:update:self'), accountController.updateProfile);
    router.post('/password', zodParser(changePasswordSchema), auth('user:credentials:update:self'), accountController.changePassword);
    router.post('/username', zodParser(changeUsernameSchema), auth('user:credentials:update:self'), accountController.changeUsername);
    router.post('/email', zodParser(changeEmailSchema), auth('user:credentials:update:self'), accountController.changeEmail);
    router.delete('/', auth('user:*:delete:self'), accountController.deleteAccount);

    return router;
}

module.exports = createAccountRoute;