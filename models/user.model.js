const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    auth: {
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            minlength: 3,
            maxlength: 20,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'user'],
            default: 'user'
        }
    },
    profile: {
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
        },
        dob: {
            type: Date,
            required: true,
        },
        phone: {
            type: String,
        },
        country_code: {
            type: String,
            default: '+91'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Active users with unique username and email
userSchema.index({'auth.email': 1},
    {unique: true, partialFilterExpression: {isActive: true}}
);
userSchema.index({'auth.username': 1},
    {unique: true, partialFilterExpression: {isActive: true}}
);

// Fast lookup for active users
userSchema.index({'auth.email': 1, isActive: -1});
userSchema.index({'auth.username': 1, isActive: -1});

module.exports = mongoose.model('User', userSchema);