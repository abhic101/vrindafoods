const productModel = require('../../models/product.model');
const ProductController = require('./product.controller');
const ProductService = require('./product.services');
const ProductRepository = require('./product.repository');

function wireProductFeature (userRepository, sharedProductRepository) {
    const productRepository = new ProductRepository(productModel, userRepository, sharedProductRepository);
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);

    return productController;
}

module.exports = wireProductFeature;