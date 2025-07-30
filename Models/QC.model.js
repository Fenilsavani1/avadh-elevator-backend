
const mongoose = require("mongoose");

const QCEntrySchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
    trim: true,
  },
  jobNumber: {
    type: String,
    trim: true,
  },
  wingOrLiftNo: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  sideSupervisor: {
    type: String,
    trim: true,
  },
  wiremanName: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true, 
});

const QCEntry  = mongoose.model("qcentrys", QCEntrySchema);

const Notes_Signatures = new mongoose.Schema({
  note: {
    type: String,
  },
  wiremanSign: {
    type: String, 
  },
  electricianSign: {
    type: String,
  },
  siteSupervisorSign: {
    type: String,
  },
  ownerSign: {
    type: String,
  },
  maintenanceManagerSign: {
    type: String,
  },
}, {
  timestamps: true,
});

const NotesAndSignatures = mongoose.model("notes_signatures", Notes_Signatures);

module.exports = {
    QCEntry,
    NotesAndSignatures
}