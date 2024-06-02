// Data base schema 
const User = require('../models/User')
const OTP = require('../models/OTP')

// essential packages for Authentication
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
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




// sign up controller for regestering Users

exports.signup = async (req, res) => {

    try {
        // destructuring all fields arr present in database
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        // all fields are required for request 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({ message: "All fields are required." })
        }

        // check the password and confirm password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password does not match." })
        }

        // check user already exist or not using email with find method mongoDB
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "User already exist with this email." })
        }

        // find the most recent otp in database 
        const recentOtp = await OTP.findOne().sort({ createdAt: -1 }).limit(1)
        // check the otp is correct or not
        if (recentOtp.otp !== otp) {
            return res.status(400).json({ message: "OTP is incorrect." })
        }

        // hashed the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // create the user with all fields
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // send response after storing to database
        res.status(201).json({ message: "User created successfully.", user: user })



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'User Regester Failed'
        })
    }
}


// login user functionality 

exports.login = async (req, res) => {
    try {

        // destructure the fields
        const { email, password } = req.body;

        // check email and password fields are not empty 
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields required'
            })
        }

        // check user exist or not 
        const userExist = await User.findOne({ email }).populate('additionalDetails')
        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }

        // generate JWT token and compate password
        if (await bcrypt.compare(password, userExist.password)) {
            const token = jwt.sign({ email: userExist.email, id: userExist._id, accountType: userExist.accountType }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })
            // save token to user document in database
            userExist.token = token;
            userExist.password = undefined;

            // set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                userExist,
                message: 'User login Success'
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Login Failure Please Try again'
        })
    }
}