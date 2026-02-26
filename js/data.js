// =========================================
// Gift Star - Data Store (النسخة النهائية)
// =========================================

// البيانات الافتراضية
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
    name: "بطاقة ائتمانية",
    description: "Visa, Mastercard",
    icon: "card",
    active: true
  },
  {
    id: 2,
    name: "KNET",
    description: "الدفع الإلكتروني الكويتي",
    icon: "knet",
    active: true
  },
  {
    id: 3,
    name: "تحويل بنكي",
    description: "تحويل بنكي مباشر",
    icon: "bank",
    active: true
  },
  {
    id: 4,
    name: "نقداً عند الاستلام",
    description: "الدفع نقداً للمندوب",
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
// دوال التخزين الأساسية
// =========================================
function getItem(key, fallback = null) {
  try {
    const data = localStorage.getItem('giftstar_' + key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('خطأ في القراءة:', e);
    return fallback;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem('giftstar_' + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('خطأ في الحفظ:', e);
    return false;
  }
}

// تهيئة البيانات
function initData() {
  console.log('تهيئة البيانات...');
  
  if (!localStorage.getItem('giftstar_products')) {
    setItem('products', defaultProducts);
  }
  
  if (!localStorage.getItem('giftstar_promos')) {
    setItem('promos', defaultPromos);
  }
  
  if (!localStorage.getItem('giftstar_payment_methods')) {
    setItem('payment_methods', defaultPaymentMethods);
  }
  
  if (!localStorage.getItem('giftstar_orders')) {
    setItem('orders', []);
  }
  
  // التأكد من وجود حساب المدير
  const users = getItem('users', []);
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
    setItem('users', users);
  }
  
  console.log('تم تهيئة البيانات بنجاح');
}

// =========================================
// نظام المستخدمين
// =========================================
function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem('giftstar_user'));
  } catch {
    return null;
  }
}

function login(email, password) {
  const users = getItem('users', []);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
  
  if (!user.verified) {
    return { success: false, error: 'يرجى تفعيل حسابك أولاً' };
  }
  
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  };
  
  sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}

function logout() {
  sessionStorage.removeItem('giftstar_user');
  window.location.href = 'index.html';
}

function register(name, email, password, phone = '') {
  const users = getItem('users', []);
  
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
  setItem('users', users);
  sessionStorage.setItem('giftstar_pending_verify', JSON.stringify({ email, code }));
  
  return { success: true, code };
}

function verifyCode(email, inputCode) {
  const pending = JSON.parse(sessionStorage.getItem('giftstar_pending_verify') || '{}');
  
  if (pending.email !== email || pending.code !== inputCode) {
    return false;
  }
  
  const users = getItem('users', []);
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) return false;
  
  users[userIndex].verified = true;
  delete users[userIndex].verifyCode;
  
  setItem('users', users);
  sessionStorage.removeItem('giftstar_pending_verify');
  
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

// =========================================
// نظام السلة
// =========================================
function getCart() {
  const user = getCurrentUser();
  if (user) {
    const cart = localStorage.getItem('giftstar_cart_' + user.id);
    return cart ? JSON.parse(cart) : [];
  }
  return getItem('cart', []);
}

function saveCart(cart) {
  const user = getCurrentUser();
  if (user) {
    localStorage.setItem('giftstar_cart_' + user.id, JSON.stringify(cart));
  } else {
    setItem('cart', cart);
  }
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const products = getItem('products', defaultProducts);
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

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function clearCart() {
  const user = getCurrentUser();
  if (user) {
    localStorage.removeItem('giftstar_cart_' + user.id);
  } else {
    setItem('cart', []);
  }
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
    if (el) el.textContent = total;
  });
}

// =========================================
// نظام الطلبات
// =========================================
function createOrder(orderData) {
  const orders = getItem('orders', []);
  
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
  setItem('orders', orders);
  
  // حفظ نسخ احتياطية
  localStorage.setItem('giftstar_last_order', JSON.stringify(order));
  sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
  
  return order;
}

function getAllOrders() {
  return getItem('orders', []);
}

function getUserOrders(userId) {
  const orders = getItem('orders', []);
  return orders.filter(o => o.userId === userId);
}

function getUserOrdersByEmail(email) {
  const orders = getItem('orders', []);
  return orders.filter(o => o.userEmail === email);
}

function getOrderById(orderId) {
  const orders = getItem('orders', []);
  return orders.find(o => o.id === orderId);
}

