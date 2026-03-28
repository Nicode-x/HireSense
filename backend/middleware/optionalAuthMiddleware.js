const jwt = require("jsonwebtoken");

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiresense_secure_jwt_secret_2026_xK9mP3nQ7rL2vW8");
      req.user = decoded;
    } catch (error) {
      // Ignore token errors for optional auth, user remains undefined
    }
  }
  
  next();
};

module.exports = optionalAuthMiddleware;
