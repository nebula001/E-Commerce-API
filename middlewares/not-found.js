const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ msg: "This route doesn't exists" });
};

module.exports = notFoundMiddleware;
