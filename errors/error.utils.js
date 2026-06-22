function buildConflictErrorDetails(err) {
    const details = [];
    const fields = Object.keys(err.keyPattern);
    if (fields) {
        for (let field of fields) {
            const actualField = field.split('.')[1];
            details.push({field: actualField, message: `${actualField} is already in use`});
        }
    }

    return details;
}

module.exports = {
    buildConflictErrorDetails
};