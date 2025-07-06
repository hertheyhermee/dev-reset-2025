function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies automatically
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Signed up!');
    })
    .catch(() => showMessage('Signup failed'));
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies automatically
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Login failed');
    })
    .catch(() => showMessage('Login failed'));
}

function getProtected() {
  fetch('/protected', {
    credentials: 'include' // Send session cookie automatically
  })
    .then(res => res.json())
    .then(data => {
      showMessage('🔐 ' + (data.message || JSON.stringify(data)));
    })
    .catch(() => showMessage('Not authorized'));
}

function getMe() {
  fetch('/me', {
    credentials: 'include' // Send session cookie automatically
  })
    .then(res => res.json())
    .then(data => {
      showMessage('👤 ' + JSON.stringify(data.user));
    })
    .catch(() => showMessage('Not authenticated'));
}

function logout() {
  fetch('/logout', {
    method: 'POST',
    credentials: 'include' // Send session cookie automatically
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Logged out');
    })
    .catch(() => showMessage('Logout failed'));
}

/*
  --- How Session Auth Frontend Works ---
  
  - No need to store tokens in JavaScript
  - Browser automatically sends session cookie with requests
  - Use credentials: 'include' to ensure cookies are sent
  - Session is managed entirely by the server
  
  --- Key Differences from JWT ---
  - No Authorization headers needed
  - No token storage or management
  - Simpler client-side code
  - Automatic session handling
*/ 