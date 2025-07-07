import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();
app.use(express.static('public'));

// --- MongoDB Setup ---
await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/oauthauth');

// --- User Model ---
const User = mongoose.model('User', new mongoose.Schema({
  googleId: { type: String, unique: true },
  displayName: String,
  email: String,
  photo: String
}));

// --- Session Setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));

// --- Passport Setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// --- Google OAuth Strategy ---
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user in DB
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    });
  }
  return done(null, user);
}));

// --- Auth Routes ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/?error=login_failed',
  successRedirect: '/profile'
}));

// --- Middleware to Check Auth ---
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authenticated' });
}

// --- Profile Route ---
app.get('/profile', requireAuth, (req, res) => {
  // Render a simple profile page or return JSON
  res.send(`<h2>Welcome, ${req.user.displayName}!</h2><img src="${req.user.photo}" width="100"/><p>Email: ${req.user.email}</p><a href="/logout">Logout</a>`);
});

// --- Logout Route ---
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// --- API: Get Current User ---
app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// --- Home Route ---
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

// --- Start Server ---
app.listen(3005, () => console.log('OAuth (Google) auth app running on 3005'));

/*
  --- How Google OAuth Works ---
  1. User clicks "Login with Google" (GET /auth/google)
  2. Redirects to Google login/consent page
  3. On success, Google redirects to /auth/google/callback
  4. Server exchanges code for profile info, finds/creates user in DB
  5. User is logged in (session created)
  6. User can access /profile and /me
  7. Logout with /logout

  --- .env file required ---
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  SESSION_SECRET=your_session_secret
  MONGO_URI=mongodb://localhost:27017/oauthauth
*/ 