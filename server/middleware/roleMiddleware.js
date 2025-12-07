export const adminOnly = (req, res, next) => {
  // Check if user role is admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
