// =========================================
// Gift Star - Data Store (النسخة النهائية المتكاملة)
// =========================================

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

// =========================================
// تهيئة البيانات
// =========================================
function initData() {
    console.log('تهيئة البيانات...');
    
    // التحقق من وجود المستخدمين
    let users = getItem('users', []);
    if (users.length === 0) {
        // إنشاء حساب المدير
        users.push({
            id: 1,
            name: "مدير المتجر",
            email: "admin@giftstar.kw",
            password: "Admin@2024",
            role: "admin",
            verified: true,
            createdAt: new Date().toISOString(),
            phone: "51234567"
        });
        
        // إنشاء مستخدم تجريبي
        users.push({
            id: 2,
            name: "أحمد محمد",
            email: "ahmed@test.com",
            password: "12345678",
            role: "customer",
            verified: true,
            createdAt: new Date().toISOString(),
            phone: "51234568"
        });
        
        setItem('users', users);
        console.log('تم إنشاء المستخدمين');
    }
    
    // التحقق من وجود المنتجات
    let products = getItem('products', []);
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "كيك الفراولة الفاخر",
                category: "cakes",
                price: 12.500,
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
                description: "كيك فراولة طازجة بكريمة الشانتيه الفرنسية",
                badge: "الأكثر مبيعاً",
                featured: true,
                stock: 20,
                active: true
            },
            {
                id: 2,
                name: "باقة ورد حمراء",
                category: "flowers",
                price: 8.750,
                image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop",
                description: "24 وردة حمراء طازجة",
                badge: "جديد",
                featured: true,
                stock: 30,
                active: true
            },
            {
                id: 3,
                name: "صندوق هدايا فاخر",
                category: "gifts",
                price: 15.000,
                image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop",
                description: "صندوق هدايا فاخر مع شوكولاتة بلجيكية",
                badge: "هدية مثالية",
                featured: true,
                stock: 15,
                active: true
            }
        ];
        setItem('products', products);
        console.log('تم إنشاء المنتجات');
    }
    
    // التحقق من وجود الطلبات
    let orders = getItem('orders', []);
    if (orders.length === 0) {
        setItem('orders', []);
        console.log('تم إنشاء قائمة الطلبات');
    }
    
    // التحقق من وجود العروض
    let promos = getItem('promos', []);
    if (promos.length === 0) {
        promos = [
            {
                id: 1,
                title: "خصم 20% على جميع الكيك",
                description: "عرض خاص لفترة محدودة",
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=300&fit=crop",
                badge: "عرض",
                active: true
            }
        ];
        setItem('promos', promos);
        console.log('تم إنشاء العروض');
    }
    
    console.log('تم تهيئة البيانات بنجاح');
}

// =========================================
// نظام المستخدمين
// =========================================
function getCurrentUser() {
    try {
        const userStr = sessionStorage.getItem('giftstar_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error('خطأ في جلب المستخدم:', e);
        return null;
    }
}

function login(email, password) {
    console.log('محاولة تسجيل الدخول:', email);
    
    const users = getItem('users', []);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    
    if (!user.verified) {
        return { success: false, error: 'الحساب غير مفعل' };
    }
    
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
    };
    
    sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
    
    // تحديث السلة بعد تسجيل الدخول
    migrateCart();
    
    return { success: true, user: sessionUser };
}

function logout() {
    sessionStorage.removeItem('giftstar_user');
    window.location.href = 'index.html';
}

// =========================================
// نظام السلة المحسن
// =========================================
function getCart() {
    try {
        const user = getCurrentUser();
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
    try {
        const user = getCurrentUser();
        if (user) {
            localStorage.setItem('giftstar_cart_' + user.id, JSON.stringify(cart));
        } else {
            localStorage.setItem('giftstar_cart', JSON.stringify(cart));
        }
        
        // تحديث العداد في كل الصفحات
        updateCartBadge();
        
        // إرسال حدث تحديث السلة
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        
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
    
    const products = getItem('products', []);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('المنتج غير موجود');
        return false;
    }
    
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty = (existing.qty || 1) + qty;
    } else {
        cart.push({
            id: productId,
            qty: qty,
            name: product.name,
            price: product.price,
            image: product.image
        });
    }
    
    saveCart(cart);
    
    // تحديث الصفحات الأخرى
    broadcastCartUpdate(cart);
    
    return true;
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    broadcastCartUpdate(cart);
    return cart;
}

