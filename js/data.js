// =========================================
// Gift Star - Data Store (نسخة متطورة)
// =========================================

// استخدام IndexedDB للتخزين المتقدم
let db;

// تهيئة قاعدة البيانات
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GiftStarDB', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // إنشاء الجداول
      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id' });
        usersStore.createIndex('email', 'email', { unique: true });
      }
      
      if (!db.objectStoreNames.contains('products')) {
        const productsStore = db.createObjectStore('products', { keyPath: 'id' });
        productsStore.createIndex('category', 'category');
      }
      
      if (!db.objectStoreNames.contains('orders')) {
        const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
        ordersStore.createIndex('userId', 'userId');
        ordersStore.createIndex('email', 'userEmail');
        ordersStore.createIndex('date', 'date');
      }
      
      if (!db.objectStoreNames.contains('promos')) {
        db.createObjectStore('promos', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('payment_methods')) {
        db.createObjectStore('payment_methods', { keyPath: 'id' });
      }
    };
  });
}

// تخزين البيانات الافتراضية
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
    phone: "96512345678"
  }
];

// تهيئة البيانات
async function initData() {
  try {
    await initDB();
    
    // التحقق من وجود المستخدمين
    const users = await getData('users');
    if (!users || users.length === 0) {
      await setData('users', defaultUsers);
    }
    
    // التحقق من وجود المنتجات
    const products = await getData('products');
    if (!products || products.length === 0) {
      await setData('products', defaultProducts);
    }
    
    // التحقق من وجود العروض
    const promos = await getData('promos');
    if (!promos || promos.length === 0) {
      await setData('promos', defaultPromos);
    }
    
    // التحقق من وجود طرق الدفع
    const payments = await getData('payment_methods');
    if (!payments || payments.length === 0) {
      await setData('payment_methods', defaultPaymentMethods);
    }
    
    // التحقق من وجود الطلبات
    const orders = await getData('orders');
    if (!orders) {
      await setData('orders', []);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// دالة مساعدة لجلب البيانات
async function getData(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve([]);
      return;
    }
    
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// دالة مساعدة لحفظ البيانات
async function setData(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // مسح البيانات القديمة
    store.clear().onsuccess = () => {
      // إضافة البيانات الجديدة
      if (Array.isArray(data)) {
        data.forEach(item => store.add(item));
      } else {
        store.add(data);
      }
    };
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// دالة لإضافة عنصر جديد
async function addItem(storeName, item) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// دالة لتحديث عنصر
async function updateItem(storeName, item) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// دالة لحذف عنصر
async function deleteItem(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// دالة لجلب عنصر بواسطة ID
async function getItemById(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }
    
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// دالة لجلب عناصر بواسطة index
async function getItemsByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve([]);
      return;
    }
    
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// =========================================
// نظام المستخدمين
// =========================================
async function register(name, email, password, phone = '') {
  try {
    const users = await getData('users');
    
    // التحقق من وجود البريد الإلكتروني
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
      createdAt: new Date().toISOString(),
      orders: []
    };
    
    users.push(newUser);
    await setData('users', users);
    
    // تخزين كود التحقق مؤقتاً
    sessionStorage.setItem('giftstar_pending_verify', JSON.stringify({ email, code }));
    
    return { success: true, code };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'حدث خطأ أثناء التسجيل' };
  }
}

async function login(email, password) {
  try {
    const users = await getData('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    
    if (!user.verified) {
      return { success: false, error: 'يرجى تفعيل حسابك أولاً' };
    }
    
    // تخزين جلسة المستخدم
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    
    sessionStorage.setItem('giftstar_user', JSON.stringify(userSession));
    localStorage.setItem('giftstar_user_' + user.id, JSON.stringify(userSession));
    
    return { success: true, user: userSession };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}

function logout() {
  const user = getCurrentUser();
  if (user) {
    localStorage.removeItem('giftstar_user_' + user.id);
  }
  sessionStorage.removeItem('giftstar_user');
  window.location.href = 'index.html';
}

function getCurrentUser() {
  try {
    const userStr = sessionStorage.getItem('giftstar_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

async function verifyCode(email, inputCode) {
  try {
    const pending = JSON.parse(sessionStorage.getItem('giftstar_pending_verify') || '{}');
    if (pending.email !== email || pending.code !== inputCode) {
      return false;
    }
    
    const users = await getData('users');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) return false;
    
    users[userIndex].verified = true;
    delete users[userIndex].verifyCode;
    
    await setData('users', users);
    sessionStorage.removeItem('giftstar_pending_verify');
    
    // تسجيل الدخول تلقائياً
    const user = users[userIndex];
    sessionStorage.setItem('giftstar_user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }));
    
    return true;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

// =========================================
// نظام الطلبات
// =========================================
async function createOrder(orderData) {
  try {
    const orders = await getData('orders') || [];
    
    const order = {
      id: 'GS' + Date.now() + Math.floor(Math.random() * 1000),
      ...orderData,
      date: new Date().toLocaleDateString('ar-KW'),
      time: new Date().toLocaleTimeString('ar-KW'),
      status: 'جديد',
      statusHistory: [
        {
          status: 'جديد',
          date: new Date().toISOString(),
          note: 'تم استلام الطلب'
        }
      ],
      lastUpdate: new Date().toISOString()
    };
    
    orders.unshift(order);
    await setData('orders', orders);
    
    // حفظ في localStorage للنسخ الاحتياطي
    localStorage.setItem('giftstar_last_order', JSON.stringify(order));
    
    // إضافة الطلب للمستخدم
    const users = await getData('users');
    const userIndex = users.findIndex(u => u.id === orderData.userId);
    if (userIndex !== -1) {
      if (!users[userIndex].orders) users[userIndex].orders = [];
      users[userIndex].orders.push(order.id);
      await setData('users', users);
    }
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

async function getUserOrders(userId) {
  try {
    const orders = await getData('orders');
    return orders.filter(order => order.userId === userId).sort((a, b) => 
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

async function getUserOrdersByEmail(email) {
  try {
    const orders = await getData('orders');
    return orders.filter(order => order.userEmail === email).sort((a, b) => 
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );
  } catch (error) {
    console.error('Error getting user orders by email:', error);
    return [];
  }
}

async function updateOrderStatus(orderId, newStatus, note = '') {
  try {
    const orders = await getData('orders');
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
    
    await setData('orders', orders);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
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
  return JSON.parse(localStorage.getItem('giftstar_cart') || '[]');
}

function saveCart(cart) {
  const user = getCurrentUser();
  if (user) {
    localStorage.setItem('giftstar_cart_' + user.id, JSON.stringify(cart));
  } else {
    localStorage.setItem('giftstar_cart', JSON.stringify(cart));
  }
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const products = JSON.parse(localStorage.getItem('giftstar_products') || '[]');
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
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
  });
}

function getCartTotal() {
  return getCart().reduce((s, i) => s + (i.price * i.qty), 0);
}

function clearCart() {
  const user = getCurrentUser();
  if (user) {
    localStorage.removeItem('giftstar_cart_' + user.id);
  } else {
    localStorage.removeItem('giftstar_cart');
  }
  updateCartBadge();
}

// =========================================
// نظام المنتجات
// =========================================
async function getProducts(filters = {}) {
  let products = await getData('products') || [];
  
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
}

async function addProduct(product) {
  try {
    const products = await getData('products') || [];
    product.id = Date.now();
    product.createdAt = new Date().toISOString();
    products.push(product);
    await setData('products', products);
    return { success: true, id: product.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
}

async function updateProduct(product) {
  try {
    const products = await getData('products') || [];
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
      await setData('products', products);
      return { success: true };
    }
    return { success: false, error: 'Product not found' };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

async function deleteProduct(productId) {
  try {
    const products = await getData('products') || [];
    const filtered = products.filter(p => p.id !== productId);
    await setData('products', filtered);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

// =========================================
// نظام الإحصائيات
// =========================================
async function getDashboardStats() {
  try {
    const orders = await getData('orders') || [];
    const products = await getData('products') || [];
    const users = await getData('users') || [];
    
    const today = new Date().toLocaleDateString('ar-KW');
    const todayOrders = orders.filter(o => o.date === today);
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const recentOrders = orders.filter(o => new Date(o.lastUpdate) > lastMonth);
    
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalProducts: products.filter(p => p.active).length,
      totalUsers: users.filter(u => u.role === 'customer').length,
      totalRevenue,
      todayRevenue,
      recentOrders: recentOrders.length,
      averageOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(3) : 0
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalOrders: 0,
      todayOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      recentOrders: 0,
      averageOrderValue: 0
    };
  }
}

// =========================================
// دوال مساعدة
// =========================================
function formatKWD(amount) {
  return amount.toFixed(3) + ' د.ك';
}

function showNotification(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'notification ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// تصدير الدوال
window.giftstar = {
  initData,
  getData,
  setData,
  addItem,
  updateItem,
  deleteItem,
  getItemById,
  getItemsByIndex,
  register,
  login,
  logout,
  getCurrentUser,
  verifyCode,
  createOrder,
  getUserOrders,
  getUserOrdersByEmail,
  updateOrderStatus,
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  getCartTotal,
  clearCart,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  formatKWD,
  showNotification
};

// تهيئة البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initData().then(() => {
    console.log('Gift Star Data System Ready');
    updateCartBadge();
  });
});
