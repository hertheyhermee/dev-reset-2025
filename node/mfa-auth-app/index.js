import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- MongoDB Setup ---
await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mfaauth');

// --- User Model ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}));

// --- OTP Model ---
const Otp = mongoose.model('Otp', new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date
}));

// --- Session Setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));

// --- Nodemailer Transport ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Signup Route ---
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

// --- Login Route (Step 1: Email/Password) ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
  await Otp.deleteMany({ email }); // Remove old OTPs
  await Otp.create({ email, code, expiresAt });
  // Send OTP via email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${code}`
  });
  // Store email in session for next step
  req.session.pendingUser = email;
  res.json({ message: 'OTP sent to your email' });
});

// --- Verify OTP Route (Step 2: OTP) ---
app.post('/verify-otp', async (req, res) => {
  const { code } = req.body;
  const email = req.session.pendingUser;
  if (!email) return res.status(400).json({ message: 'No pending login' });
  const otp = await Otp.findOne({ email, code });
  if (!otp || otp.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }
  // OTP is valid
  await Otp.deleteMany({ email }); // Remove used OTPs
  req.session.user = { email };
  delete req.session.pendingUser;
  await User.updateOne({ email }, { isVerified: true });
  res.json({ message: 'MFA successful, you are logged in' });
});

// --- Middleware to Check Auth ---
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ message: 'Not authenticated' });
}

// --- Protected Route ---
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.session.user });
});

// --- Logout Route ---
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// --- Start Server ---
app.listen(3006, () => console.log('MFA auth app running on 3006'));

/*
  --- How MFA Works ---
  1. User logs in with email/password (POST /login)
     - If valid, server generates OTP, emails it, and stores it with expiry
     - Session stores pendingUser
  2. User submits OTP (POST /verify-otp)
     - If valid, session is authenticated (req.session.user set)
  3. User can access protected routes
  4. Logout destroys session

  --- .env file required ---
  MONGO_URI=mongodb://localhost:27017/mfaauth
  SESSION_SECRET=your_session_secret
  EMAIL_USER=your_gmail_address
  EMAIL_PASS=your_gmail_app_password
*/ 