exports.PermissionsData = [
  { id: 1, permission_name: "Add Project" },
  { id: 2, permission_name: "View Project" },
  { id: 3, permission_name: "Edit Project" },
  { id: 4, permission_name: "Delete Project" },

  { id: 5, permission_name: "Add Erector" },
  { id: 6, permission_name: "View Erector" },
  { id: 7, permission_name: "Edit Erector" },
  { id: 8, permission_name: "Delete Erector" },

  { id: 9, permission_name: "Add User" },
  { id: 10, permission_name: "View User" },
  { id: 11, permission_name: "Edit User" },
  { id: 12, permission_name: "Delete User" },

  { id: 13, permission_name: "View Dashboard" },

  { id: 14, permission_name: "View Roles" },
  { id: 15, permission_name: "Add Roles" },
  { id: 16, permission_name: "Edit Roles" },
  { id: 17, permission_name: "Delete Roles" },

  { id: 18, permission_name: "View Permissions" },
  { id: 19, permission_name: "Add Permissions" },
  { id: 20, permission_name: "Edit Permissions" },
  { id: 21, permission_name: "Delete Permissions" },

  { id: 22, permission_name: "View Elevator" },
  { id: 23, permission_name: "Add Elevator" },
  { id: 24, permission_name: "Edit Elevator" },
  { id: 25, permission_name: "Delete Elevator" },

  { id: 26, permission_name: "View Pre Installation Steps" },
  { id: 27, permission_name: "Add Pre Installation Steps" },
  { id: 28, permission_name: "Edit Pre Installation Steps" },
  { id: 29, permission_name: "Delete Pre Installation Steps" },

  { id: 30, permission_name: "View Vender order" },
  { id: 31, permission_name: "Add Vender order" },
  { id: 32, permission_name: "Edit Vender order" },
  { id: 33, permission_name: "Delete Vender order" },

  { id: 34, permission_name: "View Delivery List" },
  { id: 35, permission_name: "Add Delivery List" },
  { id: 36, permission_name: "Edit Delivery List" },
  { id: 37, permission_name: "Delete Delivery List" },

  { id: 38, permission_name: "View QC" },
  { id: 39, permission_name: "Add QC" },
  { id: 40, permission_name: "Edit QC" },
  { id: 41, permission_name: "Delete QC" },

  { id: 42, permission_name: "View Payment" },
  { id: 43, permission_name: "Add Payment" },
  { id: 44, permission_name: "Edit Payment" },
  { id: 45, permission_name: "Delete Payment" },

  { id: 46, permission_name: "View Handover" },
  { id: 47, permission_name: "Add Handover" },
  { id: 48, permission_name: "Edit Handover" },
  { id: 49, permission_name: "Delete Handover" },
];


exports.PermissionRolesData = [
  // Admin (role_id: 1)
  { id: 1, role_id: 1, permission_id: 1 },  // Add Project
  { id: 2, role_id: 1, permission_id: 2 },  // View Project
  { id: 3, role_id: 1, permission_id: 3 },  // Edit Project
  { id: 4, role_id: 1, permission_id: 4 },  // Delete Project
  { id: 5, role_id: 1, permission_id: 13 }, // View Dashboard
  { id: 6, role_id: 1, permission_id: 14 }, // View Roles
  { id: 7, role_id: 1, permission_id: 15 }, // Add Roles
  { id: 8, role_id: 1, permission_id: 16 }, // Edit Roles
  { id: 9, role_id: 1, permission_id: 17 }, // Delete Roles
  { id: 10, role_id: 1, permission_id: 9 }, // Add User
  { id: 11, role_id: 1, permission_id: 10 }, // View User
  { id: 12, role_id: 1, permission_id: 11 }, // Edit User
  { id: 13, role_id: 1, permission_id: 12 }, // Delete User

   // Manager (role_id: 3)
  { id: 14, role_id: 3, permission_id: 2 },  // View Project
  { id: 15, role_id: 3, permission_id: 6 },  // View Erector
  { id: 16, role_id: 3, permission_id: 10 }, // View User
  { id: 17, role_id: 3, permission_id: 13 }, // View Dashboard
  { id: 18, role_id: 3, permission_id: 18 }, // View Permissions
  { id: 19, role_id: 3, permission_id: 22 }, // View Elevator
  { id: 20, role_id: 3, permission_id: 26 }, // View Pre Installation Steps
  { id: 21, role_id: 3, permission_id: 30 }, // View Vender order
  { id: 22, role_id: 3, permission_id: 34 }, // View Delivery List
  { id: 23, role_id: 3, permission_id: 38 }, // View QC
  { id: 24, role_id: 3, permission_id: 42 }, // View Payment
  { id: 25, role_id: 3, permission_id: 46 }, // View Handover

  // Site Engineer (role_id: 4)
  { id: 26, role_id: 4, permission_id: 2 },  // View Project
  { id: 27, role_id: 4, permission_id: 6 },  // View Erector
  { id: 28, role_id: 4, permission_id: 13 }, // View Dashboard
  { id: 29, role_id: 4, permission_id: 22 }, // View Elevator
  { id: 30, role_id: 4, permission_id: 26 }, // View Pre Installation Steps
  { id: 31, role_id: 4, permission_id: 30 }, // View Vender order
  { id: 32, role_id: 4, permission_id: 34 }, // View Delivery List
  { id: 33, role_id: 4, permission_id: 38 }  // View QC
]