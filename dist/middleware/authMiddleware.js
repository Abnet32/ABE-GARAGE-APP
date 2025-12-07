import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ message: "Authorization denied" });
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // @ts-ignore
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
