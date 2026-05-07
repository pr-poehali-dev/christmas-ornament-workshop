import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const IMG_ORNAMENT = "https://cdn.poehali.dev/projects/2f0fbbd7-69be-4e23-80fe-f0a7c71a7755/files/ed3c8296-6c28-4309-b169-92cabe70b232.jpg";
const IMG_WORKSHOP = "https://cdn.poehali.dev/projects/2f0fbbd7-69be-4e23-80fe-f0a7c71a7755/files/4b11eda5-05ed-44f8-bbef-44e6a17183e6.jpg";
const IMG_COLLECTION = "https://cdn.poehali.dev/projects/2f0fbbd7-69be-4e23-80fe-f0a7c71a7755/files/24ba75be-baea-43c2-b8a0-f498f1de7fee.jpg";

const PRODUCTS = [
  { id: 1, name: "Яблоко в золоте", desc: "Ручная роспись, 24-каратное золото", price: 1800, tag: "Хит", img: IMG_ORNAMENT },
  { id: 2, name: "Зимняя сказка", desc: "Стекло, серебряный декор, снежинки", price: 2200, tag: "Новинка", img: IMG_COLLECTION },
  { id: 3, name: "Лесной шар", desc: "Хвойный орнамент, матовое стекло", price: 1600, tag: "", img: IMG_WORKSHOP },
  { id: 4, name: "Царский орех", desc: "Форма ореха, золотая патина", price: 2600, tag: "Эксклюзив", img: IMG_ORNAMENT },
  { id: 5, name: "Рождественская звезда", desc: "Многолучевая звезда, ручная роспись", price: 1900, tag: "", img: IMG_COLLECTION },
  { id: 6, name: "Сахарная слива", desc: "Нежный фиолетовый, перламутр", price: 2100, tag: "Хит", img: IMG_WORKSHOP },
];

const STEPS = [
  { num: "01", title: "Выдувание", desc: "Мастер вручную выдувает стеклянный пузырь — каждая форма уникальна и неповторима, рождена дыханием человека." },
  { num: "02", title: "Серебрение", desc: "Внутри шара наносится специальный состав — он даёт то самое волшебное зеркальное мерцание." },
  { num: "03", title: "Роспись", desc: "Художник наносит узоры вручную тонкой кисточкой. Ни один шаблон, только живая рука и вдохновение." },
  { num: "04", title: "Золочение", desc: "Тончайший слой золота или серебра наносится в особых местах — для блеска и благородства." },
  { num: "05", title: "Сушка", desc: "Игрушка сохнет в тепле несколько часов. Торопиться нельзя — красота требует терпения." },
  { num: "06", title: "Упаковка", desc: "Каждая игрушка укладывается в фирменную коробку с папиросной бумагой и именной карточкой мастера." },
];

const HISTORY = [
  { year: "1848", title: "Первый стеклянный шар", text: "В немецком городе Лауша стеклодув впервые выдул шар вместо традиционных ореховых и яблочных украшений — так родилась эпоха стеклянных игрушек." },
  { year: "1936", title: "Советская ёлка", text: "После запрета ёлок в 1927-м их реабилитировали в 1935-м. Началось массовое производство советских игрушек — шары, колхозницы, дирижабли." },
  { year: "1960-е", title: "Золотой век", text: "Расцвет ёлочных игрушек: стеклянные фрукты, овощи, персонажи сказок. Мастера соревновались в изобретательности и красоте." },
  { year: "Сегодня", title: "Возрождение ремесла", text: "Мастерская «Рождественское Яблоко» хранит и передаёт традиции ручного производства, создавая каждую игрушку как произведение искусства." },
];

interface CartItem { id: number; name: string; price: number; qty: number; }

