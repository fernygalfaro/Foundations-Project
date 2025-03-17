const jwt = require('jsonwebtoken');
const secretKey = "secret-key";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
//const authorizeRole = (req, res, next) => {
    //if (req.user.role !== "Manager") {
        //return res.status(403).json({ error: "Access denied. Only Managers can access this resource." });
    //}
    //next();
//};
module.exports = authMiddleware;
//module.exports = authorizeRole;