const {Project} = require('../../Models/Project.model'); // Update the path as needed
const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');

const createProject = async (req, res) => {
  try {
    const {
      site_name,
      aggrement_no,
      aggrement_date,
      site_address,
      client_name,
      client_mobile,
      client_email,
      Site_Supervisor,
      gst_no,
      payment_amount,
      additional_notes,
      location, 
    } = req.body;

    // Basic validation
    if (
      !site_name || !site_address || !client_name ||
      !client_mobile || !client_email || !gst_no ||
      !payment_amount || !additional_notes || !Site_Supervisor || !location || typeof location.lat !== "number" || typeof location.lng !== "number"
    ) {
      return ErrorHandler(res, 400, "All required fields must be provided");
    }

    const project = await Project.create({
      site_name,
      aggrement_no,
      aggrement_date,
      site_address,
      client_name,
      client_mobile,
      client_email,
      Site_Supervisor,
      gst_no,
      payment_amount,
      additional_notes,
      location,
    });

    return ResponseOk(res, 201, "Project created successfully", project);
  } catch (error) {
    console.error("[createProject]", error);
    return ErrorHandler(res, 500, "Server error while creating project");
  }
};

const ViewProject = async (req, res) => {
  try { 
    const projects = await Project.find()
    
    if (!projects || projects.length === 0) {
      return ErrorHandler(res, 404, "No projects found");
    }

    return ResponseOk(res, 200, "Projects retrieved successfully", projects);
  } catch (error) {
    console.error("[ViewProject]", error);    
    return ErrorHandler(res, 500, "Server error while retrieving projects");
  }
};

const UpdateProject = async (req, res) => {
  try {
    const projectId = req.query.projectId

    if (!projectId) {
      return ErrorHandler(res, 400, "Project ID is required");
    }

    const allowedFields = [
      "site_name",
      "aggrement_no",
      "aggrement_date",
      "site_address",
      "client_name",
      "client_mobile",
      "client_email",
      "Site_Supervisor",
      "gst_no",
      "payment_amount",
      "additional_notes"
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return ErrorHandler(res, 404, "Project not found");
    }

    return ResponseOk(res, 200, "Project updated successfully", updatedProject);
  } catch (error) {
    console.error("[UpdateProject]", error);
    return ErrorHandler(res, 500, "Server error while updating project");
  }
};




module.exports = {
  createProject,
  ViewProject,
  UpdateProject,
};
