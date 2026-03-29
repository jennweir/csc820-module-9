// CheckPermission middleware

const checkPermission = (req, res, next) => {
  // Check user permissions
  next();
};

module.exports = checkPermission;
