// =========================================
// Gift Star - Data Store (النسخة المحسّنة النهائية)
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
    price: 15.000,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop",
    description: "صندوق هدايا فاخر يحتوي على شوكولاتة بلجيكية وعطر صغير وبطاقة تهنئة",
    badge: "هدية مثالية",
    featured: true,
    stock: 15,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "كيك الشوكولاتة الفاخرة",
    category: "cakes",
    price: 14.250,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    description: "كيك شوكولاتة بلجيكية مع طبقة غاناش فاخرة وحبات التوت",
    badge: null,
    featured: true,
    stock: 18,
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
    name: "كيك الفستق الحلبي",
    category: "cakes",
    price: 16.500,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop",
    description: "كيك الفستق الحلبي الفاخر مع طبقات كريمة مخملية",
    badge: "خاص",
    featured: true,
    stock: 12,
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
  },
  {
    id: 3,
    title: "توصيل مجاني",
    description: "للطلبات فوق 15 د.ك",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=300&fit=crop",
    badge: "شحن مجاني",
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
    description: "تحويل بنكي مباشر",
    icon: "bank",
    active: true
  },
  {
    id: 4,
    name: "نقداً عند الاستلام",
    description: "الدفع عند الاستلام",
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
// دوال التخزين الأساسية المحسّنة
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

// تهيئة البيانات المحسّنة
function initData() {
  console.log('تهيئة البيانات...');
  
  if (!localStorage.getItem('giftstar_products')) {
    setItem('products', defaultProducts);
    console.log('تم إنشاء المنتجات الافتراضية');
  }
  
  if (!localStorage.getItem('giftstar_promos')) {
    setItem('promos', defaultPromos);
    console.log('تم إنشاء العروض الافتراضية');
  }
  
  if (!localStorage.getItem('giftstar_payment_methods')) {
    setItem('payment_methods', defaultPaymentMethods);
    console.log('تم إنشاء طرق الدفع الافتراضية');
  }
  
  if (!localStorage.getItem('giftstar_orders')) {
    setItem('orders', []);
    console.log('تم إنشاء قائمة الطلبات');
  }
  
  // التأكد من وجود حساب المدير
  const users = getItem('users', []);
  const adminExists = users.find(u => u.email === 'admin@giftstar.kw');
  
  if (!adminExists) {
    users.unshift({
      id: Date.now(),
      name: "مدير المتجر",
      email: "admin@giftstar.kw",
      password: "Admin@2024",
      role: "admin",
      verified: true,
      createdAt: new Date().toISOString(),
      phone: "51234567"
    });
    setItem('users', users);
    console.log('تم إنشاء حساب المدير');
  }
  
  // إضافة بعض المستخدمين التجريبيين إذا لم يكن هناك مستخدمين
  if (users.length <= 1) {
    users.push({
      id: Date.now() + 1,
      name: "أحمد محمد",
      email: "ahmed@test.com",
      password: "12345678",
      role: "customer",
      verified: true,
      createdAt: new Date().toISOString(),
      phone: "51234568"
    });
    setItem('users', users);
    console.log('تم إنشاء مستخدم تجريبي');
  }
  
  console.log('تم تهيئة البيانات بنجاح');
  return true;
}

// =========================================
// نظام المستخدمين المحسّن
// =========================================
function getCurrentUser() {
  try {
    const user = sessionStorage.getItem('giftstar_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('خطأ في جلب المستخدم الحالي:', e);
    return null;
  }
}

function login(email, password) {
  console.log('محاولة تسجيل الدخول:', email);
  const users = getItem('users', []);
  console.log('جميع المستخدمين:', users);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('فشل تسجيل الدخول: بيانات غير صحيحة');
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
  
  if (!user.verified) {
    return { success: false, error: 'يرجى تفعيل حسابك أولاً' };
  }
  
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'customer',
    phone: user.phone || ''
  };
  
  sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
  console.log('تم تسجيل الدخول بنجاح:', sessionUser);
  
  // تحديث عداد السلة بعد تسجيل الدخول
  setTimeout(() => updateCartBadge(), 100);
  
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
  
  console.log('تم إنشاء حساب جديد:', email);
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

// تحديث الهيدر
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
// نظام السلة المحسّن
// =========================================
function getCart() {
  const user = getCurrentUser();
  try {
    if (user) {
      const cart = localStorage.getItem('giftstar_cart_' + user.id);
      return cart ? JSON.parse(cart) : [];
    }
    return JSON.parse(localStorage.getItem('giftstar_cart') || '[]');
  } catch (e) {
    console.error('خطأ في جلب السلة:', e);
    return [];
  }
}

function saveCart(cart) {
  const user = getCurrentUser();
  try {
    if (user) {
      localStorage.setItem('giftstar_cart_' + user.id, JSON.stringify(cart));
    } else {
      localStorage.setItem('giftstar_cart', JSON.stringify(cart));
    }
    updateCartBadge();
    return true;
  } catch (e) {
    console.error('خطأ في حفظ السلة:', e);
    return false;
  }
}

function addToCart(productId, qty = 1) {
  const user = getCurrentUser();
  if (!user) {
    sessionStorage.setItem('giftstar_redirect_after_login', window.location.href);
    window.location.href = 'login.html?msg=login_required';
    return false;
  }

  const products = getItem('products', defaultProducts);
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error('المنتج غير موجود:', productId);
    return false;
  }

  let cart = getCart();
  const existing = cart.find(i => i.id === productId);
  
  if (existing) {
    existing.qty = (existing.qty || 1) + qty;
  } else {
    cart.push({
      id: productId,
      qty,
      name: product.name,
      price: product.price,
      image: product.image
    });
  }
  
  const saved = saveCart(cart);
  if (saved) {
    console.log('تمت إضافة المنتج للسلة:', product.name);
    // تشغيل حدث تحديث السلة
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  }
  return saved;
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  return cart;
}

function updateCartItemQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  }
  return cart;
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
}

