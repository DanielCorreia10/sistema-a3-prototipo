// ===== JOGOS JS =====

// State
let activeGenre = 'Todos';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('gs_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('gs_wishlist') || '[]');

// Elements
const genreFiltersEl = document.getElementById('genreFilters');
const gamesGridEl = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const cartCountEl = document.getElementById('cartCount');
const resultsInfoEl = document.getElementById('resultsInfo');
const toast = document.getElementById('toast');
const logoutBtn = document.getElementById('logoutBtn');

// ===== TOAST =====
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== CART =====
function updateCartCount() {
  cartCountEl.textContent = cart.length;
  cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';
  localStorage.setItem('gs_cart', JSON.stringify(cart));
}

function toggleCart(gameId) {
  const idx = cart.indexOf(gameId);
  if (idx === -1) {
    cart.push(gameId);
    showToast('Adicionado ao carrinho!', 'success');
  } else {
    cart.splice(idx, 1);
    showToast('Removido do carrinho.');
  }
  updateCartCount();
  renderGames();
}

// ===== WISHLIST =====
function toggleWishlist(gameId) {
  const idx = wishlist.indexOf(gameId);
  if (idx === -1) {
    wishlist.push(gameId);
    showToast('Adicionado à lista de desejos!', '');
  } else {
    wishlist.splice(idx, 1);
    showToast('Removido da lista de desejos.');
  }
  localStorage.setItem('gs_wishlist', JSON.stringify(wishlist));
  renderGames();
}

function makeCardSvg(colors) {
  const [c1, c2] = colors;
  return `<svg class="card-gradient" viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="rg_${Math.random().toString(36).slice(2,6)}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="300" height="170" fill="url(#rg_${Math.random().toString(36).slice(2,6)})"/>
    <ellipse cx="200" cy="80" rx="120" ry="90" fill="${c1}" fill-opacity="0.4"/>
    <ellipse cx="60" cy="130" rx="100" ry="60" fill="${c2}" fill-opacity="0.3"/>
  </svg>`;
}

function formatPrice(price) {
  if (price === 0) return 'Grátis';
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function renderGenres() {
  genreFiltersEl.innerHTML = GENRES.map(genre => `
    <button
      class="genre-btn ${genre === activeGenre ? 'active' : ''}"
      data-genre="${genre}"
    >${genre}</button>
  `).join('');

  genreFiltersEl.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeGenre = btn.dataset.genre;
      renderGenres();
      renderGames();
    });
  });
}

// ===== RENDER GAMES =====
function renderGames() {
  let filtered = GAMES_DATA;

  // Genre filter
  if (activeGenre !== 'Todos') {
    filtered = filtered.filter(g =>
      g.genre.toLowerCase() === activeGenre.toLowerCase()
    );
  }

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    );
  }

  // Results info
  resultsInfoEl.innerHTML = `<strong>${filtered.length}</strong> jogo${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    gamesGridEl.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>Nenhum jogo encontrado</h3>
        <p>Tente outro termo ou categoria.</p>
      </div>
    `;
    return;
  }

  gamesGridEl.innerHTML = filtered.map(game => {
    const inCart = cart.includes(game.id);
    const inWish = wishlist.includes(game.id);

    return `
    <article class="game-card" data-id="${game.id}">
      <div class="card-image">
        ${makeCardSvg(game.colors)}
        <span class="card-genre-badge">${game.genre.toUpperCase()}</span>
        <button class="card-wishlist-float ${inWish ? 'active' : ''}" data-wish="${game.id}" title="Lista de desejos">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${inWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div class="card-title-overlay">
          <h3>${game.title}</h3>
          <div class="card-genre-label">${game.genre}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info">
          <h4>${game.title}</h4>
          <div class="card-meta">${game.developer} • ${game.year}</div>
        </div>
        <div class="card-actions">
          <div class="card-price">${formatPrice(game.price)}</div>
          <button class="btn-wishlist ${inWish ? 'active' : ''}" data-wish="${game.id}" title="Lista de desejos">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${inWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="btn-cart ${inCart ? 'in-cart' : ''}" data-cart="${game.id}" title="${inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              ${inCart
                ? '<polyline points="20 6 9 17 4 12"/>'
                : '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'}
            </svg>
          </button>
        </div>
      </div>
    </article>
    `;
  }).join('');

  // Event listeners on buttons
  gamesGridEl.querySelectorAll('[data-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleCart(Number(btn.dataset.cart));
    });
  });

  gamesGridEl.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(Number(btn.dataset.wish));
    });
  });
}

// ===== SEARCH =====
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  renderGames();
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('gs_user');
  window.location.href = 'index.html';
});

// ===== INIT =====
updateCartCount();
renderGenres();
renderGames();
