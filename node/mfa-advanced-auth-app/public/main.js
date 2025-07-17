function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}

function showSection(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const method = document.getElementById('signup-method').value;
  const phone = document.getElementById('signup-phone').value;
  fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, method, phone })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Signed up!');
      if (data.qr) {
        showSection('qr-section', true);
        document.getElementById('qr-img').src = data.qr;
        document.getElementById('otpauth-url').innerText = data.otpauthUrl;
      } else {
        showSection('qr-section', false);
      }
    })
    .catch(() => showMessage('Signup failed'));
}

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Login step 1 done');
      showSection('totp-section', false);
      showSection('sms-section', false);
      if (data.method === 'totp') {
        showSection('totp-section', true);
      } else if (data.method === 'sms') {
        showSection('sms-section', true);
      }
    })
    .catch(() => showMessage('Login failed'));
}

function verifyTotp() {
  const code = document.getElementById('totp').value;
  fetch('/verify-totp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'TOTP verified!');
      if (data.message && data.message.includes('successful')) {
        showSection('totp-section', false);
      }
    })
    .catch(() => showMessage('TOTP verification failed'));
}

function verifySms() {
  const code = document.getElementById('sms').value;
  fetch('/verify-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'SMS verified!');
      if (data.message && data.message.includes('successful')) {
        showSection('sms-section', false);
      }
    })
    .catch(() => showMessage('SMS verification failed'));
}

function getProtected() {
  fetch('/protected', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      showMessage('🔐 ' + (data.message || JSON.stringify(data)));
    })
    .catch(() => showMessage('Not authorized'));
}

function logout() {
  fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Logged out');
      showSection('totp-section', false);
      showSection('sms-section', false);
    })
    .catch(() => showMessage('Logout failed'));
} 