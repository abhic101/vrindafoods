
/**
 * Build Confilct error details object
 * 
 * @param {Error} err Error object (of the conflicted field type). Mainly mongo error 11000
 * @returns {Object} Details object of conflicted fields
 */
function buildConflictErrorDetails(err) {
    const details = [];
    const fields = Object.keys(err.keyPattern);
    if (fields) {
        for (let field of fields) {
            const actualField = field.split('.').at(-1);
            details.push({field: actualField, message: `${actualField} is already in use`});
        }
    }

    return details;
}

module.exports = {
    buildConflictErrorDetails
};