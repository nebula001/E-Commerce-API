const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.Unauthenticated("Authentication Invalid");
  }
  try {
    const payload = isTokenValid(token);
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new CustomError.Unauthenticated("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.Unauthorized("Unauhtorized to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
