const { ResponseOk, ErrorHandler } = require('../../Utils/ResponseHandler');
const { Roles, Role_with_permission, User_Associate_With_Role } = require('../../Models/User.model');
const { Users } = require('../../Models/User.model')
const { Permissions } = require('../../Models/User.model');
const { Project } = require('../../Models/Project.model');
const { Static_Data_Schema } = require('../../Models/StaticData.model');
const { ActivityLog } = require('../../Models/Activitylog.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendToken } = require('../../Utils/TokenUtils');
const mongoose = require('mongoose');


const LoginAdmin = async (req, res) => {
  const { email, contact_number, password } = req.body;

  if (!password || (!email && !contact_number)) {
    return ErrorHandler(
      res,
      400,
      'Password ,  either email or contact number is required'
    );
  }
  console.log("email", email);
  console.log("contact_number", contact_number);


  try {
    const user = await Users.findOne({
      $or: [
        { email },
        { contact_number }
      ]
    });

    console.log("user", user);
    if (!user) {
      return ErrorHandler(res, 404, 'User not found');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return ErrorHandler(res, 400, 'Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      Contact_number: user.contact_number
    };
    const { token, refresh_token, expiresin } = await sendToken(payload);


    return ResponseOk(res, 200, 'Login successful', {
      user_id: user.id,
      email: user.email,
      contact_number: user.contact_number,
      token,
      refresh_token,
      expiresin
    });

  } catch (err) {
    console.error('[LoginAdmin]', err);
    return ErrorHandler(res, 500, 'Server error');
  }
};

const GetPermissionAdmin = async (req, res) => {
  try {
    const ListOfPermission = await Permissions.find({}, ' id permission_name');

    if (!ListOfPermission.length) {
      return ErrorHandler(res, 400, "No permissions present");
    }

    const formattedPermissions = ListOfPermission.map(permission => ({
      id: permission.id,
      permission_name: permission.permission_name
    }));
    return ResponseOk(res, 200, "List of permissions retrieved successfully", formattedPermissions);
  } catch (error) {
    console.error('err', error);
    return ErrorHandler(res, 500, "Server error");
  }
};

const GetListOfRole = async (req, res) => {
  try {
    const GetListOfRole = await Roles.find({}, 'id name');

    if (!GetListOfRole.length) {
      return ErrorHandler(res, 400, "No roles present");
    }

    const formattedRoles = GetListOfRole.map(role => ({
      id: role.id,
      name: role.name
    }));

    return ResponseOk(res, 200, "List of roles retrieved successfully", formattedRoles);
  } catch (error) {
    console.error('err', error);
    return ErrorHandler(res, 500, "Server error");
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const roleId = parseInt(req.query.role_id);

    if (!roleId) {
      return ErrorHandler(res, 400, "Role ID is required");
    }

    const role = await Roles.findOne({ id: roleId });
    if (!role) {
      return ErrorHandler(res, 404, "Role not found");
    }

    const rolePermissionLinks = await Role_with_permission.find({ role_id: roleId });
    const permissionIds = rolePermissionLinks.map(rp => rp.permission_id);

    const permissions = await Permissions.find({ id: { $in: permissionIds } });
    console.log("firstname", permissions);

    if (!permissions.length) {
      return ErrorHandler(res, 404, "No permissions found for this role");
    }

    const result = {
      role_id: role.id,
      role_name: role.name,
      permissions: permissions.map(p => ({
        id: p.id,
        permission_name: p.permission_name
      }))
    };

    return ResponseOk(res, 200, {
      message: 'Permissions of the role retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Error fetching permissions:', error);
    return ErrorHandler(res, 500, "Server error");
  }
};

const GetUserById = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return ErrorHandler(res, 400, "User ID is required");
    }
    const user = await Users.findById(userId, 'id name email contact_number');
    if (!user) {
      return ErrorHandler(res, 404, "User not found");
    }
    return ResponseOk(res, 200, "User retrieved successfully", {
      user_id: user.id,
      name: user.name,
      email: user.email,
      contact_number: user.contact_number
    });
  } catch (error) {
    console.error("GetUserById Error:", error);
    return ErrorHandler(res, 500, "Server error while retrieving user");
  }
};

