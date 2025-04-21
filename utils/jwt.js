require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token) => {
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  return decode;
};

const attachCookiesToResponse = (res, user) => {
  const token = createJWT(user);
  const OneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + OneDay),
    httpOnly: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
