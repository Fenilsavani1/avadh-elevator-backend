const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ErrorHandler, ResponseOk } = require('../../Utils/ResponseHandler');
const { sendToken } = require('../../Utils/TokenUtils');
const { Users, User_Associate_With_Role } = require('../../Models/User.model')
const { ActivityLog } = require('../../Models/Activitylog.model');
require('dotenv').config();



const RegisterUser = async (req, res) => {
  try {
    const { name, email, contact_number, password } = req.body;

    if (!name || !password || (!email && !contact_number)) {
      return ResponseOk(res, 400, 'Name, password, and either email or contact number are required');
    }

    const existing = await Users.findOne({
      $or: [
        email ? { email } : null,
        contact_number ? { contact_number } : null
      ].filter(Boolean)
    });

    console.log("existing", existing)

    if (existing) {
      return ResponseOk(res, 400, 'User already exists with this email or contact number');
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("here")
    const user = await Users.create({
      name,
      email,
      contact_number,
      password: password
    });
    console.log("hey", user)

    return ResponseOk(res, 201, 'User registered successfully', {
      user_id: user.id,
      name: user.name,
      email: user.email,
      contact_number: user.contact_number
    });

  } catch (err) {
    console.log(err);
    return ErrorHandler(res, 500, 'Server error during registration');
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!password || (!email)) {
    return ErrorHandler(
      res,
      400,
      'Password and either email or contact number are required'
    );
  }

  try {
    const user = await Users.findOne({
      $or: [
        email ? { email } : null
      ].filter(Boolean)
    });

    if (!user) {
      return ErrorHandler(res, 404, 'User not found');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return ErrorHandler(res, 400, 'Invalid credentials');
    }

    const payload = {
      id: user._id,
      email: user.email,
      contact_number: user.contact_number
    };

    const { token, expiresin } = await sendToken(payload);

    await ActivityLog.create({
      user_id: user._id,
      action: 'LOGIN_USER',
      type: 'Message_Response',
      sub_type: 'Login',
      message: `User "${user.name}" logged in successfully.`,
      title: 'User Login',
      created_by: user._id
    });

    return ResponseOk(res, 200, 'Login successful', {
      user_id: user._id,
      email: user.email,
      contact_number: user.contact_number,
      token,
      expiresin
    });

  } catch (err) {
    console.error('[LoginUser]', err);
    return ErrorHandler(res, 500, 'Server error');
  }
};

const GetProfile = async (req, res) => {
  try {
    const user_id = req.auth.id;
    if (!user_id) {
      return ResponseOk(res, 400, 'User ID is required');
    }
    const userData = await User_Associate_With_Role.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'roles',
          localField: 'role_id',
          foreignField: 'id',
          as: 'role'
        }
      },
      { $unwind: '$role' },
      {
        $lookup: {
          from: 'role_with_permissions',
          localField: 'role_id',
          foreignField: 'role_id',
          as: 'role_permissions'
        }
      },
      {
        $unwind: {
          path: '$role_permissions',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'role_permissions.permission_id',
          foreignField: 'id',
          as: 'permissions'
        }
      },
      {
        $unwind: {
          path: '$permissions',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$user._id',
          name: { $first: '$user.name' },
          email: { $first: '$user.email' },
          contact_number: { $first: '$user.contact_number' },
          role: { $first: '$role.name' },
          permissions: { $addToSet: '$permissions.permission_name' }
        }
      }
    ]);

    return ResponseOk(res, 200, 'User profile fetched successfully', userData[0]);
  } catch (error) {
    console.log('error', error);
    return ErrorHandler(res, 500, 'Server error while fetching profile');
  }
};


const UpdateProfile = async (req, res) => {
  try {
    const { email, role_id, contact_number, name, password, oldPassword } = req.body;
    const userRoleId = req.query.id;

    const existingUserRole = await User_Associate_With_Role.findOne({ user_id: userRoleId });
    if (!existingUserRole) {
      return ErrorHandler(res, 404, "User association not found");
    }
    const userId = existingUserRole.user_id;

    const updateData = {};

    if (email) {
      const emailConflict = await Users.findOne({
        _id: { $ne: userId },
        email: email,
        is_deleted: false,
      });
      if (emailConflict) {
        return ErrorHandler(res, 400, "Another user with this email already exists");
      }
      updateData.email = email;
    }

    if (contact_number) {
      updateData.contact_number = contact_number;
    }

    if (name) {
      updateData.name = name;
    }

    if (password) {
      if (!oldPassword) {
        return ErrorHandler(res, 400, "Old password is required to set a new password");
      }

      const userPass = await Users.findById(req.auth.id);
      if (!userPass) {
        return ErrorHandler(res, 404, "User not found");
      }

      const match = await bcrypt.compare(oldPassword, userPass.password);
      if (!match) {
        return ErrorHandler(res, 400, "Invalid credentials");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return ErrorHandler(res, 400, "No valid fields provided for update");
    }

    await Users.findByIdAndUpdate(userId, updateData, { new: true });

    return ResponseOk(res, 200, "User updated successfully");
  } catch (error) {
    console.error("UpdateAdminUser Error:", error);
    return ErrorHandler(res, 400, error.message || "Something went wrong");
  }
};


module.exports = {
  RegisterUser,
  LoginUser,
  GetProfile,
  UpdateProfile
}