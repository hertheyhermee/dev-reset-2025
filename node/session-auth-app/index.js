import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- MongoDB Setup ---
await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sessionauth');

// --- User Model ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// --- Session Configuration ---
// This is where session-based auth differs from JWT
// Sessions are stored server-side (in MongoDB) and referenced by a session ID in a cookie
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false, // Don't save session if nothing changed
  saveUninitialized: false, // Don't create session until something stored
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/sessionauth',
    collectionName: 'sessions' // Store sessions in 'sessions' collection
  }),
  cookie: {
    httpOnly: true, // Not accessible via JavaScript (XSS protection)
    secure: false,  // Set to true if using HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// --- Middleware to Check Authentication ---
function requireAuth(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

// --- Signup Route ---
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Email and password (min 6 chars) required' });
  }
  
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// --- Login Route ---
// Creates a session and stores user info server-side
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Store user info in session (server-side)
    req.session.user = { 
      id: user._id, 
      email: user.email 
    };
    
    // Session ID is automatically sent as HTTP-only cookie
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// --- Protected Route ---
// No need to pass tokens - session is automatically checked
app.get('/protected', requireAuth, (req, res) => {
  res.json({ 
    message: 'You are authenticated', 
    user: req.session.user 
  });
});

// --- Logout Route ---
// Destroys the session (revokes access immediately)
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

// --- Get Current User ---
app.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// --- Start Server ---
app.listen(3004, () => console.log('Session auth app running on 3004'));

/*
  --- How Session-Based Authentication Works ---
  
  1. User logs in: POST /login with email/password
     - Server verifies credentials
     - Creates a session in MongoDB with user info
     - Sends session ID in HTTP-only cookie
  
  2. Subsequent requests:
     - Browser automatically sends session cookie
     - Server looks up session in MongoDB using session ID
     - If session exists and is valid, user is authenticated
  
  3. Protected routes:
     - No need to pass tokens in headers
     - Session middleware automatically handles authentication
     - User info available in req.session.user
  
  4. Logout:
     - Destroys session in MongoDB
     - Clears session cookie
     - Access revoked immediately
  
  --- Advantages of Session-Based Auth ---
  - Easy to revoke access (just delete session)
  - No token management on client-side
  - Built-in CSRF protection with sameSite cookies
  - Can store additional session data
  
  --- Disadvantages ---
  - Requires server-side storage
  - Doesn't scale as well for distributed systems
  - Session data stored on server
*/ 