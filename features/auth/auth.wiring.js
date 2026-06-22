const UserModel = require('../../models/user.model');
const AuthController = require('./auth.controller');
const AuthService = require('./auth.services');
const AuthRepository = require('./auth.repository');

// Wiring order should previal in every feature wiring
function wireAuthFeature(userRepository) {
    const authRepository = new AuthRepository(UserModel, userRepository);
    const authService = new AuthService(authRepository);
    const authController = new AuthController(authService);

    return authController;
}

module.exports = wireAuthFeature;