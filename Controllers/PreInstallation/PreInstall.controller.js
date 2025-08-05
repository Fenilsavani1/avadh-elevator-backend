const { PreInstallation } = require("../../Models/Project.model");
const { ResponseOk, ErrorHandler } = require("../../Utils/ResponseHandler");
const path = require("path");
const fs = require("fs");

const CreatePreInstallation = async (req, res) => {
  try {
    const {
      name,
      lift_details,
      lift_shaft_plaster,
      pit_water_ppc,
      machine_room_pcc,
      lift_machine_clean,
      whitewash_wiring,
      machine_room_ladder_door_window,
      project_id
    } = req.body;

    if (!name || !lift_details || !lift_shaft_plaster || !pit_water_ppc || !project_id) {
      return ErrorHandler(res, 400, "Required fields missing");
    }

   const uploadedFiles = req.files || [];

const files = uploadedFiles.map(file => ({
  fileType: file.mimetype.startsWith('video') ? 'video' : 'image',
  fileUrl: `public/uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}/${file.filename}`
}));

    const newPreInstallEntry = await PreInstallation.create({
      name,
      lift_details,
      lift_shaft_plaster,
      pit_water_ppc,
      machine_room_pcc,
      lift_machine_clean,
      whitewash_wiring,
      machine_room_ladder_door_window,
      project_id,
      files    
    });

    return ResponseOk(res, 201, "Pre Install Entry created successfully", newPreInstallEntry);

  } catch (error) {
    console.error("Error creating QC Entry:", error);
    return ErrorHandler(res, 500, "Failed to create QC Entry", error.message || error);
  }
};



const GetAllPreInstallations = async (req, res) => {
  try {
    const allEntries = await PreInstallation.find(); 
    return ResponseOk(res, 200, "Fetched all entries", allEntries);
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch entries", error.message || error);
  }
};

const GetPreInstallationById = async (req, res) => {
  try {
    const { id } = req.query;

    const entry = await PreInstallation.findById(id);
    if (!entry) return ErrorHandler(res, 404, "Entry not found");

    return ResponseOk(res, 200, "Entry fetched successfully", entry);
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch entry", error.message || error);
  }
};

const UpdatePreInstallation = async (req, res) => {
  try {
    const { id } = req.query;

    const existingEntry = await PreInstallation.findById(id);
    if (!existingEntry) {
      return ErrorHandler(res, 404, "Entry not found");
    }

    const {
      name,
      lift_details,
      lift_shaft_plaster,
      pit_water_ppc,
      machine_room_pcc,
      lift_machine_clean,
      whitewash_wiring,
      machine_room_ladder_door_window,
      project_id,
      deletedFileId,
    } = req.body;

    // Convert single or multiple deletedFileId to array
    const idsToDelete = Array.isArray(deletedFileId)
      ? deletedFileId
      : deletedFileId
      ? [deletedFileId]
      : [];

    // 🧹 DELETE FILES (DB + FILE SYSTEM)
    if (idsToDelete.length > 0) {
      for (const fileId of idsToDelete) {
        const fileToRemove = existingEntry.files.find(
          (file) => file._id.toString() === fileId
        );
        if (fileToRemove) {
          const filePath = path.join(
            __dirname,
            "..",
            fileToRemove.fileUrl.replace("/public", "public")
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // delete from disk
          }
        }
      }

      // Remove from Mongo array
      existingEntry.files = existingEntry.files.filter(
        (file) => !idsToDelete.includes(file._id.toString())
      );
    }

    // 📤 HANDLE NEW UPLOADED FILES
    const uploadedFiles = req.files || [];
    const newFiles = uploadedFiles.map((file) => ({
      fileType: file.mimetype.startsWith("video") ? "video" : "image",
      fileUrl: `/public/uploads/${
        file.mimetype.startsWith("video") ? "videos" : "images"
      }/${file.filename}`,
    }));

    if (newFiles.length > 0) {
      existingEntry.files.push(...newFiles); // append new files
    }

    // 📝 UPDATE FIELDS
    if (name !== undefined) existingEntry.name = name;
    if (lift_details !== undefined) existingEntry.lift_details = lift_details;
    if (lift_shaft_plaster !== undefined)
      existingEntry.lift_shaft_plaster = lift_shaft_plaster;
    if (pit_water_ppc !== undefined)
      existingEntry.pit_water_ppc = pit_water_ppc;
    if (machine_room_pcc !== undefined)
      existingEntry.machine_room_pcc = machine_room_pcc;
    if (lift_machine_clean !== undefined)
      existingEntry.lift_machine_clean = lift_machine_clean;
    if (whitewash_wiring !== undefined)
      existingEntry.whitewash_wiring = whitewash_wiring;
    if (machine_room_ladder_door_window !== undefined)
      existingEntry.machine_room_ladder_door_window =
        machine_room_ladder_door_window;
    if (project_id !== undefined) existingEntry.project_id = project_id;

    await existingEntry.save();

    return ResponseOk(res, 200, "Entry updated successfully", existingEntry);
  } catch (error) {
    console.error("Error updating entry:", error);
    return ErrorHandler(
      res,
      500,
      "Failed to update entry",
      error.message || error
    );
  }
};


const DeletePreInstallation = async (req, res) => {
  try {
    const { id } = req.query;

    const entry = await PreInstallation.findById(id);
    if (!entry) return ErrorHandler(res, 404, "Entry not found");

   await entry.deleteOne();

    return ResponseOk(res, 200, "Entry deleted successfully");
  } catch (error) {
    console.log("object", error);
    return ErrorHandler(res, 500, "Failed to delete entry", error.message || error);
  }
};


const GetAllPreInstallationsOverview = async (req, res) => {
  try {
    const allEntries = await PreInstallation.find({}).select("_id name lift_details lift_shaft_plaster pit_water_ppc machine_room_pcc lift_machine_clean whitewash_wiring machine_room_ladder_door_window");

    const UpdatedData = {
      entries: allEntries.map(entry => {
        const completed_tasks = Object.entries(entry._doc)
          .filter(([key, value]) =>
            typeof value === 'boolean' && value === true
          )
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        return {
          id: entry._id,
          name: entry.name,
          lift_details: entry.lift_details,
          completed_tasks
        };
      })
    };

    return ResponseOk(res, 200, "Fetched all entries", UpdatedData);
  } catch (error) {
    return ErrorHandler(res, 500, "Failed to fetch entries", error.message || error);
  }
};


module.exports = {
  CreatePreInstallation,
  GetAllPreInstallations,
  GetPreInstallationById,
  UpdatePreInstallation,
  DeletePreInstallation,
  GetAllPreInstallationsOverview
};