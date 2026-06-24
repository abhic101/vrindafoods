class ProductRepository {
    constructor(productModel) {
        this.productModel = productModel;
    }

    /**
     * Find single product by its id
     * 
     * @param {string} productId ObjectId of the product as string
     * @returns {mongoose.Query} Unexecuted query to the product document with given id
     */
    findProductById = (productId) => {
        const productQuery = this.productModel.findOne({_id: productId, 'internal_info.isActive': 1});
        return productQuery;

    }

    findProductsByCategory = (main_category) => {
        const categoryProducts = this.productModel.findOne({'category'})
    }
}