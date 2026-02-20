// main.js - الملف الرئيسي للموقع - نسخة الكويت 🇰🇼

// ================ البيانات الثابتة ================

// التصنيفات
const CATEGORIES = [
    { name: 'نسائي', count: 45, img: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400&h=400&fit=crop' },
    { name: 'رجالي', count: 38, img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop' },
    { name: 'يونيسكس', count: 22, img: 'https://images.unsplash.com/photo-1592945403244-b3faa00c5a21?w=400&h=400&fit=crop' },
    { name: 'هدايا', count: 30, img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop' }
];

// المنتجات الافتراضية (سيتم تخزينها في localStorage)
const PRODUCTS = [
    {id:1,name:"روز نوار",category:"نسائي",price:28.500,stock:24,badge:"الأكثر مبيعاً",desc:"عطر ملكي يجمع بين وردة الطائف النادرة والمسك الأبيض الشفاف",notes:"العلوية: وردة | القلب: ياسمين | القاعدة: مسك",sizes:["30ml","50ml","100ml"],img:"https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop"],active:true,featured:true},
    {id:2,name:"عود الملوك",category:"رجالي",price:45.000,stock:12,badge:"حصري",desc:"عبق العود الكمبودي الفاخر المدمج بالبخور الشرقي",notes:"العلوية: توابل | القلب: عود | القاعدة: كهرمان",sizes:["50ml","100ml"],img:"https://images.unsplash.com/photo-1602928321679-560bb453f190?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop"],active:true,featured:true},
    {id:3,name:"لؤلؤة الشرق",category:"نسائي",price:19.500,stock:35,badge:null,desc:"تركيبة أنثوية رقيقة تمزج بين البخور الأبيض وأزهار الليمون",notes:"العلوية: ليمون | القلب: بخور | القاعدة: فانيليا",sizes:["30ml","50ml","100ml"],img:"https://images.unsplash.com/photo-1595535868835-74088c83f98a?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1595535868835-74088c83f98a?w=600&h=600&fit=crop"],active:true,featured:true},
    {id:4,name:"نخلة السيف",category:"رجالي",price:32.000,stock:18,badge:"جديد",desc:"قوة وأناقة في آن واحد",notes:"العلوية: نعناع | القلب: خشب | القاعدة: مسك",sizes:["50ml","100ml","200ml"],img:"https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop"],active:true,featured:false},
    {id:5,name:"غيمة العشق",category:"يونيسكس",price:23.000,stock:0,badge:null,desc:"مزيج سحري من الزهور الشرقية",notes:"العلوية: برغموت | القلب: وردة | القاعدة: مسك",sizes:["30ml","50ml"],img:"https://images.unsplash.com/photo-1592945403244-b3faa00c5a21?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1592945403244-b3faa00c5a21?w=600&h=600&fit=crop"],active:false,featured:true},
    {id:6,name:"سلطانة الليل",category:"نسائي",price:39.000,stock:8,badge:"محدود",desc:"روح الليل الشرقي في زجاجة",notes:"العلوية: ياسمين | القلب: عود | القاعدة: عنبر",sizes:["50ml","100ml"],img:"https://images.unsplash.com/photo-1563170351-be54bff31d8c?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1563170351-be54bff31d8c?w=600&h=600&fit=crop"],active:true,featured:false},
    {id:7,name:"ذهب الصحراء",category:"رجالي",price:26.000,stock:22,badge:null,desc:"روح الصحراء العربية",notes:"العلوية: لبان | القلب: عود | القاعدة: كهرمان",sizes:["50ml","100ml"],img:"https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=600&h=600&fit=crop"],active:true,featured:false},
    {id:8,name:"نسمة الفجر",category:"يونيسكس",price:17.500,stock:40,badge:"الأحب للعملاء",desc:"خفيف كنسمة الفجر",notes:"العلوية: شاي أخضر | القلب: فريزيا | القاعدة: مسك أبيض",sizes:["30ml","50ml","100ml"],img:"https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=200&h=200&fit=crop",imgs:["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop"],active:true,featured:false}
];

//
// ===== STORE STATE =====
let cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('perfume_wishlist')) || [];

function saveCart() { localStorage.setItem('perfume_cart', JSON.stringify(cart)); updateCartCount(); }
function saveWishlist() { localStorage.setItem('perfume_wishlist', JSON.stringify(wishlist)); }

