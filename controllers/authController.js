const { StatusCodes } = require("http-status-codes");
const { createJWT } = require("../utils");
const CustomError = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";
  const newUser = await User.create(req.body);
  const payload = {
    userId: newUser._id,
    userName: newUser.name,
    role: newUser.role,
  };
  const token = createJWT(payload);
  res.status(201).json({ newUser, token });
};

const login = async (req, res) => {
  res.send("login");
};

const logout = async (req, res) => {
  res.send("logout");
};

module.exports = { register, login, logout };
