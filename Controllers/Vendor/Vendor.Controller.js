const { ErrorHandler, ResponseOk } = require("../../Utils/ResponseHandler");
const mongoose = require("mongoose");
const { MaterialSet } = require("../../Models/Project.model");
const { Vendor } = require("../../Models/Project.model");
const { ActivityLog } = require("../../Models/Activitylog.model");
const { Project } = require("../../Models/Project.model");
const { Users } = require("../../Models/User.model");
const createMaterialSet = async (req, res) => {
  try {
    const {
      project_id,
      materialSetTitle,
      vendorOrderList
    } = req.body;

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

    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findOne({ _id: project_id }).select('site_name');
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'CREATE_MATERIAL_SET',
      type: 'Create',
      description: `User ${user_details.name} has added material set named ${materialSetTitle} for project "${projectDetails.site_name}".`,
      title: 'Create Material Set',
      project_id: project_id,
    });

    return ResponseOk(res, 200, "Material Set created successfully", materialSet);
  } catch (error) {
    console.error("[createMaterialSet]", error);
    return ErrorHandler(res, 500, "Server error while creating Material Set");
  }
};

const updateMaterialSet = async (req, res) => {
  try {
    const {
      materialSetId,
      project_id,
      materialSetTitle,
      vendorOrderList
    } = req.body;

    if (!materialSetId || !project_id || !materialSetTitle || !Array.isArray(vendorOrderList)) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }

    const missingFields = vendorOrderList.some(item =>
      !item.partName || !item.brandName || !item.orderDetailsWithQty
    );
    if (missingFields) {
      return ErrorHandler(res, 400, "Each vendor item must have partName, brandName, and orderDetailsWithQty");
    }

    const updatedMaterialSet = await MaterialSet.findByIdAndUpdate(
      materialSetId,
      {
        project_id,
        materialSetTitle,
        vendorOrderList
      },
      { new: true }
    );

    if (!updatedMaterialSet) {
      return ErrorHandler(res, 404, "Material Set not found");
    }

    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findOne({ _id: project_id }).select('site_name');
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'UPDATE_MATERIAL_SET',
      type: 'Update',
      description: `User ${user_details.name} has update material set named ${materialSetTitle} for project "${projectDetails.site_name}".`,
      title: 'Update Material Set',
      project_id: project_id,
    });

    return ResponseOk(res, 200, "Material Set updated successfully", updatedMaterialSet);
  } catch (error) {
    console.error("[updateMaterialSet]", error);
    return ErrorHandler(res, 500, "Server error while updating Material Set");
  }
};

const getMaterialSets = async (req, res) => {
  try {
    const materialSets = await MaterialSet.find({ project_id: req.query.project_id });

    if (!materialSets || materialSets.length === 0) {
      return ErrorHandler(res, 404, "No material sets found for this project");
    }

    return ResponseOk(res, 200, "Material Sets retrieved successfully", {
      materialSets,
    });
  } catch (error) {
    console.error("[getMaterialSets]", error);
    return ErrorHandler(res, 500, "Server error while retrieving material sets");
  }
};

const deleteMaterialSet = async (req, res) => {
  try {
    const { id } = req.query;

    const entry = await MaterialSet.findById(id);
    if (!entry) return ErrorHandler(res, 404, "Entry not found");

    const user_details = await Users.findById(req.auth.id);
    const projectDetails = await Project.findOne({ _id: entry.project_id }).select('site_name');
    await entry.deleteOne();
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'DELETE_MATERIAL_SET',
      type: 'Delete',
      description: `User ${user_details.name} has deleted material set named ${entry.materialSetTitle} for project "${projectDetails.site_name}".`,
      title: 'Delete Material Set',
      project_id: entry.project_id,
    });
    return ResponseOk(res, 200, "Entry deleted successfully");
  } catch (error) {
    console.error("error", error);
    return ErrorHandler(res, 500, "Server error while deleting Material Set");

  }
}

