const mongoose = require('mongoose');
const { PROFILE_LOG_FIELDS } = require('../constants/models.constants');

// Only these fields' value changes are stored

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
            enum: Object.values(PROFILE_LOG_FIELDS),
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