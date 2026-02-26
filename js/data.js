// =========================================
// Gift Star - Data Store مع Firebase (النسخة النهائية)
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { 
  getMessaging, 
  getToken, 
  onMessage 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging.js";

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
const messaging = getMessaging(app);

const VAPID_KEY = "BNw1PdYdUT5h8YZxwNPwsHb77s5C2L0IwMhyr0zlHUyEJs4gpgx5tqfje6BgBgZo6QssvaekMAQMYNl5r7E70G4";

console.log('✅ Firebase initialized successfully');

// =========================================
// دوال التخزين المحلية
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
// تهيئة البيانات - الأهم هنا!
// =========================================
function initData() {
    console.log('تهيئة البيانات...');
    
    // التحقق من وجود المستخدمين
    let users = getItem('users', []);
    if (users.length === 0) {
        users = [
            { id: 1, name: "مدير المتجر", email: "admin@giftstar.kw", password: "Admin@2024", role: "admin", verified: true, createdAt: new Date().toISOString(), phone: "51234567" },
            { id: 2, name: "أحمد محمد", email: "ahmed@test.com", password: "12345678", role: "customer", verified: true, createdAt: new Date().toISOString(), phone: "51234568" }
        ];
        setItem('users', users);
        console.log('✅ تم إنشاء المستخدمين');
    }
    
    // التحقق من وجود المنتجات - هذا هو المهم
    let products = getItem('products', []);
    if (products.length === 0) {
        products = [
            { 
                id: 1, 
                name: "كيك الفراولة الفاخر", 
                category: "cakes", 
                price: 12.500, 
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop", 
                description: "كيك فراولة طازجة بكريمة الشانتيه الفرنسية الفاخرة، مزين بحبات الفراولة الطازجة", 
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
                description: "باقة من 24 وردة حمراء طازجة مع شريط ساتان فاخر وبطاقة إهداء مجانية", 
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
                description: "صندوق هدايا فاخر يحتوي على شوكولاتة بلجيكية وعطر صغير وبطاقة تهنئة", 
                badge: "هدية مثالية", 
                featured: true, 
                stock: 15, 
                active: true 
            },
            { 
                id: 4, 
                name: "كيك الشوكولاتة", 
                category: "cakes", 
                price: 14.250, 
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop", 
                description: "كيك شوكولاتة بلجيكية مع طبقة غاناش فاخرة وحبات التوت الطازج", 
                badge: null, 
                featured: false, 
                stock: 18, 
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
            }
        ];
        setItem('products', products);
        console.log('✅ تم إنشاء المنتجات:', products.length);
    } else {
        console.log('✅ المنتجات موجودة مسبقاً:', products.length);
    }
    
    // التحقق من وجود العروض
    let promos = getItem('promos', []);
    if (promos.length === 0) {
        promos = [
            { 
                id: 1, 
                title: "خصم 20% على جميع الكيك", 
                description: "عرض خاص لفترة محدودة بمناسبة شهر رمضان", 
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=300&fit=crop", 
                badge: "رمضان كريم", 
                active: true 
            },
            { 
                id: 2, 
                title: "باقة ورد + كيك", 
                description: "احصل على باقة ورد وكيك بسعر خاص للمناسبات", 
                image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=300&fit=crop", 
                badge: "عرض خاص", 
                active: true 
            },
            { 
                id: 3, 
                title: "توصيل مجاني", 
                description: "توصيل مجاني للطلبات فوق 15 د.ك", 
                image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=300&fit=crop", 
                badge: "شحن مجاني", 
                active: true 
            }
        ];
        setItem('promos', promos);
        console.log('✅ تم إنشاء العروض:', promos.length);
    } else {
        console.log('✅ العروض موجودة مسبقاً:', promos.length);
    }
    
    // التحقق من وجود طرق الدفع
    let paymentMethods = getItem('payment_methods', []);
    if (paymentMethods.length === 0) {
        paymentMethods = [
            { id: 1, name: "بطاقة ائتمانية / مدين", description: "Visa, Mastercard, KNET", icon: "card", active: true },
            { id: 2, name: "تحويل بنكي", description: "تحويل بنكي مباشر", icon: "bank", active: true },
            { id: 3, name: "نقداً عند الاستلام", description: "الدفع نقداً للمندوب", icon: "cash", active: true }
        ];
        setItem('payment_methods', paymentMethods);
        console.log('✅ تم إنشاء طرق الدفع');
    }
    
    // التحقق من وجود الطلبات
    let orders = getItem('orders', []);
    if (orders.length === 0) {
        setItem('orders', []);
        console.log('✅ تم إنشاء قائمة الطلبات');
    }
    
    console.log('✅ تم تهيئة البيانات بنجاح');
    return true;
}

// =========================================
// نظام المنتجات - معدل للتأكد من العمل
// =========================================
function getProducts(filters = {}) {
    console.log('جلب المنتجات مع الفلاتر:', filters);
    
    let products = getItem('products', []);
    console.log('المنتجات من localStorage:', products.length);
    
    if (products.length === 0) {
        console.log('لا توجد منتجات، سيتم إنشاؤها');
        initData();
        products = getItem('products', []);
    }
    
    // تطبيق الفلاتر
    let filteredProducts = [...products];
    
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        console.log(`بعد تصفية الفئة ${filters.category}:`, filteredProducts.length);
    }
    
    if (filters.featured) {
        filteredProducts = filteredProducts.filter(p => p.featured === true);
        console.log('بعد تصفية المميزة:', filteredProducts.length);
    }
    
    if (filters.active !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.active === filters.active);
    } else {
        filteredProducts = filteredProducts.filter(p => p.active !== false);
    }
    
    console.log('المنتجات بعد التصفية:', filteredProducts.length);
    return filteredProducts;
}

