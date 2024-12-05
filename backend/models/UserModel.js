const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
UserSchema.index({ name: 1 });

module.exports = mongoose.model('User', UserSchema);