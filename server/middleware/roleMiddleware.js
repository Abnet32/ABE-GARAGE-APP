export const adminOnly = (req, res, next) => {
  // Check if user role is admin
  const role = req.user?.role ? String(req.user.role).toLowerCase() : "";
  if (!req.user || role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
