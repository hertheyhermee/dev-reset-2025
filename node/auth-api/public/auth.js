let accessToken = '';
let refreshToken = '';

const api = 'http://localhost:5000/api/auth';

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${api}/login-refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
    showMessage('✅ Logged in');
  })
  .catch(() => showMessage('⚠️ Invalid credentials'));
}

function getProtectedData() {
  fetch('http://localhost:5000/api/auth/protected', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  .then(res => res.json())
  .then(data => {
    showMessage('🔐 Protected data: ' + JSON.stringify(data));
  })
}

function refreshTokenFn() {
  fetch(`${api}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken })
  })
  .then(res => res.json())
  .then(data => {
    accessToken = data.accessToken;
    showMessage('🔄 Access token refreshed');
  });
}

function logout() {
  fetch(`${api}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken })
  })
  .then(() => {
    accessToken = '';
    refreshToken = '';
    showMessage('🚪 Logged out');
  });
}

function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}
