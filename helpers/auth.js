const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
}

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
  };
  