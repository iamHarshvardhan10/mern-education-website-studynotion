const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Mongo Db Connected')
    }).catch((error) => {
        console.log('Mongo Connection Failed')
        console.log(error)
        process.exit(1)
    })
}