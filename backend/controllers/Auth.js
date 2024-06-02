// Data base schema 
const User = require('../models/User')
const OTP = require('../models/OTP')

// essential packages for Authentication
const otpGenerator = require('otp-generator')


// otp generating and validation of otp

exports.SendOtp = async (req, res) => {
    try {
        // fetch email from req body
        const { email } = req.body;
        // check if email is already registered
        const checkUserPresent = await User.findOne({ email })
        // check if user exist then return a resp.
        if (checkUserPresent) {
            return res.status(400).json({ message: "User already exist." })

        }

        // generate otp
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        console.log('OTP generated', otp)

        // save otp in db
        const result = await OTP.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, { upperCaseAlphabets, lowerCaseAlphabets: false, specialChars: false })
        }
        const otpPayload = { email, otp }
        const otpResult = await OTP.create(otpPayload)
        console.log(otpResult)
        res.status(200).json({ message: "OTP sent successfully.", otp: otpResult })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}