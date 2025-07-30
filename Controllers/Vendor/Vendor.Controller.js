const { ErrorHandler, ResponseOk } = require("../../Utils/ResponseHandler");
const mongoose = require("mongoose");
const { MaterialSet } = require("../../Models/Project.model");
const { Vendor } = require("../../Models/Project.model");

const createMaterialSet = async (req, res) => {
  try {
    const {
      project_id,
      materialSetTitle,
      vendorOrderList
    } = req.body;

    // Validation
    if (!project_id || !materialSetTitle || !Array.isArray(vendorOrderList)) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }

    const missingFields = vendorOrderList.some(item =>
      !item.partName || !item.brandName || !item.orderDetailsWithQty
    );
    if (missingFields) {
      return ErrorHandler(res, 400, "Each vendor item must have partName, brandName, and orderDetailsWithQty");
    }

    const materialSet = await MaterialSet.create({
      project_id,
      materialSetTitle,
      vendorOrderList
    });

    return ResponseOk(res, 400, "Material Set created successfully", materialSet);
  } catch (error) {
    console.error("[createMaterialSet]", error);
    return ErrorHandler(res, 500, "Server error while creating Material Set");
  }
};



const addVendor = async (req, res) => {
  try {
    const { name, company_name, mobile_number } = req.body;

    if (!name || !company_name || !mobile_number) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }

    console.log("name", name);
    console.log("company_name", company_name);
    console.log("mobile_number", mobile_number);

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ mobile_number });
    if (existingVendor) {
      return ErrorHandler(res, 400, "Vendor with this mobile number already exists");
    }

    // Create new vendor
    const newVendor = await Vendor.create({
      name,
      company_name,
      mobile_number
    });

    console.log("Created:", newVendor);

    return ResponseOk(res, 201, "Vendor added successfully", newVendor);
  } catch (error) {
    console.error("Error:", error);
    return ErrorHandler(res, 500, "Server error while adding Vendor");
  }
}

const UpdateVendor = async (req, res) => {
  try {
    const  id  = req.query.id;
    const { name, company_name, mobile_number } = req.body;
    if (!name || !company_name || !mobile_number) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }
    // Check if vendor exists
    const existingVendor = await Vendor.findById(id);
    if (!existingVendor) {
      return ErrorHandler(res, 404, "Vendor not found");
    }
    // Update vendor details
    existingVendor.name = name;
    existingVendor.company_name = company_name;
    existingVendor.mobile_number = mobile_number;
    const updatedVendor = await existingVendor.save();
    return ResponseOk(res, 200, "Vendor updated successfully", updatedVendor);
  } catch (error) {
    console.error("[UpdateVendor]", error);
    return ErrorHandler(res, 500, "Server error while updating vendor");
  }
};

const GetVendor = async (req, res) => {
  try {
    // Fetch all vendors
    const vendors = await Vendor.find().lean();
    return ResponseOk(res, 200, "Vendors retrieved successfully", vendors);
  } catch (error) {

    console.error("[GetVendor]", error);
    return ErrorHandler(res, 500, "Server error while retrieving vendors");
  }
};

const getMaterialSets = async (req, res) => {
  try {
    // Fetch all material sets
    const materialSets = await MaterialSet.find()
    // .populate('project_id', 'site_name')
    // .lean();

    // Fetch all vendors
    const vendors = await Vendor.find({}, 'company_name').lean();

    // Extract company names
    const companyNames = vendors.map(v => v.company_name);

    // Return both in a single response
    return ResponseOk(res, 200, "Material Sets retrieved successfully", {
      materialSets,
      vendorCompanyNames: companyNames
    });
  } catch (error) {
    console.error("[getMaterialSets]", error);
    return ErrorHandler(res, 500, "Server error while retrieving material sets");
  }
};




module.exports = {
  createMaterialSet,
  addVendor,
  GetVendor,
  getMaterialSets,
  UpdateVendor
}
