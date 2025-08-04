const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY } = require('../config');

const sendToken = async (user) => {
  const token = jwt.sign(user, ACCESS_TOKEN_KEY, {
    expiresIn: '12h',
  });
  console.log("token", token);
  return { token, expiresin: '12h' };
};

module.exports = { sendToken };
