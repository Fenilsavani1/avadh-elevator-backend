const PaymentEntry = require('../../Models/Project.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler'); 

const createPaymentEntry = async (req, res) => {
  try {
    const {
      paymentStatus,
      totalPayment,
      receivedAmount = 0,
      remainingAmount = 0,
      paymentMade = 0,
      paymentMethod,
      date,
      paidTo
    } = req.body;

    // Basic validation
    if (!paymentStatus || !totalPayment || !date || !paidTo) {
      return ErrorHandler(res, 400, "Required fields: paymentStatus, totalPayment, date, paidTo");
    }

    const payment = await PaymentEntry.create({
      paymentStatus,
      totalPayment,
      receivedAmount,
      remainingAmount,
      paymentMade,
      paymentMethod,
      date,
      paidTo
    });

    return ResponseOk(res, 201, "Payment entry created", payment);
  } catch (error) {
    console.error("[createPaymentEntry]", error);
    return ErrorHandler(res, 500, "Server error while creating payment entry");
  }
};

module.exports = {
  createPaymentEntry
};
