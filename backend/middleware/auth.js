const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach entire payload
    req.user = decoded;

    // Attach userId
    req.userId = decoded.userId;

    // Attach Airtable tokens (if they exist in JWT)
    req.airtableAccessToken = decoded.airtableAccessToken || null;
    req.airtableRefreshToken = decoded.airtableRefreshToken || null;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



