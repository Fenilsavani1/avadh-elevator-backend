const mongoose = require("mongoose");

const ErectorSchema = new mongoose.Schema({
  erectorName: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: String,
    required: true,
    match: /^\d{12}$/, // 12-digit Aadhar number
    unique: true,
  },
}, {
  timestamps: true 
});

const Erector = mongoose.model("erectors", ErectorSchema);


const ProjectSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: null,
  },
  centerName: {
    type: String,
    required: true,
  },
  contractNo: {
    type: String,
    required: true,
  },
  totalLift: {
    type: Number,
    required: true,
    min: 1,
  },
  typeOfLift: {
    type: String,
    enum: ["Passenger", "Freight", "Hospital", "Service", "Other"], // update as needed
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  specificationOfLift: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  typeOfDoor: {
    type: String,
    required: true,
  },
  totalFloor: {
    type: Number,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  passenger: {
    type: Number,
    required: true,
  },
  traOrMrl: {
    type: String,
    enum: ["TRA", "MRL"],
    required: true,
  },
  scaffoldingCharges: {
    type: String,
    enum: ["Included", "Excluded", "Not Applicable"], // change based on dropdown
    required: true,
  },
}, {
  timestamps: true
});

const Project   = mongoose.model("projects", ProjectSchema);


const  IncludedWorkSchema  = new mongoose.Schema({
  hoistWayCharge: {
    type: String,
    enum: ["Included", "Excluded", "Optional"],
    required: true,
  },
  wiringWork: {
    type: String,
    enum: ["Included", "Excluded", "Optional"],
    required: true,
  },
  otherCharges: {
    type: String,
    enum: ["Included", "Excluded", "Optional"],
    required: true,
  },
  wiringAdjustmentCharges: {
    type: String,
    enum: ["Included", "Excluded", "Optional"],
    required: true,
  },
  outStationCharges: {
    type: String,
    enum: ["Included", "Excluded", "Optional"],
    required: true,
  },
  completionDate: {
    type: Date,
    required: true,
  },

  // --- Installation & Payment Terms ---
  totalInstallationCharges: {
    type: Number,
    required: true,
  },
  railAndDoorFramePercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  machineRopingAndDoorPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  cabinAndLiftStartupPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  afterHandoverPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
}, {
  timestamps: true,
});

const IncludedWork = mongoose.model("included_works", IncludedWorkSchema );

const PaymentRecordSchema  = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  typeOfPayment: {
    type: String,
    enum: ["Cash", "Cheque", "Bank Transfer", "UPI", "Other"], // update as per your dropdown
    required: true,
  },
  byWhom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true,
  }
}, {
  timestamps: true,
});

const PaymentRecord = mongoose.model("payment_records", PaymentRecordSchema );


module.exports = {
    Erector,
    Project,
    IncludedWork,
    PaymentRecord

}