const { Router } = require("express");

const { CreateErector , GetAllErectors, DeleteErector } = require('../../Controllers/Erector/Erector.controller');


const ErectorRouter = Router();

ErectorRouter.post('/create_erector', CreateErector);
ErectorRouter.get('/get_all_erectors', GetAllErectors);
ErectorRouter.delete('/delete_erectors',DeleteErector );

module.exports = ErectorRouter;