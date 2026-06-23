const { ROLES } = require('../constants/models.constants');

// Roles permission, whenever add new feature, set its permission here
const accessRules = {
    [ROLES.ADMIN]: [
        'user:*:read:self',
        'user:*:read:any',
        'user:profile:update:self',
        'user:role:update:any',
        'user:*:delete:any',
    ],
    [ROLES.MANAGER]: [
        'user:*:read:self',
        'user:credentials:update:self',
        'user:profile:update:self'
    ],
    [ROLES.CUSTOMER]: [
        'user:*:read:self',
        'user:credentials:update:self',
        'user:profile:update:self',
        'user:*:delete:self'
    ]
};

/**
 * @param {string} role - Role of the user being authorized
 * @param {string} permission - Permission string to check against
 * @returns {Boolean} True if the user with 'role' has 'permission', false otherwise
 */
function hasPermission(role, permission) {
    const permissions = accessRules[role] || [];

    // wildCard Matching

    if (permissions.includes(permission)) return true;
    return false;
}

module.exports = hasPermission;