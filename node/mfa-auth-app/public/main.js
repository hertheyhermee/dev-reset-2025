function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}

function showOtpSection(show) {
  document.getElementById('otp-section').style.display = show ? 'block' : 'none';
  document.getElementById('auth-section').style.display = show ? 'none' : 'block';
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch('/signup', {
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
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'Login step 1 done');
      if (data.message && data.message.includes('OTP')) {
        showOtpSection(true);
      }
    })
    .catch(() => showMessage('Login failed'));
}

function verifyOtp() {
  const code = document.getElementById('otp').value;
  fetch('/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message || 'OTP verified!');
      if (data.message && data.message.includes('successful')) {
        showOtpSection(false);
      }
    })
    .catch(() => showMessage('OTP verification failed'));
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
      showOtpSection(false);
    })
    .catch(() => showMessage('Logout failed'));
} 