const getMaterialSetsOverview = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return ErrorHandler(res, 400, "Invalid project_id format");
    }

    const materialSets = await MaterialSet.find({ project_id })
      .select("_id materialSetTitle vendorOrderList")
      .lean();

    if (!materialSets || materialSets.length === 0) {
      return ErrorHandler(res, 404, "No material sets found for this project");
    }

    const result = materialSets.map(set => {
      const totalItems = set.vendorOrderList.length;
      const receivedCount = set.vendorOrderList.filter(item => item.received === true).length;
      const pendingItems = set.vendorOrderList
        .filter(item => item.received === false)
        .map(item => item.partName);

      const completionProgress = totalItems > 0
        ? Math.round((receivedCount / totalItems) * 100)
        : 0;

      return {
        id: set._id,
        materialSetTitle: set.materialSetTitle,
        pendingItems,
        totalItems,
        receivedCount,
        pendingCount: pendingItems.length,
        completionProgress: `${completionProgress}%`
      };
    });

    return ResponseOk(res, 200, "Material Sets retrieved successfully", { materialSets: result });
  } catch (error) {
    console.error("[getMaterialSets]", error);
    return ErrorHandler(res, 500, "Server error while retrieving material sets");
  }
};





const getMaterialSetsByid = async (req, res) => {
  try {
    const { id } = req.query;
    const materialSets = await MaterialSet.findById(id)
    // .populate('project_id', 'site_name')
    // .lean();

    // const vendors = await Vendor.find({}, 'company_name').lean();

    // const companyNames = vendors.map(v => v.company_name);

    return ResponseOk(res, 200, "Material Sets retrieved successfully", {
      materialSets,
    });
  } catch (error) {
    console.error("[getMaterialSets]", error);
    return ErrorHandler(res, 500, "Server error while retrieving material sets");
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

    const existingVendor = await Vendor.findOne({ mobile_number });
    if (existingVendor) {
      return ErrorHandler(res, 400, "Vendor with this mobile number already exists");
    }

    const newVendor = await Vendor.create({
      name,
      company_name,
      mobile_number
    });

    const user_details = await Users.findById(req.auth.id);
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'ADD_VENDOR',
      type: 'Add',
      description: `User ${user_details.name} has added vendor ${name}.`,
      title: 'Add Vendor',
      project_id: null,
    });
    return ResponseOk(res, 201, "Vendor added successfully", newVendor);
  } catch (error) {
    console.error("Error:", error);
    return ErrorHandler(res, 500, "Server error while adding Vendor");
  }
}

const UpdateVendor = async (req, res) => {
  try {
    const id = req.query.id;
    const { name, company_name, mobile_number } = req.body;
    if (!name || !company_name || !mobile_number) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }
    const existingVendor = await Vendor.findById(id);
    if (!existingVendor) {
      return ErrorHandler(res, 404, "Vendor not found");
    }
    existingVendor.name = name;
    existingVendor.company_name = company_name;
    existingVendor.mobile_number = mobile_number;
    const updatedVendor = await existingVendor.save();

    const user_details = await Users.findById(req.auth.id);
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'UPDATE_VENDOR',
      type: 'Update',
      description: `User ${user_details.name} has update vendor ${name}.`,
      title: 'Update Vendor',
      project_id: null,
    });

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


const DeleteVendor = async (req, res) => {
  try {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler(res, 400, "Invalid vendor ID");
    }
    const existingVendor = await Vendor.findById(id);
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) {
      return ErrorHandler(res, 404, "Vendor not found");
    }
    const user_details = await Users.findById(req.auth.id);
    await ActivityLog.create({
      user_id: req.auth?.id || null,
      user_name: user_details.name,
      action: 'DELETE_VENDOR',
      type: 'Delete',
      description: `User ${user_details.name} has deleted vendor ${existingVendor.name}.`,
      title: 'Delete Vendor',
      project_id: null,
    });

    return ResponseOk(res, 200, "Vendor deleted successfully", deletedVendor);
  } catch (error) {
    console.error("[DeleteVendor]", error);
    return ErrorHandler(res, 500, "Server error while deleting vendor");
  }
};

const GetVendorById = async (req, res) => {
  try {
    const vendors = await Vendor.findById(req.query.id);
    return ResponseOk(res, 200, "Vendors retrieved successfully", vendors);
  } catch (error) {

    console.error("[GetVendor]", error);
    return ErrorHandler(res, 500, "Server error while retrieving vendors");
  }
};
module.exports = {
  createMaterialSet,
  updateMaterialSet,
  deleteMaterialSet,
  getMaterialSets,
  getMaterialSetsByid,
  getMaterialSetsOverview,
  addVendor,
  GetVendor,
  UpdateVendor,
  DeleteVendor,
  GetVendorById
}
