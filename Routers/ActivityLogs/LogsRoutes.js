const { Router } = require("express");

const { ActivityLog } = require('../../Models/Activitylog.model')
const {GetAllActivityLogs } = require("../../Controllers/ActivityLogs/ActivityLogs.Controller");


const ActivityLogsRouter = Router();
ActivityLogsRouter.get('/get_all_logs', GetAllActivityLogs );


module.exports = ActivityLogsRouter;