const Course = require('../models/Course')
const Tag = require('../models/Tag')
const User = require('../models/User')

const { uploadImageToClodinary } = require('../utils/imageUploader')

// createCourse handle function

exports.createCourse = async (req, res) => {
    try {
        // destructure data
        const { CourseName, CourseDesc, WhatYouWillLearn, price, tag } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnail;

        //  validation

        if (!CourseName || !CourseDesc || !WhatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required'
            })
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId)

        console.log('Instructor Details', instructorDetails)

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: 'Instructor Details not found'
            })
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById(tag)
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: 'Tag Details not found'
            })
        }

        //  upload mage top cloudinary
        const thumbnailImage = await uploadImageToClodinary(thumbnail, process.env.FOLDER_NAME)

        // create entry for new course

        const newCourse = await Course.create({
            CourseName,
            CourseDesc,
            instructor: instructorDetails._id,
            WhatYouWillLearn: WhatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        // add the new course to the use schema of instructor

        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id
            },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true }
        )

        //  return response
        return res.status(200).json({
            success: false,
            message: 'Course Created Successfully',
            data: newCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}



// get all courses

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            CourseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate('instructor').exec()

        return res.status(200).json({
            success: true,
            message: 'Data for all courses fetched successfully',
            data: allCourses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}