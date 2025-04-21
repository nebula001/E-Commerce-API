const { StatusCodes } = require("http-status-codes");

const { createTokenUser, attachCookiesToResponse } = require("../utils");

const CustomError = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";
  const newUser = await User.create(req.body);
  const tokenUser = createTokenUser(newUser);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new CustomError.BadRequest(
      "Please provide both email id and password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFound(`No user with email Id ${email} found`);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.Unauthenticated("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    signed: true,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

module.exports = { register, login, logout };
