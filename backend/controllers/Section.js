const Section = require('../models/Section')
const Course = require('../models/Course')

exports.createSection = async (req, res) => {
    try {
        // data fetch
        console.log(req.body);
        const { sectionName, courseId } = req.body;

        // validate
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Requirements'
            })
        }

        // create section
        const newSection = await Section.create({ sectionName });

        // update course with sectio objectId
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id,
            },
        },
            { new: true }
        )
        .populate({
            path: 'courseContent',
            populate:{
                path: 'SubSection',
            }
          })
          .exec()

        return res.status(200).json({
            success: true,
            message: 'section created Successfully',
            updatedCourse
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messge: 'Section Creation failed',
            error: error.message
        })
    }
}


// update section

exports.updateSection = async (req, res) => {
    try {
        // data input
        const { sectionName, sectionId } = req.body;
        // data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required'
            })
        }
        // update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })
        // return res

        return res.status(200).json({
            success: true,
            message: 'Section Update Successfully',
            data:section
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update section',
            error: error.message
        })
    }
}


// delete section 

exports.deleteSection = async (req, res) => {
    try {
        // getId
        const { sectionId } = req.params;

        // findById 
        await Section.findByIdAndDelete(sectionId)
        // return res

        return res.status(200).json({
            success: false,
            message: 'section deleted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete section',
            error: error.message
        })
    }
}