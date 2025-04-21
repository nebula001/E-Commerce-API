const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const allUser = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ user: allUser });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const singleUser = await User.findById(id).select("-password");
  if (!singleUser) {
    throw new CustomError.BadRequest(`No use with id of ${id} present`);
  }
  checkPermissions(req.user, singleUser._id);
  res.status(StatusCodes.OK).json({ user: singleUser });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

const updateUser = async (req, res) => {
  const { email, name } = req.body || {};
  if (!email && !name) {
    throw new CustomError.BadRequest("Please provide atleast one value");
  }
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser) {
    throw new CustomError.NotFound("No user with given Id found");
  }
  if (email) {
    currentUser.email = email;
  }
  if (name) {
    currentUser.name = name;
  }
  await currentUser.save();
  const tokenUser = createTokenUser(currentUser);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequest("Both old and new password required");
  }
  const currentUser = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await currentUser.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.Unauthenticated("Invalid Credentials");
  }
  currentUser.password = newPassword;
  await currentUser.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
