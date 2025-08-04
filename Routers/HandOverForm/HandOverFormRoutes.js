const { Router } = require("express");
const upload  = require('../../Utils/ImageUtils'); 

const { HandOverForm } = require('../../Models/HandOverForm.model')
const {CreateHandOverForm, UpdateHandOverForm, GetHandOverForm, DeleteHandOverForm} = require('../../Controllers/HandOverForm/HandOverForm.controller');


const FormRouter = Router();

FormRouter.post('/handover_form', upload.array('media'), CreateHandOverForm);
FormRouter.put('/Update_handover_form', upload.array('media'), UpdateHandOverForm);
FormRouter.get('/get_handover_form', GetHandOverForm);
FormRouter.delete('/delete_handover_form', DeleteHandOverForm);

module.exports = FormRouter;