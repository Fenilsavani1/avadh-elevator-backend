const { Router } = require("express");

const { PreInstallation } = require('../../Models/Project.model')
const { CreatePreInstallation, UpdatePreInstallation, GetAllPreInstallations, GetPreInstallationById, DeletePreInstallation, GetAllPreInstallationsOverview } = require("../../Controllers/PreInstallation/PreInstall.controller");
const upload = require("../../Utils/ImageUtils");


const PreInstallRouter = Router();

PreInstallRouter.post('/create_pre_install',upload.array('files'), CreatePreInstallation);
PreInstallRouter.post('/update_pre_install',upload.array('files'), UpdatePreInstallation);
PreInstallRouter.get('/get_pre_install_all', GetAllPreInstallations);
PreInstallRouter.get('/get_pre_install_by_id', GetPreInstallationById);
PreInstallRouter.post('/delete_pre_install', DeletePreInstallation);
PreInstallRouter.get('/get_pre_install_overview', GetAllPreInstallationsOverview);

module.exports = PreInstallRouter;