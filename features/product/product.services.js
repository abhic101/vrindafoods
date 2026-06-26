const {flattenProductListing, flattenProduct} = require('./product.utils');
const { comparePassword } = require('../../utils/password.utils');
const { UnauthorizedError } = require('../../errors/app.errors');
const { canUpdate, canDelete } = require('./product.policy');

class ProductService {

    /**
     * @param {import('./product.repository')} productRepository
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * 
     * @param {string} userId ObjectId of the user as string
     * @param {Object} productData Object containing the required fields to create product
     * @returns Newly created product listing
     */
    async addNewProduct(userId, productData) {
        return await this.productRepository.addNewProduct(userId, productData);
    }

    /**
     * Find a single product using its id
     * 
     * @param {string} productId ObjectId of the product as string
     * @returns Complete product object for full display
     */
    async getProduct(productId) {
        return await this.productRepository.getProductById(productId);
    }

    /**
     * 
     * @param {string} userId ObjectId of the auth user as string
     * @param {string} scope Allowed scope of objects that can be updated, according to policy
     * @param {string} productId ObjectId of product to be updated as string
     * @param {Object} updateData Object containing fields to be updates
     * @returns Updated product listing
     */
    async updateProduct(userId, scope, productId, updateData) {
        const product = this.getProduct(productId);
        if (!canUpdate(userId, ))
        return await this.productRepository.updateProduct(productId, updateData);
    }

    /**
     * 
     * @param {string} userId ObjectId of user deleting the 
     * @param {string} scope Allowed scope of objects that can be updated, according to policy
     * @param {string} password Password send for verification
     * @param {string} productId ObjectId of product to be deleted as string
     */
    async deleteProduct (userId, scope, password, productId) {
        const user = await this.productRepository.findUserAuth(userId);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordMatch = comparePassword(password, userAuth.passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Invalid Credentials');
        }
        await this.productRepository.deleteProduct(productId);
    }
}

module.exports = ProductService;