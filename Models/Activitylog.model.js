// models/ActivityLog.model.js

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  sub_type: {
    type: String,
    required: false,
  },
  message : {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { ActivityLog };
