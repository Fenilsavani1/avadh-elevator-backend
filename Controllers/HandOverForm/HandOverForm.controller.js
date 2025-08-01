const { HandOverForm } = require('../../Models/HandOverForm.model');
const {Image} = require('../../Models/Images.model'); 
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const path = require('path');


const createHandOverForm = async (req, res) => {
  try {
    const {
      siteSupervisor,
      date,
      jobNumber,
      sideName,
      wingLiftNumber,
      siteHandler,
      erectorName,
      wireManName,
      project_id,
    } = req.body;

    if (!siteSupervisor || !date || !jobNumber || !project_id) {
      return ErrorHandler(res, 400, "Required fields missing: siteSupervisor, date, jobNumber, project_id");
    }

    const uploadedFiles = req.files || [];

    const mediaFiles = uploadedFiles.map(file => ({
      fileType: file.mimetype.startsWith('video') ? 'video' : 'image'
    }));

    // Step 1: Save HandOverForm with media metadata
    const newForm = await HandOverForm.create({
      siteSupervisor,
      date,
      jobNumber,
      sideName,
      wingLiftNumber,
      siteHandler,
      erectorName,
      wireManName,
      project_id,
      // mediaFiles
    });

    // Step 2: Save file URLs in images collection
    const imageDocs = uploadedFiles.map(file => {
      const fileUrl = `/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`;
      return {
        project_id,
        table_type: "HandOverForm",
        table_id: newForm._id,
        document_url: fileUrl
      };
    });

    if (imageDocs.length > 0) {
      await Image.insertMany(imageDocs);
    }

    return ResponseOk(res, 201, "HandOver form created successfully", {
      form: newForm,
    });

  } catch (error) {
    console.error("[createHandOverForm]", error);
    return ErrorHandler(res, 500, "Server error while creating HandOver form");
  }
};

module.exports = {
  createHandOverForm  
};