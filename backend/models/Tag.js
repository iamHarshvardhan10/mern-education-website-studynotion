const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
})


module.exports = mongoose.model('Tag', tagSchema)