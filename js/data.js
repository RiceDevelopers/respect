// =========================================
// Gift Star - Data Store مع Firebase (الإصدار النهائي)
// =========================================

// =========================================
// Firebase Configuration
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtHnYZT8yq9tp7xaA7AyJQV4Ag4Wi1Yks",
    authDomain: "gift-star-abf48.firebaseapp.com",
    projectId: "gift-star-abf48",
    storageBucket: "gift-star-abf48.firebasestorage.app",
    messagingSenderId: "546782076914",
    appId: "1:546782076914:web:3fb957a03c7e0501fc556b",
    measurementId: "G-W6PKPSEWDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('✅ Firebase initialized successfully');

// =========================================
// دوال التخزين المحلية (كـ Fallback)
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
// نظام المصادقة مع Firebase
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

async function login(email, password) {
    console.log('محاولة تسجيل الدخول:', email);
    
    try {
        // تسجيل الدخول عبر Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // إنشاء كائن المستخدم للتطبيق
        const sessionUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email,
            role: email === 'admin@giftstar.kw' ? 'admin' : 'customer',
            phone: firebaseUser.phoneNumber || ''
        };
        
        sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
        
        // تحديث السلة بعد تسجيل الدخول
        migrateCart();
        
        return { success: true, user: sessionUser };
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        // Fallback إلى localStorage للتجربة
        const users = getItem('users', []);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const sessionUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            };
            sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
            migrateCart();
            return { success: true, user: sessionUser };
        }
        
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
}

async function logout() {
    try {
        await signOut(auth);
    } catch (e) {
        console.error('خطأ في تسجيل الخروج من Firebase:', e);
    }
    sessionStorage.removeItem('giftstar_user');
    window.location.href = 'index.html';
}

// =========================================
// نظام السلة
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
        
        updateCartBadge();
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
    return true;
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
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
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
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

function migrateCart() {
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
// نظام الطلبات مع Firebase (الأهم هنا!)
// =========================================
async function createOrder(orderData) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, error: 'يجب تسجيل الدخول أولاً' };
        }
        
        // إنشاء كائن الطلب
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
            createdAt: serverTimestamp(),
            lastUpdate: new Date().toISOString()
        };
        
        // حفظ الطلب في Firebase
        const docRef = await addDoc(collection(db, "orders"), order);
        console.log('✅ تم حفظ الطلب في Firebase:', docRef.id);
        
        // حفظ نسخة في localStorage كاحتياطي
        const localOrders = getItem('orders', []);
        localOrders.unshift(order);
        setItem('orders', localOrders);
        
        localStorage.setItem('giftstar_last_order', JSON.stringify(order));
        sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
        
        clearCart();
        
        window.dispatchEvent(new CustomEvent('orderCreated', { detail: order }));
        
        return { success: true, order };
        
    } catch (error) {
        console.error('❌ خطأ في حفظ الطلب في Firebase:', error);
        
        // Fallback إلى localStorage
        const user = getCurrentUser();
        const localOrders = getItem('orders', []);
        
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
        
        localOrders.unshift(order);
        setItem('orders', localOrders);
        
        localStorage.setItem('giftstar_last_order', JSON.stringify(order));
        sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
        
        clearCart();
        
        return { success: true, order, fallback: true };
    }
}

async function getUserOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    
    try {
        // جلب الطلبات من Firebase
        const q = query(
            collection(db, "orders"), 
            where("userId", "==", user.id),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push(doc.data());
        });
        
        console.log(`✅ تم جلب ${orders.length} طلب من Firebase`);
        return orders;
        
    } catch (error) {
        console.error('❌ خطأ في جلب الطلبات من Firebase:', error);
        
        // Fallback إلى localStorage
        const orders = getItem('orders', []);
        return orders.filter(o => o.userId === user.id || o.userEmail === user.email);
    }
}

async function getAllOrders() {
    try {
        // جلب جميع الطلبات من Firebase (للمدير)
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push(doc.data());
        });
        
        return orders;
        
    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        return getItem('orders', []);
    }
}

async function getOrderById(orderId) {
    try {
        // البحث في Firebase أولاً
        const q = query(collection(db, "orders"), where("id", "==", orderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        }
        
        // إذا لم نجد، نبحث في localStorage
        const orders = getItem('orders', []);
        return orders.find(o => o.id === orderId);
        
    } catch (error) {
        console.error('خطأ في جلب الطلب:', error);
        const orders = getItem('orders', []);
        return orders.find(o => o.id === orderId);
    }
}

async function updateOrderStatus(orderId, newStatus, note = '') {
    try {
        // تحديث في Firebase
        const q = query(collection(db, "orders"), where("id", "==", orderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
                status: newStatus,
                lastUpdate: new Date().toISOString(),
                statusHistory: firebase.firestore.FieldValue.arrayUnion({
                    status: newStatus,
                    date: new Date().toISOString(),
                    note: note || `تم تحديث الحالة إلى ${newStatus}`
                })
            });
        }
        
        // تحديث في localStorage
        let orders = getItem('orders', []);
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index !== -1) {
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
        }
        
        return true;
        
    } catch (error) {
        console.error('خطأ في تحديث الطلب:', error);
        return false;
    }
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
async function getDashboardStats() {
    const orders = await getAllOrders();
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
    console.log('بدء تشغيل نظام Gift Star مع Firebase...');
    
    initData();
    updateHeader();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'giftstar_orders' || e.key === 'giftstar_last_order') {
            console.log('تم تحديث الطلبات من صفحة أخرى');
            if (window.location.pathname.includes('my-orders') || 
                window.location.pathname.includes('receipt')) {
                location.reload();
            }
        }
        
        if (e.key && e.key.startsWith('giftstar_cart')) {
            console.log('تم تحديث السلة من صفحة أخرى');
            updateCartBadge();
        }
    });
    
    window.addEventListener('cartUpdated', function(e) {
        updateCartBadge();
    });
    
    setInterval(() => {
        updateCartBadge();
    }, 2000);
    
    console.log('نظام Gift Star مع Firebase جاهز للعمل');
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
    getCurrentUser,
    login,
    logout,
    getCart,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart,
    updateCartBadge,
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getProducts,
    getProductById,
    getPromos,
    getDashboardStats,
    formatKWD,
    showNotification,
    updateHeader
};

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

// بدء التطبيق
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