const GetUserAll = async (req, res) => {
  try {
   
    const user = await Users.find().select('id name email contact_number');
    if (!user) {
      return ErrorHandler(res, 404, "User not found");
    }
    return ResponseOk(res, 200, "User retrieved successfully",user);
  } catch (error) {
    console.error("GetUserById Error:", error);
    return ErrorHandler(res, 500, "Server error while retrieving user");
  }
};
 
const AddAdminUser = async (req, res) => {
  try {
    const { email, role_id, password, contact_number, name } = req.body;

    if (!name || !email || !password || !contact_number || !role_id) {
      return ErrorHandler(res, 400, "All fields (name, email, password, contact_number, role_id) are required");
    }


    const existingUser = await Users.findOne({
      email: email,
      is_deleted: 0,
    });

    if (existingUser) {
      return ErrorHandler(res, 400, "User with this email already exists");
    }


    const newUser = await Users.create({
      email: email,
      password: password, 
      contact_number: contact_number,
      name: name,
    });

    await User_Associate_With_Role.create({
      role_id: parseInt(role_id),
      user_id: newUser._id,
      is_allowed_email: 1,
    });

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'ADD_USER',
      type: 'Message_Response',
      sub_type: 'Create',
      message: `User ${name} was added with role ID ${role_id}.`,
      project_id:null,
      title: 'User Added',
    });


    return ResponseOk(res, 200, newUser, "User added successfully");
  } catch (error) {
    console.error('AddAdminUser Error:', error);
    return ErrorHandler(res, 400, error);
  }
};


const UpdateAdminUser = async (req, res) => {
  try {
    const { email, role_id, contact_number, name,password } = req.body;
    const userRoleId = req.query.id; 

    if (!email || !role_id || !contact_number || !name) {
      return ErrorHandler(res, 400, "All fields (name, email, contact_number, role_id) are required");
    }

    const existingUserRole = await User_Associate_With_Role.findOne({user_id: userRoleId});

    if (!existingUserRole) {
      return ErrorHandler(res, 404, "User association not found");
    }

    const userId = existingUserRole.user_id;

    const emailConflict = await Users.findOne({
      _id: { $ne: userId },
      email: email,
      is_deleted: false,
    });

    if (emailConflict) {
      return ErrorHandler(res, 400, "Another user with this email already exists");
    }

    await Users.findByIdAndUpdate(userId, {
      email,
      contact_number,
      name,
    });
      const user = await Users.findById(userId);
      user.password = password;
      await user.save();
    await User_Associate_With_Role.findByIdAndUpdate(userRoleId, {
      role_id: parseInt(role_id),
    });

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'UPDATE_USER',
      type: 'Message_Response',
      sub_type: 'Update',
      message: `User Profile "${name}" has been updated.`,
      title: 'User Updated',
      project_id: null,
    });


    return ResponseOk(res, 200, "User updated successfully");
  } catch (error) {
    console.error("UpdateAdminUser Error:", error);
    return ErrorHandler(res, 400, error.message || "Something went wrong");
  }
};

const DeleteAdminUser = async (req, res) => {
  try {
    const userRoleId = req.query.id;

    if (!userRoleId) {
      return ErrorHandler(res, 400, "User role association ID is required");
    }

    const existingUserRole = await User_Associate_With_Role.findOne({user_id: userRoleId});

    if (!existingUserRole) {
      return ErrorHandler(res, 404, "User role association not found");
    }

    const userId = existingUserRole.user_id;

    await Users.findByIdAndDelete(userId);
    const user_details = await Users.findById(userId)
    await User_Associate_With_Role.findByIdAndDelete(userRoleId);

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'DELETE_ADMIN_USER',
      type: 'Message_Response',
      sub_type: 'Delete',
      message: `User ${user_details.name} was permanently deleted.`,
      title: 'Admin User Deleted',
      project_id: null,
    });


    return ResponseOk(res, 200, "User permanently deleted");
  } catch (error) {
    console.error("DeleteAdminUser Error:", error);
    return ErrorHandler(res, 400, error.message || "Something went wrong");
  }
};

