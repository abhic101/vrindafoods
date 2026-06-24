/**
 * Build changeLog object in the model shape
 * 
 * @param {Object} oldObject - Object with key:oldValue pairs
 * @param {Object} changeObject - Object with key:newValue pairs. Shape must be subset of oldObject
 * @param {string} path - Parent fieldname in case of nested fields
 * @returns {Object} Object in the required shape with oldValue and newValue
 */
function buildChangeLog(oldObject, changeObject, path) {
    const changes = [];
    const keys = Object.keys(changeObject);
    for (let key of keys) {
        changes.push({
            field: path ? path + '.' + key : key,
            oldValue: oldObject[key],
            newValue: changeObject[key]
        });
    }
    return changes;
}

/**
 * Build updated profile fields in the model shape
 * 
 * @param {Object} updates - Flat object which contains field:newValues to update
 * @returns Object in the model specified shape
 */
function buildProfileForSet(updates) {
    const formattedUpdates = {};
    const keys = Object.keys(updates);
    for (let key of keys) {
        formattedUpdates['profile.' + key] = updates[key];
    }

    return formattedUpdates;
}

module.exports = {
    buildChangeLog,
    buildProfileForSet
}