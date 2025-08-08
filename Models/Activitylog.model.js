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
  user_name:{
    type: String,
    required: false,
  },
  user_email:{
    type: String,
    required: false,
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: false,
  },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { ActivityLog };
