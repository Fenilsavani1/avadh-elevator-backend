const { Router } = require("express");

const MaterialSet = require("../../Models/Project.model");
const { createMaterialSet, addVendor, getMaterialSets, GetVendor, UpdateVendor, DeleteVendor, updateMaterialSet, deleteMaterialSet, getMaterialSetsByid, getMaterialSetsOverview, GetVendorById } = require("../../Controllers/Vendor/Vendor.Controller");


const VendorRouter = Router();

VendorRouter.post('/material_set', createMaterialSet);
VendorRouter.post('/update_material_set', updateMaterialSet);
VendorRouter.get('/get_material_set', getMaterialSets);
VendorRouter.post('/delete_material_set', deleteMaterialSet);
VendorRouter.get('/get_material_set_by_id', getMaterialSetsByid);
VendorRouter.get('/get_material_set_overview', getMaterialSetsOverview);


VendorRouter.post('/add_vendor', addVendor);
VendorRouter.get('/get_vendor', GetVendor);
VendorRouter.put('/update_vendor', UpdateVendor);
VendorRouter.delete('/delete_vendor', DeleteVendor);
VendorRouter.get('/get_vendor_by_id', GetVendorById);

module.exports = VendorRouter;