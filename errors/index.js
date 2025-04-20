const CustomAPIError = require("../errors/custom-api");
const BadRequest = require("../errors/bad-request");
const NotFound = require("../errors/not-found");
const Unauthenticated = require("../errors/unauthenticated");
const Unauthorized = require("../errors/unauthorized");

module.exports = {
  CustomAPIError,
  BadRequest,
  NotFound,
  Unauthenticated,
  Unauthorized,
};
