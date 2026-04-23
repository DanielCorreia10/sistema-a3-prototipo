const library = JSON.parse(localStorage.getItem('gs_library') || '[]');
const cart = JSON.parse(localStorage.getItem('gs_cart') || '[]');

const libGrid = document.getElementById('libGrid');
const libEmpty = document.getElementById('libEmpty');
const cartCountEl = document.getElementById('cartCount');
const logoutBtn = document.getElementById('logoutBtn');

cartCountEl.textContent = cart.length;
cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';

function makeCardSvg(colors) {
  const [c1, c2] = colors;
  const id = Math.random().toString(36).slice(2, 8);
  return `<svg class="card-gradient" viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="rg${id}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </radialGradient>
    </defs>
    <rect width="300" height="170" fill="url(#rg${id})"/>
    <ellipse cx="200" cy="80" rx="120" ry="90" fill="${c1}" fill-opacity="0.4"/>
    <ellipse cx="60" cy="130" rx="100" ry="60" fill="${c2}" fill-opacity="0.3"/>
  </svg>`;
}

function render() {
  if (library.length === 0) {
    libGrid.style.display = 'none';
    libEmpty.style.display = 'flex';
    return;
  }

  libEmpty.style.display = 'none';
  libGrid.style.display = 'grid';

  libGrid.innerHTML = library.map(entry => {
    const game = GAMES_DATA.find(g => g.id === entry.id);
    if (!game) return '';
    const price = game.price === 0 ? 'Grátis' : `R$ ${game.price.toFixed(2).replace('.', ',')}`;
    return `
    <article class="game-card lib-card">
      <div class="card-image">
        ${makeCardSvg(game.colors)}
        <span class="card-genre-badge">${game.genre.toUpperCase()}</span>
        <div class="card-title-overlay">
          <h3>${game.title}</h3>
          <div class="card-genre-label">${game.genre}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info">
          <h4>${game.title}</h4>
          <div class="card-meta">${game.developer} • ${price}</div>
        </div>
      </div>
      <div class="key-box">
        <div class="key-label">Chave de ativação</div>
        <div class="key-value">${entry.key}</div>
      </div>
    </article>`;
  }).join('');
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('gs_user');
  window.location.href = 'index.html';
});

render();