function updateCartItemQty(productId, qty) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty = Math.max(1, qty);
        saveCart(cart);
        broadcastCartUpdate(cart);
    }
    return cart;
}

function clearCart() {
    const user = getCurrentUser();
    if (user) {
        localStorage.removeItem('giftstar_cart_' + user.id);
    } else {
        localStorage.removeItem('giftstar_cart');
    }
    
    updateCartBadge();
    broadcastCartUpdate([]);
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
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

function broadcastCartUpdate(cart) {
    // تخزين آخر تحديث للرؤية بين الصفحات
    sessionStorage.setItem('giftstar_last_cart_update', Date.now().toString());
    sessionStorage.setItem('giftstar_last_cart', JSON.stringify(cart));
    
    // إرسال حدث
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
}

function migrateCart() {
    // نقل السلة من localStorage العام إلى سلة المستخدم
    const user = getCurrentUser();
    if (!user) return;
    
    const guestCart = JSON.parse(localStorage.getItem('giftstar_cart') || '[]');
    if (guestCart.length > 0) {
        let userCart = getCart();
        
        guestCart.forEach(guestItem => {
            const existing = userCart.find(item => item.id === guestItem.id);
            if (existing) {
                existing.qty += guestItem.qty;
            } else {
                userCart.push(guestItem);
            }
        });
        
        saveCart(userCart);
        localStorage.removeItem('giftstar_cart');
    }
}

// =========================================
// نظام الطلبات المحسن
// =========================================
function createOrder(orderData) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, error: 'يجب تسجيل الدخول أولاً' };
        }
        
        // قراءة الطلبات الموجودة
        let orders = getItem('orders', []);
        
        // إنشاء الطلب الجديد
        const order = {
            id: 'GS' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            ...orderData,
            userId: user.id,
            userEmail: user.email,
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
        
        // إضافة الطلب للقائمة
        orders.unshift(order);
        
        // حفظ الطلبات
        const saved = setItem('orders', orders);
        
        if (!saved) {
            return { success: false, error: 'فشل في حفظ الطلب' };
        }
        
        // حفظ نسخ احتياطية للوصول السريع
        localStorage.setItem('giftstar_last_order', JSON.stringify(order));
        sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
        
        // تحديث إحصائيات المستخدم
        updateUserStats(user.id, order);
        
        // إرسال حدث تحديث الطلبات
        window.dispatchEvent(new CustomEvent('orderCreated', { detail: order }));
        
        console.log('تم إنشاء الطلب بنجاح:', order.id);
        
        return { success: true, order };
        
    } catch (e) {
        console.error('خطأ في إنشاء الطلب:', e);
        return { success: false, error: e.message };
    }
}

function getUserOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const orders = getItem('orders', []);
    return orders.filter(o => o.userId === user.id || o.userEmail === user.email);
}

function getAllOrders() {
    return getItem('orders', []);
}

function getOrderById(orderId) {
    const orders = getItem('orders', []);
    return orders.find(o => o.id === orderId);
}

function updateOrderStatus(orderId, newStatus, note = '') {
    let orders = getItem('orders', []);
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
    
    // إرسال حدث تحديث
    window.dispatchEvent(new CustomEvent('orderUpdated', { detail: orders[index] }));
    
    return true;
}

function updateUserStats(userId, order) {
    // تحديث إحصائيات المستخدم (يمكن استخدامها لاحقاً)
    const userStats = getItem('user_stats_' + userId, {
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null
    });
    
    userStats.totalOrders += 1;
    userStats.totalSpent += order.total || 0;
    userStats.lastOrderDate = new Date().toISOString();
    
    setItem('user_stats_' + userId, userStats);
}

