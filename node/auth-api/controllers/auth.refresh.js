import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import bcrypt from 'bcrypt';
const jwtSecret = process.env.JWT_SECRET;

// In-memory store for refresh tokens (for learning purposes only)
const refreshTokens = new Set();

export const loginWithRefresh = async (req, res) => {
  
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  console.log(user);
  

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password)
    
  if(!match) {
      return res.status(401).json({ message: "Invalid credentials!" })
  }
  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

  refreshTokens.add(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refreshAccessToken = (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.has(token)) {
    return res.status(403).json({ message: 'Refresh token is invalid or missing' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const newAccessToken = jwt.sign({ id: payload.id, email: payload.email }, jwtSecret, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Token expired or invalid' });
  }
};

export const logout = (req, res) => {
  const { token } = req.body;
  refreshTokens.delete(token);
  res.json({ message: 'Logged out successfully' });
};
