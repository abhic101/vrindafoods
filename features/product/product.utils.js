/**
 * 
 * @param {Object} data Object containing fields to add from request
 * @returns {Object} Object in the required shape to create or update
 */
function shapeProductData(data) {
    const productData = {
        'listing.name': productData.name,
            'listing.mrp': productData.mrp,
            'listing.selling_price': productData.selling_price,
            'listing.thumbnail': productData.thumbnail,
            'details.product_images': Object.values(productData.product_images),
            'details.specifications.units': productData.specs.units,
            'details.specifications.amount': productData.specs.amount,
            'details.specifications.amount_unit': productData.specs.amount_unit,
            'details.specifications.description': productData.specs.description,
            'details.seller': productData.seller,
            'meta.brand': productData.brand,
            'meta.category': productData.category,
            'internal_info.createdBy': userId
    }
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined));
}

/**
 * Flatten shaped object got from db to respond to the client
 * 
 * @param {Object} product Shaped product object from db 
 * @returns Flatten product object to be responded with
 */
function buildFlattenProduct(product) {
    const flattenProduct = {};

    return flattenHelper(flattenProduct, product);
}
function flattenHelper(flattenProduct, product) {
    const keys = Object.keys(product);
    for (let key of keys) {
        if (typeof(product[key]) === Object) {
            flattenHelper(flattenProduct, product[key]);
        }
        else {
            flattenProduct[key] = product[key];
        }
    }
    return flattenProduct;
}

module.exports = {
    shapeProductData,
    buildFlattenProduct
}