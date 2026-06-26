const mongoose = require('mongoose');
const { ConflictError } = require('../../errors/app.errors');
const { buildConflictErrorDetails } = require('../../errors/error.utils');
const { buildProfileForSet } = require('./account.utils');

class AccountRepository {
    /**
     * 
     * @param {import('../../models/user.model')} userModel 
     * @param {import('../../repositories/user.repository')} userRepository 
     * @param {import('../../repositories/profileLog.repository')} profileLogRepository 
     */
    constructor(userModel, userRepository, profileLogRepository) {
        this.userModel = userModel;
        this.userRepository = userRepository;
        this.profileLogRepository = profileLogRepository;
    }

    /**
     * Find user profile
     * 
     * @param {string} userId ObjectId of the user as string
     * @returns User document with only non-sensitive fields if found. undefined otherwise
     */
    async findUserProfile (userId) {
        return await this.userRepository.findProfileById(userId).select('auth.email auth.username auth.role').lean();
    }

    /**
     * Find user credentials for authorization purposes
     * 
     * @param {string} userId ObjectId of the user as string
     * @returns User document with auth and sensitive fields
     */
    findUserAuth = async (userId) => {
        return await this.userRepository.findAuthById(userId).lean();
    }

    /**
     * 
     * @param {string} userId ObjectId of the user as string
     * @param {string} newPasswordHash Hashed string of the new password to set
     * @param {Object} changes ChangeLog object
     */
    async changePassword (userId, newPasswordHash, changes) {
        const session = await mongoose.startSession();      // For ACID guarantee
        try {
            session.startTransaction();
            // Update document
            await this.userModel.findByIdAndUpdate(
                userId,
                { $set: {'auth.passwordHash': newPasswordHash} },
                {
                    session: session
                }
            );

            // Log changes
            const log = this.profileLogRepository.addLog(userId, changes);
            log.$session(session);
            await log.save();
            
            await session.commitTransaction();
        } catch(err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession(); // Never forget anywhere in sessions
        }
    }

    /**
     * For changing username
     * 
     * @param {string} userId ObjectId of the user as string
     * @param {string} newUsername New username to be set
     * @param {Object} changes ChangeLog
     */
    async changeUsername  (userId, newUsername, changes) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this.userModel.findByIdAndUpdate(userId,
                { $set: {'auth.username': newUsername} },
                {
                    runValidators: true,    // Need to run validators to check conflicts
                    session: session
                }
            );

            const log = this.profileLogRepository.addLog(userId, changes);
            log.$session(session);
            await log.save();
            
            await session.commitTransaction();
        } catch (err) {     // In case the username is taken
            await session.abortTransaction();
            if (err.code === 11000) {
                const details = buildConflictErrorDetails(err);
                throw new ConflictError('Username not available', details, {cause: err});
            }

            // Otherwise to the global handler
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * For changing email
     * 
     * @param {string} userId ObjectId of the user as string
     * @param {string} newEmail New email to be set
     * @param {Object} changes ChangeLog
     */
    async changeEmail (userId, newEmail, changes) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this.userModel.findByIdAndUpdate(userId, 
                { $set: { 'auth.email': newEmail } },
                {
                    runValidators: true,    // Need to run validators to check conflicts
                    session: session
                }
            );

            const log = this.profileLogRepository.addLog(userId, changes);
            log.$session(session);
            await log.save();
            
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            if (err.code === 11000) {   // In case the email is taken
                const details = buildConflictErrorDetails(err);
                throw new ConflictError('Email already taken', details, {cause: err});
            }

            // If error is other type, then handle through handler
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * For updating profile fields(single/multiple)
     * 
     * @param {string} userId ObjectId of the user as string
     * @param {string} updates Object containing fields to update
     * @param {Object} changes ChangeLog
     */
    async updateProfile (userId, updates, changes) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const formattedUpdates = buildProfileForSet(updates);
            await this.userModel.findByIdAndUpdate(userId,
                { $set: formattedUpdates },
                {
                    runValidators: true,
                    session: session
                }
            )

            const log = this.profileLogRepository.addLog(userId, changes);
            log.$session(session);
            await log.save();

            await session.commitTransaction();
        } catch(err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 
     * @param {string} userId ObjectId of user as string
     */
    async deleteAccount (userId) {
        await this.userModel.findByIdAndUpdate(userId,
            { $set: {isActive: false} }
        )
    }
}

module.exports = AccountRepository;