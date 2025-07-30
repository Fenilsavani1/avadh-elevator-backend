const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const db = require('../../Models/Config/mongoose.config');

const { ErrorHandler, ResponseOk } = require('../../Utils/ResponseHandler');
require('dotenv').config();
const { Op } = require('sequelize');
const { sendToken } = require('../../Utils/TokenUtils');
const { Users } = require('../../Models/User.model')



// Register
const registerUser = async (req, res) => {
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


// Login
const loginUser = async (req, res) => {
    const { email, contact_number, password } = req.body;

    if (!password || (!email && !contact_number)) {
        return ErrorHandler(
            res,
            400,
            'Password and either email or contact number are required'
        );
    }

    try {
        const user = await Users.findOne({
            $or: [
                email ? { email } : null,
                contact_number ? { contact_number } : null
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

        return ResponseOk(res, 200, 'Login successful', {
            user_id: user._id,
            email: user.email,
            contact_number: user.contact_number,
            token,
            expiresin
        });

    } catch (err) {
        console.error('[loginUser]', err);
        return ErrorHandler(res, 500, 'Server error');
    }
};


module.exports = {
    registerUser,
    loginUser,
}