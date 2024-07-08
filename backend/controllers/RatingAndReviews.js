const RatingAndReview = require('../models/RatingAndReviews')
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

// create rating

exports.createRating = async (req, res) => {
    try {
        //    get user id
        const userId = req.user.id;

        // fetchData from req body
        const { rating, review, courseId } = req.body
        // check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: {
                    $eleMatch: {
                        $eq: userId

                    }
                }
            }
        )
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'student is not enrolled in the course'
            })
        }
        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviwed by the user'
            })
        }
        // creating rating and review
        const ratingReview = await RatingAndReview.create({
            rating: review,
            course: courseId,
            user: userId
        })
        // update course with this rating 
        const courseReview = await Course.findByIdAndUpdate({ _id: courseId }, {
            $push: {
                ratingAndReviews: ratingReview._id
            }
        }, { new: true })

        console.log(courseReview)
        // return response
        return res.status(200).json({
            success: true,
            message: 'Rating review created successfully',
            ratingReview
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Rating review creation failed',
            error: error.message
        })
    }
}



// getAverageRating

exports.getAverageRating = async (req, res) => {
    try {
        // get courseId
        const courseId = req.body.courseId;
        // calculate avg rating
        const result = await RatingAndReview.aggregate(
            [
                {
                    $match: {
                        course: new mongoose.Types.ObjectId(courseId),
                    },

                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: "$rating" },
                    }
                }
            ]
        )
        // return rating

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Average Rating is 0 , no rating given till now',
            averageRating: 0
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// get AllRating

exports.getAllRating = async (req, res) => {
    try {
        const allReview = await RatingAndReview.find({}).sort({ rating: 'desc' }).populate({ path: 'user', select: 'firstName lastName email image' }).populate({ path: 'course', select: 'courseName' }).exec()

        return res.status(200).json({
            success: true,
            message: 'All review fetch successfully',
            data: allReview
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


