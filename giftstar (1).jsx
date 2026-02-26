import { useState, useEffect, useCallback, useRef } from "react";

// ==============================
// STORAGE HELPERS
// ==============================
const storage = {
  get: async (key) => {
    try { return await window.storage.get(key, true); } catch { return null; }
  },
  set: async (key, value) => {
    try { return await window.storage.set(key, JSON.stringify(value), true); } catch { return null; }
  },
  getVal: async (key, fallback) => {
    try {
      const r = await window.storage.get(key, true);
      return r ? JSON.parse(r.value) : fallback;
    } catch { return fallback; }
  }
};

// ==============================
// INITIAL DATA
// ==============================
const INITIAL_PRODUCTS = [
  { id:1, name:"كيك الفراولة الفاخر", cat:"cakes", price:12.500, img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop", desc:"كيك فراولة طازجة بكريمة الشانتيه الفرنسية", badge:"الأكثر مبيعاً", stock:20, featured:true },
  { id:2, name:"باقة ورد حمراء", cat:"flowers", price:8.750, img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop", desc:"24 وردة حمراء طازجة مع ورق الزينة", badge:"جديد", stock:30, featured:true },
  { id:3, name:"تورتة الشوكولاتة", cat:"cakes", price:15.000, img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop", desc:"تورتة شوكولاتة بلجيكية فاخرة بطبقات الكريمة", badge:"", stock:15, featured:true },
  { id:4, name:"باقة زهور الربيع", cat:"flowers", price:11.000, img:"https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=400&h=400&fit=crop", desc:"تشكيلة من أجمل زهور الربيع الملونة", badge:"", stock:25, featured:false },
  { id:5, name:"علبة هدايا فاخرة", cat:"gifts", price:22.000, img:"https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop", desc:"علبة هدايا مميزة تحتوي على تشكيلة من الحلويات والشوكولاتة", badge:"مميز", stock:10, featured:true },
  { id:6, name:"بالون تزيين", cat:"gifts", price:5.500, img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop", desc:"مجموعة بالونات ملونة للمناسبات السعيدة", badge:"", stock:50, featured:false },
  { id:7, name:"كيك عيد الميلاد", cat:"cakes", price:18.000, img:"https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop", desc:"كيك احتفالي مع شمعات وزينة مميزة", badge:"عرض", stock:12, featured:true },
  { id:8, name:"ورد أبيض فاخر", cat:"flowers", price:14.500, img:"https://images.unsplash.com/photo-1487530811015-780aa15174b8?w=400&h=400&fit=crop", desc:"30 وردة بيضاء طازجة في تغليف فاخر", badge:"", stock:20, featured:false },
];

const INITIAL_USERS = [
  { id:1, name:"مدير المتجر", email:"admin@giftstar.kw", password:"Admin@2024", role:"admin", phone:"51234567" },
  { id:2, name:"أحمد محمد", email:"ahmed@test.com", password:"12345678", role:"customer", phone:"51234568" },
];

const STATUS_MAP = { new:"جديد", processing:"قيد المعالجة", delivered:"تم التوصيل", cancelled:"ملغي" };
const STATUS_COLOR = { new:"#5ec98a", processing:"#f39c12", delivered:"#3498db", cancelled:"#e05555" };
const AREAS = ["العاصمة","حولي","الفروانية","مبارك الكبير","الأحمدي","الجهراء"];

// ==============================
// HELPERS
// ==============================
const kwd = (n) => Number(n||0).toFixed(3) + " د.ك";
const genId = () => "GS-" + Date.now().toString(36).toUpperCase().slice(-6);

// ==============================
// MAIN APP
// ==============================
export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [announcements, setAnnouncements] = useState([]);
  const prevOrdersLen = useRef(0);

  const INITIAL_ANNOUNCEMENTS = [
    { id:1, text:"✨ توصيل مجاني للطلبات فوق 15 د.ك داخل الكويت", active:true, color:"gold" },
  ];

  // Load all data
  useEffect(() => {
    (async () => {
      const p = await storage.getVal("gs:products", INITIAL_PRODUCTS);
      const u = await storage.getVal("gs:users", INITIAL_USERS);
      const o = await storage.getVal("gs:orders", []);
      const n = await storage.getVal("gs:notifications", []);
      const uc = await storage.getVal("gs:unread", 0);
      const ann = await storage.getVal("gs:announcements", null);
      const INITIAL_ANN = [{ id:1, text:"✨ توصيل مجاني للطلبات فوق 15 د.ك داخل الكويت", active:true, color:"gold" }];
      setProducts(p.length ? p : INITIAL_PRODUCTS);
      setUsers(u.length ? u : INITIAL_USERS);
      setOrders(o);
      setNotifications(n);
      setUnreadCount(uc);
      setAnnouncements(ann !== null ? ann : INITIAL_ANN);
      prevOrdersLen.current = o.length;
      setLoaded(true);
    })();
  }, []);

  // Poll for new orders (simulate real-time)
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(async () => {
      const o = await storage.getVal("gs:orders", []);
      if (o.length > prevOrdersLen.current) {
        const newOrds = o.slice(prevOrdersLen.current);
        setOrders(o);
        prevOrdersLen.current = o.length;
        const n = await storage.getVal("gs:notifications", []);
        setNotifications(n);
        const uc = await storage.getVal("gs:unread", 0);
        setUnreadCount(uc);
        newOrds.forEach(ord => {
          showToast(`🛒 طلب جديد من ${ord.customerName} - ${kwd(ord.total)}`, "success");
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loaded]);

  const showToast = (msg, type="success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const saveOrders = async (newOrders) => {
    setOrders(newOrders);
    await storage.set("gs:orders", newOrders);
  };

  const saveProducts = async (newProducts) => {
    setProducts(newProducts);
    await storage.set("gs:products", newProducts);
  };

  const saveUsers = async (newUsers) => {
    setUsers(newUsers);
    await storage.set("gs:users", newUsers);
  };

  const addNotification = async (text, orderId) => {
    const n = await storage.getVal("gs:notifications", []);
    const newN = [{ id: Date.now(), text, orderId, time: new Date().toISOString(), read: false }, ...n];
    await storage.set("gs:notifications", newN);
    setNotifications(newN);
    const uc = await storage.getVal("gs:unread", 0);
    const newUc = uc + 1;
    await storage.set("gs:unread", newUc);
    setUnreadCount(newUc);
  };

  const markAllRead = async () => {
    const newN = notifications.map(n => ({ ...n, read: true }));
    setNotifications(newN);
    await storage.set("gs:notifications", newN);
    await storage.set("gs:unread", 0);
    setUnreadCount(0);
  };

  const placeOrder = async (orderData) => {
    const order = {
      id: genId(),
      ...orderData,
      status: "new",
      date: new Date().toLocaleDateString("ar-KW"),
      time: new Date().toLocaleTimeString("ar-KW", { hour:"2-digit", minute:"2-digit" }),
      createdAt: new Date().toISOString(),
    };
    const newOrders = [order, ...orders];
    await saveOrders(newOrders);
    prevOrdersLen.current = newOrders.length;
    await addNotification(`طلب جديد #${order.id} من ${order.customerName} بقيمة ${kwd(order.total)}`, order.id);
    setCart([]);
    showToast("✅ تم إرسال طلبك بنجاح!", "success");
    return order;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  };

  const register = async (name, email, password, phone) => {
    if (users.find(u => u.email === email)) return { success: false, error: "البريد الإلكتروني مسجل مسبقاً" };
    const newUser = { id: Date.now(), name, email, password, role: "customer", phone };
    const newUsers = [...users, newUser];
    await saveUsers(newUsers);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setPage("home");
  };

  const addToCart = (product) => {
    if (!currentUser) { setPage("login"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast("تمت الإضافة للسلة 🛍️");
  };

  const updateOrderStatus = async (orderId, status) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    await saveOrders(newOrders);
    showToast(`تم تحديث حالة الطلب إلى: ${STATUS_MAP[status]}`);
  };

  const saveAnnouncements = async (newAnn) => {
    setAnnouncements(newAnn);
    await storage.set("gs:announcements", newAnn);
  };

  if (!loaded) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#1a1a2e", color:"#c8a96e", fontFamily:"Tajawal,sans-serif", fontSize:22, direction:"rtl" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:50, marginBottom:16 }}>★</div>
        <div>جاري تحميل Gift Star...</div>
      </div>
    </div>
  );

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin = currentUser?.role === "admin";

  const props = { page, setPage, products, users, orders, cart, setCart, currentUser, notifications, unreadCount,
    addToCart, placeOrder, login, register, logout, updateOrderStatus, saveProducts, saveOrders,
    markAllRead, cartTotal, cartCount, isAdmin, selectedOrder, setSelectedOrder, adminTab, setAdminTab,
    showToast, saveUsers, announcements, saveAnnouncements };

  return (
    <div style={{ fontFamily:"'Tajawal',sans-serif", direction:"rtl", minHeight:"100vh", background:"#0f0f1a", color:"#e8e0d0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      <GlobalStyles />
      <Header {...props} />
      <main>
        {page === "home" && <HomePage {...props} />}
        {page === "shop" && <ShopPage {...props} />}
        {page === "product" && <ProductPage {...props} />}
        {page === "cart" && <CartPage {...props} />}
        {page === "checkout" && <CheckoutPage {...props} />}
        {page === "receipt" && <ReceiptPage {...props} />}
        {page === "orders" && <MyOrdersPage {...props} />}
        {page === "login" && <LoginPage {...props} />}
        {page === "register" && <RegisterPage {...props} />}
        {page === "admin" && isAdmin && <AdminPage {...props} />}
      </main>
      {toast && <Toast toast={toast} />}
    </div>
  );
}

// ==============================
// GLOBAL STYLES
// ==============================
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing:border-box; margin:0; padding:0; }
      :root {
        --gold:#c8a96e; --gold-light:#e2c98a; --gold-dark:#a68840;
        --bg:#0f0f1a; --bg2:#161625; --bg3:#1e1e32;
        --border:rgba(200,169,110,0.15); --border2:rgba(200,169,110,0.3);
        --text:#e8e0d0; --muted:#8a7f6e; --success:#5ec98a; --danger:#e05555;
      }
      body { background:var(--bg); }
      img { max-width:100%; }
      a { text-decoration:none; color:inherit; }
      input, select, textarea { font-family:'Tajawal',sans-serif; }
      .btn-gold {
        background:linear-gradient(135deg,var(--gold),var(--gold-light));
        color:#0f0f1a; border:none; padding:12px 28px; border-radius:30px;
        font-size:15px; font-weight:800; cursor:pointer; transition:all .2s;
        font-family:'Tajawal',sans-serif;
      }
      .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(200,169,110,.4); }
      .btn-outline {
        background:transparent; color:var(--gold); border:2px solid var(--gold);
        padding:10px 24px; border-radius:30px; font-size:14px; font-weight:700;
        cursor:pointer; transition:all .2s; font-family:'Tajawal',sans-serif;
      }
      .btn-outline:hover { background:var(--gold); color:#0f0f1a; }
      .container { max-width:1200px; margin:0 auto; padding:0 20px; }
      .input-field {
        width:100%; padding:13px 16px; background:var(--bg3); border:1.5px solid var(--border);
        border-radius:10px; color:var(--text); font-size:15px; font-family:'Tajawal',sans-serif;
        transition:border .2s; outline:none;
      }
      .input-field:focus { border-color:var(--gold); }
      .card {
        background:var(--bg2); border:1px solid var(--border); border-radius:16px;
        transition:all .2s;
      }
      .card:hover { border-color:var(--border2); box-shadow:0 8px 30px rgba(0,0,0,.3); }
      .badge {
        display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;
        background:linear-gradient(135deg,var(--gold),var(--gold-light)); color:#0f0f1a;
      }
      .page-title {
        font-size:clamp(28px,5vw,48px); font-weight:900; color:var(--text);
        background:linear-gradient(135deg,var(--gold),var(--gold-light)); -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
      @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      @keyframes slideIn { from{transform:translateX(120px);opacity:0} to{transform:none;opacity:1} }
      @keyframes spin { to{transform:rotate(360deg)} }
      .animate-in { animation:fadeIn .4s ease forwards; }
      .grid-products { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:24px; }
      .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
      .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
      @media(max-width:768px) {
        .grid-2,.grid-3,.grid-4 { grid-template-columns:1fr; }
        .grid-products { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
      }
    `}</style>
  );
}

// ==============================
// TOAST
// ==============================
function Toast({ toast }) {
  return (
    <div style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background: toast.type === "success" ? "rgba(94,201,138,.95)" : "rgba(224,85,85,.95)",
      color:"#fff", padding:"14px 28px", borderRadius:30, fontWeight:700, fontSize:15,
      zIndex:9999, animation:"slideIn .3s ease", boxShadow:"0 8px 30px rgba(0,0,0,.4)",
      whiteSpace:"nowrap"
    }}>
      {toast.msg}
    </div>
  );
}

// ==============================
// HEADER
// ==============================
function Header({ page, setPage, cartCount, currentUser, notifications, unreadCount, markAllRead, isAdmin, logout, announcements }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);

  const activeAnns = (announcements || []).filter(a => a.active);

  useEffect(() => {
    if (activeAnns.length <= 1) return;
    const t = setInterval(() => setAnnIdx(i => (i + 1) % activeAnns.length), 4000);
    return () => clearInterval(t);
  }, [activeAnns.length]);

  const annColors = {
    gold: { bg:"linear-gradient(90deg,var(--gold-dark),var(--gold))", color:"#0f0f1a" },
    red:  { bg:"linear-gradient(90deg,#c0392b,#e74c3c)", color:"#fff" },
    green:{ bg:"linear-gradient(90deg,#27ae60,#2ecc71)", color:"#fff" },
    blue: { bg:"linear-gradient(90deg,#2980b9,#3498db)", color:"#fff" },
    dark: { bg:"linear-gradient(90deg,#1a1a2e,#2d2d4e)", color:"var(--gold)" },
  };

  const currentAnn = activeAnns[annIdx] || null;
  const annStyle = currentAnn ? (annColors[currentAnn.color] || annColors.gold) : null;

  return (
    <header style={{ background:"rgba(15,15,26,.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:100 }}>
      {currentAnn && annStyle && (
        <div style={{ background:annStyle.bg, padding:"7px 0", textAlign:"center", fontSize:13, fontWeight:600, color:annStyle.color, transition:"all .4s", position:"relative", overflow:"hidden" }}>
          {currentAnn.text}
          {activeAnns.length > 1 && (
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", display:"flex", gap:4 }}>
              {activeAnns.map((_,i) => (
                <span key={i} onClick={() => setAnnIdx(i)} style={{ width:6, height:6, borderRadius:"50%", background:i===annIdx?"rgba(0,0,0,.6)":"rgba(0,0,0,.25)", cursor:"pointer", display:"inline-block" }} />
              ))}
            </span>
          )}
        </div>
      )}
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px" }}>
        <button onClick={() => setPage("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:28, color:"var(--gold)" }}>★</span>
          <span style={{ fontSize:22, fontWeight:900, background:"linear-gradient(135deg,var(--gold),var(--gold-light))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Gift Star</span>
        </button>

        <nav style={{ display:"flex", alignItems:"center", gap:24 }}>
          {["home","shop"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background:"none", border:"none", cursor:"pointer", fontSize:15, fontWeight:600,
              color: page === p ? "var(--gold)" : "var(--muted)", transition:"color .2s",
              borderBottom: page === p ? "2px solid var(--gold)" : "2px solid transparent", paddingBottom:2
            }}>
              {p === "home" ? "الرئيسية" : "المتجر"}
            </button>
          ))}
          {currentUser && (
            <button onClick={() => setPage("orders")} style={{
              background:"none", border:"none", cursor:"pointer", fontSize:15, fontWeight:600,
              color: page === "orders" ? "var(--gold)" : "var(--muted)", transition:"color .2s"
            }}>طلباتي</button>
          )}
          {isAdmin && (
            <button onClick={() => setPage("admin")} style={{
              background:"linear-gradient(135deg,var(--gold),var(--gold-light))", border:"none",
              cursor:"pointer", fontSize:13, fontWeight:800, color:"#0f0f1a", padding:"6px 16px", borderRadius:20
            }}>
              لوحة التحكم
            </button>
          )}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {/* Cart */}
          <button onClick={() => setPage("cart")} style={{ background:"none", border:"none", cursor:"pointer", position:"relative" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}>
              <circle cx={9} cy={21} r={1}/><circle cx={20} cy={21} r={1}/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:-6, right:-6, background:"var(--gold)", color:"#0f0f1a", borderRadius:"50%", width:18, height:18, fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications (admin only) */}
          {isAdmin && (
            <div style={{ position:"relative" }}>
              <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) markAllRead(); }}
                style={{ background:"none", border:"none", cursor:"pointer", position:"relative" }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position:"absolute", top:-5, right:-5, background:"var(--danger)", color:"#fff",
                    borderRadius:"50%", width:18, height:18, fontSize:11, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center", animation:"pulse 1.5s infinite"
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <NotificationsDropdown notifications={notifications} onClose={() => setShowNotifs(false)} />
              )}
            </div>
          )}

          {/* User */}
          {currentUser ? (
            <div style={{ position:"relative" }}>
              <button onClick={() => setShowMenu(!showMenu)} style={{
                background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:30,
                padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:"var(--text)", fontSize:14
              }}>
                <span style={{ color:"var(--gold)" }}>👤</span> {currentUser.name.split(" ")[0]}
              </button>
              {showMenu && (
                <div style={{
                  position:"absolute", left:0, top:"110%", background:"var(--bg2)", border:"1px solid var(--border)",
                  borderRadius:12, minWidth:160, overflow:"hidden", boxShadow:"0 8px 30px rgba(0,0,0,.4)", zIndex:200
                }}>
                  <button onClick={() => { setPage("orders"); setShowMenu(false); }} style={{ display:"block", width:"100%", padding:"12px 16px", background:"none", border:"none", color:"var(--text)", cursor:"pointer", textAlign:"right", fontSize:14, transition:"background .15s" }}>
                    📦 طلباتي
                  </button>
                  <button onClick={() => { logout(); setShowMenu(false); }} style={{ display:"block", width:"100%", padding:"12px 16px", background:"none", border:"none", color:"var(--danger)", cursor:"pointer", textAlign:"right", fontSize:14 }}>
                    🚪 تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setPage("login")} className="btn-gold" style={{ padding:"8px 20px", fontSize:14 }}>
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ==============================
// NOTIFICATIONS DROPDOWN
// ==============================
function NotificationsDropdown({ notifications, onClose }) {
  return (
    <div style={{
      position:"absolute", left:0, top:"110%", background:"var(--bg2)", border:"1px solid var(--border)",
      borderRadius:16, width:340, maxHeight:400, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,.5)", zIndex:200
    }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", fontWeight:800, color:"var(--gold)", fontSize:15 }}>
        🔔 الإشعارات
      </div>
      <div style={{ overflowY:"auto", maxHeight:340 }}>
        {notifications.length === 0 ? (
          <div style={{ padding:30, textAlign:"center", color:"var(--muted)" }}>لا توجد إشعارات</div>
        ) : notifications.map(n => (
          <div key={n.id} style={{
            padding:"12px 18px", borderBottom:"1px solid var(--border)",
            background: n.read ? "transparent" : "rgba(200,169,110,.05)",
            display:"flex", gap:10, alignItems:"flex-start"
          }}>
            <span style={{ fontSize:20, flexShrink:0 }}>🛒</span>
            <div>
              <div style={{ fontSize:14, color:"var(--text)", lineHeight:1.5 }}>{n.text}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>
                {new Date(n.time).toLocaleString("ar-KW")}
              </div>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--gold)", flexShrink:0, marginTop:4 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================
// HOME PAGE
// ==============================
function HomePage({ setPage, products, addToCart }) {
  const featured = products.filter(p => p.featured).slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <div style={{
        background:"linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#1e1a0e 100%)",
        padding:"80px 20px", textAlign:"center", position:"relative", overflow:"hidden"
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 50% 50%, rgba(200,169,110,.08) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:60, marginBottom:16 }}>★</div>
          <h1 style={{ fontSize:"clamp(36px,7vw,72px)", fontWeight:900, lineHeight:1.1, marginBottom:20 }}>
            <span style={{ background:"linear-gradient(135deg,var(--gold),var(--gold-light))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Gift Star
            </span>
            <br />
            <span style={{ color:"var(--text)", fontSize:"clamp(20px,4vw,36px)", fontWeight:400 }}>متجر الهدايا الكويتي الأول</span>
          </h1>
          <p style={{ color:"var(--muted)", fontSize:18, marginBottom:36, maxWidth:500, margin:"0 auto 36px" }}>
            أجمل الكيك والورد والهدايا لكل مناسباتك المميزة
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-gold" onClick={() => setPage("shop")} style={{ padding:"14px 36px", fontSize:17 }}>
              تسوق الآن 🛍️
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container" style={{ padding:"60px 20px" }}>
        <h2 className="page-title" style={{ textAlign:"center", marginBottom:36 }}>تسوق حسب الفئة</h2>
        <div className="grid-3">
          {[
            { key:"cakes", label:"كيك", emoji:"🎂", img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=200&fit=crop" },
            { key:"flowers", label:"ورد", emoji:"🌹", img:"https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=400&h=200&fit=crop" },
            { key:"gifts", label:"هدايا", emoji:"🎁", img:"https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=200&fit=crop" },
          ].map(c => (
            <div key={c.key} onClick={() => setPage(`shop?cat=${c.key}`)} className="card" style={{ cursor:"pointer", overflow:"hidden" }}>
              <img src={c.img} alt={c.label} style={{ width:"100%", height:150, objectFit:"cover" }} />
              <div style={{ padding:16, textAlign:"center", fontSize:18, fontWeight:800 }}>
                {c.emoji} {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ background:"var(--bg2)", padding:"60px 0" }}>
        <div className="container">
          <h2 className="page-title" style={{ textAlign:"center", marginBottom:36 }}>المنتجات المميزة</h2>
          <div className="grid-products">
            {featured.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} setPage={setPage} />)}
          </div>
          <div style={{ textAlign:"center", marginTop:36 }}>
            <button className="btn-outline" onClick={() => setPage("shop")}>عرض جميع المنتجات</button>
          </div>
        </div>
      </div>

      {/* Why Us */}
      <div className="container" style={{ padding:"60px 20px" }}>
        <h2 className="page-title" style={{ textAlign:"center", marginBottom:36 }}>لماذا Gift Star؟</h2>
        <div className="grid-4">
          {[
            { icon:"🛡️", title:"جودة مضمونة", desc:"منتجات طازجة مختارة بعناية" },
            { icon:"⚡", title:"توصيل سريع", desc:"توصيل في نفس اليوم لكل الكويت" },
            { icon:"💝", title:"خدمة شخصية", desc:"نساعدك في اختيار الهدية المثالية" },
            { icon:"🔒", title:"دفع آمن", desc:"طرق دفع متعددة وآمنة 100%" },
          ].map((w, i) => (
            <div key={i} className="card" style={{ padding:24, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>{w.icon}</div>
              <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:8 }}>{w.title}</h3>
              <p style={{ color:"var(--muted)", fontSize:14 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==============================
// PRODUCT CARD
// ==============================
function ProductCard({ product: p, onAdd, setPage }) {
  const [added, setAdded] = useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="card animate-in" style={{ overflow:"hidden", cursor:"pointer" }} onClick={() => setPage("product?" + p.id)}>
      <div style={{ position:"relative" }}>
        <img src={p.img} alt={p.name} style={{ width:"100%", height:200, objectFit:"cover" }} />
        {p.badge && <span className="badge" style={{ position:"absolute", top:10, right:10 }}>{p.badge}</span>}
      </div>
      <div style={{ padding:16 }}>
        <h3 style={{ fontWeight:800, marginBottom:6, fontSize:16, color:"var(--text)" }}>{p.name}</h3>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:14, lineHeight:1.5 }}>{p.desc.substring(0,55)}...</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"var(--gold)", fontWeight:900, fontSize:18 }}>{kwd(p.price)}</span>
          <button className="btn-gold" onClick={handleAdd} style={{
            padding:"8px 18px", fontSize:13,
            background: added ? "linear-gradient(135deg,var(--success),#7fe0a0)" : undefined
          }}>
            {added ? "✓ تمت" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// SHOP PAGE
// ==============================
function ShopPage({ products, addToCart, setPage, page }) {
  const urlCat = page.includes("?cat=") ? page.split("?cat=")[1] : "all";
  const [cat, setCat] = useState(urlCat);
  const [sort, setSort] = useState("default");

  let filtered = cat === "all" ? products : products.filter(p => p.cat === cat);
  if (sort === "asc") filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "desc") filtered = [...filtered].sort((a,b) => b.price - a.price);

  return (
    <div className="container" style={{ padding:"40px 20px" }}>
      <h1 className="page-title" style={{ marginBottom:30 }}>المتجر</h1>
      <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:30, flexWrap:"wrap", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[["all","الكل"],["cakes","كيك 🎂"],["flowers","ورد 🌹"],["gifts","هدايا 🎁"]].map(([v,l]) => (
            <button key={v} onClick={() => setCat(v)} style={{
              padding:"8px 20px", borderRadius:20, border:"1.5px solid",
              borderColor: cat===v ? "var(--gold)" : "var(--border)",
              background: cat===v ? "var(--gold)" : "transparent",
              color: cat===v ? "#0f0f1a" : "var(--muted)",
              cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"Tajawal,sans-serif"
            }}>{l}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field" style={{ width:"auto", padding:"8px 14px" }}>
          <option value="default">الترتيب الافتراضي</option>
          <option value="asc">السعر: من الأقل</option>
          <option value="desc">السعر: من الأعلى</option>
        </select>
      </div>
      <p style={{ color:"var(--muted)", marginBottom:20 }}>📦 {filtered.length} منتج</p>
      <div className="grid-products">
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} setPage={setPage} />)}
      </div>
    </div>
  );
}

// ==============================
// PRODUCT PAGE
// ==============================
function ProductPage({ page, products, addToCart, setPage, cart }) {
  const id = parseInt(page.split("?")[1]);
  const p = products.find(pr => pr.id === id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!p) return <div style={{ padding:80, textAlign:"center", color:"var(--muted)" }}>المنتج غير موجود</div>;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(p);
    setAdded(true);
    setTimeout(() => { setAdded(false); setPage("cart"); }, 1000);
  };

  return (
    <div className="container" style={{ padding:"40px 20px" }}>
      <button onClick={() => setPage("shop")} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", marginBottom:20, fontSize:14 }}>
        ← العودة للمتجر
      </button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
        <img src={p.img} alt={p.name} style={{ width:"100%", borderRadius:16, maxHeight:450, objectFit:"cover" }} />
        <div style={{ paddingTop:10 }}>
          {p.badge && <span className="badge" style={{ marginBottom:14, display:"inline-block" }}>{p.badge}</span>}
          <h1 style={{ fontSize:32, fontWeight:900, marginBottom:12 }}>{p.name}</h1>
          <div style={{ fontSize:32, color:"var(--gold)", fontWeight:900, marginBottom:20 }}>{kwd(p.price)}</div>
          <p style={{ color:"var(--muted)", lineHeight:1.8, marginBottom:30, fontSize:16 }}>{p.desc}</p>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
            <button onClick={() => setQty(Math.max(1,qty-1))} style={{ width:40, height:40, borderRadius:"50%", background:"var(--bg3)", border:"1px solid var(--border)", color:"var(--text)", fontSize:20, cursor:"pointer" }}>-</button>
            <span style={{ fontSize:22, fontWeight:800, minWidth:30, textAlign:"center" }}>{qty}</span>
            <button onClick={() => setQty(qty+1)} style={{ width:40, height:40, borderRadius:"50%", background:"var(--bg3)", border:"1px solid var(--border)", color:"var(--text)", fontSize:20, cursor:"pointer" }}>+</button>
            <span style={{ color:"var(--muted)", fontSize:14 }}>متاح: {p.stock} قطعة</span>
          </div>
          <button className="btn-gold" onClick={handleAdd} style={{ width:"100%", padding:16, fontSize:17, background: added ? "linear-gradient(135deg,var(--success),#7fe0a0)" : undefined }}>
            {added ? "✓ تمت الإضافة - جاري التحويل..." : "أضف إلى السلة 🛒"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// CART PAGE
// ==============================
function CartPage({ cart, setCart, setPage, currentUser }) {
  const sub = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const delivery = sub > 15 ? 0 : 1.500;
  const total = sub + delivery;

  const update = (id, dir) => setCart(prev => prev.map(i => i.id===id ? {...i, qty:Math.max(1,i.qty+dir)} : i));
  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));

  if (!cart.length) return (
    <div style={{ textAlign:"center", padding:"100px 20px" }}>
      <div style={{ fontSize:80, marginBottom:20, opacity:.3 }}>🛒</div>
      <h2 style={{ color:"var(--muted)", marginBottom:16 }}>السلة فارغة</h2>
      <button className="btn-gold" onClick={() => setPage("shop")}>تسوق الآن</button>
    </div>
  );

  return (
    <div className="container" style={{ padding:"40px 20px" }}>
      <h1 className="page-title" style={{ marginBottom:30 }}>سلة المشتريات</h1>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:30 }}>
        <div>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ display:"flex", gap:16, padding:18, marginBottom:16 }}>
              <img src={item.img} alt={item.name} style={{ width:90, height:90, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <h3 style={{ marginBottom:8, fontWeight:800 }}>{item.name}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                  <button onClick={() => update(item.id,-1)} style={{ width:30, height:30, borderRadius:"50%", background:"var(--bg3)", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text)" }}>-</button>
                  <span style={{ fontWeight:800, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => update(item.id,+1)} style={{ width:30, height:30, borderRadius:"50%", background:"var(--bg3)", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text)" }}>+</button>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"var(--gold)", fontWeight:900 }}>{kwd(item.price * item.qty)}</span>
                  <button onClick={() => remove(item.id)} style={{ background:"none", border:"none", color:"var(--danger)", cursor:"pointer", fontSize:13 }}>حذف ✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card" style={{ padding:24, position:"sticky", top:80 }}>
            <h3 style={{ fontWeight:800, marginBottom:20, color:"var(--gold)" }}>ملخص الطلب</h3>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)", color:"var(--muted)" }}>
              <span>المجموع الفرعي</span><span>{kwd(sub)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)", color:"var(--muted)" }}>
              <span>رسوم التوصيل</span>
              <span style={{ color: delivery===0 ? "var(--success)" : undefined }}>{delivery===0 ? "مجاني 🎉" : kwd(delivery)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0", fontSize:20, fontWeight:900 }}>
              <span>الإجمالي</span><span style={{ color:"var(--gold)" }}>{kwd(total)}</span>
            </div>
            <button className="btn-gold" onClick={() => setPage(currentUser ? "checkout" : "login")} style={{ width:"100%", padding:14, fontSize:16 }}>
              {currentUser ? "المتابعة للدفع →" : "سجل الدخول للمتابعة"}
            </button>
            <button className="btn-outline" onClick={() => setPage("shop")} style={{ width:"100%", marginTop:10, padding:12 }}>
              متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================
// CHECKOUT PAGE
// ==============================
function CheckoutPage({ cart, currentUser, placeOrder, setPage, setSelectedOrder }) {
  const [form, setForm] = useState({ name: currentUser?.name||"", phone: currentUser?.phone||"", area:"", address:"", notes:"", payment:"cash" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sub = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const delivery = sub > 15 ? 0 : 1.500;
  const total = sub + delivery;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.match(/^[569]\d{7}$/)) e.phone = "رقم هاتف غير صحيح (8 أرقام)";
    if (!form.area) e.area = "اختر المنطقة";
    if (!form.address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const order = await placeOrder({
      customerName: form.name,
      customerEmail: currentUser.email,
      customerPhone: form.phone,
      userId: currentUser.id,
      area: form.area,
      address: form.address,
      notes: form.notes,
      payment: form.payment,
      items: cart,
      subtotal: sub,
      delivery,
      total,
    });
    setLoading(false);
    setSelectedOrder(order);
    setPage("receipt");
  };

  if (!cart.length) { setPage("shop"); return null; }

  return (
    <div className="container" style={{ padding:"40px 20px" }}>
      <h1 className="page-title" style={{ marginBottom:30 }}>إتمام الطلب</h1>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:30 }}>
        <div>
          {/* Delivery */}
          <div className="card" style={{ padding:24, marginBottom:20 }}>
            <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:20 }}>📍 معلومات التوصيل</h3>
            <FormField label="الاسم الكامل" error={errors.name}>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="اسمك الكريم" />
            </FormField>
            <div className="grid-2" style={{ marginBottom:0 }}>
              <FormField label="رقم الهاتف" error={errors.phone}>
                <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="5xxxxxxx" maxLength={8} />
              </FormField>
              <FormField label="المنطقة" error={errors.area}>
                <select className="input-field" value={form.area} onChange={e => setForm({...form, area:e.target.value})}>
                  <option value="">اختر المنطقة</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="العنوان التفصيلي" error={errors.address}>
              <textarea className="input-field" value={form.address} onChange={e => setForm({...form, address:e.target.value})} rows={2} placeholder="اسم الشارع، رقم المبنى..." style={{ resize:"vertical" }} />
            </FormField>
            <FormField label="ملاحظات إضافية (اختياري)">
              <textarea className="input-field" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} rows={2} style={{ resize:"vertical" }} />
            </FormField>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding:24 }}>
            <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:20 }}>💳 طريقة الدفع</h3>
            {[["cash","الدفع نقداً عند الاستلام 💵"],["card","بطاقة ائتمانية 💳"],["transfer","تحويل بنكي 🏦"]].map(([v,l]) => (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:12, padding:14, marginBottom:10, background:"var(--bg3)", borderRadius:10, cursor:"pointer", border:"1.5px solid", borderColor: form.payment===v ? "var(--gold)" : "var(--border)" }}>
                <input type="radio" name="payment" value={v} checked={form.payment===v} onChange={() => setForm({...form, payment:v})} style={{ accentColor:"var(--gold)" }} />
                <span style={{ fontWeight:600 }}>{l}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ padding:24, position:"sticky", top:80 }}>
            <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:20 }}>🛒 ملخص الطلب</h3>
            <div style={{ maxHeight:200, overflowY:"auto", marginBottom:16 }}>
              {cart.map(i => (
                <div key={i.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)", fontSize:14, color:"var(--muted)" }}>
                  <span>{i.name} ×{i.qty}</span>
                  <span>{kwd(i.price*i.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", color:"var(--muted)" }}>
              <span>المجموع الفرعي</span><span>{kwd(sub)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", color:"var(--muted)" }}>
              <span>التوصيل</span><span style={{ color:delivery===0?"var(--success)":undefined }}>{delivery===0?"مجاني":kwd(delivery)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0 0", marginTop:8, borderTop:"2px solid var(--border)", fontSize:20, fontWeight:900 }}>
              <span>الإجمالي</span><span style={{ color:"var(--gold)" }}>{kwd(total)}</span>
            </div>
            <button className="btn-gold" onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:16, fontSize:16, marginTop:20, opacity:loading?.7:1 }}>
              {loading ? "⏳ جاري معالجة الطلب..." : `إتمام الطلب • ${kwd(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children, error }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", fontWeight:700, color:"var(--muted)", fontSize:13, marginBottom:6 }}>{label}</label>
      {children}
      {error && <div style={{ color:"var(--danger)", fontSize:12, marginTop:4 }}>{error}</div>}
    </div>
  );
}

// ==============================
// RECEIPT PAGE
// ==============================
function ReceiptPage({ selectedOrder, setPage }) {
  if (!selectedOrder) { setPage("home"); return null; }
  const o = selectedOrder;
  return (
    <div className="container" style={{ padding:"40px 20px", maxWidth:600 }}>
      <div className="card" style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:70, marginBottom:16 }}>🎉</div>
        <h1 style={{ color:"var(--success)", marginBottom:8, fontWeight:900 }}>تم استلام طلبك!</h1>
        <p style={{ color:"var(--muted)", marginBottom:30 }}>شكراً {o.customerName}، سيصل طلبك قريباً</p>

        <div style={{ background:"var(--bg3)", borderRadius:12, padding:20, marginBottom:24, textAlign:"right" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ color:"var(--gold)", fontWeight:800, fontSize:20 }}>{o.id}</span>
            <span style={{ color:"var(--muted)", fontSize:13 }}>{o.date} {o.time}</span>
          </div>
          {o.items.map(i => (
            <div key={i.id} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--border)", color:"var(--muted)", fontSize:14 }}>
              <span>{i.name} ×{i.qty}</span><span>{kwd(i.price*i.qty)}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 0", fontWeight:900, fontSize:18 }}>
            <span>الإجمالي</span><span style={{ color:"var(--gold)" }}>{kwd(o.total)}</span>
          </div>
        </div>

        <div style={{ background:"rgba(94,201,138,.1)", border:"1px solid rgba(94,201,138,.3)", borderRadius:10, padding:14, marginBottom:24, color:"var(--success)", fontSize:14, textAlign:"right" }}>
          📍 التوصيل إلى: {o.area} - {o.address}
        </div>

        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button className="btn-gold" onClick={() => setPage("orders")}>متابعة طلباتي</button>
          <button className="btn-outline" onClick={() => setPage("shop")}>مواصلة التسوق</button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// MY ORDERS PAGE
// ==============================
function MyOrdersPage({ orders, currentUser, setPage, setSelectedOrder }) {
  if (!currentUser) { setPage("login"); return null; }
  const myOrders = orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email);

  return (
    <div className="container" style={{ padding:"40px 20px" }}>
      <h1 className="page-title" style={{ marginBottom:30 }}>طلباتي</h1>
      {!myOrders.length ? (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:70, opacity:.3, marginBottom:16 }}>📦</div>
          <h3 style={{ color:"var(--muted)" }}>لا توجد طلبات بعد</h3>
          <button className="btn-gold" onClick={() => setPage("shop")} style={{ marginTop:20 }}>تسوق الآن</button>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {myOrders.map(o => (
            <div key={o.id} className="card" style={{ padding:22, cursor:"pointer" }} onClick={() => { setSelectedOrder(o); setPage("receipt"); }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ color:"var(--gold)", fontWeight:800, fontSize:18 }}>{o.id}</span>
                <span style={{ background:`${STATUS_COLOR[o.status]}20`, color:STATUS_COLOR[o.status], border:`1px solid ${STATUS_COLOR[o.status]}50`, padding:"4px 14px", borderRadius:20, fontSize:13, fontWeight:700 }}>
                  {STATUS_MAP[o.status] || o.status}
                </span>
              </div>
              <div style={{ color:"var(--muted)", fontSize:14, marginBottom:12 }}>
                {o.items?.length} منتجات • {o.date} {o.time}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"var(--muted)", fontSize:13 }}>📍 {o.area}</span>
                <span style={{ color:"var(--gold)", fontWeight:900, fontSize:18 }}>{kwd(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================
// LOGIN PAGE
// ==============================
function LoginPage({ login, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true); setError("");
    setTimeout(() => {
      const r = login(email, password);
      if (r.success) {
        setPage(r.user.role === "admin" ? "admin" : "home");
      } else {
        setError(r.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:20 }}>
      <div className="card" style={{ padding:40, width:"100%", maxWidth:420 }}>
        <h2 style={{ textAlign:"center", fontWeight:900, fontSize:28, marginBottom:8 }}>تسجيل الدخول</h2>
        <p style={{ textAlign:"center", color:"var(--muted)", marginBottom:30 }}>مرحباً بك في Gift Star ✨</p>
        {error && <div style={{ background:"rgba(224,85,85,.1)", border:"1px solid rgba(224,85,85,.3)", color:"var(--danger)", padding:12, borderRadius:10, marginBottom:20, textAlign:"center", fontSize:14 }}>{error}</div>}
        <FormField label="البريد الإلكتروني">
          <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" onKeyDown={e => e.key==="Enter"&&handleLogin()} />
        </FormField>
        <FormField label="كلمة المرور">
          <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" onKeyDown={e => e.key==="Enter"&&handleLogin()} />
        </FormField>
        <button className="btn-gold" onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:14, fontSize:16, opacity:loading?.7:1, marginTop:8 }}>
          {loading ? "⏳ جاري تسجيل الدخول..." : "دخول"}
        </button>
        <div style={{ marginTop:20, padding:16, background:"var(--bg3)", borderRadius:10, fontSize:13, color:"var(--muted)" }}>
          <div style={{ marginBottom:4 }}>🔑 للتجربة: <span style={{ color:"var(--gold)" }}>admin@giftstar.kw</span> / Admin@2024</div>
          <div>👤 مستخدم: <span style={{ color:"var(--gold)" }}>ahmed@test.com</span> / 12345678</div>
        </div>
        <p style={{ textAlign:"center", marginTop:20, color:"var(--muted)", fontSize:14 }}>
          ليس لديك حساب؟{" "}
          <button onClick={() => setPage("register")} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontWeight:700, fontSize:14 }}>
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  );
}

// ==============================
// REGISTER PAGE
// ==============================
function RegisterPage({ register, setPage }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("يرجى ملء جميع الحقول"); return; }
    if (form.password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (form.password !== form.confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true); setError("");
    const r = await register(form.name, form.email, form.password, form.phone);
    if (r.success) setPage("home");
    else setError(r.error);
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:20 }}>
      <div className="card" style={{ padding:40, width:"100%", maxWidth:420 }}>
        <h2 style={{ textAlign:"center", fontWeight:900, fontSize:28, marginBottom:8 }}>إنشاء حساب</h2>
        <p style={{ textAlign:"center", color:"var(--muted)", marginBottom:30 }}>انضم إلى Gift Star 🌟</p>
        {error && <div style={{ background:"rgba(224,85,85,.1)", border:"1px solid rgba(224,85,85,.3)", color:"var(--danger)", padding:12, borderRadius:10, marginBottom:20, textAlign:"center", fontSize:14 }}>{error}</div>}
        {["name","email","phone","password","confirm"].map(field => (
          <FormField key={field} label={{ name:"الاسم الكامل", email:"البريد الإلكتروني", phone:"رقم الهاتف", password:"كلمة المرور", confirm:"تأكيد كلمة المرور" }[field]}>
            <input className="input-field" type={field.includes("pass")||field==="confirm"?"password":field==="email"?"email":"text"}
              value={form[field]} onChange={e => setForm({...form,[field]:e.target.value})} />
          </FormField>
        ))}
        <button className="btn-gold" onClick={handleRegister} disabled={loading} style={{ width:"100%", padding:14, fontSize:16, marginTop:8 }}>
          {loading ? "⏳ جاري الإنشاء..." : "إنشاء الحساب"}
        </button>
        <p style={{ textAlign:"center", marginTop:20, color:"var(--muted)", fontSize:14 }}>
          لديك حساب؟{" "}
          <button onClick={() => setPage("login")} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontWeight:700, fontSize:14 }}>تسجيل الدخول</button>
        </p>
      </div>
    </div>
  );
}

// ==============================
// ADMIN PAGE
// ==============================
function AdminPage({ orders, products, users, updateOrderStatus, saveProducts, adminTab, setAdminTab, notifications, unreadCount, markAllRead, showToast, announcements, saveAnnouncements }) {
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s,o) => s + o.total, 0);
  const todayOrders = orders.filter(o => o.date === new Date().toLocaleDateString("ar-KW"));

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100vh - 120px)" }}>
      {/* Sidebar */}
      <div style={{ background:"var(--bg2)", borderLeft:"1px solid var(--border)", padding:20 }}>
        <div style={{ marginBottom:30 }}>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:12, fontWeight:700 }}>لوحة التحكم</div>
          {[
            ["dashboard","📊 الرئيسية"],
            ["orders","📦 الطلبات"],
            ["products","🎁 المنتجات"],
            ["announcements","📢 الإعلانات"],
            ["notifications","🔔 الإشعارات"],
            ["users","👥 المستخدمين"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setAdminTab(id)} style={{
              display:"block", width:"100%", padding:"10px 14px", marginBottom:6, textAlign:"right",
              background: adminTab===id ? "rgba(200,169,110,.15)" : "transparent",
              border: adminTab===id ? "1px solid var(--border2)" : "1px solid transparent",
              borderRadius:10, color: adminTab===id ? "var(--gold)" : "var(--muted)",
              cursor:"pointer", fontSize:14, fontFamily:"Tajawal,sans-serif", fontWeight: adminTab===id ? 800 : 400,
              position:"relative"
            }}>
              {label}
              {id === "notifications" && unreadCount > 0 && (
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"var(--danger)", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:30, overflowY:"auto" }}>
        {adminTab === "dashboard" && <AdminDashboard orders={orders} products={products} users={users} totalRevenue={totalRevenue} todayOrders={todayOrders} />}
        {adminTab === "orders" && <AdminOrders orders={orders} updateOrderStatus={updateOrderStatus} />}
        {adminTab === "products" && <AdminProducts products={products} saveProducts={saveProducts} showToast={showToast} />}
        {adminTab === "announcements" && <AdminAnnouncements announcements={announcements} saveAnnouncements={saveAnnouncements} showToast={showToast} />}
        {adminTab === "notifications" && <AdminNotifications notifications={notifications} markAllRead={markAllRead} />}
        {adminTab === "users" && <AdminUsers users={users} orders={orders} />}
      </div>
    </div>
  );
}

function AdminDashboard({ orders, products, users, totalRevenue, todayOrders }) {
  const stats = [
    { label:"إجمالي الطلبات", value:orders.length, icon:"📦", color:"var(--gold)" },
    { label:"طلبات اليوم", value:todayOrders.length, icon:"🗓️", color:"var(--success)" },
    { label:"إجمالي المبيعات", value:kwd(totalRevenue), icon:"💰", color:"#a78bfa" },
    { label:"المنتجات النشطة", value:products.length, icon:"🎁", color:"#38bdf8" },
    { label:"المستخدمين", value:users.filter(u=>u.role==="customer").length, icon:"👥", color:"#fb923c" },
    { label:"قيد المعالجة", value:orders.filter(o=>["new","processing"].includes(o.status)).length, icon:"⚡", color:"#f59e0b" },
  ];
  return (
    <div>
      <h2 style={{ color:"var(--gold)", fontWeight:900, marginBottom:24 }}>📊 نظرة عامة</h2>
      <div className="grid-3" style={{ marginBottom:30 }}>
        {stats.map((s,i) => (
          <div key={i} className="card" style={{ padding:20 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ color:"var(--muted)", fontSize:14 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:16 }}>آخر الطلبات</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {orders.slice(0,5).map(o => (
          <div key={o.id} className="card" style={{ padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <span style={{ color:"var(--gold)", fontWeight:800 }}>{o.id}</span>
              <span style={{ color:"var(--muted)", fontSize:13, marginRight:12 }}>{o.customerName} • {o.date}</span>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ background:`${STATUS_COLOR[o.status]}20`, color:STATUS_COLOR[o.status], border:`1px solid ${STATUS_COLOR[o.status]}50`, padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                {STATUS_MAP[o.status]}
              </span>
              <span style={{ color:"var(--gold)", fontWeight:900 }}>{kwd(o.total)}</span>
            </div>
          </div>
        ))}
        {!orders.length && <div style={{ color:"var(--muted)", textAlign:"center", padding:40 }}>لا توجد طلبات بعد</div>}
      </div>
    </div>
  );
}

function AdminOrders({ orders, updateOrderStatus }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h2 style={{ color:"var(--gold)", fontWeight:900, marginBottom:24 }}>📦 إدارة الطلبات</h2>
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {[["all","الكل"],["new","جديد"],["processing","قيد المعالجة"],["delivered","مُسلَّم"],["cancelled","ملغي"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding:"7px 18px", borderRadius:20, border:"1.5px solid",
            borderColor: filter===v?"var(--gold)":"var(--border)",
            background: filter===v?"var(--gold)":"transparent",
            color: filter===v?"#0f0f1a":"var(--muted)",
            cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"Tajawal,sans-serif"
          }}>{l} {v!=="all"&&`(${orders.filter(o=>o.status===v).length})`}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(o => (
          <div key={o.id} className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <span style={{ color:"var(--gold)", fontWeight:900, fontSize:18 }}>{o.id}</span>
                <span style={{ color:"var(--muted)", fontSize:13, marginRight:12 }}>{o.date} {o.time}</span>
              </div>
              <span style={{ color:"var(--gold)", fontWeight:900, fontSize:20 }}>{kwd(o.total)}</span>
            </div>
            <div className="grid-2" style={{ marginBottom:14, fontSize:14, color:"var(--muted)" }}>
              <div>👤 {o.customerName}</div>
              <div>📱 {o.customerPhone}</div>
              <div>📍 {o.area} - {o.address}</div>
              <div>💳 {o.payment === "cash" ? "نقداً" : o.payment === "card" ? "بطاقة" : "تحويل بنكي"}</div>
            </div>
            <div style={{ marginBottom:14 }}>
              {o.items?.map(i => (
                <span key={i.id} style={{ display:"inline-block", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, padding:"3px 10px", margin:"3px", fontSize:13, color:"var(--muted)" }}>
                  {i.name} ×{i.qty}
                </span>
              ))}
            </div>
            {o.notes && <div style={{ color:"var(--muted)", fontSize:13, marginBottom:14, padding:"8px 12px", background:"var(--bg3)", borderRadius:8 }}>💬 {o.notes}</div>}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"var(--muted)" }}>تغيير الحالة:</span>
              {Object.entries(STATUS_MAP).map(([v,l]) => (
                <button key={v} onClick={() => updateOrderStatus(o.id, v)} style={{
                  padding:"6px 14px", borderRadius:20, border:"1.5px solid",
                  borderColor: o.status===v ? STATUS_COLOR[v] : "var(--border)",
                  background: o.status===v ? `${STATUS_COLOR[v]}20` : "transparent",
                  color: o.status===v ? STATUS_COLOR[v] : "var(--muted)",
                  cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"Tajawal,sans-serif"
                }}>{l}</button>
              ))}
            </div>
          </div>
        ))}
        {!filtered.length && <div style={{ color:"var(--muted)", textAlign:"center", padding:60 }}>لا توجد طلبات</div>}
      </div>
    </div>
  );
}

function AdminProducts({ products, saveProducts, showToast }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);

  const startEdit = (p) => { setEditing(p.id); setForm({...p}); setShowAdd(false); };
  const startAdd = () => { setShowAdd(true); setEditing(null); setForm({ id:Date.now(), name:"", cat:"cakes", price:0, img:"", desc:"", badge:"", stock:10, featured:false }); };
  const cancelEdit = () => { setEditing(null); setShowAdd(false); };

  const save = async () => {
    if (!form.name || !form.price) { showToast("يرجى ملء الحقول الإلزامية", "error"); return; }
    let newProducts;
    if (showAdd) {
      newProducts = [form, ...products];
    } else {
      newProducts = products.map(p => p.id === editing ? form : p);
    }
    await saveProducts(newProducts);
    showToast(showAdd ? "تمت إضافة المنتج ✅" : "تم تحديث المنتج ✅");
    cancelEdit();
  };

  const deleteProduct = async (id) => {
    await saveProducts(products.filter(p => p.id !== id));
    showToast("تم حذف المنتج");
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:"var(--gold)", fontWeight:900 }}>🎁 إدارة المنتجات</h2>
        <button className="btn-gold" onClick={startAdd}>+ إضافة منتج</button>
      </div>

      {(editing !== null || showAdd) && (
        <div className="card" style={{ padding:24, marginBottom:24 }}>
          <h3 style={{ color:"var(--gold)", marginBottom:20 }}>{showAdd ? "إضافة منتج جديد" : "تعديل المنتج"}</h3>
          <div className="grid-2">
            <FormField label="اسم المنتج *"><input className="input-field" value={form.name||""} onChange={e => setForm({...form,name:e.target.value})} /></FormField>
            <FormField label="الفئة">
              <select className="input-field" value={form.cat||"cakes"} onChange={e => setForm({...form,cat:e.target.value})}>
                <option value="cakes">كيك</option><option value="flowers">ورد</option><option value="gifts">هدايا</option>
              </select>
            </FormField>
            <FormField label="السعر (د.ك) *"><input className="input-field" type="number" step="0.001" value={form.price||""} onChange={e => setForm({...form,price:parseFloat(e.target.value)})} /></FormField>
            <FormField label="المخزون"><input className="input-field" type="number" value={form.stock||0} onChange={e => setForm({...form,stock:parseInt(e.target.value)})} /></FormField>
          </div>
          <FormField label="رابط الصورة"><input className="input-field" value={form.img||""} onChange={e => setForm({...form,img:e.target.value})} /></FormField>
          <FormField label="الوصف"><textarea className="input-field" value={form.desc||""} onChange={e => setForm({...form,desc:e.target.value})} rows={2} style={{resize:"vertical"}} /></FormField>
          <div className="grid-2">
            <FormField label="شارة (اختياري)"><input className="input-field" value={form.badge||""} onChange={e => setForm({...form,badge:e.target.value})} placeholder="مثال: جديد" /></FormField>
            <FormField label="مميز في الرئيسية">
              <label style={{ display:"flex", alignItems:"center", gap:10, marginTop:4, cursor:"pointer" }}>
                <input type="checkbox" checked={form.featured||false} onChange={e => setForm({...form,featured:e.target.checked})} style={{ width:18, height:18, accentColor:"var(--gold)" }} />
                <span>نعم</span>
              </label>
            </FormField>
          </div>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button className="btn-gold" onClick={save}>💾 حفظ</button>
            <button className="btn-outline" onClick={cancelEdit}>إلغاء</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {products.map(p => (
          <div key={p.id} className="card" style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
            <img src={p.img} alt={p.name} style={{ width:70, height:70, borderRadius:10, objectFit:"cover", flexShrink:0 }} onError={e => e.target.src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=70&h=70&fit=crop"} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, marginBottom:4 }}>{p.name}</div>
              <div style={{ color:"var(--muted)", fontSize:13 }}>{p.cat} • مخزون: {p.stock} • {kwd(p.price)}</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-outline" onClick={() => startEdit(p)} style={{ padding:"6px 16px", fontSize:13 }}>تعديل</button>
              <button onClick={() => deleteProduct(p.id)} style={{ padding:"6px 16px", background:"rgba(224,85,85,.1)", border:"1px solid rgba(224,85,85,.3)", color:"var(--danger)", borderRadius:20, cursor:"pointer", fontSize:13, fontFamily:"Tajawal,sans-serif" }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminNotifications({ notifications, markAllRead }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:"var(--gold)", fontWeight:900 }}>🔔 الإشعارات</h2>
        {notifications.some(n => !n.read) && (
          <button className="btn-outline" onClick={markAllRead} style={{ fontSize:13 }}>تحديد الكل كمقروء</button>
        )}
      </div>
      {!notifications.length ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>
          <div style={{ fontSize:50, marginBottom:16 }}>🔕</div>
          <p>لا توجد إشعارات بعد</p>
          <p style={{ fontSize:13, marginTop:8 }}>ستظهر هنا عند استلام طلبات جديدة</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding:18, display:"flex", gap:14, alignItems:"flex-start", background: n.read ? "var(--bg2)" : "rgba(200,169,110,.05)", borderColor: n.read ? "var(--border)" : "var(--border2)" }}>
              <span style={{ fontSize:28, flexShrink:0 }}>🛒</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, marginBottom:6, lineHeight:1.6 }}>{n.text}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{new Date(n.time).toLocaleString("ar-KW")}</div>
              </div>
              {!n.read && <div style={{ width:10, height:10, borderRadius:"50%", background:"var(--gold)", flexShrink:0, marginTop:6 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminUsers({ users, orders }) {
  return (
    <div>
      <h2 style={{ color:"var(--gold)", fontWeight:900, marginBottom:24 }}>👥 المستخدمين ({users.filter(u=>u.role==="customer").length} عميل)</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {users.filter(u => u.role === "customer").map(u => {
          const userOrders = orders.filter(o => o.customerEmail === u.email);
          const spent = userOrders.reduce((s,o) => s + o.total, 0);
          return (
            <div key={u.id} className="card" style={{ padding:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,var(--gold),var(--gold-light))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#0f0f1a", fontWeight:900 }}>
                  {u.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight:800 }}>{u.name}</div>
                  <div style={{ color:"var(--muted)", fontSize:13 }}>{u.email} • {u.phone}</div>
                </div>
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ color:"var(--gold)", fontWeight:800 }}>{kwd(spent)}</div>
                <div style={{ color:"var(--muted)", fontSize:13 }}>{userOrders.length} طلبات</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==============================
// ADMIN ANNOUNCEMENTS
// ==============================
function AdminAnnouncements({ announcements, saveAnnouncements, showToast }) {
  const [items, setItems] = useState(announcements || []);
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState("gold");

  useEffect(() => { setItems(announcements || []); }, [announcements]);

  const colorOptions = [
    { value:"gold",  label:"ذهبي", bg:"linear-gradient(90deg,#a68840,#c8a96e)" },
    { value:"red",   label:"أحمر",  bg:"linear-gradient(90deg,#c0392b,#e74c3c)" },
    { value:"green", label:"أخضر", bg:"linear-gradient(90deg,#27ae60,#2ecc71)" },
    { value:"blue",  label:"أزرق",  bg:"linear-gradient(90deg,#2980b9,#3498db)" },
    { value:"dark",  label:"داكن",  bg:"linear-gradient(90deg,#1a1a2e,#2d2d4e)" },
  ];

  const addAnn = async () => {
    if (!newText.trim()) { showToast("أدخل نص الإعلان", "error"); return; }
    const newItems = [...items, { id: Date.now(), text: newText.trim(), active: true, color: newColor }];
    setItems(newItems);
    await saveAnnouncements(newItems);
    setNewText("");
    setNewColor("gold");
    showToast("تمت إضافة الإعلان ✅");
  };

  const toggleActive = async (id) => {
    const updated = items.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setItems(updated);
    await saveAnnouncements(updated);
  };

  const deleteAnn = async (id) => {
    const updated = items.filter(a => a.id !== id);
    setItems(updated);
    await saveAnnouncements(updated);
    showToast("تم حذف الإعلان");
  };

  const colMap = {
    gold:  { bg:"linear-gradient(90deg,#a68840,#c8a96e)", color:"#0f0f1a" },
    red:   { bg:"linear-gradient(90deg,#c0392b,#e74c3c)", color:"#fff" },
    green: { bg:"linear-gradient(90deg,#27ae60,#2ecc71)", color:"#fff" },
    blue:  { bg:"linear-gradient(90deg,#2980b9,#3498db)", color:"#fff" },
    dark:  { bg:"linear-gradient(90deg,#1a1a2e,#2d2d4e)", color:"#c8a96e" },
  };

  return (
    <div>
      <h2 style={{ color:"var(--gold)", fontWeight:900, marginBottom:24 }}>📢 إدارة الإعلانات</h2>
      <p style={{ color:"var(--muted)", fontSize:14, marginBottom:24 }}>
        الإعلانات تظهر في الشريط الملون أعلى كل صفحة. يمكنك إضافة أكثر من إعلان وسيتم تبديلها تلقائياً.
      </p>

      {/* Add new */}
      <div className="card" style={{ padding:24, marginBottom:28 }}>
        <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:18 }}>+ إضافة إعلان جديد</h3>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontWeight:700, color:"var(--muted)", fontSize:13, marginBottom:6 }}>نص الإعلان</label>
          <input
            className="input-field"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="مثال: ✨ خصم 20% على جميع الكيك اليوم فقط!"
            onKeyDown={e => e.key === "Enter" && addAnn()}
          />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontWeight:700, color:"var(--muted)", fontSize:13, marginBottom:10 }}>لون الشريط</label>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {colorOptions.map(c => (
              <button key={c.value} onClick={() => setNewColor(c.value)} style={{
                padding:"8px 18px", borderRadius:20, border:"2px solid",
                borderColor: newColor === c.value ? "#fff" : "transparent",
                background: c.bg, color: c.value === "gold" || c.value === "dark" ? (c.value==="gold"?"#0f0f1a":"#c8a96e") : "#fff",
                cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"Tajawal,sans-serif",
                boxShadow: newColor === c.value ? "0 0 0 3px rgba(200,169,110,.4)" : "none",
              }}>{c.label}</button>
            ))}
          </div>
        </div>
        {/* Preview */}
        {newText && (
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontWeight:700, color:"var(--muted)", fontSize:13, marginBottom:8 }}>معاينة:</label>
            <div style={{ ...colMap[newColor], background:colMap[newColor].bg, padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, textAlign:"center" }}>
              {newText}
            </div>
          </div>
        )}
        <button className="btn-gold" onClick={addAnn} style={{ padding:"10px 28px" }}>+ إضافة</button>
      </div>

      {/* List */}
      <h3 style={{ color:"var(--gold)", fontWeight:800, marginBottom:16 }}>الإعلانات الحالية ({items.length})</h3>
      {!items.length ? (
        <div style={{ textAlign:"center", padding:50, color:"var(--muted)", background:"var(--bg2)", borderRadius:16, border:"1px solid var(--border)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📢</div>
          <p>لا توجد إعلانات. أضف إعلاناً ليظهر في الموقع.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.map(ann => {
            const cs = colMap[ann.color] || colMap.gold;
            return (
              <div key={ann.id} className="card" style={{ padding:18, display:"flex", gap:14, alignItems:"center", opacity: ann.active ? 1 : 0.5 }}>
                {/* Color preview bar */}
                <div style={{ width:6, height:50, borderRadius:4, background:cs.bg, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, marginBottom:4, fontSize:15 }}>{ann.text}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>
                    اللون: {colorOptions.find(c=>c.value===ann.color)?.label || ann.color}
                    {" • "}
                    <span style={{ color: ann.active ? "var(--success)" : "var(--danger)", fontWeight:700 }}>
                      {ann.active ? "● مفعّل" : "● مخفي"}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <button onClick={() => toggleActive(ann.id)} style={{
                    padding:"6px 16px", borderRadius:20, border:"1.5px solid",
                    borderColor: ann.active ? "var(--success)" : "var(--border)",
                    background: ann.active ? "rgba(94,201,138,.1)" : "transparent",
                    color: ann.active ? "var(--success)" : "var(--muted)",
                    cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"Tajawal,sans-serif"
                  }}>
                    {ann.active ? "إخفاء" : "إظهار"}
                  </button>
                  <button onClick={() => deleteAnn(ann.id)} style={{
                    padding:"6px 16px", borderRadius:20, border:"1px solid rgba(224,85,85,.3)",
                    background:"rgba(224,85,85,.1)", color:"var(--danger)",
                    cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"Tajawal,sans-serif"
                  }}>حذف</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
