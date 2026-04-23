const cart = JSON.parse(localStorage.getItem('gs_cart') || '[]');
const cartCountEl = document.getElementById('cartCount');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

cartCountEl.textContent = cart.length;
cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('gs_user');
  window.location.href = 'index.html';
});

function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => toast.classList.remove('show'), 3000);
}

const MOCK_USERS = [
  { id: 1, name: 'Admin', email: 'admin@api.com', role: 'Administrador' },
  { id: 2, name: 'Carlos', email: 'cliente@api.com', role: 'Cliente' },
  { id: 3, name: 'Diego Salvador', email: 'contatodiegosalvador@gmail.com', role: 'Cliente' },
  { id: 4, name: 'gabi', email: 'fab@bia.com', role: 'Cliente' },
  { id: 5, name: 'Gabriel', email: 'gabriel@gmail.com', role: 'Cliente' },
  { id: 6, name: 'Daniel', email: 'danieljcorreia10@gmail.com', role: 'Administrador' },
];

const MOCK_EMPRESAS = [
  { id: 1, name: 'Ubisoft', country: 'França' },
  { id: 2, name: 'FromSoftware', country: 'Japão' },
  { id: 3, name: 'CD Projekt Red', country: 'Polônia' },
  { id: 4, name: 'Valve', country: 'EUA' },
  { id: 5, name: 'Mojang', country: 'Suécia' },
];

const MOCK_CATEGORIAS = GENRES.filter(g => g !== 'Todos').map((g, i) => ({
  id: i + 1,
  name: g,
  count: GAMES_DATA.filter(game => game.genre === g).length
}));

function renderSection(sectionId) {
  document.querySelectorAll('.workspace-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.admin-card').forEach(c => c.classList.remove('active-card'));

  document.getElementById(`panel${capitalize(sectionId)}`).classList.remove('hidden');
  document.getElementById(`card${capitalize(sectionId)}`).classList.add('active-card');

  if (sectionId === 'usuarios') renderUsuarios();
  if (sectionId === 'empresas') renderEmpresas();
  if (sectionId === 'jogos') renderJogosAdmin();
  if (sectionId === 'categorias') renderCategorias();
  if (sectionId === 'perfis') renderPerfis();
  if (sectionId === 'relatorios') renderRelatorios();
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function renderUsuarios() {
  const tbody = document.getElementById('usuariosBody');
  tbody.innerHTML = MOCK_USERS.map(u => `
    <tr>
      <td>#${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role === 'Administrador' ? 'badge-admin' : 'badge-client'}">${u.role}</span></td>
      <td><button class="btn-edit" data-uid="${u.id}">Editar</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-uid]').forEach(btn => {
    btn.addEventListener('click', () => openEditUser(Number(btn.dataset.uid)));
  });
}

function openEditUser(uid) {
  const user = MOCK_USERS.find(u => u.id === uid);
  if (!user) return;
  const form = document.getElementById('editUserForm');
  form.innerHTML = `
    <div class="edit-form-fields">
      <div class="edit-field">
        <label>Nome</label>
        <input type="text" value="${user.name}" id="editName" />
      </div>
      <div class="edit-field">
        <label>E-mail</label>
        <input type="email" value="${user.email}" id="editEmail" />
      </div>
      <div class="edit-field">
        <label>Perfil</label>
        <select id="editRole">
          <option ${user.role === 'Cliente' ? 'selected' : ''}>Cliente</option>
          <option ${user.role === 'Administrador' ? 'selected' : ''}>Administrador</option>
        </select>
      </div>
      <button class="btn-save" id="saveUserBtn">Salvar alterações</button>
    </div>
  `;
  document.getElementById('saveUserBtn').addEventListener('click', () => {
    user.name = document.getElementById('editName').value;
    user.email = document.getElementById('editEmail').value;
    user.role = document.getElementById('editRole').value;
    renderUsuarios();
    showToast('Usuário atualizado com sucesso!', 'success');
  });
}

function renderEmpresas() {
  const tbody = document.getElementById('empresasBody');
  tbody.innerHTML = MOCK_EMPRESAS.map(e => `
    <tr>
      <td>#${e.id}</td>
      <td>${e.name}</td>
      <td>${e.country}</td>
      <td><button class="btn-edit">Editar</button></td>
    </tr>
  `).join('');
}

function renderJogosAdmin() {
  const tbody = document.getElementById('jogosAdminBody');
  tbody.innerHTML = GAMES_DATA.map(g => {
    const price = g.price === 0 ? 'Grátis' : `R$ ${g.price.toFixed(2).replace('.', ',')}`;
    return `
    <tr>
      <td>#${g.id}</td>
      <td>${g.title}</td>
      <td>${g.genre}</td>
      <td>${price}</td>
      <td><button class="btn-edit">Editar</button></td>
    </tr>`;
  }).join('');
}

function renderCategorias() {
  const tbody = document.getElementById('categoriasBody');
  tbody.innerHTML = MOCK_CATEGORIAS.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td>${c.name}</td>
      <td>${c.count} jogo${c.count !== 1 ? 's' : ''}</td>
      <td><button class="btn-edit">Editar</button></td>
    </tr>
  `).join('');
}

function renderPerfis() {
  const grid = document.getElementById('perfisGrid');
  grid.innerHTML = MOCK_USERS.map(u => `
    <div class="perfil-card">
      <div class="perfil-avatar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h4>${u.name}</h4>
      <p>${u.role}</p>
    </div>
  `).join('');
}

function renderRelatorios() {
  const top = [...GAMES_DATA].sort((a, b) => b.price - a.price).slice(0, 6);
  const grid = document.getElementById('relatorioCards');
  grid.innerHTML = top.map((g, i) => `
    <div class="relatorio-item">
      <div class="rank">#${i + 1}</div>
      <h4>${g.title}</h4>
      <p>${g.developer} · ${g.genre}</p>
    </div>
  `).join('');
}

document.querySelectorAll('.admin-card').forEach(card => {
  card.addEventListener('click', () => renderSection(card.dataset.section));
});

renderSection('usuarios');
