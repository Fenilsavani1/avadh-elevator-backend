const { Router } = require("express");

const MaterialSet = require("../../Models/Project.model");
const { createMaterialSet, addVendor, getMaterialSets, GetVendor, UpdateVendor, DeleteVendor } = require("../../Controllers/Vendor/Vendor.Controller");


const VendorRouter = Router();

VendorRouter.post('/material_set', createMaterialSet);
VendorRouter.post('/add_vendor', addVendor);
VendorRouter.get('/get_material_set', getMaterialSets);
VendorRouter.get('/get_vendor', GetVendor);
VendorRouter.put('/update_vendor', UpdateVendor);
VendorRouter.delete('/delete_vendor', DeleteVendor);


module.exports = VendorRouter;