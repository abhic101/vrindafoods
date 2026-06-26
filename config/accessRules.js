const { ROLES } = require('../constants/models.constants');

// Roles permission, whenever add new feature, set its permission here
const accessRules = {
    [ROLES.ADMIN]: [
        'user:*:read:self',
        'user:*:read:*',
        'user:profile:update:self',
        'user:role:update:*',
        'user:*:delete:*',
        'product:*:*:*'
    ],
    [ROLES.MANAGER]: [
        'user:*:read:self',
        'user:credentials:update:self',
        'user:profile:update:self',
        'product:*:read:*',
        'product:*:create:self',
        'product:*:update:self',
        'product:*:delete:self'
    ],
    [ROLES.CUSTOMER]: [
        'user:*:read:self',
        'user:credentials:update:self',
        'user:profile:update:self',
        'user:*:delete:self',
        'product:*:read:*'
    ]
};

/**
 * @param {string} role - Role of the user being authorized
 * @param {string} granted - Permission string to check against
 * @returns {Array} Array containing matched permissions
 */
function matchPermission(role, granted) {
    const permissions = accessRules[role] || [];
    const grantedArr = granted.split(':');
    
    return permissions.filter((required) => {
        const requiredArr = required.split(':');
        return requiredArr.every((attribute, i) => attribute === '*' || attribute === grantedArr[i]);
    });
}

/**
 * @param {string} role - Role of the user being authorized
 * @param {string} granted - Permission string to check against
 * @returns {Boolean} True if the user with 'role' has 'permission', false otherwise
 */
function hasPermission(role, granted) {
    return matchPermission(role, granted).length > 0;
}

module.exports = {
    hasPermission,
    matchPermission
};