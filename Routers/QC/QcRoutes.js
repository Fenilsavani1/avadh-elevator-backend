const { Router } = require("express");

const { QCEntry } = require('../../Models/QC.model')
const {CreateQCEntry, GetQCEntries, DeleteQcEntry, UpdateQCEntry } = require("../../Controllers/QC/Qc.Controller");
const upload = require('../../Utils/ImageUtils'); 


const QcRouter = Router();

QcRouter.post('/qc_entry', upload.array('media'), CreateQCEntry);
QcRouter.put('/update_qc_entry', upload.array('media'), UpdateQCEntry);
QcRouter.get('/get_qc_entry', GetQCEntries );
QcRouter.delete('/delete_qc_entry',DeleteQcEntry);

module.exports = QcRouter;