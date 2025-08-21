const { PaymentEntry } = require('../../Models/Project.model');
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const { ActivityLog } = require('../../Models/Activitylog.model');
const { Project } = require('../../Models/Project.model');
const { Users } = require('../../Models/User.model');

const CreatePaymentEntry = async (req, res) => {
  try {
    const {
      paymentStatus,
      project_id,
      paymentMade,
      paymentMethod,
      date,
      paidTo
    } = req.body;

    if (!paymentStatus || !date || !paidTo) {
      return ErrorHandler(res, 400, "Required fields: paymentStatus, totalPayment, date, paidTo");
    }
    const payment = await PaymentEntry.create({
      project_id,
      payment_status: paymentStatus,
      payment_Made: paymentMade,
      payment_method: paymentMethod,
      date,
      paid_to: paidTo
    });


    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findOne({ _id: payment.project_id }).select('site_name');
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'ADD_PAYMENT_ENTRY',
      type: 'Create',
      description: `User ${user_details.name} has add payment entry of ${paymentMade} inside project ${projectDetails.site_name}.`,
      title: 'Add Payment Entry',
      project_id: payment.project_id,
    });


    return ResponseOk(res, 201, "Payment entry created", payment);
  } catch (error) {
    console.error("[CreatePaymentEntry]", error);
    return ErrorHandler(res, 500, "Server error while creating payment entry");
  }
};

const ListPaymentEntries = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return ErrorHandler(res, 400, "Project ID is required");
    }

    const payments = await PaymentEntry.find({ project_id: project_id })


    if (!payments || payments.length === 0) {
      return ErrorHandler(res, 404, "No payment entries found for this project");
    }

    return ResponseOk(res, 200, "Payment entries retrieved successfully", payments);
  } catch (error) {
    console.error("[ListPaymentEntries]", error);
    return ErrorHandler(res, 500, "Server error while retrieving payment entries");
  }
};


const UpdatePaymentEntry = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      paymentStatus,
      project_id,
      paymentMade,
      paymentMethod,
      date,
      paidTo
    } = req.body;

    if (!id) {
      return ErrorHandler(res, 400, "Payment entry ID is required");
    }

    const payment = await PaymentEntry.findById(id);
    if (!payment) {
      return ErrorHandler(res, 404, "Payment entry not found");
    }

    if (paymentStatus !== undefined) payment.payment_status = paymentStatus;
    if (project_id !== undefined) payment.project_id = project_id;
    if (paymentMade !== undefined) payment.payment_Made = paymentMade;
    if (paymentMethod !== undefined) payment.payment_method = paymentMethod;
    if (date !== undefined) payment.date = date;
    if (paidTo !== undefined) payment.paid_to = paidTo;

    await payment.save();


    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findById({ _id: payment.project_id }).select('site_name');
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'UPDATE_PAYMENT_ENTRY',
      type: 'Update',
      description: `User ${user_details.name} has update payment entry inside project ${projectDetails.site_name}.`,
      title: 'Update Payment Entry',
      project_id: payment.project_id,
    });


    return ResponseOk(res, 200, "Payment entry updated", payment);
  } catch (error) {
    console.error("[UpdatePaymentEntry]", error);
    return ErrorHandler(res, 500, "Server error while updating payment entry");
  }
};

const DeletePaymentEntry = async (req, res) => {

  try {

    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "Payment entry ID is required");
    }

    const paymentEntry = await PaymentEntry.findByIdAndDelete(id);
    if (!paymentEntry) {
      return ErrorHandler(res, 404, "Payment entry not found");
    }
    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findOne({ _id: paymentEntry.project_id }).select('site_name');
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'DELETE_PAYMENT_ENTRY',
      type: 'Delete',
      description: `User ${user_details.name} has delete payment entry inside project ${projectDetails.site_name}.`,
      title: 'Delete Payment Entry',
      project_id: paymentEntry.project_id,
    });
    return ResponseOk(res, 200, "Payment entry deleted successfully", paymentEntry);
  } catch (error) {
    console.error("[DeletePaymentEntry]", error);
    return ErrorHandler(res, 500, "Server error while deleting payment entry");
  }
}

const GetPaymentEntryById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "id is required");
    }

    const payments = await PaymentEntry.findById(id)


    if (!payments || payments.length === 0) {
      return ErrorHandler(res, 404, "No payment entries found ");
    }

    return ResponseOk(res, 200, "Payment entries retrieved successfully", payments);
  } catch (error) {
    console.error("[ListPaymentEntries]", error);
    return ErrorHandler(res, 500, "Server error while retrieving payment entries");
  }
};

module.exports = {
  CreatePaymentEntry,
  ListPaymentEntries,
  UpdatePaymentEntry,
  DeletePaymentEntry,
  GetPaymentEntryById
};
