const { Router } = require("express");

const { HandOverForm } = require('../../Models/HandOverForm.model')
const { createPaymentEntry } = require("../../Controllers/Payment/Payment.Controller");


const PaymentRouter = Router();

PaymentRouter.post('/payment-entry', createPaymentEntry);

module.exports = PaymentRouter;