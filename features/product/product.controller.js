class ProductController {
    /**
     * @param {import('./product.services')} productService
     */
    constructor(productService) {
        this.productService = productService;
    }

    async addNewProduct(req, res, next) {
        try {
            const newProduct = await this.productService.addNewProduct(req.user.userId, req.body);
            res.status(200).json({
                success: true,
                message: 'Product has been successfully created',
                newProduct
            });
        } catch (err) {
            next(err);
        }
    }

    async getProduct(req, res, next) {
        try {
            const product = await this.productService.getProduct(req.params.productId);
            res.status(200).json({
                success: true,
                message: 'Product fetched successfully',
                product
            });
        } catch(err) {
            next(err)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const updatedProduct = await this.productService.updateProduct(req.user.userId, req.user.permission.scope, req.params.productId, req.body);
            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                product
            })
        } catch(err) {
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            await this.productService.deleteProduct(req.user.userId, req.user.permission.scope, req.body.password, req.params.productId);
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = ProductController;