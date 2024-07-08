const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
const { uploadImageToClodinary } = require('../utils/imageUploader')


exports.createSubSection = async (req, res) => {
  try {
    // fetch dat from req body
    const { sectionId, title, description } = req.body;

    // extract file 
    const video = req.files.videoFile;
    // validation 
    console.log('sub Section details', req.body)
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: 'All Fields required'
      })
    }
    console.log(sectionId, title, description, video)
    console.log('before uploadDetails')
    // upload video to cloudinary
    const uploadDetails = await uploadImageToClodinary(video, process.env.FOLDER_NAME)

    console.log('uploadDetails', uploadDetails)


    // create a sub section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url
    })

    console.log(SubSectionDetails)
    // update section with this sub section ObjectId
    const updateSection = await Section.findByIdAndUpdate({ _id: sectionId }, {
      $push: {
        SubSection: SubSectionDetails._id
      }
    }, { new: true }).populate('SubSection')

    console.log(updateSection)
    // return res
    return res.status(200).json({
      success: true,
      message: 'SubSection Created SuccessFully',
      data: updateSection
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Subsection Creation Failed'
    })
  }
}


exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    // console.log(subSection)
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToClodinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "SubSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          SubSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "SubSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}
