// Shared dependencies imports
const UserModel = require('./models/user.model');
const ProfileLogModel = require('./models/profileLog.model');
const ProductModel = require('./models/product.model');
const UserRepository = require('./repositories/user.repository');
const ProfileRepository = require('./repositories/profileLog.repository');
const SharedProductRepository = require('./repositories/product.repository');

// Feature wiring factories import
const wireAuthFeature = require('./features/auth/auth.wiring');
const wireAccountFeature = require('./features/account/account.wiring');
const wireProductFeature = require('./features/product/product.wiring');

function wireDependencies() {

    // Generic global dependency instances
    const userRepository = new UserRepository(UserModel);
    const profileLogRepository = new ProfileRepository(ProfileLogModel);
    const sharedProductRepository = new SharedProductRepository(ProductModel);

    // Wiring feature dependencies
    const authController = wireAuthFeature(userRepository);
    const accountController = wireAccountFeature(userRepository, profileLogRepository);
    const productController = wireProductFeature(userRepository, sharedProductRepository);

    return {authController, accountController, productController};
}

module.exports = wireDependencies;