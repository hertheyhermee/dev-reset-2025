import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import twilio from 'twilio';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- MongoDB Setup ---
await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mfaadvancedauth');

// --- User Model ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totpSecret: { type: String }, // For TOTP
  phone: { type: String },      // For SMS
  isVerified: { type: Boolean, default: false }
}));

// --- OTP Model (for SMS) ---
const SmsOtp = mongoose.model('SmsOtp', new mongoose.Schema({
  phone: String,
  code: String,
  expiresAt: Date
}));

// --- Session Setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));

// --- Twilio Setup (for SMS OTP) ---
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_FROM = process.env.TWILIO_FROM;

// --- Signup Route (choose TOTP or SMS) ---
app.post('/signup', async (req, res) => {
  const { email, password, method, phone } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Email and password (min 6 chars) required' });
  }
  if (method === 'sms' && !phone) {
    return res.status(400).json({ message: 'Phone number required for SMS MFA' });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  let totpSecret, qr, otpauthUrl;
  if (method === 'totp') {
    const secret = speakeasy.generateSecret({ name: `MFA-Advanced (${email})` });
    totpSecret = secret.base32;
    otpauthUrl = secret.otpauth_url;
    qr = await qrcode.toDataURL(otpauthUrl);
  }
  await User.create({ email, password: hashed, totpSecret, phone });
  res.status(201).json({
    message: 'User registered successfully',
    qr: qr || null,
    otpauthUrl: otpauthUrl || null
  });
});

// --- Login Route (Step 1: Email/Password) ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  req.session.pendingUser = email;
  if (user.totpSecret) {
    return res.json({ message: 'Enter TOTP code from your authenticator app', method: 'totp' });
  }
  if (user.phone) {
    // Generate SMS OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await SmsOtp.deleteMany({ phone: user.phone });
    await SmsOtp.create({ phone: user.phone, code, expiresAt });
    // Send SMS
    if (twilioClient && TWILIO_FROM) {
      await twilioClient.messages.create({
        body: `Your OTP code is: ${code}`,
        from: TWILIO_FROM,
        to: user.phone
      });
    }
    return res.json({ message: 'OTP sent via SMS', method: 'sms' });
  }
  res.status(400).json({ message: 'No MFA method set up for this user' });
});

// --- Verify TOTP Route ---
app.post('/verify-totp', async (req, res) => {
  const { code } = req.body;
  const email = req.session.pendingUser;
  if (!email) return res.status(400).json({ message: 'No pending login' });
  const user = await User.findOne({ email });
  if (!user || !user.totpSecret) return res.status(400).json({ message: 'No TOTP setup' });
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: code,
    window: 1
  });
  if (!verified) {
    return res.status(401).json({ message: 'Invalid or expired TOTP code' });
  }
  req.session.user = { email };
  delete req.session.pendingUser;
  await User.updateOne({ email }, { isVerified: true });
  res.json({ message: 'MFA (TOTP) successful, you are logged in' });
});

// --- Verify SMS OTP Route ---
app.post('/verify-sms', async (req, res) => {
  const { code } = req.body;
  const email = req.session.pendingUser;
  if (!email) return res.status(400).json({ message: 'No pending login' });
  const user = await User.findOne({ email });
  if (!user || !user.phone) return res.status(400).json({ message: 'No SMS setup' });
  const otp = await SmsOtp.findOne({ phone: user.phone, code });
  if (!otp || otp.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Invalid or expired SMS OTP' });
  }
  await SmsOtp.deleteMany({ phone: user.phone });
  req.session.user = { email };
  delete req.session.pendingUser;
  await User.updateOne({ email }, { isVerified: true });
  res.json({ message: 'MFA (SMS) successful, you are logged in' });
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
app.listen(3007, () => console.log('MFA advanced auth app running on 3007'));

/*
  --- How Advanced MFA Works ---
  1. User signs up: chooses TOTP (gets QR code) or SMS (enters phone)
  2. User logs in with email/password (POST /login)
     - If TOTP, prompt for TOTP code
     - If SMS, send OTP and prompt for code
  3. User submits TOTP code (POST /verify-totp) or SMS code (POST /verify-sms)
     - If valid, session is authenticated (req.session.user set)
  4. User can access protected routes
  5. Logout destroys session

  --- .env file required ---
  MONGO_URI=mongodb://localhost:27017/mfaadvancedauth
  SESSION_SECRET=your_session_secret
  TWILIO_SID=your_twilio_sid
  TWILIO_AUTH_TOKEN=your_twilio_auth_token
  TWILIO_FROM=your_twilio_phone_number
*/ 