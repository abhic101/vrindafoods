const { matchPermission } = required('../../config/accessRules');

/**
 * Check if the current user can update the productId product
 * @param {string} userId 
 * @param {string} sellerId ObjectId of the seller of the product
 * @param {string} scope Scope of the granted permission (based on ownership)
 */
function canUpdate (userId, sellerId, scope) {
    if (scope === 'self') return userId === sellerId;
    return true;
}

/**
 * Check if the current user can delete the productId product
 * @param {string} userId 
 * @param {string} sellerId ObjectId of the seller of the product
 * @param {string} scope Scope of the granted permission (based on ownership)
 */
function canDelete (userId, sellerId, role, scope) {
    if (scope === 'self') return userId === sellerId;
    return true;
}

module.exports = {
    canUpdate,
    canDelete
}