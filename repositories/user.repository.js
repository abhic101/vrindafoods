class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    // Internal data are not selected by default, can be selected in
    // other repositories when needed using select

    // Finding user by 'auth.username' or 'email.username'
    findUserByUsername = (username) => {
        const userQuery = this.userModel.findOne({
            $or : [
                {'auth.email': username},
                {'auth.username': username}
            ],
            isActive: true
        }).select('auth.email auth.username auth.role profile');
        return userQuery;
    }

    // These functions work on user's objectID
    findUserById = (userId) => {
        const userQuery = this.userModel.findOne({_id: userId, isActive: true});
        return userQuery;
    }
    // Find only auth details of the user excluding sensitive
    findUserAuth = (userId) => {
        const userQuery = this.findUserById(userId).select('auth');
        return userQuery;
    }

    // Find only profile of the user
    findUserProfile = (userId) => {
        const userQuery = this.findUserById(userId).select('profile');
        return userQuery;
    }
}

module.exports = UserRepository;