const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  activity_logs_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    index: true
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reference_type: {
    type: String,
    required: true,
    enum: ['user', 'project', ] 
  },
  content_words: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default:0
  },
  activity_category: {
    type: String,
    required: true
  },
  activity_id: {
    type: String, 
    required: true
  },
}, {
  timestamps: false,
  versionKey: false
});

const ActivityLog = mongoose.model('activity_logs', ActivityLogSchema);
module.exports = { ActivityLog };
