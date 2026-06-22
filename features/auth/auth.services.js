const jwt = require('jsonwebtoken');
const {comparePassword, hashPassword} = require('../../utils/password.utils');
const { UnauthorizedError } = require('../../errors/app.errors');

// Fake data to avoid timing attacks
// const fakeHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

class AuthService {
    constructor (authRepository) {
        this.authRepository = authRepository;
    }

    // Login functionality with bcrypt hashing, no timing atk safeguard due to username being easily accessible
    login = async (identifier, password) => {
        const user = await this.authRepository.findUserAuth(identifier);
        if (!user) {
            throw new UnauthorizedError('Invalid username or password');
        }

        const isPasswordMatched = await comparePassword(password, user.auth.passwordHash)
        if (!isPasswordMatched) {
            throw new UnauthorizedError('Invalid username or password');
        }

        return jwt.sign({
            userId: user._id.toString(),
            role: user.auth.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
    }

    // Creating new user, signup data is flat here
    signup = async (signupData) => {
        signupData.passwordHash = await hashPassword(signupData.password);
        await this.authRepository.addNewUser(signupData);
    }
}

module.exports = AuthService;