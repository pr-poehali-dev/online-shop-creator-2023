import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = "home" | "catalog" | "cart" | "profile" | "payment" | "support";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  tag?: string;
  emoji: string;
  image?: string;
}

interface CartItem extends Product {
  qty: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Браслет из паракорда «Чёрный»",
    price: 379,
    rating: 4.9,
    reviews: 87,
    category: "Паракорд",
    tag: "Хит",
    emoji: "🖤",
    image: "https://cdn.poehali.dev/projects/48b2efde-8e0f-45fa-b796-1a8d32e2d6e9/bucket/8241f57b-963f-4512-b91c-e1ccb137688c.png",
  },
  {
    id: 2,
    name: "Браслет из паракорда «Зелёный»",
    price: 379,
    rating: 4.8,
    reviews: 54,
    category: "Паракорд",
    tag: "Новинка",
    emoji: "🌿",
    image: "https://cdn.poehali.dev/projects/48b2efde-8e0f-45fa-b796-1a8d32e2d6e9/bucket/af24d7f5-81b6-4c43-addb-85719f5359c6.png",
  },
  {
    id: 3,
    name: "Браслет из камня",
    price: 469,
    rating: 4.9,
    reviews: 36,
    category: "Камень",
    tag: "Хит",
    emoji: "💎",
    image: "https://cdn.poehali.dev/projects/48b2efde-8e0f-45fa-b796-1a8d32e2d6e9/bucket/1ec666cf-6c22-4cb6-bfb3-0d7447c5340b.png",
  },
];

const CATEGORIES = ["Все", "Паракорд", "Камень"];

const FAQ = [
  { q: "Как долго идёт доставка?", a: "Доставка по городу — 1-2 дня, по России — 3-7 дней в зависимости от региона." },
  { q: "Можно ли вернуть товар?", a: "Да, возврат возможен в течение 14 дней при сохранении товарного вида." },
  { q: "Браслеты ручной работы?", a: "Да, каждый браслет изготавливается вручную. Возможен индивидуальный заказ под нужный размер." },
  { q: "Как оплатить заказ?", a: "Принимаем карты Visa/МИР, СБП, наличные при получении." },
  { q: "Можно ли заказать свой цвет?", a: "Конечно! Напишите нам — сделаем браслет в нужном цвете или комбинации." },
];

const ORDERS = [
  { id: "#00124", date: "20 апреля 2026", status: "Доставлен", amount: 2340, items: 3 },
  { id: "#00098", date: "5 апреля 2026", status: "Доставлен", amount: 1650, items: 1 },
  { id: "#00087", date: "18 марта 2026", status: "Доставлен", amount: 4200, items: 6 },
];

