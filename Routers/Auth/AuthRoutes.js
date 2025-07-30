const { Router } = require("express");


const User = require('../../Models/User.model');
const { registerUser, loginUser } = require("../../Controllers/Auth/Auth.controllers.js");



const AuthRouter = Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);
module.exports = AuthRouter;