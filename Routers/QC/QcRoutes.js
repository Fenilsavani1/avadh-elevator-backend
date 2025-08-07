const { Router } = require("express");

const { QCEntry } = require('../../Models/QC.model')
const {CreateQCEntry, GetQCEntries, DeleteQcEntry, UpdateQCEntry, GetQCEntriesById, GetQCEntriesOverview } = require("../../Controllers/QC/Qc.Controller");
const upload = require('../../Utils/ImageUtils'); 


const QcRouter = Router();

QcRouter.post('/qc_entry', upload.array('files'), CreateQCEntry);
QcRouter.put('/update_qc_entry', upload.array('files'), UpdateQCEntry);
QcRouter.get('/get_qc_entry', GetQCEntries );
QcRouter.get('/get_qc_entry_overview', GetQCEntriesOverview );
QcRouter.get('/get_qc_entry_by_id', GetQCEntriesById );
QcRouter.delete('/delete_qc_entry',DeleteQcEntry);

module.exports = QcRouter;