const express = require("express");
const auth = require('../../middlewares/auth');
const zodParser = require('../../middlewares/zodParser');

/**
 * Factory function to create '/product' route
 * 
 * @param {import('./product.controller')} productController
 * @returns {express.Router} Product feature router
 */
function createProductRoute(productController) {
    const router = express.Router();

    router.post('/', auth('product:*:create:*'), zodParser(productCreateSchema), productController.addNewProduct);
    router.route('/:productId')
        .get(auth('product:public:read:*'), productController.getProduct)
        .patch(auth('product:public:update:*'), zodParser(productUpdateSchema), productController.updateProduct)
        .delete(auth('product:*:delete:*'), productController.deleteProduct);

    return router;
}

module.exports = createProductRoute;