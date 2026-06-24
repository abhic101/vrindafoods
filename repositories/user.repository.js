class UserRepository {
    /**
     * 
     * @param {import('../models/user.model')} userModel 
     */
    constructor(userModel) {
        this.userModel = userModel;
    }

    /**
     * Finds a user by username or email. Internal fields excluded by default.
     *
     * @param {string} username - Either auth.username or auth.email
     * @returns {mongoose.Query} Unexecuted Query to user with auth and profile fields
     */
    findUserByUsername(username) {
        return this.userModel.findOne({
            $or: [
                { 'auth.email': username },
                { 'auth.username': username }
            ],
            isActive: true
        }).select('auth.email auth.username auth.role profile');
    }

    /**
     * Base query for finding an active user by ObjectId.
     * 
     * @param {string} userId - MongoDB ObjectId as string
     * @returns {mongoose.Query} Unexecuted Query to full user document, except sensitive fields
     */
    findUserById(userId) {
        return this.userModel.findOne({ _id: userId, isActive: true });
    }

    /**
     * Finds auth details of an active user by ObjectId. Excludes sensitive fields
     * like passwordHash unless explicitly selected downstream.
     *
     * @param {string} userId - MongoDB ObjectId as string
     * @returns {mongoose.Query} Unexecuted Query to user with only auth fields
     */
    findUserAuth(userId) {
        return this.findUserById(userId).select('auth');
    }

    /**
     * Finds profile of an active user by ObjectId.
     *
     * @param {string} userId - MongoDB ObjectId as string
     * @returns {mongoose.Query} Unexecuted Query to user with only profile fields
     */
    findUserProfile(userId) {
        return this.findUserById(userId).select('profile');
    }
}

module.exports = UserRepository;