const { QCEntry } = require("../../Models/QC.model");
const { Image } = require("../../Models/Images.model");
const { ResponseOk, ErrorHandler } = require("../../Utils/ResponseHandler");
const { json } = require("sequelize");
const path = require("path");
const fs = require("fs");


const CreateQCEntry = async (req, res) => {
  try {
    const {
      areaName,
      qc_name,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id,
      inspection_data
    } = req.body;

    if (!areaName || !date || !siteName || !jobNumber || !project_id) {
      return ErrorHandler(res, 400, "Required fields missing: areaName, date, siteName, jobNumber, project_id");
    }

    const uploadedFiles = req.files || [];

      const files = uploadedFiles.map(file => ({
        fileType: file.mimetype.startsWith('video') ? 'video' : 'image',
        fileUrl: `public/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`
      }));


    const newQCEntry = await QCEntry.create({
      areaName,
      qc_name,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id,
      files,
      inspection_data
    });


    return ResponseOk(res, 201, "QC Entry created successfully", newQCEntry);

  } catch (error) {
    console.error("Error creating QC Entry:", error);
    return ErrorHandler(res, 500, "Failed to create QC Entry", error.message || error);
  }
};

const UpdateQCEntry = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "Missing required query parameter: id");
    }

    const {
      areaName,
      qc_name,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id,
      inspection_data,
      deletedImg
    } = req.body;

    if (!project_id) {
      return ErrorHandler(res, 400, "Missing required field: project_id");
    }

    const updateFields = {};
    if (areaName !== undefined) updateFields.areaName = areaName;
    if (qc_name !== undefined) updateFields.qc_name = qc_name;
    if (date !== undefined) updateFields.date = date;
    if (siteName !== undefined) updateFields.siteName = siteName;
    if (jobNumber !== undefined) updateFields.jobNumber = jobNumber;
    if (wingOrLiftNo !== undefined) updateFields.wingOrLiftNo = wingOrLiftNo;
    if (type !== undefined) updateFields.type = type;
    if (sideSupervisor !== undefined) updateFields.sideSupervisor = sideSupervisor;
    if (wiremanName !== undefined) updateFields.wiremanName = wiremanName;
    // // updateFields.project_id = project_id;
    // if (project_id !== undefined) updateFields.project_id = project_id;

    if (inspection_data !== undefined) {
      const cleanedInspectionData = Array.isArray(inspection_data)
        ? inspection_data.map(section => ({
            ...section,
            data: Array.isArray(section.data)
              ? section.data.map(item => ({
                  point: item.point?.trim(),
                  action: item.action?.trim() || "N/A",
                  details: item.details?.trim() || "N/A"
                }))
              : []
          }))
        : [];
      updateFields.inspection_data = cleanedInspectionData;
    }

    const uploadedFiles = req.files || [];
    const newFiles = uploadedFiles.map(file => ({
      fileType: file.mimetype.startsWith("video") ? "video" : "image",
      fileUrl: `public/uploads/${file.mimetype.startsWith("video") ? "videos" : "images"}/${file.filename}`,
    }));

    const currentEntry = await QCEntry.findById(id);
    if (!currentEntry) {
      return ErrorHandler(res, 404, "QC Entry not found");
    }



    let updatedFiles = currentEntry.files || [];
console.log("deletedImg",deletedImg);
let UpdateddeletedImgIds = JSON.parse(deletedImg || "[]");

    if (UpdateddeletedImgIds.length > 0) {
      const deletedSet = new Set(UpdateddeletedImgIds);

      const filesToDelete = updatedFiles.filter(file => deletedSet.has(file._id?.toString()));

      for (const file of filesToDelete) {
        const filePath = path.resolve(file.fileUrl);
        fs.unlink(filePath, err => {
          if (err) {
            console.warn(`Failed to delete file: ${filePath}`, err.message);
          }
        });
      }

      updatedFiles = updatedFiles.filter(file => !deletedSet.has(file._id?.toString()));
    }

if (newFiles.length > 0) {
  updatedFiles.push(...newFiles);
}

updateFields.files = updatedFiles;


    const updatedQCEntry = await QCEntry.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return ResponseOk(res, 200, "QC Entry updated successfully", {
      entry: updatedQCEntry,
    });

  } catch (error) {
    console.error("Error updating QC Entry:", error);
    return ErrorHandler(res, 500, "Server error while updating QC Entry", error.message || error);
  }
};



const GetQCEntries = async (req, res) => {
  try {
   
    const entries = await QCEntry.find({project_id: req.query.project_id})


    return ResponseOk(res, 200, 'QC Entries with images retrieved successfully', entries);
  } catch (error) {
    console.error("Error retrieving QC Entries:", error);
    return ErrorHandler(res, 500, 'Failed to retrieve QC Entries', error.message || error);
  }
};


const GetQCEntriesById = async (req, res) => {
  try {
   const { id } = req.query;
    const entries = await QCEntry.findById(id)
    if(!entries) {
      return ErrorHandler(res, 404, "QC Entry not found");
    }

    return ResponseOk(res, 200, 'QC Entries with images retrieved successfully', entries);
  } catch (error) {
    console.error("Error retrieving QC Entries:", error);
    return ErrorHandler(res, 500, 'Failed to retrieve QC Entries', error.message || error);
  }
};

const DeleteQcEntry = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "Missing required query parameter: id");
    }

    const deletedEntry = await QCEntry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return ErrorHandler(res, 404, "QC Entry not found");
    }

    // Delete associated images
    await Image.deleteMany({ table_type: "QCEntry", table_id: id });

    return ResponseOk(res, 200, "QC Entry deleted successfully");
  } catch (error) {
    console.error("Error deleting QC Entry:", error);
    return ErrorHandler(res, 500, "Server error while deleting QC Entry");
  }
};

const GetQCEntriesOverview = async (req,res) =>{
  try {
    
    const entries = await QCEntry.find({project_id: req.query.project_id})
      .select('_id qc_name date siteName  sideSupervisor wiremanName wingOrLiftNo notes')
      .sort({ date: -1 });  
    return ResponseOk(res, 200, "QC Entries overview retrieved successfully", entries);
  } catch (error) {
    console.error("Error retrieving QC Entries overview:", error);
    return ErrorHandler(res, 500, "Failed to retrieve QC Entries overview",error);
    
  }
}


module.exports = {
  CreateQCEntry,
  GetQCEntries,
  GetQCEntriesById,
  GetQCEntriesOverview,
  UpdateQCEntry,
  DeleteQcEntry
};
