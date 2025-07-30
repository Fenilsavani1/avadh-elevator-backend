const { Router } = require("express");

const { HandOverForm } = require('../../Models/HandOverForm.model')
const {createHandOverForm} = require('../../Controllers/HandOverForm/HandOverForm.controller');


const FormRouter = Router();

FormRouter.post('/handover-form', createHandOverForm);

module.exports = FormRouter;