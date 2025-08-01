const { Router } = require("express");

const { GetPermissionAdmin, LoginAdmin, GetListOfRole, getRolePermissions, AddAdminUser, UpdateAdminUser, DeleteAdminUser, AddRolesByAdmin, UpdateRole, DeleteRole, UpdatePermissionAdmin, UpdateProjectStatus, DeleteProject, ViewProjectById, GetUserById } = require("../../Controllers/Admin/Admin.Controller");


const AdminRouter = Router();

AdminRouter.post("/login_admin", LoginAdmin);
AdminRouter.get('/get_permission_list', GetPermissionAdmin);
AdminRouter.get('/get_roles_list', GetListOfRole)
AdminRouter.get('/list_of_permission_to_role', getRolePermissions)
AdminRouter.post('/add_user_admin', AddAdminUser)
AdminRouter.put('/update_user_admin', UpdateAdminUser)
AdminRouter.post('/delete_user_admin', DeleteAdminUser)
AdminRouter.post('/add_role', AddRolesByAdmin)
AdminRouter.post('/update_role', UpdateRole)
AdminRouter.post('/delete_role', DeleteRole)
AdminRouter.put('/update_permission', UpdatePermissionAdmin)
AdminRouter.put('/update_project_status', UpdateProjectStatus);
AdminRouter.post('/delete_project', DeleteProject);
AdminRouter.get('/view_project_by_id/:projectId', ViewProjectById);
AdminRouter.get('/get_user_by_id', GetUserById);



module.exports = AdminRouter;