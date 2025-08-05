const { HandOverForm } = require('../../Models/HandOverForm.model');
const { Image } = require('../../Models/Images.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const path = require('path');


const CreateHandOverForm = async (req, res) => {
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
      mediaFiles
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
    console.error("error", error);
    return ErrorHandler(res, 500, "Server error while creating HandOver form");
  }
};

const GetHandOverForm = async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id) {
      return ErrorHandler(res, 400, "Missing required query parameter: project_id");
    }
    const handOverForms = await HandOverForm.find({ project_id }).populate('mediaFiles');
    if (!handOverForms || handOverForms.length === 0) {
      return ErrorHandler(res, 404, "No HandOver forms found for this project");
    }
    return ResponseOk(res, 200, "HandOver forms retrieved successfully", {
      forms: handOverForms,
    });
  } catch (error) {
    console.log("error", error);

    return ErrorHandler(res, 500, "Server error while retrieving HandOver forms");
  }
};


const UpdateHandOverForm = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "Missing required query parameter: id");
    }

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

    if (!id || !project_id) {
      return ErrorHandler(res, 400, "Required fields missing: id, project_id");
    }

    const existingForm = await HandOverForm.findById(id);
    if (!existingForm) {
      return ErrorHandler(res, 404, "HandOver form not found");
    }

    existingForm.siteSupervisor = siteSupervisor || existingForm.siteSupervisor;
    existingForm.date = date || existingForm.date;
    existingForm.jobNumber = jobNumber || existingForm.jobNumber;
    existingForm.sideName = sideName || existingForm.sideName;
    existingForm.wingLiftNumber = wingLiftNumber || existingForm.wingLiftNumber;
    existingForm.siteHandler = siteHandler || existingForm.siteHandler;
    existingForm.erectorName = erectorName || existingForm.erectorName;
    existingForm.wireManName = wireManName || existingForm.wireManName;
    existingForm.project_id = project_id;

    await existingForm.save();

    const uploadedFiles = req.files || [];

    const imageDocs = uploadedFiles.map(file => {
      const fileUrl = `/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`;
      return {
        project_id,
        table_type: "HandOverForm",
        table_id: existingForm._id,
        document_url: fileUrl
      };
    });

    if (imageDocs.length > 0) {
      await Image.insertMany(imageDocs);
    }

    return ResponseOk(res, 200, "HandOver form updated successfully", {
      form: existingForm,
    });

  } catch (error) {
    console.error("error", error);
    return ErrorHandler(res, 500, "Server error while updating HandOver form");
  }
};


const DeleteHandOverForm = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "HandOverForm ID is required");
    }

    const deletedForm = await HandOverForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return ErrorHandler(res, 404, "HandOverForm not found");
    }

    // Optionally delete associated images
    await Image.deleteMany({ table_id: id, table_type: "HandOverForm" });

    return ResponseOk(res, 200, "HandOver form deleted successfully");
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(res, 500, "Server error while deleting HandOver form");
  }
}
module.exports = {
  CreateHandOverForm,
  GetHandOverForm,
  UpdateHandOverForm,
  DeleteHandOverForm
};