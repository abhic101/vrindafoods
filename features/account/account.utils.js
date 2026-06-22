function buildChangeLog(oldObject, changeObject, path) {
    const changes = [];
    const keys = Object.keys(changeObject);
    for (let key of keys) {
        changes.push({
            field: path + '.' + key,
            oldValue: oldObject[key],
            newValue: changeObject[key]
        });
    }
    return changes;
}

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