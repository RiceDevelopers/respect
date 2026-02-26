// =========================================
// Gift Star - Data Store (نسخة مستقرة ومحسنة)
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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
    active: true,
    createdAt: new Date().toISOString()
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

const defaultUsers = [
  {
    id: 1,
    name: "مدير المتجر",
    email: "admin@giftstar.kw",
    password: "Admin@2024",
    role: "admin",
    verified: true,
    createdAt: new Date().toISOString(),
    phone: "51234567"
  }
];

// =========================================
// Storage helpers (localStorage)
// =========================================
function getData(key, fallback = []) {
  try {
    const data = localStorage.getItem('giftstar_' + key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return fallback;
  }
}

function setData(key, value) {
  try {
    localStorage.setItem('giftstar_' + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Error writing to localStorage:', e);
    return false;
  }
}

// Initialize default data if not exists
function initData() {
  console.log('Initializing data...');
  
  if (!localStorage.getItem('giftstar_products')) {
    console.log('Setting default products');
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
  const users = getData('users', []);
  const adminExists = users.find(u => u.email === 'admin@giftstar.kw');
  
  if (!adminExists) {
    users.unshift({
      id: 1,
      name: "مدير المتجر",
      email: "admin@giftstar.kw",
      password: "Admin@2024",
      role: "admin",
      verified: true,
      createdAt: new Date().toISOString(),
      phone: "51234567"
    });
    setData('users', users);
  }
  
  console.log('Data initialized successfully');
}

// =========================================
// Cart
// =========================================
function getCart() { 
  const user = getCurrentUser();
  if (user) {
    try {
      const cart = localStorage.getItem('giftstar_cart_' + user.id);
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error('Error getting user cart:', e);
      return [];
    }
  }
  return getData('cart', []); 
}

function saveCart(cart) { 
  const user = getCurrentUser();
  if (user) {
    try {
      localStorage.setItem('giftstar_cart_' + user.id, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving user cart:', e);
    }
  } else {
    setData('cart', cart); 
  }
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const products = getData('products', defaultProducts);
  const product = products.find(p => p.id === productId);
  if (!product) return false;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      qty,
      name: product.name,
      price: product.price,
      image: product.image
    });
  }
  
  saveCart(cart);
  return true;
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateCartBadge() {
  try {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + (i.qty || 0), 0);
    document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
      if (el) el.textContent = total;
    });
  } catch (e) {
    console.error('Error updating cart badge:', e);
  }
}

function getCartTotal() {
  try {
    return getCart().reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0);
  } catch (e) {
    console.error('Error calculating cart total:', e);
    return 0;
  }
}

function clearCart() {
  const user = getCurrentUser();
  if (user) {
    try {
      localStorage.removeItem('giftstar_cart_' + user.id);
    } catch (e) {
      console.error('Error clearing user cart:', e);
    }
  } else {
    setData('cart', []);
  }
  updateCartBadge();
}

// =========================================
// Auth
// =========================================
function getCurrentUser() {
  try {
    const userStr = sessionStorage.getItem('giftstar_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
}

function login(email, password) {
  console.log('Login attempt:', email, password);
  
  const users = getData('users', []);
  console.log('Users in storage:', users);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('User not found or password incorrect');
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
  
  if (!user.verified) {
    console.log('User not verified');
    return { success: false, error: 'يرجى تفعيل حسابك أولاً' };
  }
  
  // Create session object (without password)
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  };
  
  sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
  console.log('Login successful:', sessionUser);
  
  return { success: true, user: sessionUser };
}

function logout() {
  sessionStorage.removeItem('giftstar_user');
  window.location.href = 'index.html';
}

function register(name, email, password, phone = '') {
  const users = getData('users', []);
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    phone,
    role: 'customer',
    verified: false,
    verifyCode: code,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  setData('users', users);
  
  // Store verification code temporarily
  sessionStorage.setItem('giftstar_pending_verify', JSON.stringify({ email, code }));
  
  console.log('Registration successful, code:', code);
  return { success: true, code };
}

function verifyCode(email, inputCode) {
  const pending = JSON.parse(sessionStorage.getItem('giftstar_pending_verify') || '{}');
  
  if (pending.email !== email || pending.code !== inputCode) {
    return false;
  }
  
  const users = getData('users', []);
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) return false;
  
  users[userIndex].verified = true;
  delete users[userIndex].verifyCode;
  
  setData('users', users);
  sessionStorage.removeItem('giftstar_pending_verify');
  
  // Auto login
  const user = users[userIndex];
  sessionStorage.setItem('giftstar_user', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  }));
  
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
    id: 'GS' + Date.now() + Math.floor(Math.random() * 1000),
    ...orderData,
    date: new Date().toLocaleDateString('ar-KW'),
    time: new Date().toLocaleTimeString('ar-KW'),
    status: 'new',
    statusHistory: [
      {
        status: 'new',
        date: new Date().toISOString(),
        note: 'تم استلام الطلب'
      }
    ],
    lastUpdate: new Date().toISOString()
  };
  
  orders.unshift(order);
  setData('orders', orders);
  
  // Save in multiple places for backup
  try {
    localStorage.setItem('giftstar_last_order', JSON.stringify(order));
    sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
    
    // Save in simple localStorage too
    const simpleOrders = JSON.parse(localStorage.getItem('giftstar_orders') || '[]');
    simpleOrders.unshift(order);
    localStorage.setItem('giftstar_orders', JSON.stringify(simpleOrders));
  } catch (e) {
    console.error('Error saving order backup:', e);
  }
  
  // Add order to user
  const users = getData('users', []);
  const userIndex = users.findIndex(u => u.id === orderData.userId);
  if (userIndex !== -1) {
    if (!users[userIndex].orders) users[userIndex].orders = [];
    users[userIndex].orders.push(order.id);
    setData('users', users);
  }
  
  console.log('Order created and saved:', order.id);
  return order;
}

