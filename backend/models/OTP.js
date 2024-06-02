const mongoose = require('mongoose')

const OTPScheam = new mongoose({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

module.exports = mongoose.model('OTP', OTPScheam)