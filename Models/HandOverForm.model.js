const mongoose = require("mongoose");

const HandOverFormSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    required: true
  },
  siteSupervisor: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  jobNumber: {
    type: String,
    required: true,
    trim: true,
  },
  sideName: {
    type: String,
    trim: true,
  },
  wingLiftNumber: {
    type: String,
    trim: true,
  },
  siteHandler: {
    type: String,
    trim: true,
  },
  erectorName: {
    type: String,
    trim: true,
  },
  wireManName: {
    type: String,
    trim: true,
  },
  mediaFiles: [{
  fileName: String,
  fileType: String // 'image' or 'video'
}]
}, {
  timestamps: true,
});

const HandOverForm = mongoose.model("handoverforms", HandOverFormSchema);

const ComplaintFormSchema = new mongoose.Schema({
  id : {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  hand_over_form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'handoverforms',
    required: true
  },
  complaint_point: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  remark: {
    type: String,
    trim: true,
  },
  action : {
    type: String,
    trim: true,
  },
},{
  timestamps: true,
  versionKey: false
})

const ComplaintForm = mongoose.model('complaintforms', ComplaintFormSchema);

module.exports = {
    HandOverForm,
    ComplaintForm
}