const {comparePassword, hashPassword} = require('../../utils/password.utils');
const { UnauthorizedError } = require('../../errors/app.errors');
const { buildChangeLog } = require('./account.utils');

class AccountServices {
    constructor(accountRepository, userRepository) {
        this.accountRepository = accountRepository;
    }

    // -----HELPER METHODS-----
    #getUser = async (userId) => {
        const user = await this.accountRepository.findUserAuth(userId);
        if (!user) {
            throw new UnauthorizedError('User session');
        }
        return user;
    }
    #verifyPassword = async (password, passwordHash) => {
        const isPasswordMatch = await comparePassword(password, passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Incorrect password');
        }
    }

    // -----SERVICE METHODS-----
    getProfile = async (userId) => {
        const user = await this.accountRepository.findUserProfile(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    changePassword = async (userId, {currentPassword, newPassword}) => {
        const user = await this.#getUser(userId);
        await this.#verifyPassword(currentPassword, user.auth.passwordHash);

        const newPasswordHash = await hashPassword(newPassword);
        const changes = buildChangeLog(user.auth, {passwordHash: newPasswordHash});
        await this.accountRepository.changePassword(userId, newPasswordHash, changes);
    }

    changeUsername = async (userId, {password, newUsername}) => {
        const user = await this.#getUser(userId);
        await this.#verifyPassword(password, user.auth.passwordHash);

        const changes = buildChangeLog(user.auth, {username: newUsername});
        await this.accountRepository.changeUsername(userId, newUsername, changes);
    }

    changeEmail = async (userId, {password, newEmail}) => {
        const user = await this.#getUser(userId);
        await this.#verifyPassword(password, user.auth.passwordHash);
        
        const changes = buildChangeLog(user.auth, {email: newEmail});
        await this.accountRepository.changeEmail(userId, newEmail, changes);
    }

    updateProfile = async(userId, updates) => {
        const user = await this.getProfile(userId);

        const changes = buildChangeLog(user.profile, updates);
        await this.accountRepository.updateProfile(userId, updates, changes);
    }

    deleteAccount = async(userId, password) => {
        const user = await this.#getUser(userId);
        await this.#verifyPassword(password, user.auth.passwordHash);
        
        await this.accountRepository.deleteUser(userId);
    }
}

module.exports = AccountServices;