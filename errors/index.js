const CustomAPIError = require("./custom-api");
const BadRequest = require("./bad-request");
const NotFound = require("./not-found");
const Unauthenticated = require("./unauthenticated");
const Unauthorized = require("./unauthorized");

module.exports = {
  CustomAPIError,
  BadRequest,
  NotFound,
  Unauthenticated,
  Unauthorized,
};
