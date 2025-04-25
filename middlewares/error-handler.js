const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    message: err.message || "Something Went Wrong",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )}, Please choose another ${Object.keys(err.keyValue)}`;
  }
  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `No id found with ${err.value}`;
  }
  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
