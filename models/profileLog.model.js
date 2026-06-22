const mongoose = require('mongoose');

// Only these fields' value changes are stored
const fieldEnum = ['auth.email', 'auth.username', 'auth.passwordHash', 'auth.role', 'profile.firstname', 'profile.lastname', 'profile.dob', 'profile.phone', 'profile.country_code']

const profileLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    changes: [{
        field: {
            type: String,
            enum: fieldEnum,
            required: true,
            immutable: true
        },
        oldValue: {
            type: String,
            immutable: true
        },
        newValue: {
            type: String,
            required: true,
            trim: true,
            immutable: true
        }
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

profileLogSchema.index({user: 1, 'changes.field': 1});
profileLogSchema.index({user: 1, timestamps: -1});

module.exports = mongoose.model('ProfileLog', profileLogSchema);