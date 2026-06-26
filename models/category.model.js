const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

categorySchema.index({category: 1, parent: 1}, {unique: true, partialFilterExpression: {isActive: true}});
categorySchema.index({parent: 1, isActive: 1});

module.exports = mongoose.model('Category', categorySchema);