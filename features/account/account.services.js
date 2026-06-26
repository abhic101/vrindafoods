const {comparePassword, hashPassword} = require('../../utils/password.utils');
const { UnauthorizedError, ConflictError } = require('../../errors/app.errors');
const { buildChangeLog } = require('./account.utils');

class AccountServices {
    /**
     * 
     * @param {import('./account.repository')} accountRepository 
     * @param {import('../../repositories')} userRepository 
     */
    constructor(accountRepository, userRepository) {
        this.accountRepository = accountRepository;
    }

    // -----HELPER METHODS-----

    /**
     * 
     * @param {string} userId ObjectId of the user in the form of string
     * @returns User document with only auth details
     */
    #getUser = async (userId) => {
        const user = await this.accountRepository.findUserAuth(userId);
        if (!user) {
            throw new UnauthorizedError('User session');
        }
        return user;
    }

    /**
     * 
     * @param {string} password Password recieved from client
     * @param {string} passwordHash Hashed password string from User document
     */
    #verifyPassword = async (password, passwordHash) => {
        const isPasswordMatch = await comparePassword(password, passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Incorrect password');
        }
    }

    // -----SERVICE METHODS-----
    /**
     * 
     * @param {*} userId 
     * @returns 
     */
    async getProfile (userId) {
        const user = await this.accountRepository.findUserProfile(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    /**
     * Change password of logged in user
     * 
     * @param {string} userId ObjectId of user as string
     * @param {Object} param1 Object containing current password and new password to set
     */
    async changePassword (userId, {currentPassword, newPassword}) {
        // Equality check
        if (newPassword === currentPassword) {
            throw new ConflictError('New password cannot be same as old password');
        }

        const user = await this.#getUser(userId);
        await this.#verifyPassword(currentPassword, user.auth.passwordHash);

        const newPasswordHash = await hashPassword(newPassword);
        const changes = buildChangeLog(user.auth, {passwordHash: newPasswordHash}, 'auth');

        await this.accountRepository.changePassword(userId, newPasswordHash, changes);
    }

    /**
     * Change username of logged in user
     * 
     * @param {string} userId ObjectId of user as string 
     * @param {Object} param1 Password for verification and new username as object
     */
    async changeUsername (userId, {password, newUsername}) {
        const user = await this.#getUser(userId);

        // Equality check
        if (newUsername === user.auth.username) {
            throw new ConflictError('New username cannot be same as old username');
        }

        await this.#verifyPassword(password, user.auth.passwordHash);
        const changes = buildChangeLog(user.auth, {username: newUsername}, 'auth');

        await this.accountRepository.changeUsername(userId, newUsername, changes);
    }

    /**
     * Change email of logged in user
     * 
     * @param {string} userId ObjectId of user as string
     * @param {Object} param1 Password for verification and new email to set
     */
    async changeEmail (userId, {password, newEmail}) {
        const user = await this.#getUser(userId);
        
        // Equality Check
        if (newEmail === user.auth.email) {
            throw new ConflictError('New email cannot be the same as old email');
        }

        await this.#verifyPassword(password, user.auth.passwordHash);
        const changes = buildChangeLog(user.auth, {email: newEmail}, 'auth');

        await this.accountRepository.changeEmail(userId, newEmail, changes);
    }

    /**
     * Update fields of user profile using a single method
     * 
     * @param {string} userId ObjectId of user as string
     * @param {Object} updates Flat object containing fields to change
     */
    async updateProfile (userId, updates) {
        const user = await this.getProfile(userId);

        // Strip equal fields from updates
        const keys = Object.keys(updates);
        const details = [];
        for (let key of keys) {
            if (updates[key] === user.profile[key]) {
                details.push({field: key, message: `new ${key} cannot be same as current ${key}`});
                delete updates[key];
            }
        }
        // If all fields are stripped from updates
        if (details.length === keys.length) {
            throw new ConflictError('No changes in profile found', details);
        }

        const changes = buildChangeLog(user.profile, updates, 'profile');
        await this.accountRepository.updateProfile(userId, updates, changes);
    }

    /**
     * Delete self account
     * 
     * @param {string} userId ObjectId of the user in the form of string
     * @param {string} password Password for verification
     */
    async deleteAccount (userId, password) {
        const user = await this.#getUser(userId);
        await this.#verifyPassword(password, user.auth.passwordHash);
        
        await this.accountRepository.deleteUser(userId);
    }
}

module.exports = AccountServices;


/*
Features to implement
- flatten returning data to avoid leaking db shape details to the client in response

*/