const Snowflakes = () => {
  const flakes = ["❄", "❅", "❆", "✦", "✧"];
  const items = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    flake: flakes[Math.floor(Math.random() * flakes.length)],
    left: Math.random() * 100,
    size: Math.random() * 14 + 8,
    dur1: Math.random() * 8 + 7,
    dur2: Math.random() * 4 + 3,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.3,
  }));
  return (
    <div aria-hidden="true">
      {items.map(f => (
        <span key={f.id} className="snowflake" style={{
          left: `${f.left}%`, fontSize: `${f.size}px`,
          animationDuration: `${f.dur1}s, ${f.dur2}s`,
          animationDelay: `${f.delay}s`, opacity: f.opacity,
        }}>{f.flake}</span>
      ))}
    </div>
  );
};

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [orderForm, setOrderForm] = useState({
    name: "", phone: "", email: "", type: "Стандарт", size: "Маленький (6 см)", color: "", notes: ""
  });

  const sections = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О мастерской" },
    { id: "gallery", label: "Галерея" },
    { id: "process", label: "Процесс" },
    { id: "order", label: "Заказать" },
    { id: "history", label: "История" },
    { id: "contacts", label: "Контакты" },
  ];

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35 }
    );
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 1rem",
    border: "1px solid var(--cream-dark)",
    background: "var(--cream)",
    fontFamily: "'Merriweather', serif",
    fontSize: "0.9rem", color: "var(--text-dark)", outline: "none",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <Snowflakes />

      {/* ===== NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(245,237,224,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--cream-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              <div className="leading-tight text-left">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--crimson)", letterSpacing: "0.03em" }}>Рождественское Яблоко</div>
                <div style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Мастерская ёлочных игрушек</div>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {sections.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className="nav-link"
                  style={{ color: activeSection === s.id ? "var(--crimson)" : "var(--text-dark)", fontWeight: activeSection === s.id ? 600 : 400 }}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCartOpen(true)} className="relative p-2" style={{ color: "var(--crimson)" }}>
                <Icon name="ShoppingBag" size={22} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "var(--crimson)" }}>
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 flex flex-col gap-1">
              {sections.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className="text-left py-2 nav-link" style={{ borderBottom: "1px solid var(--cream-dark)", paddingLeft: "0.5rem" }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ===== CART ===== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0" style={{ background: "rgba(42,26,14,0.55)" }} onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm flex flex-col h-full animate-slide-in-right" style={{ background: "var(--cream)", borderLeft: "2px solid var(--cream-dark)" }}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--cream-dark)" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--crimson)" }}>Корзина</h3>
              <button onClick={() => setCartOpen(false)} style={{ color: "var(--text-mid)" }}><Icon name="X" size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p style={{ color: "var(--text-mid)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>Корзина пуста</p>
                  <p style={{ color: "var(--text-mid)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Добавьте что-нибудь из галереи</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 retro-card">
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--text-dark)" }}>{item.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--crimson)", marginTop: "0.2rem" }}>{item.price.toLocaleString()} ₽ × {item.qty}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--text-mid)" }}><Icon name="Trash2" size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5" style={{ borderTop: "1px solid var(--cream-dark)" }}>
                <div className="flex justify-between mb-4">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>Итого:</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "var(--crimson)", fontWeight: 600 }}>{cartTotal.toLocaleString()} ₽</span>
                </div>
                <button className="btn-vintage w-full text-center" onClick={() => { setCartOpen(false); scrollTo("order"); }}>
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={IMG_ORNAMENT} alt="Ёлочная игрушка" className="w-full h-full object-cover" style={{ filter: "brightness(0.3) saturate(1.3)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(139,26,26,0.75) 0%, rgba(42,26,14,0.85) 55%, rgba(45,80,22,0.55) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(42,26,14,0.7) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--gold-light)" }}>Мастерская с 1998 года</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.0, marginBottom: "1.5rem" }}>
              Рождественское<br /><span className="gold-shimmer">Яблоко</span>
            </h1>
            <p style={{ color: "rgba(245,237,224,0.82)", fontFamily: "'Merriweather', serif", fontSize: "0.95rem", lineHeight: 2, maxWidth: "480px", marginBottom: "2.5rem" }}>
              Мастерская ручной росписи стеклянных ёлочных игрушек. Каждый шар создаётся с душой — от выдувания до золочения.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-vintage" onClick={() => scrollTo("gallery")}>Смотреть работы</button>
              <button className="btn-gold" onClick={() => scrollTo("order")}>Заказать игрушку</button>
            </div>
            <div className="flex gap-10 mt-12">
              {[["25+", "лет опыта"], ["4 000+", "игрушек"], ["12", "мастеров"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", color: "var(--gold-light)", fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(245,237,224,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-72">
              <div className="animate-ornament absolute inset-0">
                <img src={IMG_ORNAMENT} alt="Игрушка" className="w-full h-full object-cover"
                  style={{ borderRadius: "50%", border: "4px solid var(--gold)", boxShadow: "0 0 60px rgba(201,150,42,0.4), 0 0 120px rgba(139,26,26,0.3)" }} />
              </div>
              {["❄", "✦", "❅", "✧"].map((f, i) => (
                <span key={i} className="animate-sparkle absolute text-2xl"
                  style={{ color: "var(--gold-light)", top: `${[8, 82, 18, 78][i]}%`, left: `${[88, 92, 2, 5][i]}%`, animationDelay: `${i * 0.5}s` }}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={28} style={{ color: "var(--gold)" } as React.CSSProperties} />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={IMG_WORKSHOP} alt="Мастерская" className="w-full h-96 object-cover"
              style={{ border: "3px solid var(--cream-dark)", boxShadow: "8px 8px 0 var(--cream-dark)" }} />
            <div className="absolute -bottom-6 -right-4 retro-card p-5" style={{ maxWidth: "200px", zIndex: 10 }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.35rem", color: "var(--crimson)", lineHeight: 1.3 }}>«С любовью к каждой детали»</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-mid)", marginTop: "0.5rem", letterSpacing: "0.08em" }}>— Анна Ларина, основатель</div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ height: "1px", width: "30px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>О нас</span>
            </div>
            <h2 className="section-title mb-6">Мастерская<br />с душой</h2>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 2, marginBottom: "1.2rem" }}>
              Мастерская «Рождественское Яблоко» основана в 1998 году Анной Лариной. Начав с небольшой комнатки и одной горелки, мы выросли в семейное производство, где каждая игрушка проходит через руки мастера.
            </p>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 2, marginBottom: "2rem" }}>
              Мы работаем с настоящим выдувным стеклом, используем ручную роспись и традиционные техники — те самые, что делали игрушки 60-х годов особенными.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[["🎨", "Ручная роспись"], ["🔮", "Выдувное стекло"], ["✨", "Золочение"], ["📦", "Авторская упаковка"]].map(([ico, lbl]) => (
                <div key={lbl} className="flex items-center gap-3 p-3 retro-card">
                  <span className="text-xl">{ico}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--text-dark)" }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="py-24 px-6" style={{ background: "var(--cream-dark)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>Наши работы</span>
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
            </div>
            <h2 className="section-title mb-2">Галерея игрушек</h2>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.85rem", color: "var(--text-mid)" }}>Нажмите на игрушку, чтобы добавить в корзину</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(p => (
              <div key={p.id} className="retro-card overflow-hidden group cursor-pointer" style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--cream-dark), 0 16px 40px rgba(0,0,0,0.12)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                <div className="relative overflow-hidden h-56">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    style={{ background: "rgba(42,26,14,0.65)" }}>
                    <button onClick={() => addToCart(p)} className="btn-vintage" style={{ fontSize: "0.85rem", padding: "0.55rem 1.4rem" }}>В корзину</button>
                  </div>
                  {p.tag && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-1"
                      style={{ background: "var(--crimson)", color: "var(--cream)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.06em" }}>{p.tag}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "var(--text-dark)", fontWeight: 600 }}>{p.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-mid)", marginTop: "0.3rem", marginBottom: "1rem" }}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--crimson)", fontWeight: 700 }}>{p.price.toLocaleString()} ₽</span>
                    <button onClick={() => addToCart(p)}
                      className="p-2"
                      style={{ color: "var(--gold)", border: "1px solid var(--gold)", transition: "all 0.2s" }}
                      onMouseOver={e => { const t = e.currentTarget as HTMLElement; t.style.background = "var(--gold)"; t.style.color = "var(--text-dark)"; }}
                      onMouseOut={e => { const t = e.currentTarget as HTMLElement; t.style.background = "transparent"; t.style.color = "var(--gold)"; }}>
                      <Icon name="Plus" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section id="process" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>Как это делается</span>
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
            </div>
            <h2 className="section-title mb-2">Путь игрушки</h2>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.85rem", color: "var(--text-mid)" }}>От стекла до праздника — шесть шагов с любовью</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {STEPS.map(step => (
              <div key={step.num} className="retro-card p-6">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", color: "var(--cream-dark)", fontWeight: 700, lineHeight: 1, marginBottom: "0.5rem" }}>{step.num}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--crimson)", fontWeight: 600, marginBottom: "0.75rem" }}>{step.title}</h3>
                <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.82rem", color: "var(--text-mid)", lineHeight: 1.85 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <img src={IMG_WORKSHOP} alt="Процесс работы" className="w-full max-w-2xl mx-auto h-64 object-cover"
              style={{ border: "2px solid var(--cream-dark)", boxShadow: "6px 6px 0 var(--cream-dark)" }} />
          </div>
        </div>
      </section>

      {/* ===== ORDER ===== */}
      <section id="order" className="py-24 px-6" style={{ background: "var(--crimson)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-light)" }}>Индивидуальный заказ</span>
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "var(--cream)", marginBottom: "0.75rem" }}>Заказать игрушку</h2>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.88rem", color: "rgba(245,237,224,0.8)" }}>Создадим уникальную игрушку по вашим пожеланиям. Срок изготовления — 7–14 дней.</p>
          </div>

          {orderSent ? (
            <div className="text-center retro-card p-12" style={{ background: "var(--cream)" }}>
              <div className="text-6xl mb-5">🎄</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--crimson)", marginBottom: "1rem" }}>Заявка отправлена!</h3>
              <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.9 }}>
                Мы свяжемся с вами в течение 24 часов для обсуждения деталей. Спасибо, что выбрали «Рождественское Яблоко»!
              </p>
              <button className="btn-vintage mt-8" onClick={() => setOrderSent(false)}>Отправить ещё заявку</button>
            </div>
          ) : (
            <div className="retro-card p-8" style={{ background: "var(--cream)" }}>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { label: "Ваше имя *", key: "name", placeholder: "Анна" },
                  { label: "Телефон *", key: "phone", placeholder: "+7 (900) 000-00-00" },
                  { label: "Email", key: "email", placeholder: "anna@mail.ru" },
                  { label: "Цветовая палитра", key: "color", placeholder: "Красный с золотом, синий..." },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "var(--text-mid)", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>{label}</label>
                    <input
                      value={orderForm[key as keyof typeof orderForm]}
                      onChange={e => setOrderForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "var(--gold)"}
                      onBlur={e => e.target.style.borderColor = "var(--cream-dark)"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "var(--text-mid)", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Тип игрушки</label>
                  <select value={orderForm.type} onChange={e => setOrderForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                    <option>Стандарт</option>
                    <option>Эксклюзив</option>
                    <option>Корпоративный заказ</option>
                    <option>Подарочный набор</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "var(--text-mid)", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Размер</label>
                  <select value={orderForm.size} onChange={e => setOrderForm(p => ({ ...p, size: e.target.value }))} style={inputStyle}>
                    <option>Маленький (6 см)</option>
                    <option>Средний (8 см)</option>
                    <option>Большой (10 см)</option>
                    <option>Гигантский (15 см)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "var(--text-mid)", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>Пожелания и описание</label>
                  <textarea
                    value={orderForm.notes}
                    onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                    rows={4} placeholder="Опишите вашу мечту: мотив, стиль, надпись..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "var(--gold)"}
                    onBlur={e => e.target.style.borderColor = "var(--cream-dark)"}
                  />
                </div>
              </div>
              <button className="btn-vintage w-full mt-6 text-center"
                onClick={() => { if (orderForm.name && orderForm.phone) setOrderSent(true); }}>
                Отправить заявку
              </button>
              <p style={{ fontSize: "0.72rem", color: "var(--text-mid)", textAlign: "center", marginTop: "1rem" }}>
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== HISTORY ===== */}
      <section id="history" className="py-24 px-6" style={{ background: "var(--text-dark)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-light)" }}>Легенды и факты</span>
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "var(--cream)", marginBottom: "0.5rem" }}>
              История ёлочных игрушек
            </h2>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.85rem", color: "rgba(245,237,224,0.55)" }}>От Лауши до советских заводов</p>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {HISTORY.map((h, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className="px-5 py-2 whitespace-nowrap transition-all"
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem",
                  background: activeTab === i ? "var(--crimson)" : "transparent",
                  color: activeTab === i ? "var(--cream)" : "var(--gold)",
                  border: `1px solid ${activeTab === i ? "var(--crimson)" : "rgba(201,150,42,0.5)"}`,
                  letterSpacing: "0.05em",
                }}>
                {h.year}
              </button>
            ))}
          </div>

          <div className="p-8" style={{ border: "1px solid rgba(201,150,42,0.25)", background: "rgba(245,237,224,0.04)" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "var(--gold-light)", marginBottom: "1rem" }}>{HISTORY[activeTab].title}</h3>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.95rem", color: "rgba(245,237,224,0.8)", lineHeight: 2 }}>{HISTORY[activeTab].text}</p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              { ico: "🎄", fact: "Первые ёлочные шары появились в Германии в 1848 году" },
              { ico: "⭐", fact: "В СССР выпускалось более 700 видов ёлочных игрушек" },
              { ico: "🔮", fact: "Один мастер может создать до 50 шаров за рабочий день" },
            ].map((f, i) => (
              <div key={i} className="p-5 text-center" style={{ border: "1px solid rgba(201,150,42,0.18)" }}>
                <div className="text-3xl mb-3">{f.ico}</div>
                <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.78rem", color: "rgba(245,237,224,0.65)", lineHeight: 1.75 }}>{f.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACTS ===== */}
      <section id="contacts" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>Свяжитесь с нами</span>
              <div style={{ height: "1px", width: "40px", background: "var(--gold)" }} />
            </div>
            <h2 className="section-title">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="retro-card p-8">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--crimson)", marginBottom: "1.5rem", borderBottom: "1px solid var(--cream-dark)", paddingBottom: "0.75rem" }}>Мастерская</h3>
              <div className="flex flex-col gap-5">
                {[
                  { icon: "MapPin", label: "Адрес", val: "Москва, ул. Рождественская, 12" },
                  { icon: "Phone", label: "Телефон", val: "+7 (495) 123-45-67" },
                  { icon: "Mail", label: "Email", val: "hello@rozhyabloko.ru" },
                  { icon: "Clock", label: "Режим работы", val: "Пн–Сб: 10:00–19:00" },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="p-2 mt-0.5" style={{ background: "var(--cream-dark)", color: "var(--crimson)" }}>
                      <Icon name={icon as "MapPin" | "Phone" | "Mail" | "Clock"} size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-mid)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.15rem" }}>{label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "var(--text-dark)" }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="retro-card p-8">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--crimson)", marginBottom: "1.5rem", borderBottom: "1px solid var(--cream-dark)", paddingBottom: "0.75rem" }}>Мы в соцсетях</h3>
              <div className="flex flex-col gap-3">
                {[
                  { ico: "📸", name: "Instagram", user: "@rozhyabloko" },
                  { ico: "💬", name: "ВКонтакте", user: "vk.com/rozhyabloko" },
                  { ico: "✈️", name: "Telegram", user: "@rozhyabloko_shop" },
                  { ico: "▶️", name: "YouTube", user: "Рождественское Яблоко" },
                ].map(({ ico, name, user }) => (
                  <div key={name} className="flex items-center justify-between p-3"
                    style={{ border: "1px solid var(--cream-dark)", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseOver={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"}
                    onMouseOut={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--cream-dark)"}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{ico}</span>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--text-dark)" }}>{name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-mid)" }}>{user}</div>
                      </div>
                    </div>
                    <Icon name="ExternalLink" size={14} style={{ color: "var(--gold)" } as React.CSSProperties} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "var(--text-dark)", borderTop: "2px solid var(--crimson)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍎</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "var(--cream)", fontWeight: 600 }}>Рождественское Яблоко</div>
                <div style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Мастерская с 1998 года</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Merriweather', serif", fontSize: "0.75rem", color: "rgba(245,237,224,0.38)", textAlign: "center" }}>
              © 2024 Рождественское Яблоко. Все права защищены.<br />Каждая игрушка создана с любовью ❤️
            </p>
            <div className="flex gap-4">
              {sections.slice(0, 4).map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(245,237,224,0.45)", transition: "color 0.2s" }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "rgba(245,237,224,0.45)"}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