const AddRolesByAdmin = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return ErrorHandler(res, 400, "Both 'id' and 'name' are required.");
    }

    const existingRole = await Roles.findOne({ $or: [{ id }, { name }] });
    if (existingRole) {
      return ErrorHandler(res, 400, "Role with this ID or name already exists.");
    }

    const newRole = await Roles.create({ id, name });

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'CREATE_ROLE',
      type: 'Message_Response',
      sub_type: 'Create',
      message: `New role "${name}" was created.`,
      title: 'Role Created',
      project_id: null,
    });


    return ResponseOk(res, 200, "Role created successfully", newRole);
  } catch (error) {
    console.error("AddRole Error:", error);
    return ErrorHandler(res, 500, "Failed to create role");
  }
};

const UpdateRole = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return ErrorHandler(res, 400, "Both 'id' and 'name' are required.");
    }

    const updatedRole = await Roles.findOneAndUpdate(
      { id },
      { name },
      { new: true }
    );

    if (!updatedRole) {
      return ErrorHandler(res, 404, "Role not found.");
    }

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'UPDATE_ROLE',
      type: 'Message_Response',
      sub_type: 'Update',
      message: `Role ID ${id} was updated to name "${name}".`,
      title: 'Role Updated',
      project_id: null,
    });


    return ResponseOk(res, 200, "Role updated successfully", updatedRole);
  } catch (error) {
    console.error("UpdateRole Error:", error);
    return ErrorHandler(res, 500, "Failed to update role");
  }
};

const DeleteRole = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return ErrorHandler(res, 400, "Role 'id' is required in query.");
    }

    const deletedRole = await Roles.findOneAndDelete({ id });

    if (!deletedRole) {
      return ErrorHandler(res, 404, "Role not found or already deleted.");
    }

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'DELETE_ROLE',
      type: 'Message_Response',
      sub_type: 'Delete',
      message: `Role with ID ${id} was deleted.`,
      title: 'Role Deleted',
      project_id: null,
    });


    return ResponseOk(res, 200, "Role deleted successfully", deletedRole);
  } catch (error) {
    console.error("DeleteRole Error:", error);
    return ErrorHandler(res, 500, "Failed to delete role");
  }
};

const UpdatePermissionAdmin = async (req, res) => {
  try {
    const { permission_ids, enable_permissions, disable_permissions } = req.body;

    if (!Array.isArray(permission_ids) || permission_ids.length === 0) {
      return ErrorHandler(res, 400, "permission_ids must be a non-empty array.");
    }

    let updateStatus = null;
    if (enable_permissions) {
      updateStatus = 1;
    } else if (disable_permissions) {
      updateStatus = 0;
    } else {
      return ErrorHandler(res, 400, "Either enable_permissions or disable_permissions must be true.");
    }

    await Permissions.updateMany(
      { id: { $in: permission_ids } },
      { $set: { status: updateStatus } }
    );

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'UPDATE_PERMISSIONS',
      type: 'Message_Response',
      sub_type: updateStatus === 1 ? 'Enable' : 'Disable',
      message: `Permissions ${updateStatus === 1 ? 'enabled' : 'disabled'}: [${permission_ids.join(', ')}]`,
      title: `Permissions ${updateStatus === 1 ? 'Enabled' : 'Disabled'}`,
      project_id: null,
    });

    return ResponseOk(res, 200, "Permissions updated successfully", {
      updated_permissions: permission_ids,
      status: updateStatus === 1 ? "enabled" : "disabled"
    });

  } catch (error) {
    console.error("UpdatePermissionAdmin Error:", error);
    return ErrorHandler(res, 500, "Failed to update permissions");
  }
};

