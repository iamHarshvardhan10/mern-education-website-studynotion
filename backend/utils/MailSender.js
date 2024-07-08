const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            secure: false,
        })

        let info = await transporter.sendMail({
            from: `"Harsh.devcodes || Harsh Bhosale" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info.response)
        return info

    } catch (error) {
        console.log(error.message)
        return error.message
    }
}

module.exports = mailSender;