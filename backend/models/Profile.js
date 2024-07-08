const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dataOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Profile', profileSchema);