function updateOrderStatus(orderId, newStatus, note = '') {
  const orders = getItem('orders', []);
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index === -1) return false;
  
  orders[index].status = newStatus;
  orders[index].lastUpdate = new Date().toISOString();
  
  if (!orders[index].statusHistory) {
    orders[index].statusHistory = [];
  }
  
  orders[index].statusHistory.push({
    status: newStatus,
    date: new Date().toISOString(),
    note: note
  });
  
  setItem('orders', orders);
  return true;
}

// =========================================
// نظام المنتجات
// =========================================
function getProducts(filters = {}) {
  let products = getItem('products', defaultProducts);
  
  if (filters.category && filters.category !== 'all') {
    products = products.filter(p => p.category === filters.category);
  }
  
  if (filters.featured) {
    products = products.filter(p => p.featured);
  }
  
  if (filters.active !== undefined) {
    products = products.filter(p => p.active === filters.active);
  }
  
  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }
  
  return products;
}

function getProductById(id) {
  const products = getItem('products', defaultProducts);
  return products.find(p => p.id === id);
}

function addProduct(product) {
  const products = getItem('products', defaultProducts);
  product.id = Date.now();
  product.createdAt = new Date().toISOString();
  products.push(product);
  setItem('products', products);
  return { success: true, id: product.id };
}

function updateProduct(product) {
  const products = getItem('products', defaultProducts);
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...product };
    setItem('products', products);
    return { success: true };
  }
  return { success: false };
}

function deleteProduct(productId) {
  const products = getItem('products', defaultProducts);
  const filtered = products.filter(p => p.id !== productId);
  setItem('products', filtered);
  return { success: true };
}

// =========================================
// نظام العروض
// =========================================
function getPromos() {
  return getItem('promos', defaultPromos);
}

function addPromo(promo) {
  const promos = getItem('promos', defaultPromos);
  promo.id = Date.now();
  promos.push(promo);
  setItem('promos', promos);
  return { success: true, id: promo.id };
}

function updatePromo(promo) {
  const promos = getItem('promos', defaultPromos);
  const index = promos.findIndex(p => p.id === promo.id);
  if (index !== -1) {
    promos[index] = { ...promos[index], ...promo };
    setItem('promos', promos);
    return { success: true };
  }
  return { success: false };
}

function deletePromo(promoId) {
  const promos = getItem('promos', defaultPromos);
  const filtered = promos.filter(p => p.id !== promoId);
  setItem('promos', filtered);
  return { success: true };
}

// =========================================
// نظام المستخدمين للإدارة
// =========================================
function getAllUsers() {
  return getItem('users', []);
}

function getUserById(id) {
  const users = getItem('users', []);
  return users.find(u => u.id === id);
}

// =========================================
// الإحصائيات
// =========================================
function getDashboardStats() {
  const orders = getItem('orders', []);
  const products = getItem('products', defaultProducts);
  const users = getItem('users', []);
  
  const today = new Date().toLocaleDateString('ar-KW');
  const todayOrders = orders.filter(o => o.date === today);
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    totalProducts: products.filter(p => p.active).length,
    totalUsers: users.filter(u => u.role === 'customer').length,
    totalRevenue,
    todayRevenue,
    averageOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(3) : 0
  };
}

// =========================================
// دوال مساعدة
// =========================================
function formatKWD(amount) {
  return Number(amount || 0).toFixed(3) + ' د.ك';
}

function showNotification(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'notification ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// =========================================
// تصدير الدوال
// =========================================
window.giftstar = {
  // التخزين
  getItem,
  setItem,
  
  // المستخدمين
  getCurrentUser,
  login,
  logout,
  register,
  verifyCode,
  
  // السلة
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  updateCartBadge,
  
  // الطلبات
  createOrder,
  getAllOrders,
  getUserOrders,
  getUserOrdersByEmail,
  getOrderById,
  updateOrderStatus,
  
  // المنتجات
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  
  // العروض
  getPromos,
  addPromo,
  updatePromo,
  deletePromo,
  
  // المستخدمين للإدارة
  getAllUsers,
  getUserById,
  
  // الإحصائيات
  getDashboardStats,
  
  // مساعدة
  formatKWD,
  showNotification
};

// تهيئة البيانات
initData();

// تحديث الهيدر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  console.log('نظام Gift Star جاهز');
});
