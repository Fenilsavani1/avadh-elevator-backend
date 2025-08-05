const { Router } = require("express");
const upload  = require('../../Utils/ImageUtils'); 

const { HandOverForm } = require('../../Models/HandOverForm.model')
const {CreateHandOverForm, UpdateHandOverForm, GetHandOverForm, DeleteHandOverForm, GetHandOverFormById, GetHandOverFormOverview} = require('../../Controllers/HandOverForm/HandOverForm.controller');


const FormRouter = Router();

FormRouter.post('/handover_form', upload.array('files'), CreateHandOverForm);
FormRouter.put('/Update_handover_form', upload.array('files'), UpdateHandOverForm);
FormRouter.get('/get_handover_form', GetHandOverForm);
FormRouter.get('/get_handover_form_overview', GetHandOverFormOverview);
FormRouter.get('/get_handover_form_by_id', GetHandOverFormById);
FormRouter.delete('/delete_handover_form', DeleteHandOverForm);

module.exports = FormRouter;