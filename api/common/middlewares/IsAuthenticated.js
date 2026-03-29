// IsAuthenticated middleware

const isAuthenticated = (req, res, next) => {
  // Check if user is authenticated
  next();
};

module.exports = isAuthenticated;
