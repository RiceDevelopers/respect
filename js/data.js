// =========================================
// Gift Star - Data Store
// =========================================

// Default data
const defaultProducts = [
  {
    id: 1,
    name: "كيك الفراولة الفاخر",
    category: "cakes",
    price: 12.500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
    description: "كيك فراولة طازجة بكريمة الشانتيه الفرنسية الفاخرة، مناسب لجميع المناسبات",
    badge: "الأكثر مبيعاً",
    featured: true,
    stock: 20,
    active: true
  },
  {
    id: 2,
    name: "باقة ورد حمراء كلاسيكية",
    category: "flowers",
    price: 8.750,
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop",
    description: "24 وردة حمراء طازجة مع شريط ساتان فاخر وبطاقة إهداء مجانية",
    badge: "جديد",
    featured: true,
    stock: 30,
    active: true
  },
  {
    id: 3,
    name: "صندوق هدايا فاخر",
    category: "gifts",
    price: 22.000,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    description: "صندوق هدايا مميز يحتوي على شوكولاتة وعطر وإكسسوارات راقية، تغليف فاخر",
    badge: "حصري",
    featured: true,
    stock: 15,
    active: true
  },
  {
    id: 4,
    name: "كيك الشوكولاتة البلجيكية",
    category: "cakes",
    price: 15.000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    description: "كيك شوكولاتة بلجيكية داكنة بطبقات الكريمة والكراميل، تحفة فنية حلوة",
    badge: null,
    featured: true,
    stock: 10,
    active: true
  },
  {
    id: 5,
    name: "باقة ورد مختلطة",
    category: "flowers",
    price: 11.250,
    image: "https://images.unsplash.com/photo-1487530811015-780780a537b3?w=400&h=400&fit=crop",
    description: "باقة ورد مختلطة الألوان مع خضرة طازجة في تنسيق احترافي",
    badge: null,
    featured: false,
    stock: 25,
    active: true
  },
  {
    id: 6,
    name: "شوكولاتة جوديفا المختارة",
    category: "chocolate",
    price: 18.500,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
    description: "تشكيلة شوكولاتة جوديفا الفاخرة في علبة هدايا مميزة 24 قطعة",
    badge: "هدية مميزة",
    featured: false,
    stock: 18,
    active: true
  },
  {
    id: 7,
    name: "كيك التوت البري",
    category: "cakes",
    price: 14.000,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    description: "كيك طازج بكريمة التوت البري وزينة الفواكه المقطفة يومياً",
    badge: null,
    featured: false,
    stock: 12,
    active: true
  },
  {
    id: 8,
    name: "طقم هدايا عيد الزواج",
    category: "gifts",
    price: 35.000,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop",
    description: "طقم هدايا فاخر لعيد الزواج يشمل شموع وعطور وبطاقة تهنئة خاصة",
    badge: "مميز",
    featured: false,
    stock: 8,
    active: true
  }
];

const defaultPromos = [
  {
    id: 1,
    title: "خصم 20% على جميع الكيك",
    description: "طوال شهر رمضان المبارك",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=300&fit=crop",
    badge: "رمضان كريم",
    active: true
  },
  {
    id: 2,
    title: "باقة ورد + كيك بسعر مميز",
    description: "احتفلوا معنا بأجمل المناسبات",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=300&fit=crop",
    badge: "عرض خاص",
    active: true
  },
  {
    id: 3,
    title: "توصيل مجاني فوق 15 د.ك",
    description: "لجميع مناطق الكويت",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=300&fit=crop",
    badge: "توصيل مجاني",
    active: true
  }
];

const defaultPaymentMethods = [
  {
    id: 1,
    name: "بطاقة ائتمانية / مدين",
    description: "Visa, Mastercard",
    icon: "card",
    active: true
  },
  {
    id: 2,
    name: "KNET",
    description: "البوابة الإلكترونية الكويتية",
    icon: "knet",
    active: false
  },
  {
    id: 3,
    name: "تحويل بنكي",
    description: "IBAN: KW91NBOK0000000000001000372151",
    icon: "bank",
    active: true
  },
  {
    id: 4,
    name: "نقداً عند الاستلام",
    description: "الدفع لمندوب التوصيل",
    icon: "cash",
    active: true
  }
];

