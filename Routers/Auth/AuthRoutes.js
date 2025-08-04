const { Router } = require("express");


const User = require('../../Models/User.model');
const { registerUser, loginUser, getProfile } = require("../../Controllers/Auth/Auth.controllers.js");



const AuthRouter = Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);
AuthRouter.get('/get_profile', getProfile);

module.exports = AuthRouter;