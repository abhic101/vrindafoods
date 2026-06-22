const mongoose = require('mongoose');
const { ConfilctError } = require('../../errors/app.errors');
const { buildConfilctErrorDetails } = require('../../errors/error.utils');
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
        return await this.userRepository.findUserAuth(userId).select('+auth.passwordHash').lean();
    }

    // Writing password change and profile log in a single session for ACID guarantee
    changePassword = async (userId, newPasswordHash, changes) => {
        const session = await mongoose.startSession();
        try {
            // Update document
            await this.userModel.findByIdAndUpdate(
                userId,
                { $set: {'auth.passwordHash': newPasswordHash} },
                {
                    timestamps: true,
                    session: session
                }
            );

            await this.profileLogRepository.addLog(userId, changes).session(session);
            
            session.commitTransaction();
        } catch(err) {
            session.abortTransaction();
            throw err;
        } finally {
            session.endSession(); // Never forget anywhere in sessions
        }
    }

    // Changing username. Need to run validators
    changeUsername = async (userId, newUsername, changes) => {
        const session = await mongoose.startSession();
        try {
            await this.userModel.findByIdAndUpdate(userId,
                { $set: {'auth.username': newUsername} },
                {
                    runValidators: true,
                    timestamps: true,
                    session: session
                }
            );

            await this.profileLogRepository.addLog(userId, changes).session(session);
            
            session.commitTransaction();
        } catch (err) {     // In case the username is taken
            session.abortTransaction();
            if (err.code === 11000) {
                const details = buildConfilctErrorDetails(err);
                throw new ConfilctError('Username not available', details, {cause: err});
            }

            // Otherwise to the global handler
            throw err;
        } finally {
            session.endSession();
        }
    }

    // Changing username. Need to run validators
    changeEmail = async (userId, newEmail, changes) => {
        const session = mongoose.session();
        try {
            await this.userModel.findByIdAndUpdate(userId, 
                { $set: { 'auth.email': newEmail } },
                {
                    runValidators: true,
                    timestamps: true,
                    session: session
                }
            );

            await this.profileLogRepository.addLog(userId, changes).session(session);
            
            session.commitTransaction();
        } catch (err) {
            session.abortTransaction();
            if (err.code === 11000) {   // In case the email is taken
                const details = buildConfilctErrorDetails(err);
                throw new ConfilctError('Email already taken', details, {cause: err});
            }

            // If error is other type, then handle through handler
            throw err;
        } finally {
            session.endSession();
        }
    }

    // Updating any field of 'user.profile' in a single method
    updateProfile = async (userId, updates, changes) => {
        const session = mongoose.session();
        try {
            const formattedUpdates = buildProfileForSet(updates);
            await this.userModel.findByIdAndUpdate(userId,
                { $set: formattedUpdates },
                {
                    runValidators: true,
                    timestamps: true,
                    session: session
                }
            )

            await this.profileLogRepository.addLog(userId, changes).session(session);

            session.commitTransaction();
        } catch(err) {
            session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    // Soft delete account
    deleteAccount = async(userId, password) => {
        await this.userModel.findByIdAndUpdate(userId,
            { $set: {isActive: false} },
            { timestamps: true, }
        )
    }
}

module.exports = AccountRepository;