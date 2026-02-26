// =========================================
// Gift Star - Main JS (وظائف إضافية)
// =========================================

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عداد السلة
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
    
    // إضافة مستمع لأحداث السلة
    window.addEventListener('cartUpdated', function() {
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }
    });
});

// دالة إضافة المنتج للسلة (للاستخدام في onclick)
window.handleAddToCart = function(productId, btn) {
    if (!window.getCurrentUser || !window.getCurrentUser()) {
        sessionStorage.setItem('giftstar_redirect_after_login', window.location.href);
        window.location.href = 'login.html?msg=login_required';
        return;
    }
    
    if (window.addToCart) {
        window.addToCart(productId);
        
        if (btn) {
            btn.textContent = '✓ تمت الإضافة';
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.textContent = 'أضف للسلة';
                btn.style.background = '';
            }, 1500);
        }
        
        if (window.showNotification) {
            window.showNotification('تمت إضافة المنتج للسلة', 'success');
        }
    }
};

// دالة عرض الإشعارات
window.showNotification = function(msg, type) {
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
    setTimeout(() => el.remove(), 3000);
};

// دالة تنسيق العملة
window.formatPrice = function(price) {
    return (price || 0).toFixed(3) + ' د.ك';
};

// دالة تسجيل الخروج
window.logout = function() {
    if (window.giftstar && window.giftstar.logout) {
        window.giftstar.logout();
    } else {
        sessionStorage.removeItem('giftstar_user');
        window.location.href = 'index.html';
    }
};
