const { Router } = require("express");

const { HandOverForm } = require('../../Models/HandOverForm.model')
const { createPaymentEntry, list_of_payment_entries, updatePaymentEntry, DeletePaymentEntry, get_payment_entries_by_id } = require("../../Controllers/Payment/Payment.Controller");
const { GetPaymentDataReport, GetYearlyPaymentReport } = require("../../Controllers/Reports/Reports.Controller");


const PaymentRouter = Router();

PaymentRouter.post('/payment-entry', createPaymentEntry);
PaymentRouter.get('/list_payment_entries', list_of_payment_entries);
PaymentRouter.post('/update_payment_entry', updatePaymentEntry);
PaymentRouter.post('/delete_payment_entry', DeletePaymentEntry);
PaymentRouter.get('/get_payment_entries_by_id', get_payment_entries_by_id);


PaymentRouter.get('/get_payment_report', GetPaymentDataReport);
PaymentRouter.get('/get_payment_report_yearly', GetYearlyPaymentReport);
module.exports = PaymentRouter;