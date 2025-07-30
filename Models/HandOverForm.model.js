const mongoose = require("mongoose");

const HandOverFormSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

const HandOverForm = mongoose.model("handoverforms", HandOverFormSchema);


module.exports = {
    HandOverForm
}