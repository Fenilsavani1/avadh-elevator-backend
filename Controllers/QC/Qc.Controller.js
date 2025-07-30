const {QCEntry} = require("../../Models/QC.model"); 
const { ResponseOk, ErrorHandler } = require("../../Utils/ResponseHandler"); 

const createQCEntry = async (req, res) => {
  try {
    const {
      areaName,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName
    } = req.body;

    // Required field validation
    if (!areaName || !date || !siteName || !wiremanName) {
      return ErrorHandler(res, 400, "areaName, date, siteName, and wiremanName are required");
    }

    const entry = await QCEntry.create({
      areaName,
      date,
      siteName,
      jobNumber,
      wingOrLiftNo,
      type,
      sideSupervisor,
      wiremanName
    });

    return ResponseOk(res, 201, "QC Entry created successfully", entry);
  } catch (error) {
    console.error("[createQCEntry]", error);
    return ErrorHandler(res, 500, "Server error while creating QC entry");
  }
};

module.exports = {
  createQCEntry
};
