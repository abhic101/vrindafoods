const mongoose = require('mongoose');
const specificationsSchema = require('./specifications.schema');

// Product model, not final, fields can be added as required, semantic and logical nesting can be done
const productSchema = new mongoose.Schema({
    listing: {
        name: {
            type:String,
            required: true,
            trim: true
        },
        mrp: {
            type: Number,
            required: true,
        },
        selling_price: {
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            default: 0
        },
        review_count: {
            type: Number,
            default: 0
        },
        thumbnail: {
            type: String,
            required: true,
            validator: function(v) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
            },
            message: 'Invalid URL format'
        }
    },
    details: {
        specifications: specificationsSchema,
        product_images: {
            type: [String],
            validator: function(v) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
            },
            message: 'Invalid URL format'
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    meta: {
        brand: {
            type: String,
            required: true,
            trim: true
            },
        category: {
            type: mongoose.ObjectId,
            ref: 'User',
            required: true
        }
    },
    internal_info: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

productSchema.index({'meta.brand': 1, 'meta.category': 1},
        {partialFilterExpression: { 'internal_info.isActive': true } });
productSchema.index({'meta.category': 1, 'meta.brand': 1},
    {partialFilterExpression: { 'internal_info.isActive': true } });
productSchema.index({'details.seller': 1, 'meta.category': 1},
    {partialFilterExpression: { 'internal_info.isActive': true } });

// Add document creator as seller if not explicitly defined
productSchema.pre('save', function(next) {
    if (!this['details.seller']) {
        this['details.seller'] = this['internal_info.createdBy']
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);