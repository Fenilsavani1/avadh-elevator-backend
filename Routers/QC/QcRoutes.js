const { Router } = require("express");

const { QCEntry } = require('../../Models/QC.model')
const {CreateQCEntry, GetQCEntries } = require("../../Controllers/QC/Qc.Controller");
const upload = require('../../Utils/ImageUtils'); 


const QcRouter = Router();

QcRouter.post('/qc_entry', upload.array('media'), CreateQCEntry);
QcRouter.get('/get_qc_entry', GetQCEntries );

module.exports = QcRouter;