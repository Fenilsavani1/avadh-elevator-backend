const { Router } = require("express");

const { QCEntry } = require('../../Models/QC.model')
const { createQCEntry } = require("../../Controllers/QC/Qc.Controller");


const QcRouter = Router();

QcRouter.post('/qc-entry', createQCEntry);

module.exports = QcRouter;