function getProductById(id) {
    console.log('جلب المنتج بالرقم:', id);
    const products = getItem('products', []);
    const product = products.find(p => p.id === parseInt(id) || p.id === id);
    console.log('المنتج:', product);
    return product;
}

// =========================================
// نظام العروض
// =========================================
function getPromos() {
    console.log('جلب العروض');
    let promos = getItem('promos', []);
    
    if (promos.length === 0) {
        console.log('لا توجد عروض، سيتم إنشاؤها');
        initData();
        promos = getItem('promos', []);
    }
    
    const activePromos = promos.filter(p => p.active !== false);
    console.log('العروض النشطة:', activePromos.length);
    return activePromos;
}

// =========================================
// باقي الدوال (نفس الكود السابق)
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const sessionUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email,
            role: email === 'admin@giftstar.kw' ? 'admin' : 'customer',
            phone: firebaseUser.phoneNumber || ''
        };
        
        sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        const users = getItem('users', []);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
            sessionStorage.setItem('giftstar_user', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }
        
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
}

async function logout() {
    try {
        await signOut(auth);
    } catch (e) {
        console.error('خطأ في تسجيل الخروج:', e);
    }
    sessionStorage.removeItem('giftstar_user');
    window.location.href = 'index.html';
}

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
        window.dispatchEvent(new CustomEvent('cartUpdated'));
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
        cart.push({ id: productId, qty, name: product.name, price: product.price, image: product.image });
    }
    
    saveCart(cart);
    return true;
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
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
        console.error('خطأ في إنشاء الطلب:', error);
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

function getPaymentMethods() {
    return getItem('payment_methods', []).filter(p => p.active !== false);
}

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
    console.log('بدء تشغيل نظام Gift Star...');
    initData();
    updateHeader();
    
    window.addEventListener('storage', (e) => {
        if (e.key?.startsWith('giftstar_cart')) updateCartBadge();
    });
    
    window.addEventListener('cartUpdated', updateCartBadge);
    setInterval(updateCartBadge, 2000);
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
