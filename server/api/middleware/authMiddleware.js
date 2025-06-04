module.exports = (req, res, next) => {
  console.log(req.session);
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next(); // User is authenticated, continue to the route
};
