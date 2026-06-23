const mongoose = require('mongoose');

// Product model, not final, fields can be added as required, semantic and logical nesting can be done
const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
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
    category: {
        main_category: {
            type: String,
            required: true,
            trim: true
        },
        sub_category: {
            type: String,
            required: true,
            trim: true
        },
        product_type: {
            type: String,
            trim: true
        }
    },
    specifications: specificationsSchema,
    review_count: {
        type: Number
    },
    rating: {
        type: Number
    },
    product_images: {
        type: [String],
        validator: function(v) {
            return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: 'Invalid URL format'
    },
    internal_info: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        seller: {
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

productSchema.index({'category.main_category': 1, brand: 1, 'internal_info.isActive': -1});
productSchema.index({'category.sub_category': 1, 'category.main_category': 1, 'internal_info.isActive': -1})
productSchema.index({brand: 1, 'internal_info.isActive': -1}) 
productSchema.index({'internal_info.seller': 1, 'category.main_category': 1, 'internal_info.isActive': -1});

// Add document creator as seller if not explicitly defined
productSchema.pre('save', function(next) {
    if (!this['internal_info.seller']) {
        this['internal_info.seller'] = this['internal_info.createdBy']
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);