function getUserOrders(userId) {
  try {
    const orders = getData('orders', []);
    return orders.filter(order => order.userId === userId).sort((a, b) => 
      new Date(b.lastUpdate || 0) - new Date(a.lastUpdate || 0)
    );
  } catch (e) {
    console.error('Error getting user orders:', e);
    return [];
  }
}

function getUserOrdersByEmail(email) {
  try {
    const orders = getData('orders', []);
    return orders.filter(order => order.userEmail === email).sort((a, b) => 
      new Date(b.lastUpdate || 0) - new Date(a.lastUpdate || 0)
    );
  } catch (e) {
    console.error('Error getting user orders by email:', e);
    return [];
  }
}

function updateOrderStatus(orderId, newStatus, note = '') {
  try {
    const orders = getData('orders', []);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return false;
    
    orders[orderIndex].status = newStatus;
    orders[orderIndex].lastUpdate = new Date().toISOString();
    
    if (!orders[orderIndex].statusHistory) {
      orders[orderIndex].statusHistory = [];
    }
    
    orders[orderIndex].statusHistory.push({
      status: newStatus,
      date: new Date().toISOString(),
      note: note
    });
    
    setData('orders', orders);
    return true;
  } catch (e) {
    console.error('Error updating order status:', e);
    return false;
  }
}

// =========================================
// Products
// =========================================
function getProducts(filters = {}) {
  try {
    let products = getData('products', defaultProducts);
    
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.featured) {
      products = products.filter(p => p.featured);
    }
    
    if (filters.active !== undefined) {
      products = products.filter(p => p.active === filters.active);
    }
    
    return products;
  } catch (e) {
    console.error('Error getting products:', e);
    return [];
  }
}

function getProductById(id) {
  try {
    const products = getData('products', defaultProducts);
    return products.find(p => p.id === id);
  } catch (e) {
    console.error('Error getting product by id:', e);
    return null;
  }
}

function addProduct(product) {
  try {
    const products = getData('products', defaultProducts);
    product.id = Date.now();
    product.createdAt = new Date().toISOString();
    products.push(product);
    setData('products', products);
    return { success: true, id: product.id };
  } catch (e) {
    console.error('Error adding product:', e);
    return { success: false, error: e.message };
  }
}

function updateProduct(product) {
  try {
    const products = getData('products', defaultProducts);
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
      setData('products', products);
      return { success: true };
    }
    return { success: false, error: 'Product not found' };
  } catch (e) {
    console.error('Error updating product:', e);
    return { success: false, error: e.message };
  }
}

function deleteProduct(productId) {
  try {
    const products = getData('products', defaultProducts);
    const filtered = products.filter(p => p.id !== productId);
    setData('products', filtered);
    return { success: true };
  } catch (e) {
    console.error('Error deleting product:', e);
    return { success: false, error: e.message };
  }
}

// =========================================
// Dashboard Stats
// =========================================
function getDashboardStats() {
  try {
    const orders = getData('orders', []);
    const products = getData('products', defaultProducts);
    const users = getData('users', []);
    
    const today = new Date().toLocaleDateString('ar-KW');
    const todayOrders = orders.filter(o => o.date === today);
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalProducts: products.filter(p => p.active).length,
      totalUsers: users.filter(u => u.role === 'customer').length,
      totalRevenue,
      todayRevenue,
      averageOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(3) : 0
    };
  } catch (e) {
    console.error('Error getting dashboard stats:', e);
    return {
      totalOrders: 0,
      todayOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      averageOrderValue: 0
    };
  }
}

// =========================================
// Format currency
// =========================================
function formatKWD(amount) {
  try {
    return Number(amount || 0).toFixed(3) + ' د.ك';
  } catch (e) {
    console.error('Error formatting currency:', e);
    return '0.000 د.ك';
  }
}

// =========================================
// Notification helper
// =========================================
function showNotification(msg, type = 'success') {
  try {
    const el = document.createElement('div');
    el.className = 'notification ' + type;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  } catch (e) {
    console.error('Error showing notification:', e);
    alert(msg);
  }
}

// =========================================
// Export to window
// =========================================
window.giftstar = {
  // Data
  getData,
  setData,
  
  // Cart
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  updateCartBadge,
  
  // Auth
  getCurrentUser,
  login,
  logout,
  register,
  verifyCode,
  updateHeader,
  
  // Orders
  createOrder,
  getUserOrders,
  getUserOrdersByEmail,
  updateOrderStatus,
  
  // Products
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  
  // Stats
  getDashboardStats,
  
  // Utils
  formatKWD,
  showNotification
};

// Initialize
initData();

// Update header on load
document.addEventListener('DOMContentLoaded', () => {
  updateHeader();
  console.log('Gift Star Data System Ready');
});
