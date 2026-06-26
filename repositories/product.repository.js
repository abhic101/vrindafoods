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
    findById (productId) {
        const productQuery = this.productModel.findOne({_id: productId, 'internal_info.isActive': 1});
        return productQuery;
    }

    /**
     * Find all active products
     * 
     * @returns {mongoose.Query} Returns unexecuted query to all the active product documents
     */
    findAll () {
        const productQuery = this.productModel.find({'internal_info.isActive': true});
        return productQuery;
    }

    
    findByCategory(category) {
        // const productQuery = this.productModel.find({'meta.category'})
    };

    /**
     * 
     * @param {string} productId ObjectId of product as string
     * @returns Unexecuted query to soft delete the document if found
     */
    deleteById(productId) {
        const productQuery = this.productModel.findOneAndUpdate({_id: productId, 'internal_info.isActive': true}, {
            'internal_info.isActive': false
        });
        return productQuery;
    }
}

module.exports = ProductRepository;