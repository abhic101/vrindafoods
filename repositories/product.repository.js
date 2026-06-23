class ProductRepository {
    constructor(productModel) {
        this.productModel = productModel;
    }

    findProductById = (productId) => {
        const productQuery = this.productModel.findOne({_id: productId, 'internal_info.isActive': 1})
    }

    findProductsByCategory = (main_category) => {
        const categoryProducts = this.productModel.findOne({'category'})
    }
}