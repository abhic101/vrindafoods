const { NotFoundError } = require('../../errors/app.errors');
const { shapeProductData, buildFlattenProduct } = require('./product.utils');

class ProductRepository {

    /**
     * @param {import('../../models/product.model')} productModel
     * @param {import('../../repositories/user.repository')} userRepostory
     * @param {import('../../repositories/product.repository')} sharedProductRepository
     */
    constructor(productModel, userRepository, sharedProductRepository) {
        this.productModel = productModel;
        this.userRepository = userRepository;
        this.sharedProductRepository = sharedProductRepository;
    }

    /**
     * @param {string} userId ObjectId of the user as string
     * @param {Object} productData Object containing the required fields to create product
     * @returns Newly created product listing
     */
    async addNewProduct(userId, productData) {
        const shapedData = shapeProductData(productData);
        const newProduct = new this.productModel(shapedData);
        newProduct = (await newProduct.save()).toObject();

        return newProduct.listing;
    }

    /**
     * @param {string} productId ObjectId of the product as string
     * @returns {Object} Full product object
     * @throws {NotFoundError} If the object is not found
     */
    async getProductById(productId) {
        try {
            const product = await this.sharedProductRepository.findById(productId)
                .select('listing details meta _id').lean();

            return buildFlattenProduct(product);
        } catch (err) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Given product not found', {cause: err});
            }
            throw err;
        }
    }

    /**
     * 
     * @param {string} productId ObjectId of the product as string
     * @param {Object} updateData Contiaining fields to update and their values
     * @returns {Object} Updated product listing
     * @throws {NotFoundError} If the product is not found
     */
    async updateProduct(productId, updateData) {
        try {
            const shapedData = shapeProductData(updateData);
            const updatedProduct = await this.productModel.findOneAndUpdate({
                _id: productId, 'internal_info.isActive': true
            },
            shapedData, {returnDocument: 'after',});

            return updatedProduct.listing;
        } catch (err) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Product not found', {cause: err});
            }
            throw err;
        }
    }

    /**
     * 
     * @param {string} productId ObjectId of the product as string
     * @throws {NotFoundError} If the product is not found
     */
    async deleteProduct(productId) {
        try {
            await this.sharedProductRepository.deleteById(productId)
        } catch (err) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Product does not exists', {cause: err});
            }
            throw err;
        }
    }
}

module.exports = ProductRepository;