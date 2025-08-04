const { QCEntry } = require("../../Models/QC.model");
const { Image } = require("../../Models/Images.model");
const { ResponseOk, ErrorHandler } = require("../../Utils/ResponseHandler");


const CreateQCEntry = async (req, res) => {
  try {
    const {
      areaName,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id
    } = req.body;

    if (!areaName || !date || !siteName || !jobNumber || !project_id) {
      return ErrorHandler(res, 400, "Required fields missing: areaName, date, siteName, jobNumber, project_id");
    }

    const uploadedFiles = req.files || [];
    console.log( "Uploaded files:", uploadedFiles);


    const mediaFiles = uploadedFiles.map(file => ({
      fileType: file.mimetype.startsWith('video') ? 'video' : 'image'
    }));

    //step 1
    const newQCEntry = await QCEntry.create({
      areaName,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id,
      // mediaFiles
    });

    //step 2
    const imageDocs = uploadedFiles.map(file => {
      const fileUrl = `/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`;
      return {
        project_id,
        table_type: "QCEntry",
        table_id: newQCEntry._id,
        document_url: fileUrl
      };
    }
    );
     console.log("Image Docs to insert:", imageDocs); 
   if (imageDocs.length > 0) {
      await Image.insertMany(imageDocs);
    }

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
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName,
      project_id
    } = req.body;

    if (!project_id) {
      return ErrorHandler(res, 400, "Missing required field: project_id");
    }

    // Step 1: Build dynamic update object
    const updateFields = {};
    if (areaName !== undefined) updateFields.areaName = areaName;
    if (date !== undefined) updateFields.date = date;
    if (siteName !== undefined) updateFields.siteName = siteName;
    if (jobNumber !== undefined) updateFields.jobNumber = jobNumber;
    if (wingOrLiftNo !== undefined) updateFields.wingOrLiftNo = wingOrLiftNo;
    if (type !== undefined) updateFields.type = type;
    if (sideSupervisor !== undefined) updateFields.sideSupervisor = sideSupervisor;
    if (wiremanName !== undefined) updateFields.wiremanName = wiremanName;
    updateFields.project_id = project_id;

    // Step 2: Update QCEntry
    const updatedQCEntry = await QCEntry.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedQCEntry) {
      return ErrorHandler(res, 404, "QC Entry not found");
    }

    // Step 3: Handle file uploads
    const uploadedFiles = req.files || [];

    const imageDocs = uploadedFiles.map(file => {
      const fileUrl = `/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`;
      return {
        project_id,
        table_type: "QCEntry",
        table_id: updatedQCEntry._id,
        document_url: fileUrl
      };
    });

    if (imageDocs.length > 0) {
      await Image.insertMany(imageDocs);
    }

    return ResponseOk(res, 200, "QC Entry updated successfully", {
      entry: updatedQCEntry,
    });

  } catch (error) {
    console.error("Error updating QC Entry:", error);
    return ErrorHandler(res, 500, "Server error while updating QC Entry");
  }
};


const GetQCEntries = async (req, res) => {
  try {
   
    const entries = await QCEntry.find()
      .populate('project_id', 'site_name') 
      .lean(); // convert to plain JS objects

    const qcIds = entries.map(entry => entry._id);

    // 3. Fetch related images by table_type and table_id
    const images = await Image.find({
      table_type: 'QCEntry',
      table_id: { $in: qcIds }
    }).lean();

    const imageMap = {};
    for (const img of images) {
      const id = img.table_id.toString();
      if (!imageMap[id]) imageMap[id] = [];
      imageMap[id].push(img.document_url);
    }

    // Attach image URLs to each QC Entry
    const enrichedEntries = entries.map(entry => ({
      ...entry,
      images: imageMap[entry._id.toString()] || []
    }));

    return ResponseOk(res, 200, 'QC Entries with images retrieved successfully', enrichedEntries);
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


module.exports = {
  CreateQCEntry,
  GetQCEntries,
  UpdateQCEntry,
  DeleteQcEntry
};
