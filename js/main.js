// =========================================
// Gift Star - Main JS
// =========================================

// Slider
let currentSlide = 0;
let slideInterval;

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slides.length) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  slideInterval = setInterval(() => changeSlide(1), 5000);
}

function changeSlide(dir) {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(n) {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

// Render promotions
function renderPromos() {
  const container = document.getElementById('promoGrid');
  if (!container) return;

  const promos = getData('promos', []).filter(p => p.active);
  if (!promos.length) {
    document.querySelector('.promo-section').style.display = 'none';
    return;
  }

  container.innerHTML = promos.map(p => `
    <div class="promo-card">
      <img src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=300&fit=crop'">
      <div class="promo-overlay">
        <span class="promo-badge">${p.badge || 'عرض'}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </div>
  `).join('');
}

// Render featured products
function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  const products = getData('products', []).filter(p => p.featured && p.active).slice(0, 8);
  container.innerHTML = products.map(p => productCardHTML(p)).join('');
}

// Product card HTML
function productCardHTML(p) {
  return `
    <div class="product-card">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop'">
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description.substring(0, 60)}...</p>
        <div class="product-footer">
          <div class="product-price">${p.price.toFixed(3)} <span>د.ك</span></div>
          <button class="btn-add-cart" onclick="handleAddToCart(${p.id}, this)">أضف للسلة</button>
        </div>
      </div>
    </div>
  `;
}

function handleAddToCart(productId, btn) {
  const user = getCurrentUser();
  if (!user) {
    sessionStorage.setItem('giftstar_redirect_after_login', window.location.href);
    window.location.href = 'login.html?msg=login_required';
    return;
  }
  addToCart(productId);
  btn.textContent = 'تمت الإضافة';
  btn.style.background = 'var(--success)';
  setTimeout(() => {
    btn.textContent = 'أضف للسلة';
    btn.style.background = '';
  }, 1500);
  showNotification('تمت إضافة المنتج للسلة', 'success');
}
