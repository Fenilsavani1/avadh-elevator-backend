const mongoose = require("mongoose");

const PaymentEntrySchema = new mongoose.Schema({
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Partial', 'Failed'], // example values
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  receivedAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  paymentMade: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Cheque', 'Bank Transfer', 'UPI', 'Other'], // example values
  },
  date: {
    type: Date,
    required: true
  },
  paidTo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const PaymentEntry = mongoose.model("PaymentEntrys", PaymentEntrySchema);


module.exports = {
    PaymentEntry
}