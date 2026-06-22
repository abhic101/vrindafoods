const mongoose = require('mongoose');
const { ConflictError } = require('../../errors/app.errors');
const { buildConflictErrorDetails } = require('../../errors/error.utils');
const { buildProfileForSet } = require('./account.utils');

class AccountRepository {
    constructor(userModel, userRepository, profileLogRepository) {
        this.userModel = userModel;
        this.userRepository = userRepository;
        this.profileLogRepository = profileLogRepository;
    }

    // Profile + auth (non-sensitive) as it is required to display
    findUserProfile = async (userId) => {
        return await this.userRepository.findUserProfile(userId).select('auth.email auth.username auth.role').lean();
    }

    // Auth with sensitive fields for verification of important changes
    findUserAuth = async (userId) => {
        return await this.userRepository.findUserAuth(userId).lean();
    }

    // Writing password change and profile log in a single session for ACID guarantee
    changePassword = async (userId, newPasswordHash, changes) => {
        const session = await mongoose.startSession();
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

    // Changing username. Need to run validators
    changeUsername = async (userId, newUsername, changes) => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this.userModel.findByIdAndUpdate(userId,
                { $set: {'auth.username': newUsername} },
                {
                    runValidators: true,
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

    // Changing username. Need to run validators
    changeEmail = async (userId, newEmail, changes) => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this.userModel.findByIdAndUpdate(userId, 
                { $set: { 'auth.email': newEmail } },
                {
                    runValidators: true,
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

    // Updating any field of 'user.profile' in a single method
    updateProfile = async (userId, updates, changes) => {
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

    // Soft delete account
    deleteAccount = async(userId) => {
        await this.userModel.findByIdAndUpdate(userId,
            { $set: {isActive: false} }
        )
    }
}

module.exports = AccountRepository;