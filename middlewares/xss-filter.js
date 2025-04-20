const xss = require("xss");

const xssMiddleware = (req, res, next) => {
  // Function to recursively sanitize an object
  const sanitizeObject = (obj) => {
    if (!obj) return obj;

    if (typeof obj === "string") {
      return xss(obj); // Sanitize string
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeObject(item)); // Sanitize array items
    }

    if (typeof obj === "object") {
      const result = {};
      for (const key in obj) {
        result[key] = sanitizeObject(obj[key]); // Sanitize object properties
      }
      return result;
    }

    return obj; // Return unchanged if not an object, array or string
  };

  // Sanitize request body, query and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

module.exports = xssMiddleware;
