const { Router } = require("express");

const { HandOverForm } = require('../../Models/HandOverForm.model')
const { createPaymentEntry, list_of_payment_entries } = require("../../Controllers/Payment/Payment.Controller");


const PaymentRouter = Router();

PaymentRouter.post('/payment-entry', createPaymentEntry);
PaymentRouter.get('/list_payment_entries', list_of_payment_entries);

module.exports = PaymentRouter;