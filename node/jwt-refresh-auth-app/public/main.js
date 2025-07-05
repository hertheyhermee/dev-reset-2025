let accessToken = '';
const api = '';

function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch(api + '/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  fetch(api + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.accessToken) {
        accessToken = data.accessToken;
        showMessage('✅ Logged in');
      } else {
        showMessage(data.message || 'Login failed');
      }
    })
    .catch(() => showMessage('Login failed'));
}

function getProtected() {
    console.log(accessToken);
    
  fetch(api + '/protected', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(res => res.json())
    .then(data => {
      showMessage('🔐 ' + (data.message || JSON.stringify(data)) + ' ' + data.user.email);
    })
    .catch(() => showMessage('Not authorized'));
}

function refreshToken() {
  fetch(api + '/refresh-token', {
    method: 'POST',
    credentials: 'include' // send HTTP-only cookie
  })
    .then(res => res.json())
    .then(data => {
      if (data.accessToken) {
        accessToken = data.accessToken;
        showMessage('🔄 Access token refreshed');
      } else {
        showMessage(data.message || 'Refresh failed');
      }
    })
    .catch(() => showMessage('Refresh failed'));
}

function logout() {
  fetch(api + '/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      accessToken = '';
      showMessage(data.message || 'Logged out');
    })
    .catch(() => showMessage('Logout failed'));
} 