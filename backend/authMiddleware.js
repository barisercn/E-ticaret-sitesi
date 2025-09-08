import { verifyToken } from "./jwt.js";
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Token gerekli" });
  
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    try {
      const decoded = verifyToken(token);
      req.user = decoded; // username artık req.user.username içinde
      next();
    } catch (err) {
      return res.status(403).json({ message: "Geçersiz veya süresi dolmuş token" });
    }
  }
  
  export { authMiddleware };