function addToCart(productId, size, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (product.stock === 0) { showToast('عذراً، المنتج غير متوفر حالياً', 'error'); return; }
  const key = `${productId}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty += qty; }
  else { cart.push({ key, productId, size, qty, name: product.name, price: product.price, img: product.img }); }
  saveCart();
  showToast(`تمت إضافة "${product.name}" إلى السلة 🛒`, 'success');
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => { b.textContent = count; b.style.display = count ? 'flex' : 'none'; });
}

function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-20px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

// ===== PRODUCT CARD =====
function createProductCard(product) {
  const isOutOfStock = product.stock === 0;
  return `
    <div class="product-card fade-in" onclick="window.location.href='product-detail.html?id=${product.id}'">
      <div class="product-img">
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        ${isOutOfStock ? `<div class="product-badge" style="background:#6B5C52">نفذت الكمية</div>` : ''}
        <div class="product-overlay">
          <button class="btn-primary" style="flex:1" onclick="event.stopPropagation(); addToCart(${product.id}, '${product.sizes[0]}')" ${isOutOfStock ? 'disabled style="opacity:0.5"' : ''}>
            🛒 أضف للسلة
          </button>
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc.substring(0, 80)}...</p>
        <div class="product-footer">
          <div class="product-price">
            ${product.oldPrice ? `<small>${product.oldPrice}</small>` : ''}
            ${product.price} KWD
          </div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id}, '${product.sizes[0]}')" ${isOutOfStock ? 'disabled style="opacity:0.5"' : ''}>+</button>
        </div>
      </div>
    </div>`;
}

// ===== INTERSECTION OBSERVER =====
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    const bars = burger.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });
}

// ===== CHAT WIDGET =====
const CHAT_RESPONSES = [
  { keywords: ['سلام', 'مرحبا', 'هلا', 'اهلا'], response: 'أهلاً وسهلاً! 😊 كيف يمكنني مساعدتك اليوم؟ نحن هنا لمساعدتك في اختيار العطر المثالي.' },
  { keywords: ['سعر', 'كم', 'تكلفة', 'ثمن'], response: 'لدينا مجموعة واسعة من الأسعار تبدأ من 175 KWD وحتى 450 KWD. يمكنك تصفح منتجاتنا لمعرفة أسعار كل عطر بالتفصيل.' },
  { keywords: ['شحن', 'توصيل', 'استلام'], response: '📦 نوفر خدمة الدفع عند الاستلام لجميع مناطق المملكة! يصلك الطلب خلال 2-5 أيام عمل. الشحن مجاني للطلبات التي تتجاوز 300 KWD.' },
  { keywords: ['نسائي', 'بنات', 'حريم'], response: '🌸 لدينا تشكيلة رائعة من العطور النسائية! أبرزها: روز نوار، لؤلؤة الشرق، وسلطانة الليل. يمكنك تصفح قسم العطور النسائية.' },
  { keywords: ['رجالي', 'رجال', 'شباب'], response: '👑 عطورنا الرجالية فاخرة وراقية! عود الملوك وذهب الصحراء من أكثر المنتجات طلباً. اعرض منتجاتنا الرجالية الآن.' },
  { keywords: ['عود', 'بخور'], response: '🪵 عطور العود من أجود المواد وأرقى الخامات. لدينا عود الملوك الحصري المستخرج من أفضل أنواع العود الكمبودي.' },
  { keywords: ['هدية', 'هدايا', 'كادو'], response: '🎁 ممتاز! عطورنا هدية مثالية. يمكننا تغليفها بشكل أنيق. تواصل معنا للطلبات الخاصة.' },
  { keywords: ['اشتري', 'أشتري', 'طلب', 'سلة'], response: 'يمكنك إضافة أي عطر لسلة التسوق من خلال الضغط على "أضف للسلة". ثم اتبع خطوات الدفع البسيطة.' },
  { keywords: ['مكونات', 'رائحة', 'نوتات'], response: 'عطورنا مصنوعة من أجود المكونات الطبيعية والحصرية. كل عطر له نوتاته الفريدة من العلوية والقلب والقاعدة.' },
  { keywords: ['مرتجع', 'إرجاع', 'استبدال'], response: 'نقبل الإرجاع خلال 7 أيام من تاريخ الاستلام في حالة المنتج غير المستخدم وبعبوته الأصلية.' },
];

const DEFAULT_RESPONSES = [
  'شكراً لتواصلك! يسعدني مساعدتك في اختيار العطر المناسب. ما الذي تبحث عنه تحديداً؟',
  'سؤال رائع! يمكنني مساعدتك في الاختيار بين عطورنا المتنوعة. هل تريد نسائي أم رجالي؟',
  'أهلاً! فريقنا دائماً هنا للمساعدة. يمكنني مساعدتك بكل استفساراتك عن العطور والطلبات.'
];

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const r of CHAT_RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.response;
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

function initChat() {
  const chatBtn = document.querySelector('.chat-btn');
  const chatBox = document.querySelector('.chat-box');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatBtn) return;

  chatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open') && chatMessages.children.length === 0) {
      setTimeout(() => addBotMsg('مرحباً! أنا مساعد عطور الخبير 🌹 كيف يمكنني مساعدتك اليوم؟'), 500);
    }
  });

  if (chatClose) chatClose.addEventListener('click', () => chatBox.classList.remove('open'));

  function sendMsg() {
    const text = chatInput.value.trim();
    if (!text) return;
    addUserMsg(text);
    chatInput.value = '';
    showTyping();
    setTimeout(() => { removeTyping(); addBotMsg(getBotResponse(text)); }, 1200 + Math.random() * 800);
  }

  if (chatSend) chatSend.addEventListener('click', sendMsg);
  if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `<div class="chat-msg-content">${text}</div><div class="chat-msg-avatar">👤</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-msg-avatar">🌹</div><div class="chat-msg-content">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing-indicator';
    div.innerHTML = `<div class="chat-msg-avatar">🌹</div><div class="chat-msg-content chat-typing"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const t = chatMessages.querySelector('.typing-indicator');
    if (t) t.remove();
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initMobileMenu();
  initChat();
  setTimeout(initFadeIn, 100);
});
