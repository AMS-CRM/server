const logger = require("./logger.js");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.success = false;
  //logger(req, res, next)

  return res.json({
    success: res.success,
    code: res.code || 0,
    status: statusCode,
    error: res.payload || null,
    message: err.message || "Something went wrong, please contact support.",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
