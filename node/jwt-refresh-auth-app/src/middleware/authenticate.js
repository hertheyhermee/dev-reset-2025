// --- Middleware to Protect Routes ---
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log(req.user);
      next();
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  