// =========================================
// نظام المنتجات
// =========================================
function getProducts(filters = {}) {
    let products = getItem('products', []);
    
    if (filters.category && filters.category !== 'all') {
        products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.featured) {
        products = products.filter(p => p.featured);
    }
    
    if (filters.active !== undefined) {
        products = products.filter(p => p.active === filters.active);
    } else {
        products = products.filter(p => p.active !== false);
    }
    
    return products;
}

function getProductById(id) {
    const products = getItem('products', []);
    return products.find(p => p.id === parseInt(id) || p.id === id);
}

// =========================================
// نظام العروض
// =========================================
function getPromos() {
    return getItem('promos', []).filter(p => p.active !== false);
}

// =========================================
// الإحصائيات
// =========================================
function getDashboardStats() {
    const orders = getItem('orders', []);
    const products = getItem('products', []);
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
    try {
        return Number(amount || 0).toFixed(3) + ' د.ك';
    } catch {
        return '0.000 د.ك';
    }
}

function showNotification(msg, type = 'success', duration = 3000) {
    // إزالة الإشعارات القديمة
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const el = document.createElement('div');
    el.className = 'notification ' + type;
    el.textContent = msg;
    el.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#5ec98a' : '#e05555'};
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

// =========================================
// التهيئة والمزامنة بين الصفحات
// =========================================
function initializeApp() {
    console.log('بدء تشغيل نظام Gift Star...');
    
    // تهيئة البيانات
    initData();
    
    // تحديث الهيدر
    updateHeader();
    
    // التحقق من وجود طلبات جديدة من صفحات أخرى
    checkForUpdates();
    
    // الاستماع لأحداث التحديث
    window.addEventListener('cartUpdated', function(e) {
        console.log('تم تحديث السلة من صفحة أخرى:', e.detail);
        updateCartBadge();
    });
    
    window.addEventListener('orderCreated', function(e) {
        console.log('تم إنشاء طلب جديد:', e.detail);
        // يمكن إضافة تحديثات هنا
    });
    
    window.addEventListener('storage', function(e) {
        // الاستماع للتغييرات في localStorage من صفحات أخرى
        if (e.key === 'giftstar_orders' || e.key === 'giftstar_last_order') {
            console.log('تم تحديث الطلبات من صفحة أخرى');
            if (window.location.pathname.includes('my-orders')) {
                // إعادة تحميل الصفحة إذا كنا في صفحة الطلبات
                location.reload();
            }
        }
        
        if (e.key && e.key.startsWith('giftstar_cart')) {
            console.log('تم تحديث السلة من صفحة أخرى');
            updateCartBadge();
        }
    });
    
    // تحديث دوري كل ثانيتين للتأكد من المزامنة
    setInterval(() => {
        checkForUpdates();
    }, 2000);
    
    console.log('نظام Gift Star جاهز للعمل');
}

function checkForUpdates() {
    // التحقق من وجود تحديثات للطلبات
    const lastOrderUpdate = sessionStorage.getItem('giftstar_last_order_update');
    const currentTime = Date.now().toString();
    
    // تحديث عداد السلة
    updateCartBadge();
    
    // التحقق من وجود طلب جديد في sessionStorage
    const lastOrder = sessionStorage.getItem('giftstar_last_order');
    if (lastOrder && !window._lastProcessedOrder) {
        window._lastProcessedOrder = lastOrder;
    }
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
// إضافة الأنيميشن
// =========================================
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
// تصدير الدوال
// =========================================
window.giftstar = {
    // المستخدمين
    getCurrentUser,
    login,
    logout,
    
    // السلة
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    getCartTotal,
    getCartCount,
    clearCart,
    updateCartBadge,
    
    // الطلبات
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    
    // المنتجات
    getProducts,
    getProductById,
    
    // العروض
    getPromos,
    
    // الإحصائيات
    getDashboardStats,
    
    // مساعدة
    formatKWD,
    showNotification,
    updateHeader
};

// تصدير الدوال العامة
window.getCurrentUser = getCurrentUser;
window.login = login;
window.logout = logout;
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.createOrder = createOrder;
window.getUserOrders = getUserOrders;
window.getAllOrders = getAllOrders;
window.getOrderById = getOrderById;
window.formatKWD = formatKWD;
window.showNotification = showNotification;
window.updateHeader = updateHeader;

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