function clearCart() {
  const user = getCurrentUser();
  if (user) {
    localStorage.removeItem('giftstar_cart_' + user.id);
  } else {
    localStorage.removeItem('giftstar_cart');
  }
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
}

function updateCartBadge() {
  try {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
      if (el) {
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';
      }
    });
  } catch (e) {
    console.error('خطأ في تحديث عداد السلة:', e);
  }
}

// =========================================
// نظام الطلبات المحسّن
// =========================================
function createOrder(orderData) {
  const orders = getItem('orders', []);
  const user = getCurrentUser();
  
  // التحقق من صحة البيانات
  if (!orderData.customer || !orderData.items || !orderData.items.length) {
    console.error('بيانات الطلب غير مكتملة');
    return null;
  }
  
  const order = {
    id: 'GS' + Date.now() + '-' + Math.floor(Math.random() * 10000),
    ...orderData,
    userId: user ? user.id : null,
    userEmail: user ? user.email : orderData.customer.email || null,
    date: new Date().toLocaleDateString('ar-KW'),
    time: new Date().toLocaleTimeString('ar-KW'),
    status: 'new',
    statusHistory: [
      {
        status: 'new',
        date: new Date().toISOString(),
        note: 'تم استلام الطلب بنجاح'
      }
    ],
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  };
  
  orders.unshift(order);
  setItem('orders', orders);
  
  // حفظ نسخ احتياطية
  localStorage.setItem('giftstar_last_order', JSON.stringify(order));
  sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
  
  console.log('تم إنشاء الطلب:', order.id);
  
  // تفريغ السلة بعد إنشاء الطلب
  clearCart();
  
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
  if (!email) return [];
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
    note: note || `تم تحديث الحالة إلى ${newStatus}`
  });
  
  setItem('orders', orders);
  console.log('تم تحديث حالة الطلب:', orderId, newStatus);
  return true;
}

// =========================================
// نظام المنتجات المحسّن
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
  } else {
    // افتراضياً، نعرض المنتجات النشطة فقط
    products = products.filter(p => p.active !== false);
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
  return products.find(p => p.id === parseInt(id) || p.id === id);
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
    products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
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
  return getItem('promos', defaultPromos).filter(p => p.active !== false);
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
  return getItem('users', []).map(u => {
    // إخفاء كلمات المرور
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

function getUserById(id) {
  const users = getItem('users', []);
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

// =========================================
// الإحصائيات المحسّنة
// =========================================
function getDashboardStats() {
  const orders = getItem('orders', []);
  const products = getItem('products', defaultProducts);
  const users = getItem('users', []);
  
  const today = new Date().toLocaleDateString('ar-KW');
  const todayOrders = orders.filter(o => o.date === today);
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  // إحصائيات إضافية
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  
  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    pendingOrders,
    completedOrders,
    totalProducts: products.filter(p => p.active).length,
    totalUsers: users.filter(u => u.role === 'customer').length,
    totalRevenue,
    todayRevenue,
    averageOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(3) : 0
  };
}

// =========================================
// دوال مساعدة محسّنة
// =========================================
function formatKWD(amount) {
  try {
    return Number(amount || 0).toFixed(3) + ' د.ك';
  } catch (e) {
    return '0.000 د.ك';
  }
}

function showNotification(msg, type = 'success', duration = 3000) {
  // إزالة الإشعارات السابقة
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  
  const el = document.createElement('div');
  el.className = 'notification ' + type;
  el.textContent = msg;
  el.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? 'rgba(94,201,138,0.95)' : 'rgba(224,85,85,0.95)'};
    color: white;
    padding: 12px 30px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(el);
  
  setTimeout(() => {
    el.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// إضافة الأنيميشن للإشعارات
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
`;
document.head.appendChild(style);

// =========================================
// تصدير الدوال إلى window
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
  updateHeader,
  
  // السلة
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateCartItemQty,
  getCartTotal,
  getCartCount,
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

// =========================================
// تهيئة وتشغيل النظام
// =========================================
function initializeApp() {
  console.log('بدء تشغيل نظام Gift Star...');
  
  // تهيئة البيانات
  initData();
  
  // تحديث الهيدر عند تحميل الصفحة
  updateHeader();
  
  // الاستماع لأحداث تحديث السلة
  window.addEventListener('cartUpdated', (e) => {
    console.log('تم تحديث السلة:', e.detail);
    updateCartBadge();
  });
  
  // تحديث السلة كل ثانية (للتأكد من المزامنة)
  setInterval(updateCartBadge, 1000);
  
  console.log('نظام Gift Star جاهز للعمل');
}

// تشغيل التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// تصدير الدوال العامة للاستخدام في الصفحات
window.getCurrentUser = getCurrentUser;
window.login = login;
window.logout = logout;
window.register = register;
window.verifyCode = verifyCode;
window.updateHeader = updateHeader;
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.getCartTotal = getCartTotal;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
window.createOrder = createOrder;
window.getAllOrders = getAllOrders;
window.getUserOrders = getUserOrders;
window.getUserOrdersByEmail = getUserOrdersByEmail;
window.getOrderById = getOrderById;
window.updateOrderStatus = updateOrderStatus;
window.getProducts = getProducts;
window.getProductById = getProductById;
window.formatKWD = formatKWD;
window.showNotification = showNotification;