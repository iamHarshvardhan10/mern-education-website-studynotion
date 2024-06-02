const mongoose = require('mongoose')
const mailSender = require('../utils/MailSender')

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

// sending OTP via mail 
const sendVerificationEmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(email, 'Verification Mail', otp)
        console.log(mailResponse)
    } catch (error) {
        console.log(error)
        throw error
    }
}

// pre hook middleware before signin OTP will store in Database

OTPScheam.pre('save', async function (next) {
    await sendVerificationEmail(this.email, this.open)
    next();
})


module.exports = mongoose.model('OTP', OTPScheam)