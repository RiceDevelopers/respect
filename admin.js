// ===== ADMIN PANEL JS =====

const ADMIN_CREDS = { username: 'admin', password: 'admin123' };

// ===== AUTH =====
function checkAuth() {
  if (!localStorage.getItem('admin_logged_in')) {
    window.location.href = 'admin.html';
    return false;
  }
  return true;
}

function login(user, pass) {
  if (user === ADMIN_CREDS.username && pass === ADMIN_CREDS.password) {
    localStorage.setItem('admin_logged_in', 'true');
    window.location.href = 'admin-products.html';
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('admin_logged_in');
  window.location.href = 'admin.html';
}

// ===== PRODUCTS DATA MANAGEMENT =====
let products = JSON.parse(localStorage.getItem('admin_products')) || [...window.PRODUCTS_DEFAULT || []];

function getProducts() {
  const stored = localStorage.getItem('admin_products');
  if (stored) return JSON.parse(stored);
  return window.PRODUCTS_DEFAULT || [];
}

function saveProducts(prods) {
  localStorage.setItem('admin_products', JSON.stringify(prods));
}

function deleteProduct(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
  const prods = getProducts().filter(p => p.id !== id);
  saveProducts(prods);
  renderProductsTable();
  showAdminToast('تم حذف المنتج بنجاح', 'success');
}

function toggleProductStatus(id) {
  const prods = getProducts();
  const p = prods.find(p => p.id === id);
  if (p) { p.active = !p.active; saveProducts(prods); renderProductsTable(); }
}

// ===== ORDERS DATA =====
let ordersData = JSON.parse(localStorage.getItem('admin_orders')) || [
  { id: '#ORD-1001', customer: 'محمد العتيبي', phone: '0501234567', city: 'الرياض', total: 450, status: 'pending', date: '2025-02-18', items: ['عود الملوك - 50ml'] },
  { id: '#ORD-1002', customer: 'فاطمة الزهراني', phone: '0552345678', city: 'جدة', total: 280, status: 'delivered', date: '2025-02-17', items: ['روز نوار - 100ml'] },
  { id: '#ORD-1003', customer: 'خالد الدوسري', phone: '0563456789', city: 'الدمام', total: 560, status: 'processing', date: '2025-02-16', items: ['عود الملوك - 100ml', 'نسمة الفجر - 50ml'] },
  { id: '#ORD-1004', customer: 'نورة السعد', phone: '0574567890', city: 'الخبر', total: 195, status: 'cancelled', date: '2025-02-15', items: ['لؤلؤة الشرق - 30ml'] },
  { id: '#ORD-1005', customer: 'عبدالله الشمري', phone: '0585678901', city: 'مكة', total: 390, status: 'pending', date: '2025-02-14', items: ['سلطانة الليل - 50ml'] },
];

function getOrders() { return JSON.parse(localStorage.getItem('admin_orders')) || ordersData; }
function saveOrders(orders) { localStorage.setItem('admin_orders', JSON.stringify(orders)); }

function updateOrderStatus(id, status) {
  const orders = getOrders();
  const o = orders.find(o => o.id === id);
  if (o) { o.status = status; saveOrders(orders); renderOrdersTable(); showAdminToast('تم تحديث حالة الطلب', 'success'); }
}

// ===== TOAST =====
function showAdminToast(msg, type = 'info') {
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const colors = { success: '#22c55e', error: '#ef4444', info: '#FF6B00' };
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:#1A1A1A;border:1px solid ${colors[type]}33;border-radius:8px;padding:14px 20px;font-size:13px;display:flex;align-items:center;gap:12px;min-width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;color:#F5F0EB;font-family:'Montserrat',sans-serif`;
  toast.innerHTML = `<span style="color:${colors[type]}">${icons[type]}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== STATUS BADGE =====
function statusBadge(status) {
  const map = {
    pending: ['معلق', 'badge-pending'],
    processing: ['قيد التجهيز', 'badge-processing'],
    delivered: ['تم التوصيل', 'badge-delivered'],
    cancelled: ['ملغي', 'badge-cancelled'],
    active: ['نشط', 'badge-active'],
    inactive: ['غير نشط', 'badge-inactive'],
  };
  const [label, cls] = map[status] || ['غير معروف', ''];
  return `<span class="status-badge ${cls}">${label}</span>`;
}

// ===== RENDER TABLES =====
function renderProductsTable() {
  const tbody = document.querySelector('#products-table tbody');
  if (!tbody) return;
  const prods = getProducts();
  tbody.innerHTML = prods.map(p => `
    <tr>
      <td><img src="${p.img}" class="td-img" alt="${p.name}"></td>
      <td class="td-name">${p.name}</td>
      <td>${p.category}</td>
      <td style="color:var(--orange);font-weight:700">${p.price} ر.س</td>
      <td>${p.stock || 0}</td>
      <td>${statusBadge(p.active !== false ? 'active' : 'inactive')}</td>
      <td>
        <div class="td-actions">
          <button class="action-btn" onclick="openEditModal(${p.id})" title="تعديل">✏️</button>
          <button class="action-btn del" onclick="deleteProduct(${p.id})" title="حذف">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable() {
  const tbody = document.querySelector('#orders-table tbody');
  if (!tbody) return;
  const orders = getOrders();
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td class="td-name">${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.phone}</td>
      <td>${o.city}</td>
      <td style="color:var(--orange);font-weight:700">${o.total} ر.س</td>
      <td>${o.date}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <div class="td-actions">
          <select onchange="updateOrderStatus('${o.id}',this.value)" style="background:var(--dark-3);border:1px solid var(--border-subtle);color:var(--text-primary);padding:6px 10px;border-radius:6px;font-size:12px;font-family:Montserrat,sans-serif;outline:none;">
            <option value="pending" ${o.status==='pending'?'selected':''}>معلق</option>
            <option value="processing" ${o.status==='processing'?'selected':''}>قيد التجهيز</option>
            <option value="delivered" ${o.status==='delivered'?'selected':''}>تم التوصيل</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>ملغي</option>
          </select>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== PRODUCT MODAL =====
function openAddModal() {
  const modal = document.querySelector('#product-modal');
  if (!modal) return;
  document.querySelector('#modal-title').textContent = 'إضافة منتج جديد';
  document.querySelector('#product-form').reset();
  document.querySelector('#product-id').value = '';
  document.querySelector('#img-previews').innerHTML = '';
  modal.classList.add('open');
}

function openEditModal(id) {
  const prods = getProducts();
  const p = prods.find(p => p.id === id);
  if (!p) return;
  const modal = document.querySelector('#product-modal');
  if (!modal) return;
  document.querySelector('#modal-title').textContent = 'تعديل المنتج';
  document.querySelector('#product-id').value = p.id;
  document.querySelector('#product-name').value = p.name;
  document.querySelector('#product-category').value = p.category;
  document.querySelector('#product-price').value = p.price;
  document.querySelector('#product-stock').value = p.stock || 0;
  document.querySelector('#product-desc').value = p.desc;
  document.querySelector('#product-notes').value = p.notes || '';
  document.querySelector('#product-sizes').value = (p.sizes || []).join(',');
  const previews = document.querySelector('#img-previews');
  previews.innerHTML = p.imgs ? p.imgs.map((img, i) => `
    <div class="img-preview">
      <img src="${img}" alt="">
      <button class="img-remove" onclick="this.parentElement.remove()">×</button>
    </div>`).join('') : '';
  modal.classList.add('open');
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

function saveProduct() {
  const id = document.querySelector('#product-id').value;
  const prods = getProducts();
  const imgPreviews = Array.from(document.querySelectorAll('#img-previews .img-preview img')).map(img => img.src);
  const imgUrl = document.querySelector('#product-img-url').value;
  if (imgUrl) imgPreviews.unshift(imgUrl);
  
  const data = {
    id: id ? parseInt(id) : Date.now(),
    name: document.querySelector('#product-name').value,
    category: document.querySelector('#product-category').value,
    price: parseFloat(document.querySelector('#product-price').value),
    stock: parseInt(document.querySelector('#product-stock').value),
    desc: document.querySelector('#product-desc').value,
    notes: document.querySelector('#product-notes').value,
    sizes: document.querySelector('#product-sizes').value.split(',').map(s => s.trim()).filter(Boolean),
    img: imgPreviews[0] || 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop',
    imgs: imgPreviews.length ? imgPreviews : ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop'],
    badge: document.querySelector('#product-badge').value || null,
    active: true,
    featured: false
  };

  if (!data.name || !data.price) { showAdminToast('يرجى ملء الحقول المطلوبة', 'error'); return; }

  if (id) {
    const idx = prods.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) prods[idx] = { ...prods[idx], ...data };
  } else {
    prods.unshift(data);
  }

  saveProducts(prods);
  renderProductsTable();
  closeModal();
  showAdminToast(id ? 'تم تحديث المنتج بنجاح' : 'تمت إضافة المنتج بنجاح', 'success');
}

// ===== SETTINGS =====
function loadSettings() {
  const s = JSON.parse(localStorage.getItem('store_settings') || '{}');
  const form = document.querySelector('#settings-form');
  if (!form) return;
  ['store-name', 'store-desc', 'store-phone', 'store-email', 'store-city', 'delivery-time', 'min-order'].forEach(id => {
    const el = document.querySelector(`#${id}`);
    if (el && s[id]) el.value = s[id];
  });
  document.querySelectorAll('.toggle input').forEach(input => {
    const key = input.dataset.key;
    if (key && s[key] !== undefined) input.checked = s[key];
  });
}

function saveSettings() {
  const s = {};
  ['store-name', 'store-desc', 'store-phone', 'store-email', 'store-city', 'delivery-time', 'min-order'].forEach(id => {
    const el = document.querySelector(`#${id}`);
    if (el) s[id] = el.value;
  });
  document.querySelectorAll('.toggle input').forEach(input => {
    if (input.dataset.key) s[input.dataset.key] = input.checked;
  });
  localStorage.setItem('store_settings', JSON.stringify(s));
  showAdminToast('تم حفظ الإعدادات بنجاح', 'success');
}

// ===== SIDEBAR MOBILE =====
function initAdminSidebar() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

// ===== SEARCH FILTER =====
function initTableSearch() {
  const searchInput = document.querySelector('.search-input');
  const table = document.querySelector('table');
  if (!searchInput || !table) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ===== STATS DASHBOARD =====
function renderDashboardStats() {
  const orders = getOrders();
  const prods = getProducts();
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const el = (id, val) => { const e = document.querySelector(`#${id}`); if (e) e.textContent = val; };
  el('stat-revenue', totalRevenue.toLocaleString('ar-SA') + ' ر.س');
  el('stat-orders', orders.length);
  el('stat-products', prods.length);
  el('stat-pending', pendingOrders);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Login page
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.querySelector('#username').value;
      const pass = document.querySelector('#password').value;
      const err = document.querySelector('.login-error');
      if (!login(user, pass)) {
        if (err) { err.style.display = 'block'; err.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة'; }
      }
    });
    return;
  }

  // Protected pages
  if (!checkAuth()) return;

  initAdminSidebar();
  renderProductsTable();
  renderOrdersTable();
  renderDashboardStats();
  loadSettings();
  initTableSearch();

  // Logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Modal close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  });

  // Settings save
  const settingsBtn = document.querySelector('#save-settings');
  if (settingsBtn) settingsBtn.addEventListener('click', saveSettings);

  // Add product btn
  const addBtn = document.querySelector('#add-product-btn');
  if (addBtn) addBtn.addEventListener('click', openAddModal);

  // Save product
  const saveBtn = document.querySelector('#save-product-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveProduct);

  // Image URL preview
  const imgUrl = document.querySelector('#product-img-url');
  if (imgUrl) {
    imgUrl.addEventListener('input', () => {
      const url = imgUrl.value.trim();
      if (url) {
        const previews = document.querySelector('#img-previews');
        const existing = previews.querySelector('[data-url]');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'img-preview';
        div.dataset.url = url;
        div.innerHTML = `<img src="${url}" alt="" onerror="this.src='https://via.placeholder.com/80'"><button class="img-remove" onclick="this.parentElement.remove()">×</button>`;
        previews.appendChild(div);
      }
    });
  }
});
