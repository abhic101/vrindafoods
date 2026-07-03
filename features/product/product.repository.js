const { NotFoundError } = require('../../errors/app.errors');
const { shapeProductData, buildFlattenProduct } = require('./product.utils');

class ProductRepository {

    /**
     * @param {import('../../models/product.model')} ProductModel
     * @param {import('../../repositories/user.repository')} userRepostory
     * @param {import('../../repositories/product.repository')} sharedProductRepository
     * @param {import('../../repositories/sharedCategory.repository')} categoryRepository
     */
    constructor(ProductModel, userRepository, sharedProductRepository, categoryRepository) {
        this.ProductModel = ProductModel;
        this.userRepository = userRepository;
        this.sharedProductRepository = sharedProductRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * @param {string} userId ObjectId of the user as string
     * @param {Object} productData Object containing the required fields to create product
     * @returns Newly created product's listing part only
     */
    async addNewProduct(userId, productData) {
        const shapedData = shapeProductData(productData);
        productData['internal_info.createdBy'] = userId;
        const newProduct = new this.ProductModel(shapedData);
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
            const updatedProduct = await this.ProductModel.findOneAndUpdate({
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
            await this.sharedProductRepository.deleteById(productId);
        } catch (err) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Product does not exists', {cause: err});
            }
            throw err;
        }
    }

    // --------Category Repository wrapper methods------------
    /**
     * 
     * @param {string} categoryId ObjectId of category as string
     * @returns {Object} Category if found, NULL if not found
     */
    async findCategoryById(categoryId) {
        const category = await this.categoryRepository.findById(categoryId).select('_id name parent ancestors');
        return category;
    }

    /**
     * 
     * @param {string} categoryName Name of the category
     * @returns {Array} Array of all the categories with name 'categoryName'
     */
    async findCategoryByName(categoryName) {
        const categories = await this.categoryRepositories.findByName(categoryName);
        return categories;
    }

    /**
     * 
     * @returns All the categories for selection in the add product menu
     */
    async getAllCategories() {
        const categories = await this.categoryRepository.findAll();
        return categories;
    }
}

module.exports = ProductRepository;