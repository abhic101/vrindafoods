const UserModel = require('../../models/user.model');
const AccountRepository = require('./account.repository');
const AccountService = require('./account.services');
const AccountController = require('./account.controller');

function wireAccountFeature(userRepository, profileLogRepository) {
    const accountRepository = new AccountRepository(UserModel, userRepository, profileLogRepository);
    const accountService = new AccountService(accountRepository);
    const accountController = new AccountController(accountService);

    return accountController;
}

module.exports = wireAccountFeature;