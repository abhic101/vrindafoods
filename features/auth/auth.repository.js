const { ConflictError } = require('../../errors/app.errors');
const { buildConflictErrorDetails } = require('../../errors/error.utils');

class AuthRepository {
    constructor (model, userRepository) {
        this.userRepository = userRepository;
        this.model = model;
    }

    // Find auth details only, including sensitive
    // username can be email or seperate username
    findUserAuth = async (identifier) => {
        const user = await this.userRepository.findUserByUsername(identifier).select('_id +auth.passwordHash').lean();
        return user;
    }

    /* FOR FAST AVAILABILITY LOOKUP
    *
    findUsername = async (username) => {
        return await this.userRepository.findUser(username).select('auth.username').lean();
    }

    findEmail = async (email) => {
        return await this.userRepository.findUser(username).select('auth.email').lean();
    }
    *
    */


    // Adding a new user, only availabe in auth feature, auth.role field can only be updated by admin
    addNewUser = async (signupData) => {
        try {
            const newUser = await this.model.create({
                auth: {
                    email: signupData.email,
                    username: signupData.username,
                    passwordHash: signupData.passwordHash
                },
                profile: {
                    firstname: signupData.firstname,
                    lastname: signupData.lastname,
                    dob: signupData.dob,
                    phone: signupData.phone,
                    country_code: signupData.country_code
                }
            });
        } catch(err) {
            if (err.code === 11000) {
                const details = buildConflictErrorDetails(err);
                throw new ConflictError('Confilct error', details, {cause: err});
            }
            throw err;
        }
    }
}

module.exports = AuthRepository;