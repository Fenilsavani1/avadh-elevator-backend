const { Router } = require("express");

const { CreateErector, GetAllErectors, DeleteErector, UpdateErector, GetErectorsById, GetErectorsOverview, CopyErector } = require('../../Controllers/Erector/Erector.controller');


const ErectorRouter = Router();

ErectorRouter.post('/create_erector', CreateErector);
ErectorRouter.post('/update_erector', UpdateErector);
ErectorRouter.get('/get_all_erectors', GetAllErectors);
ErectorRouter.get('/get_erector_by_id', GetErectorsById);
ErectorRouter.get('/get_erector_overview', GetErectorsOverview);
ErectorRouter.delete('/delete_erectors',DeleteErector );
ErectorRouter.post('/copy_erector',CopyErector );




module.exports = ErectorRouter;