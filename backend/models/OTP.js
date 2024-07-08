const mongoose = require('mongoose')
const mailSender = require('../utils/MailSender')
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema = new mongoose.Schema({
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
        const mailResponse = await mailSender(email, 'Verification EMail', emailTemplate(otp))
        console.log(mailResponse.response)
    } catch (error) {
        console.log(error)
        throw error
    }
}

// pre hook middleware before signin OTP will store in Database

OTPSchema.pre('save', async function (next) {
    console.log("New Document Saved to database")
    if (this.isNew) {

        await sendVerificationEmail(this.email, this.otp)
        next();
    }
})


const OTP = mongoose.model('OTP', OTPSchema)

module.exports = OTP