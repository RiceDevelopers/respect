// =========================================
// Gift Star - Data Store (نسخة GitHub Pages)
// =========================================

// Firebase modules (سيتم إضافتها من import map)
const { initializeApp } = await import('firebase/app');
const { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy,
    serverTimestamp 
} = await import('firebase/firestore');
const { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut 
} = await import('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyCtHnYZT8yq9tp7xaA7AyJQV4Ag4Wi1Yks",
    authDomain: "gift-star-abf48.firebaseapp.com",
    projectId: "gift-star-abf48",
    storageBucket: "gift-star-abf48.firebasestorage.app",
    messagingSenderId: "546782076914",
    appId: "1:546782076914:web:3fb957a03c7e0501fc556b",
    measurementId: "G-W6PKPSEWDZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('✅ Firebase initialized');

// =========================================
// دوال التخزين المحلية
// =========================================
function getItem(key, fallback = null) {
    try {
        const data = localStorage.getItem('giftstar_' + key);
        return data ? JSON.parse(data) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setItem(key, value) {
    try {
        localStorage.setItem('giftstar_' + key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
}

// =========================================
// تهيئة البيانات
// =========================================
function initData() {
    console.log('تهيئة البيانات...');
    
    // المستخدمين
    let users = getItem('users', []);
    if (users.length === 0) {
        users = [
            { id: 1, name: "مدير المتجر", email: "admin@giftstar.kw", password: "Admin@2024", role: "admin", verified: true, phone: "51234567" },
            { id: 2, name: "أحمد محمد", email: "ahmed@test.com", password: "12345678", role: "customer", verified: true, phone: "51234568" }
        ];
        setItem('users', users);
    }
    
    // المنتجات
    let products = getItem('products', []);
    if (products.length === 0) {
        products = [
            { 
                id: 1, 
                name: "كيك الفراولة الفاخر", 
                category: "cakes", 
                price: 12.500, 
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop", 
                description: "كيك فراولة طازجة", 
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
                description: "24 وردة حمراء", 
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
                description: "هدية فاخرة", 
                badge: "هدية مثالية", 
                featured: true, 
                stock: 15, 
                active: true 
            }
        ];
        setItem('products', products);
    }
    
    // طرق الدفع
    let paymentMethods = getItem('payment_methods', []);
    if (paymentMethods.length === 0) {
        paymentMethods = [
            { id: 1, name: "بطاقة ائتمانية", description: "Visa, Mastercard", icon: "card", active: true },
            { id: 2, name: "تحويل بنكي", description: "تحويل بنكي", icon: "bank", active: true },
            { id: 3, name: "نقداً", description: "الدفع عند الاستلام", icon: "cash", active: true }
        ];
        setItem('payment_methods', paymentMethods);
    }
    
    // العروض
    let promos = getItem('promos', []);
    if (promos.length === 0) {
        promos = [
            { id: 1, title: "خصم 20%", description: "عرض خاص", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=300&fit=crop", badge: "عرض", active: true }
        ];
        setItem('promos', promos);
    }
    
    // الطلبات
    let orders = getItem('orders', []);
    if (orders.length === 0) {
        setItem('orders', []);
    }
    
    console.log('✅ تم تهيئة البيانات');
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

async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const sessionUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email,
            role: email === 'admin@giftstar.kw' ? 'admin' : 'customer'
        };
        
        sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
        
    } catch (error) {
        const users = getItem('users', []);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
            sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }
        
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
    }
}

function logout() {
    signOut(auth).catch(() => {});
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
    } catch {
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
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
    } catch {
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
    if (!product) return false;
    
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: productId, qty, name: product.name, price: product.price, image: product.image });
    }
    
    saveCart(cart);
    return true;
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
    const total = getCartCount();
    document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
        if (el) {
            el.textContent = total;
            el.style.display = total > 0 ? 'flex' : 'none';
        }
    });
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
// نظام طرق الدفع
// =========================================
function getPaymentMethods() {
    return getItem('payment_methods', []).filter(p => p.active !== false);
}

// =========================================
// نظام الطلبات
// =========================================
async function createOrder(orderData) {
    try {
        const user = getCurrentUser();
        if (!user) return { success: false, error: 'يجب تسجيل الدخول' };
        
        const order = {
            id: 'GS' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            ...orderData,
            userId: user.id,
            userEmail: user.email,
            date: new Date().toLocaleDateString('ar-KW'),
            time: new Date().toLocaleTimeString('ar-KW'),
            status: 'new',
            statusHistory: [{ status: 'new', date: new Date().toISOString(), note: 'تم استلام الطلب' }],
            createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, "orders"), order);
        
        const localOrders = getItem('orders', []);
        localOrders.unshift(order);
        setItem('orders', localOrders);
        
        localStorage.setItem('giftstar_last_order', JSON.stringify(order));
        sessionStorage.setItem('giftstar_last_order', JSON.stringify(order));
        
        if (user) {
            localStorage.removeItem('giftstar_cart_' + user.id);
        }
        updateCartBadge();
        
        return { success: true, order };
        
    } catch (error) {
        console.error('خطأ:', error);
        return { success: false, error: error.message };
    }
}

async function getUserOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    
    try {
        const q = query(collection(db, "orders"), where("userId", "==", user.id), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch {
        const orders = getItem('orders', []);
        return orders.filter(o => o.userId === user.id || o.userEmail === user.email);
    }
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

function showNotification(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = 'notification ' + type;
    el.textContent = msg;
    el.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: ${type === 'success' ? '#5ec98a' : '#e05555'};
        color: white; padding: 12px 30px; border-radius: 50px;
        font-size: 14px; font-weight: 600; z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function updateHeader() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) {
        if (user) {
            loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
    updateCartBadge();
}

function initializeApp() {
    initData();
    updateHeader();
    
    window.addEventListener('storage', (e) => {
        if (e.key?.startsWith('giftstar_cart')) updateCartBadge();
    });
    
    window.addEventListener('cartUpdated', updateCartBadge);
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
    getCurrentUser, login, logout, getCart, addToCart, removeFromCart,
    getCartTotal, getCartCount, updateCartBadge,
    createOrder, getUserOrders, getProducts, getProductById,
    getPromos, getPaymentMethods, formatKWD, showNotification, updateHeader
};

window.getCurrentUser = getCurrentUser;
window.login = login;
window.logout = logout;
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.createOrder = createOrder;
window.getUserOrders = getUserOrders;
window.getProducts = getProducts;
window.getProductById = getProductById;
window.getPromos = getPromos;
window.getPaymentMethods = getPaymentMethods;
window.formatKWD = formatKWD;
window.showNotification = showNotification;
window.updateHeader = updateHeader;

// بدء التطبيق
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
