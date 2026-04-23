// ===== LOGIN JS =====

const btnLogin = document.getElementById('btnLogin');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const togglePw = document.getElementById('togglePw');
const eyeIcon = document.getElementById('eyeIcon');
const toast = document.getElementById('toast');

// Toggle password visibility
const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
const EYE_CLOSED = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

togglePw.addEventListener('click', () => {
  const isHidden = senhaInput.type === 'password';
  senhaInput.type = isHidden ? 'text' : 'password';
  eyeIcon.innerHTML = isHidden ? EYE_CLOSED : EYE_OPEN;
});

// Show toast
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Login handler
btnLogin.addEventListener('click', handleLogin);

[emailInput, senhaInput].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
});

function handleLogin() {
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!email) {
    showToast('Informe seu e-mail.', 'error');
    emailInput.focus();
    return;
  }

  if (!email.includes('@')) {
    showToast('E-mail inválido.', 'error');
    emailInput.focus();
    return;
  }

  if (!senha) {
    showToast('Informe sua senha.', 'error');
    senhaInput.focus();
    return;
  }

  // Simulate login
  btnLogin.textContent = 'Entrando...';
  btnLogin.disabled = true;

  setTimeout(() => {
    // Fake auth — accept any valid email/password
    localStorage.setItem('gs_user', JSON.stringify({ email }));
    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'jogos.html';
    }, 800);
  }, 1000);
}
