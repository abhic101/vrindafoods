const mongoose = require('mongoose');

const specificationsSchema = new mongoose.Schema({
    units: {
        type: Number
    },
    amount: {
        type: Number
    },
    amount_unit: {
        type: String
    },
    description: {
        type: String
    }
    // more fields
});

module.exports = specificationsSchema;