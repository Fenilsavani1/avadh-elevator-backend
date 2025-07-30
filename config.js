require('dotenv').config();

// exports.DB_NAME = process.env.DB_NAME;
// exports.DB_USER = process.env.DB_USER;
// exports.DB_PASSWORD = process.env.DB_PASSWORD;
// exports.DB_HOST = process.env.DB_HOST;


exports.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY; 
exports.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
exports.JWT_SECRET = process.env.JWT_SECRET;

exports.MONGO_URL =  process.env.MONGO_URL