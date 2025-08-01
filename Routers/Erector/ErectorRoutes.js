const { Router } = require("express");

const { CreateErector, CreateInstallationTerms, CreatePaymentRecord, GetAllErectors } = require('../../Controllers/Erector/Erector.controller');


const ErectorRouter = Router();

ErectorRouter.post('/create_erector', CreateErector);
ErectorRouter.post('/installation_terms', CreateInstallationTerms);
ErectorRouter.post('/payment_record', CreatePaymentRecord);
ErectorRouter.get('/get_all_erectors', GetAllErectors);

module.exports = ErectorRouter;