// =========================================
// Storage helpers
// =========================================
function getData(key, fallback) {
  try {
    const v = localStorage.getItem('giftstar_' + key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function setData(key, value) {
  localStorage.setItem('giftstar_' + key, JSON.stringify(value));
}

// Initialize default data if not exists
function initData() {
  if (!localStorage.getItem('giftstar_products')) {
    setData('products', defaultProducts);
  }
  if (!localStorage.getItem('giftstar_promos')) {
    setData('promos', defaultPromos);
  }
  if (!localStorage.getItem('giftstar_payment_methods')) {
    setData('payment_methods', defaultPaymentMethods);
  }
  if (!localStorage.getItem('giftstar_orders')) {
    setData('orders', []);
  }
  // Always ensure admin user exists
  const existingUsers = getData('users', []);
  const adminExists = existingUsers.find(u => u.email === 'admin@giftstar.kw');
  if (!adminExists) {
    existingUsers.unshift({
      id: 1,
      name: "مدير المتجر",
      email: "admin@giftstar.kw",
      password: "Admin@2024",
      role: "admin",
      verified: true
    });
    setData('users', existingUsers);
  }
}

// =========================================
// Cart
// =========================================
function getCart() { return getData('cart', []); }
function saveCart(cart) { setData('cart', cart); }

function addToCart(productId, qty = 1) {
  const products = getData('products', defaultProducts);
  const product = products.find(p => p.id === productId);
  if (!product) return false;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty, name: product.name, price: product.price, image: product.image });
  }
  saveCart(cart);
  updateCartBadge();
  return true;
}

function removeFromCart(productId) {
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
}

function getCartTotal() {
  return getCart().reduce((s, i) => s + (i.price * i.qty), 0);
}

// =========================================
// Auth
// =========================================
function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem('giftstar_user'));
  } catch { return null; }
}

function login(email, password) {
  const users = getData('users', []);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  if (!user.verified) return { success: false, error: 'يرجى تفعيل حسابك أولاً' };
  sessionStorage.setItem('giftstar_user', JSON.stringify(user));
  return { success: true, user };
}

function logout() {
  sessionStorage.removeItem('giftstar_user');
  window.location.href = 'index.html';
}

function register(name, email, password) {
  const users = getData('users', []);
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = {
    id: Date.now(),
    name, email, password,
    role: 'customer',
    verified: false,
    verifyCode: code
  };
  users.push(user);
  setData('users', users);
  // Simulate sending code
  sessionStorage.setItem('giftstar_pending_verify', JSON.stringify({ email, code }));
  console.log('Verification code:', code); // In real app this would be emailed
  return { success: true, code }; // Return code for demo
}

function verifyCode(email, inputCode) {
  const pending = JSON.parse(sessionStorage.getItem('giftstar_pending_verify') || '{}');
  if (pending.email !== email) return false;
  if (pending.code !== inputCode) return false;
  const users = getData('users', []);
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return false;
  users[idx].verified = true;
  delete users[idx].verifyCode;
  setData('users', users);
  sessionStorage.removeItem('giftstar_pending_verify');
  sessionStorage.setItem('giftstar_user', JSON.stringify(users[idx]));
  return true;
}

function updateHeader() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!loginBtn) return;
  if (user) {
    loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
  updateCartBadge();
}

// =========================================
// Orders
// =========================================
function createOrder(orderData) {
  const orders = getData('orders', []);
  const order = {
    id: 'GS' + Date.now(),
    ...orderData,
    date: new Date().toLocaleDateString('ar-KW'),
    time: new Date().toLocaleTimeString('ar-KW'),
    status: 'جديد'
  };
  orders.unshift(order);
  setData('orders', orders);
  saveCart([]);
  return order;
}

// =========================================
// Format currency
// =========================================
function formatKWD(amount) {
  return amount.toFixed(3) + ' د.ك';
}

// =========================================
// Notification helper
// =========================================
function showNotification(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'notification ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ============================================
// Get Current User
// ============================================
function getCurrentUser() {
  try {
    const userStr = sessionStorage.getItem('giftstar_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
}

// Init
initData();
