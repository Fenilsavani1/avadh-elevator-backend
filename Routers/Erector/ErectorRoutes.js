const { Router } = require("express");

const {Erector } = require('../../Models/Erector.model')
const {createErector} = require('../../Controllers/Erector/Erector.controller');


const ErectorRouter = Router();

ErectorRouter.post('/create_erector', createErector);

module.exports = ErectorRouter;