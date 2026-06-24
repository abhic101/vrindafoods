const jwt = require('jsonwebtoken');
const {comparePassword, hashPassword} = require('../../utils/password.utils');
const { UnauthorizedError } = require('../../errors/app.errors');

// Fake data to avoid timing attacks
// const fakeHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

class AuthService {

    /**
     * 
     * @param {import('./auth.repository')} authRepository
     */
    constructor (authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Main user login method
     * 
     * @param {string} identifier - Either email or username as unique account identifier.
     * @param {string} password - Password string send by client.
     * @returns {string} A jwt token with validity of 1 day and userId and role as payload.
     * @throws {UnauthorizedError} If identifier not found or password does not match.
     *  */ 
    async login (identifier, password) {
        const user = await this.authRepository.findUserAuth(identifier);
        if (!user) {
            throw new UnauthorizedError('Invalid username or password');
        }

        // No timing atk safeguard due to username being easily accessible
        const isPasswordMatched = await comparePassword(password, user.auth.passwordHash)
        if (!isPasswordMatched) {
            throw new UnauthorizedError('Invalid username or password');
        }

        return jwt.sign({
            userId: user._id.toString(),
            role: user.auth.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
    }

    /**
     * Creating new user
     * 
     * @param {Object} signupData- Validated required signup fields. Flat object shape
     * @throws {ConflictError} - If the user is not created due to non-unique username or email
     */ 
    async signup  (signupData) {
        signupData.passwordHash = await hashPassword(signupData.password);
        await this.authRepository.addNewUser(signupData);
    }
}

module.exports = AuthService;