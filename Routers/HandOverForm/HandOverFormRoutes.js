const { Router } = require("express");
const upload  = require('../../Utils/ImageUtils'); 

const { HandOverForm } = require('../../Models/HandOverForm.model')
const {createHandOverForm} = require('../../Controllers/HandOverForm/HandOverForm.controller');


const FormRouter = Router();

FormRouter.post('/handover_form', upload.array('media'), createHandOverForm);

module.exports = FormRouter;