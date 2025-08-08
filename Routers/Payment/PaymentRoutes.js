const { Router } = require("express");

const { HandOverForm } = require('../../Models/HandOverForm.model')
const { createPaymentEntry, list_of_payment_entries } = require("../../Controllers/Payment/Payment.Controller");
const { GetPaymentDataReport, GetYearlyPaymentReport } = require("../../Controllers/Reports/Reports.Controller");


const PaymentRouter = Router();

PaymentRouter.post('/payment-entry', createPaymentEntry);
PaymentRouter.get('/list_payment_entries', list_of_payment_entries);



PaymentRouter.get('/get_payment_report', GetPaymentDataReport);
PaymentRouter.get('/get_payment_report_yearly', GetYearlyPaymentReport);
module.exports = PaymentRouter;