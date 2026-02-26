// ============================================
// AI Chat Widget - نظام الرد الآلي الذكي
// ============================================

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.currentUser = null;
    this.quickReplies = [
      { id: 'products', text: 'المنتجات المتوفرة', icon: '🎁' },
      { id: 'delivery', text: 'معلومات التوصيل', icon: '🚚' },
      { id: 'payment', text: 'طرق الدفع', icon: '💳' },
      { id: 'offers', text: 'العروض الحالية', icon: '✨' },
      { id: 'contact', text: 'التواصل معنا', icon: '📞' }
    ];
    
    this.responses = {
      greeting: [
        'مرحباً بك في Gift Star! ✨ كيف يمكنني مساعدتك اليوم؟',
        'أهلاً وسهلاً! أنا مساعد Gift Star الذكي، أهلاً بك',
        'مساء الخير! 🌟 أتمنى أن تجد ما تبحث عنه من هدايا فاخرة'
      ],
      delivery: [
        '🚚 التوصيل داخل الكويت فقط:\n• مجاني للطلبات فوق 15 د.ك\n• 1.5 د.ك للطلبات الأقل\n• التوصيل خلال 24 ساعة',
        'نوصل لجميع المحافظات الكويتية. يمكنك تتبع طلبك عبر حسابك'
      ],
      payment: [
        '💳 طرق الدفع المتاحة:\n• بطاقات ائتمان (Visa/MasterCard)\n• تحويل بنكي\n• نقداً عند الاستلام',
        'جميع طرق الدفع آمنة ومشفرة 100%'
      ],
      offers: [
        '🎉 العروض الحالية:\n• خصم 15% على أول طلب\n• توصيل مجاني للطلبات فوق 15 د.ك\n• هدية مع كل باقة ورد',
        'تابعنا على الانستغرام لعروض حصرية @giftstar.kw'
      ],
      contact: [
        '📞 للتواصل المباشر:\n• واتساب: 965 XXXX XXXX\n• بريد: support@giftstar.com.kw\n• ساعات العمل: 9ص - 10م',
        'نحن هنا لخدمتك دائماً! يمكنك أيضاً متابعة طلبك عبر الموقع'
      ],
      fallback: [
        'عذراً، لم أفهم طلبك تماماً. هل يمكنك إعادة الصياغة؟ 🤔',
        'أنا هنا لمساعدتك! حاول أن تطلب منتجاً معيناً أو اسأل عن خدمة محددة',
        'يمكنك اختيار أحد الخيارات السريعة بالأسفل ⬇️'
      ],
      order: [
        'للاستفسار عن طلبك، يرجى إدخال رقم الطلب أو تسجيل الدخول لحسابك',
        'هل تريد تتبع طلبك الحالي؟ يمكننا مساعدتك بذلك'
      ],
      thanks: [
        'العفو! شكراً لتواصلك مع Gift Star ✨',
        'سعدنا بمساعدتك! في خدمتك دائماً',
        'نتمنى لك تجربة تسوق ممتعة 🎁'
      ]
    };
  }

  init() {
    this.render();
    this.attachEvents();
    this.checkUser();
    this.addWelcomeMessage();
  }

  render() {
    const chatHTML = `
      <div class="chat-widget-toggle" id="chatToggle">
        <div class="chat-glow-dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <div class="chat-widget-container" id="chatContainer">
        <div class="chat-header">
          <div class="chat-header-icon">✨</div>
          <div class="chat-header-info">
            <h4>
              مساعد Gift Star
              <span class="status-dot"></span>
            </h4>
            <p>نحن متصلون - الرد الآلي</p>
          </div>
          <button class="chat-close-btn" id="chatClose">✕</button>
        </div>

        <div class="chat-messages" id="chatMessages"></div>

        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <input type="text" id="chatInput" placeholder="اكتب رسالتك هنا..." dir="rtl">
            <button class="chat-attach-btn" id="chatAttach">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <button class="chat-send-btn" id="chatSend">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="quick-options" id="quickOptions"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
    this.renderQuickOptions();
  }

  renderQuickOptions() {
    const container = document.getElementById('quickOptions');
    if (!container) return;

    container.innerHTML = this.quickReplies.map(option => `
      <button class="quick-option-btn" data-action="${option.id}">
        <span>${option.icon}</span>
        ${option.text}
      </button>
    `).join('');
  }

  attachEvents() {
    const toggle = document.getElementById('chatToggle');
    const container = document.getElementById('chatContainer');
    const closeBtn = document.getElementById('chatClose');
    const sendBtn = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const quickOptions = document.getElementById('quickOptions');

    if (toggle) {
      toggle.addEventListener('click', () => this.toggleChat());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    if (quickOptions) {
      quickOptions.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-option-btn');
        if (btn) {
          const action = btn.dataset.action;
          this.handleQuickOption(action);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !e.target.closest('#chatContainer') && 
          !e.target.closest('#chatToggle')) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    const container = document.getElementById('chatContainer');
    if (container) {
      if (this.isOpen) {
        container.classList.remove('open');
      } else {
        container.classList.add('open');
        this.scrollToBottom();
      }
      this.isOpen = !this.isOpen;
    }
  }

  closeChat() {
    const container = document.getElementById('chatContainer');
    if (container) {
      container.classList.remove('open');
      this.isOpen = false;
    }
  }

  addMessage(text, sender = 'ai') {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const time = new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' });
    
    const messageHTML = `
      <div class="message-bubble ${sender}">
        <div class="message-avatar">
          ${sender === 'ai' ? '✨' : '👤'}
        </div>
        <div class="message-content">
          <p>${text.replace(/\n/g, '<br>')}</p>
          <span class="message-time">${time}</span>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();
    this.messages.push({ text, sender, time });
  }

  addWelcomeMessage() {
    setTimeout(() => {
      const greeting = this.getRandomResponse('greeting');
      this.addMessage(greeting, 'ai');
      
      setTimeout(() => {
        this.addMessage('يمكنك اختيار أحد الخيارات السريعة بالأسفل أو كتابة سؤالك مباشرة', 'ai');
      }, 800);
    }, 300);
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const indicatorHTML = `
      <div class="typing-indicator" id="typingIndicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', indicatorHTML);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text) return;

    this.addMessage(text, 'user');
    input.value = '';
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(text);
      this.addMessage(response, 'ai');
    }, 1000 + Math.random() * 1000);
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (this.containsAny(message, ['مرحب', 'اهلين', 'سلام', 'هلا', 'hi', 'hello'])) {
      return this.getRandomResponse('greeting');
    }
    
    if (this.containsAny(message, ['توصيل', 'وصل', 'delivery', 'شحن', 'ship'])) {
      return this.getRandomResponse('delivery');
    }
    
    if (this.containsAny(message, ['دفع', 'pay', 'payment', 'كيف ادفع', 'فيزا', 'كاش'])) {
      return this.getRandomResponse('payment');
    }
    
    if (this.containsAny(message, ['عرض', 'خصم', 'offer', 'discount', 'كوبون', 'coupon'])) {
      return this.getRandomResponse('offers');
    }
    
    if (this.containsAny(message, ['تواصل', 'اتصال', 'contact', 'رقم', 'phone', 'واتس'])) {
      return this.getRandomResponse('contact');
    }
    
    if (this.containsAny(message, ['طلب', 'order', 'اوردر', 'طلبية'])) {
      return this.getRandomResponse('order');
    }
    
    if (this.containsAny(message, ['شكرا', 'thank', 'thanks', 'تسلم'])) {
      return this.getRandomResponse('thanks');
    }
    
    if (message.includes('سعر') || message.includes('كم')) {
      return this.handlePriceQuery(message);
    }
    
    return this.getRandomResponse('fallback');
  }

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.fallback;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  handlePriceQuery(message) {
    if (message.includes('كيك')) {
      return 'أسعار الكيك تبدأ من 8.5 د.ك وتصل إلى 22 د.ك حسب الحجم والنوع. هل تريد تفاصيل أكثر عن نوع معين؟';
    }
    if (message.includes('ورد')) {
      return 'باقات الورد تبدأ من 7.5 د.ك للباقات الصغيرة وتصل إلى 25 د.ك للباقات الفاخرة ✿';
    }
    return 'معظم منتجاتنا تتراوح أسعارها بين 5 د.ك و 35 د.ك. هل تبحث عن شيء معين؟';
  }

  handleQuickOption(action) {
    let response = '';
    
    switch(action) {
      case 'products':
        response = this.getRandomResponse('products');
        break;
      case 'delivery':
        response = this.getRandomResponse('delivery');
        break;
      case 'payment':
        response = this.getRandomResponse('payment');
        break;
      case 'offers':
        response = this.getRandomResponse('offers');
        break;
      case 'contact':
        response = this.getRandomResponse('contact');
        break;
    }

    const optionText = this.quickReplies.find(o => o.id === action)?.text || '';
    if (optionText) {
      this.addMessage(optionText, 'user');
    }

    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addMessage(response, 'ai');
      
      if (action === 'products') {
        setTimeout(() => {
          this.addMessage('🎁 يمكنك زيارة صفحة المتجر لرؤية جميع المنتجات', 'ai');
        }, 500);
      }
    }, 800);
  }

  checkUser() {
    if (typeof getCurrentUser !== 'undefined') {
      this.currentUser = getCurrentUser();
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}

// تهيئة أداة المحادثة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // التأكد من وجود العناصر في الصفحة (للمستخدمين العاديين فقط، وليس في لوحة التحكم)
  if (!document.querySelector('.admin-layout')) {
    const chatWidget = new ChatWidget();
    chatWidget.init();
  }
});