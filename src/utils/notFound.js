const createError = require("./createError");

const notFound = (req, res, next) => {
  next(createError("Route not found!", 404));
};

module.exports = notFound;