const REVIEWS = [
  { author: "Анна К.", rating: 5, text: "Браслет просто шикарный! Паракорд крепкий, застёжка надёжная. Уже заказала второй в подарок.", date: "14 апр" },
  { author: "Михаил В.", rating: 5, text: "Взял чёрный паракорд — отличное качество, сделано аккуратно. Быстрая доставка.", date: "10 апр" },
  { author: "Светлана О.", rating: 5, text: "Браслет из камня — просто красота! Упакован аккуратно, выглядит дорого. Очень довольна.", date: "2 апр" },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size }} className={i <= Math.round(rating) ? "text-yellow-400" : "text-white/20"}>★</span>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover group">
      <div className="relative h-52 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.12))" }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-7xl animate-float">{product.emoji}</span>
        )}
        {product.tag && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full gradient-bg text-white">
            {product.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-purple-400 font-medium mb-1">{product.category}</p>
        <h3 className="font-semibold text-sm text-white mb-2 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-white/40">({product.reviews})</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-lg font-bold text-white">{product.price.toLocaleString()} ₽</span>
          {product.oldPrice && <span className="text-xs text-white/30 line-through">{product.oldPrice.toLocaleString()} ₽</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onAdd(product)}
            className="flex-1 gradient-bg text-white text-sm font-semibold py-2 rounded-xl hover-scale transition-all">
            В корзину
          </button>
          <button onClick={() => setShowReview(!showReview)}
            className="glass px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
            <Icon name="MessageSquare" size={16} className="text-purple-400" />
          </button>
        </div>

        {showReview && (
          <div className="mt-3 p-3 rounded-xl bg-white/5 animate-fade-in">
            <p className="text-xs text-white/60 mb-2">Ваш отзыв</p>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setReviewRating(s)}
                  className={`text-lg transition-transform hover:scale-125 ${s <= reviewRating ? "text-yellow-400" : "text-white/20"}`}>★</button>
              ))}
            </div>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
              placeholder="Расскажите о товаре..." rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500/50 mb-2" />
            <label className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all text-xs text-white/60 mb-2 w-fit">
              <Icon name="Camera" size={14} className="text-purple-400" />
              Прикрепить фото
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <button className="w-full gradient-bg text-white text-xs font-semibold py-2 rounded-lg hover-scale">
              Отправить отзыв
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { id: "home" as Page, label: "Главная", icon: "Home" },
    { id: "catalog" as Page, label: "Каталог", icon: "Grid3X3" },
    { id: "cart" as Page, label: "Корзина", icon: "ShoppingCart" },
    { id: "profile" as Page, label: "Кабинет", icon: "User" },
    { id: "payment" as Page, label: "Оплата", icon: "CreditCard" },
    { id: "support" as Page, label: "Поддержка", icon: "MessageCircle" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="font-display font-black text-xl gradient-text">
          ТВОРИМ<span className="text-orange-400">23</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all relative ${
                page === n.id ? "text-white" : "text-white/50 hover:text-white/80"
              }`}>
              {page === n.id && <span className="absolute inset-0 gradient-bg rounded-xl opacity-20" />}
              <Icon name={n.icon} size={15} />
              {n.label}
              {n.id === "cart" && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 gradient-bg rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="md:hidden text-white/70" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-fade-in">
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium transition-all ${
                page === n.id ? "gradient-text" : "text-white/60"
              }`}>
              <Icon name={n.icon} size={16} />
              {n.label}
              {n.id === "cart" && cartCount > 0 && (
                <span className="ml-auto gradient-bg text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage, onAdd }: { setPage: (p: Page) => void; onAdd: (p: Product) => void }) {
  const hero = "https://cdn.poehali.dev/projects/48b2efde-8e0f-45fa-b796-1a8d32e2d6e9/bucket/8241f57b-963f-4512-b91c-e1ccb137688c.png";

  return (
    <div className="space-y-20">
      <section className="relative min-h-[85vh] flex items-center overflow-hidden rounded-3xl mx-4 mt-4">
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img src={hero} alt="ТВОРИМ23" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,8,16,0.8) 0%, rgba(168,85,247,0.3) 50%, rgba(8,8,16,0.9) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-purple-300 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Браслеты ручной работы — каждый уникален
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 leading-none animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <span className="gradient-text">ТВОРИМ</span><br />украшения
          </h1>
          <p className="text-white/60 text-lg mb-8 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            Браслеты из паракорда и натурального камня — сделано с душой, доставка по всей России
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <button onClick={() => setPage("catalog")}
              className="gradient-bg text-white font-bold px-8 py-4 rounded-2xl hover-scale glow-purple transition-all text-lg">
              Перейти в каталог
            </button>
            <button onClick={() => setPage("support")}
              className="glass text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-lg">
              Связаться с нами
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "Ручная работа", icon: "Heart" },
            { value: "500+", label: "Клиентов", icon: "Users" },
            { value: "4.9 ★", label: "Рейтинг", icon: "Star" },
            { value: "1-3 дня", label: "Доставка", icon: "Truck" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <Icon name={s.icon} size={28} className="text-purple-400 mx-auto mb-2" />
              <p className="font-display font-black text-2xl gradient-text">{s.value}</p>
              <p className="text-white/50 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white">Наши браслеты</h2>
          <button onClick={() => setPage("catalog")} className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
            Весь каталог <Icon name="ArrowRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS.map((p, i) => (
            <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <ProductCard product={p} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-8">Почему выбирают нас</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: "Scissors", title: "Ручная работа", text: "Каждый браслет делается вручную с вниманием к деталям" },
            { icon: "Ruler", title: "Любой размер", text: "Изготовим под ваш размер запястья — просто напишите нам" },
            { icon: "Palette", title: "Свой цвет", text: "Закажите браслет в любом цвете или уникальной комбинации" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <Icon name={f.icon} size={28} className="text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-8">Отзывы покупателей</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-6 card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {r.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{r.author}</p>
                    <p className="text-white/40 text-xs">{r.date}</p>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────────────────────
function CatalogPage({ onAdd }: { onAdd: (p: Product) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [sort, setSort] = useState("popular");

  const filtered = PRODUCTS
    .filter(p => category === "Все" || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "cheap") return a.price - b.price;
      if (sort === "expensive") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-6">Каталог браслетов</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="glass rounded-2xl px-4 py-3 text-white/80 focus:outline-none bg-transparent border-0 cursor-pointer">
          <option value="popular" className="bg-gray-900">По популярности</option>
          <option value="rating" className="bg-gray-900">По рейтингу</option>
          <option value="cheap" className="bg-gray-900">Сначала дешевле</option>
          <option value="expensive" className="bg-gray-900">Сначала дороже</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === cat ? "gradient-bg text-white" : "glass text-white/60 hover:text-white hover:bg-white/10"
            }`}>
            {cat}
          </button>
        ))}
      </div>
      <p className="text-white/40 text-sm mb-6">{filtered.length} товаров</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
            <ProductCard product={p} onAdd={onAdd} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-white/50">Ничего не найдено. Попробуйте другой запрос.</p>
        </div>
      )}
    </div>
  );
}

// ─── CART ────────────────────────────────────────────────────────────────────
function CartPage({ cart, setCart, setPage }: { cart: CartItem[]; setCart: (c: CartItem[]) => void; setPage: (p: Page) => void }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const update = (id: number, delta: number) =>
    setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id: number) => setCart(cart.filter(i => i.id !== id));

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-8xl mb-6 block animate-float">🛒</span>
      <h2 className="text-2xl font-black text-white mb-3">Корзина пуста</h2>
      <p className="text-white/50 mb-8">Добавьте что-нибудь из каталога</p>
      <button onClick={() => setPage("catalog")} className="gradient-bg text-white font-bold px-8 py-3 rounded-2xl hover-scale">
        Перейти в каталог
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-8">Корзина</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item, i) => (
            <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-4 animate-fade-in card-hover" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{ background: "rgba(168,85,247,0.15)" }}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm leading-tight truncate">{item.name}</p>
                <p className="text-purple-400 text-xs mt-0.5">{item.category}</p>
                <p className="text-white font-bold mt-1">{(item.price * item.qty).toLocaleString()} ₽</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => update(item.id, -1)} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white font-bold">−</button>
                <span className="w-6 text-center text-white font-medium">{item.qty}</span>
                <button onClick={() => update(item.id, 1)} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white font-bold">+</button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 ml-1 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all text-white/30 hover:text-red-400">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-6 h-fit animate-scale-in">
          <h3 className="font-bold text-white mb-4 text-lg">Итого</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-white/60 text-sm">
              <span>Товары ({cart.reduce((s, i) => s + i.qty, 0)} шт.)</span>
              <span>{total.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-white/60 text-sm">
              <span>Доставка</span>
              <span className="text-green-400">Бесплатно</span>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between font-bold text-white text-xl">
              <span>К оплате</span>
              <span className="gradient-text">{total.toLocaleString()} ₽</span>
            </div>
          </div>
          <button onClick={() => setPage("payment")} className="w-full gradient-bg text-white font-bold py-3.5 rounded-2xl hover-scale glow-purple transition-all">
            Оформить заказ
          </button>
          <button onClick={() => setCart([])} className="w-full mt-3 text-white/30 hover:text-white/60 text-sm transition-colors py-2">
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const [tab, setTab] = useState<"orders" | "settings">("orders");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-5 mb-8 animate-fade-in">
        <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center text-4xl font-black text-white glow-purple">А</div>
        <div>
          <h1 className="text-2xl font-black text-white">Анна Смирнова</h1>
          <p className="text-white/50 text-sm">anna@example.com</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-purple-400 text-xs font-medium">Бонусный счёт: 480 ₽</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {[{ id: "orders" as const, label: "Мои заказы" }, { id: "settings" as const, label: "Настройки" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === t.id ? "gradient-bg text-white" : "glass text-white/60 hover:text-white"
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "orders" && (
        <div className="space-y-3 animate-fade-in">
          {ORDERS.map((o, i) => (
            <div key={o.id} className="glass rounded-2xl p-5 flex items-center justify-between card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                  <Icon name="Package" size={22} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{o.id}</p>
                  <p className="text-white/40 text-xs">{o.date} · {o.items} товара</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{o.amount.toLocaleString()} ₽</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-medium">{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "settings" && (
        <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in">
          {[
            { label: "Имя", value: "Анна Смирнова" },
            { label: "Email", value: "anna@example.com" },
            { label: "Телефон", value: "+7 (912) 345-67-89" },
            { label: "Адрес доставки", value: "Краснодар, ул. Красная, 1" },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-white/50 text-xs mb-1.5 block">{f.label}</label>
              <input defaultValue={f.value}
                className="w-full glass rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent" />
            </div>
          ))}
          <button className="gradient-bg text-white font-bold px-6 py-3 rounded-xl hover-scale transition-all">
            Сохранить изменения
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PAYMENT ─────────────────────────────────────────────────────────────────
function PaymentPage() {
  const [selected, setSelected] = useState(0);
  const methods = [
    { icon: "CreditCard", label: "Банковская карта", desc: "Visa, МИР, Mastercard", badge: "Быстро" },
    { icon: "Smartphone", label: "СБП", desc: "Система быстрых платежей", badge: "Без комиссии" },
    { icon: "Banknote", label: "Наличные при получении", desc: "Оплата курьеру", badge: null },
    { icon: "Clock", label: "Оплата частями", desc: "Раздели платёж на 4 части", badge: "0%" },
    { icon: "Wallet", label: "Бонусные рубли", desc: "Спишите накопленные бонусы", badge: null },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-2">Способы оплаты</h1>
      <p className="text-white/50 text-sm mb-8">Выберите удобный способ оплаты заказа</p>
      <div className="space-y-3">
        {methods.map((m, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-full glass rounded-2xl p-5 flex items-center gap-4 text-left transition-all card-hover animate-fade-in ${
              selected === i ? "ring-1 ring-purple-500/60 bg-purple-500/10" : ""
            }`} style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              selected === i ? "gradient-bg" : "bg-white/5"
            }`}>
              <Icon name={m.icon} size={22} className={selected === i ? "text-white" : "text-purple-400"} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{m.label}</p>
              <p className="text-white/40 text-sm">{m.desc}</p>
            </div>
            {m.badge && <span className="text-xs gradient-bg text-white px-2.5 py-1 rounded-full font-bold">{m.badge}</span>}
            {selected === i && <Icon name="CheckCircle2" size={20} className="text-purple-400 flex-shrink-0" />}
          </button>
        ))}
      </div>
      <button className="w-full gradient-bg text-white font-bold py-4 rounded-2xl mt-8 hover-scale glow-purple transition-all text-lg">
        Оплатить заказ
      </button>
      <div className="flex items-center justify-center gap-2 mt-4 text-white/30 text-xs">
        <Icon name="Shield" size={14} />
        Защищённое соединение · Данные зашифрованы
      </div>
    </div>
  );
}

// ─── SUPPORT ─────────────────────────────────────────────────────────────────
function SupportPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! Я помогу с любым вопросом о заказе или товарах. Напишите — и я отвечу." }
  ]);
  const [open, setOpen] = useState<number | null>(null);

  const send = () => {
    if (!message.trim()) return;
    setMessages(m => [...m,
      { role: "user", text: message },
      { role: "bot", text: "Спасибо за вопрос! Менеджер ответит в течение нескольких минут." }
    ]);
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-2">Поддержка</h1>
      <p className="text-white/50 text-sm mb-8">Мы всегда рядом — пишите в чат или смотрите ответы на частые вопросы</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl overflow-hidden flex flex-col animate-fade-in" style={{ height: 460 }}>
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-lg">🎨</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">ТВОРИМ23 Support</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />Онлайн
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex animate-fade-in ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" ? "gradient-bg text-white" : "glass text-white/80"
                }`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/5 flex gap-2">
            <input value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Напишите сообщение..."
              className="flex-1 glass rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/40 bg-transparent" />
            <button onClick={send} className="gradient-bg w-10 h-10 rounded-xl flex items-center justify-center hover-scale flex-shrink-0">
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <h2 className="text-lg font-bold text-white mb-4">Частые вопросы</h2>
          <div className="space-y-2">
            {FAQ.map((faq, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all">
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-purple-400 flex-shrink-0" />
                </button>
                {open === i && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3">
            <Icon name="Phone" size={20} className="text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">8 800 123-45-67</p>
              <p className="text-white/40 text-xs">Бесплатно, пн–сб 9:00–20:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar page={page} setPage={setPage} cartCount={cartCount} />
      <main className="pt-16">
        {page === "home" && <HomePage setPage={setPage} onAdd={addToCart} />}
        {page === "catalog" && <CatalogPage onAdd={addToCart} />}
        {page === "cart" && <CartPage cart={cart} setCart={setCart} setPage={setPage} />}
        {page === "profile" && <ProfilePage />}
        {page === "payment" && <PaymentPage />}
        {page === "support" && <SupportPage />}
      </main>
    </div>
  );
}