import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { authenticate } from './src/middleware/authenticate.js';
import { User } from './src/models/User.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

// --- MongoDB Setup ---
await mongoose.connect(process.env.MONGO_URI);

// --- Refresh Token Model ---
const RefreshToken = mongoose.model('RefreshToken', new mongoose.Schema({
  token: String,
  userEmail: String,
  expiresAt: Date
}));

// --- Dummy User (for demo) ---
const USER = { email: 'test@example.com', password: await bcrypt.hash('password123', 10) };

// --- JWT Secrets ---
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

// --- Login Route ---
// Issues both access and refresh tokens
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== USER.email || !(await bcrypt.compare(password, USER.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Create tokens
  const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  // Store refresh token in DB
  await RefreshToken.create({ token: refreshToken, userEmail: email, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });
  // Send refresh token as HTTP-only cookie for security
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7*24*60*60*1000 });
  res.json({ accessToken });
});


// --- Protected Route Example ---
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

// --- Refresh Token Endpoint ---
// Issues a new access token if refresh token is valid
app.post('/refresh-token', async (req, res) => {
  // Get refresh token from HTTP-only cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) return res.status(403).json({ message: 'Refresh token invalid or revoked' });
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ email: payload.email }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Refresh token expired' });
  }
});

// --- Logout (Revoke Refresh Token) ---
app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.clearCookie('refreshToken');
  }
  res.json({ message: 'Logged out' });
});

// --- Signup Route ---
// Allows new users to register
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Email and password (min 6 chars) required' });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });
  res.status(201).json({ message: 'User registered successfully' });
});

// --- Start Server ---
app.listen(3003, () => console.log('JWT refresh auth app running on 3003'));

/*
  --- How this works ---
  1. User logs in: POST /login with email/password
     - If valid, gets accessToken (in JSON) and refreshToken (in HTTP-only cookie)
  2. To access protected routes, send accessToken in Authorization header
  3. When accessToken expires, call POST /refresh-token (cookie sent automatically)
     - If valid, gets new accessToken
  4. To logout, call POST /logout (cookie cleared, token revoked in DB)

  --- Storage ---
  - Access token: store in memory or localStorage (client-side)
  - Refresh token: stored in HTTP-only cookie (not accessible to JS)

  --- Revocation ---
  - On logout, refresh token is deleted from DB and cookie is cleared
  - If refresh token is missing or revoked, user must log in again
*/ 