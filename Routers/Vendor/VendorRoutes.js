const { Router } = require("express");

const MaterialSet = require("../../Models/Project.model");
const { CreateMaterialSet, AddVendor, GetMaterialSets, GetVendor, UpdateVendor, DeleteVendor, UpdateMaterialSet, DeleteMaterialSet, GetMaterialSetsByid, GetMaterialSetsOverview, GetVendorById } = require("../../Controllers/Vendor/Vendor.Controller");


const VendorRouter = Router();

VendorRouter.post('/material_set', CreateMaterialSet);
VendorRouter.post('/update_material_set', UpdateMaterialSet);
VendorRouter.get('/get_material_set', GetMaterialSets);
VendorRouter.post('/delete_material_set', DeleteMaterialSet);
VendorRouter.get('/get_material_set_by_id', GetMaterialSetsByid);
VendorRouter.get('/get_material_set_overview', GetMaterialSetsOverview);


VendorRouter.post('/add_vendor', AddVendor);
VendorRouter.get('/get_vendor', GetVendor);
VendorRouter.put('/update_vendor', UpdateVendor);
VendorRouter.post('/delete_vendor', DeleteVendor);
VendorRouter.get('/get_vendor_by_id', GetVendorById);

module.exports = VendorRouter;