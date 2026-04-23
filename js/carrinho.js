let cart = JSON.parse(localStorage.getItem('gs_cart') || '[]');
let library = JSON.parse(localStorage.getItem('gs_library') || '[]');

const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartCountEl = document.getElementById('cartCount');
const summaryTotalEl = document.getElementById('summaryTotal');
const btnCheckout = document.getElementById('btnCheckout');
const toast = document.getElementById('toast');
const logoutBtn = document.getElementById('logoutBtn');

function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function makeThumbSvg(colors) {
  const [c1, c2] = colors;
  const id = Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 72 54" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="t${id}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </radialGradient>
    </defs>
    <rect width="72" height="54" fill="url(#t${id})"/>
    <ellipse cx="50" cy="25" rx="35" ry="28" fill="${c1}" fill-opacity="0.4"/>
  </svg>`;
}

function formatPrice(price) {
  return price === 0 ? 'Grátis' : `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function getCartGames() {
  return GAMES_DATA.filter(g => cart.includes(g.id));
}

function removeFromCart(gameId) {
  cart = cart.filter(id => id !== gameId);
  localStorage.setItem('gs_cart', JSON.stringify(cart));
  render();
  showToast('Item removido do carrinho.');
}

function render() {
  const games = getCartGames();
  const total = games.reduce((sum, g) => sum + g.price, 0);

  cartCountEl.textContent = cart.length;
  cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';

  summaryTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  if (games.length === 0) {
    cartItemsEl.style.display = 'none';
    document.querySelector('.cart-summary').style.display = 'none';
    cartEmptyEl.style.display = 'block';
    return;
  }

  cartEmptyEl.style.display = 'none';
  cartItemsEl.style.display = 'flex';
  document.querySelector('.cart-summary').style.display = 'block';

  cartItemsEl.innerHTML = games.map(game => `
    <div class="cart-item" data-id="${game.id}">
      <div class="cart-item-thumb">${makeThumbSvg(game.colors)}</div>
      <div class="cart-item-info">
        <h4>${game.title}</h4>
        <div class="cart-item-meta">${game.developer} • ${game.genre}</div>
        <div class="cart-item-price">${formatPrice(game.price)}</div>
      </div>
      <button class="cart-item-remove" data-remove="${game.id}" title="Remover">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  `).join('');

  cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.remove)));
  });
}

function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${seg()}-${seg()}-${seg()}`;
}

btnCheckout.addEventListener('click', () => {
  const games = getCartGames();
  if (games.length === 0) return;

  const newEntries = games.map(g => ({ id: g.id, key: generateKey() }));
  const existing = JSON.parse(localStorage.getItem('gs_library') || '[]');
  const merged = [...existing, ...newEntries.filter(e => !existing.find(x => x.id === e.id))];
  localStorage.setItem('gs_library', JSON.stringify(merged));

  cart = [];
  localStorage.setItem('gs_cart', JSON.stringify(cart));

  showToast('Compra finalizada! Jogos na sua biblioteca.', 'success');
  setTimeout(() => { window.location.href = 'biblioteca.html'; }, 1200);
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('gs_user');
  window.location.href = 'index.html';
});

render();
