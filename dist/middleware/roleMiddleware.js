export const adminOnly = (req, res, next) => {
    // @ts-ignore
    if (req.user?.role !== "admin")
        return res.status(403).json({ message: "Admin access only" });
    next();
};
