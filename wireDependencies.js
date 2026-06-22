// Shared dependencies imports
const UserModel = require('./models/user.model');
const ProfileLogModel = require('./models/profileLog.model');
const UserRepository = require('./repositories/user.repository');
const ProfileRepository = require('./repositories/profileLog.repository');

// Feature wiring factories import
const wireAuthFeature = require('./features/auth/auth.wiring');
const wireAccountFeature = require('./features/account/account.wiring');

function wireDependencies() {

    // Generic global dependency instances
    const userRepository = new UserRepository(UserModel);
    const profileLogRepository = new ProfileRepository(ProfileLogModel);

    // Wiring feature dependencies
    const authController = wireAuthFeature(userRepository);
    const accountController = wireAccountFeature(userRepository, profileLogRepository);

    return {authController, accountController};
}

module.exports = wireDependencies;