const UpdateProjectStatus = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const { status } = req.body;

    if (!projectId || status === undefined) {
      return ErrorHandler(res, 400, "Project ID and status are required");
    }

    const validStatuses = [1, 2, 3]; 
    if (!validStatuses.includes(status)) {
      return ErrorHandler(res, 400, "Invalid status value");
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return ErrorHandler(res, 404, "Project not found");
    }

    const site_name = updatedProject.site_name || 'Unknown Project';

    await ActivityLog.create({
      user_id: req.user?._id || null,
      action: 'UPDATE_PROJECT_STATUS',
      type: 'Message_Response',
      sub_type: 'Update',
      message: `Project  ${site_name} status updated to ${status}.`,
      title: 'Project Status Updated',
    });


    return ResponseOk(res, 200, "Project status updated successfully", updatedProject);
  } catch (error) {
    console.error("[UpdateProjectStatus]", error);
    return ErrorHandler(res, 500, "Server error while updating project status");
  }
};

const ViewProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("projectId received:", projectId);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return ErrorHandler(res, 400, "Invalid project ID");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return ErrorHandler(res, 404, "Project not found");
    }

    return ResponseOk(res, 200, "Project retrieved successfully", project);
  } catch (error) {
    console.error("[ViewProjectById]", error);
    return ErrorHandler(res, 500, "Server error while retrieving project");
  }
};

const ManageRolePermissions = async (req, res) => {
  try {
    const { role_id, add_permission_ids = [], remove_permission_ids = [] } = req.body;

    if (!role_id) {
      return ErrorHandler(res, 400, "role_id is required.");
    }

    if (!Array.isArray(add_permission_ids) || !Array.isArray(remove_permission_ids)) {
      return ErrorHandler(res, 400, "add_permission_ids and remove_permission_ids must be arrays.");
    }

    // Check if role exists
    const roleExists = await Roles.findOne({ id: role_id });
    if (!roleExists) {
      return ErrorHandler(res, 404, "Role not found.");
    }

    // Validate added permissions
    let addedPermissionIds = [];
    if (add_permission_ids.length > 0) {
      const validAddPermissions = await Permissions.find({ id: { $in: add_permission_ids } });
      addedPermissionIds = validAddPermissions.map(p => p.id);

      if (addedPermissionIds.length !== add_permission_ids.length) {
        return ErrorHandler(res, 400, "One or more add_permission_ids are invalid.");
      }

      // Avoid duplicates (only insert if not already linked)
      const existingLinks = await Role_with_permission.find({
        role_id,
        permission_id: { $in: addedPermissionIds }
      });
      const existingPermissionIds = existingLinks.map(link => link.permission_id);

      const newLinks = addedPermissionIds
        .filter(pid => !existingPermissionIds.includes(pid))
        .map(pid => ({ role_id, permission_id: pid }));

      if (newLinks.length > 0) {
        await Role_with_permission.insertMany(newLinks);
      }
    }

    // Remove permissions
    if (remove_permission_ids.length > 0) {
      await Role_with_permission.deleteMany({
        role_id,
        permission_id: { $in: remove_permission_ids }
      });
    }

    const updatedLinks = await Role_with_permission.find({ role_id });
    const finalPermissions = await Permissions.find({ id: { $in: updatedLinks.map(rp => rp.permission_id) } });

    return ResponseOk(res, 200, "Role permissions updated successfully", {
      role_id,
      current_permissions: finalPermissions.map(p => ({
        id: p.id,
        permission_name: p.permission_name
      }))
    });

  } catch (error) {
    console.error("Error:", error);
    return ErrorHandler(res, 500, "Server error while managing role permissions");
  }
};

const GetStaticData = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = {};
    if (type) {
      filter.type = Number(type);
    }
    if (isNaN(filter.type)) {
      return ErrorHandler(res, 400, "Invalid type parameter");
    }

    const staticData = await Static_Data_Schema.find(filter);

    return ResponseOk(res, 200, "Static data fetched successfully", staticData);
  } catch (error) {
    console.error("Error fetching static data:", error);
    return ErrorHandler(res, 500, "Failed to fetch static data", error);
  }
};

module.exports = {
  LoginAdmin,
  GetPermissionAdmin,
  GetListOfRole,
  getRolePermissions,
  GetUserById,
  AddAdminUser,
  UpdateAdminUser,
  DeleteAdminUser,
  AddRolesByAdmin,
  UpdateRole,
  DeleteRole,
  UpdatePermissionAdmin,
  UpdateProjectStatus,
  ViewProjectById,
  ManageRolePermissions,
  GetStaticData,
  GetUserAll
}