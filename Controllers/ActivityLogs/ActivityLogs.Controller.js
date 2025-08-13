const { ErrorHandler, ResponseOk } = require("../../Utils/ResponseHandler");
const mongoose = require("mongoose");
const { ActivityLog } = require("../../Models/Activitylog.model");


const GetAllActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find();

    if (!activityLogs || activityLogs.length === 0) {
      return ErrorHandler(res, 404, "No activity logs found");
    }
    return ResponseOk(res, 200, "Activity Logs Retrieved successfully", activityLogs);
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(res, 500, "Server error while retrieving acitivity logs");
  }
};


const GetAllActivityLogsByProjectId = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find({ project_id: req.query.project_id });

    if (!activityLogs || activityLogs.length === 0) {
      return ErrorHandler(res, 404, "No activity logs found");
    }
    return ResponseOk(res, 200, "Activity Logs Retrieved successfully", activityLogs);
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(res, 500, "Server error while retrieving acitivity logs");
  }
};

module.exports = {
  GetAllActivityLogs,
  GetAllActivityLogsByProjectId
}