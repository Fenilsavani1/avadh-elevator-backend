const {PaymentEntry} = require('../../Models/Project.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler'); 

const createPaymentEntry = async (req, res) => {
  try {
    const {
      paymentStatus,
      project_id,
      paymentMade,
      paymentMethod,
      date,
      paidTo
    } = req.body;

    if (!paymentStatus  || !date || !paidTo) {
      return ErrorHandler(res, 400, "Required fields: paymentStatus, totalPayment, date, paidTo");
    }
    const payment = await PaymentEntry.create({
      project_id,
      payment_status:paymentStatus,
      payment_Made: paymentMade ,
      payment_method: paymentMethod,
      date,
      paid_to:paidTo
    });
    

    return ResponseOk(res, 201, "Payment entry created", payment);
  } catch (error) {
    console.error("[createPaymentEntry]", error);
    return ErrorHandler(res, 500, "Server error while creating payment entry");
  }
};

const list_of_payment_entries = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return ErrorHandler(res, 400, "Project ID is required");
    }

    const payments = await PaymentEntry.find({ project_id:project_id })


    if (!payments || payments.length === 0) {
      return ErrorHandler(res, 404, "No payment entries found for this project");
    }

    return ResponseOk(res, 200, "Payment entries retrieved successfully", payments);
  } catch (error) {
    console.error("[list_of_payment_entries]", error);
    return ErrorHandler(res, 500, "Server error while retrieving payment entries");
  }
};
module.exports = {
  createPaymentEntry,
  list_of_payment_entries
};
