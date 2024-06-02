const mongoose = require('mongoose')

const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    CompletedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSection'
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('CourseProgress', courseProgressSchema)