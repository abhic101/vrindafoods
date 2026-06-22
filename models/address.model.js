const mongoose = require('mongoose');
const User = require('./user.model');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    is_default: {
        type: Boolean,
        default: false
    },
    person: {
        firstname: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 20,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 20,
            trim: true
        }
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        city: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        district: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        state: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        country: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        postal_code: { 
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
    },
    contact: {
        phone: {
            type: String,
        },
        country_code: {
            type: String,
            default: '+91'
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, 
{ timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

addressSchema.index({user});

module.exports = mongoose.model('Address', addressSchema);