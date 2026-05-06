import { useState, useEffect, useRef } from "react";

const PRODUCTS = {
  womenMakeup: [
    { id: 1, name: "Velvet Matte Lipstick", desc: "Long-lasting matte finish in bold rebel shades", price: 24.99, emoji: "💄", tag: "MAKEUP" },
    { id: 2, name: "Glitter Bomb Eyeshadow", desc: "High-impact shimmer palette with electric colors", price: 32.99, emoji: "✨", tag: "MAKEUP" },
    { id: 3, name: "Neon Eyeliner Set", desc: "Vibrant neon liners for edgy looks", price: 19.99, emoji: "👁️", tag: "MAKEUP" },
    { id: 4, name: "Holographic Highlighter", desc: "Multi-dimensional glow with rainbow reflects", price: 28.99, emoji: "🌈", tag: "MAKEUP" },
  ],
  womenFragrance: [
    { id: 5, name: "Rebel Rose Eau de Parfum", desc: "Dark rose with leather and vanilla notes", price: 68.99, emoji: "🌹", tag: "FRAGRANCE" },
    { id: 6, name: "Electric Violet Mist", desc: "Bold violet with amber and musk undertones", price: 45.99, emoji: "💜", tag: "FRAGRANCE" },
    { id: 7, name: "Midnight Garden", desc: "Mysterious blend of jasmine and dark woods", price: 72.99, emoji: "🌙", tag: "FRAGRANCE" },
    { id: 8, name: "Pink Punk Spray", desc: "Sweet berries meet spicy pepper", price: 38.99, emoji: "🌸", tag: "FRAGRANCE" },
  ],
  menGrooming: [
    { id: 9, name: "Obsidian Face Serum", desc: "Hydrating serum with activated charcoal", price: 42.99, emoji: "🖤", tag: "GROOMING" },
    { id: 10, name: "Phantom Beard Oil", desc: "Cedarwood and bergamot blend for lush beards", price: 26.99, emoji: "🧔", tag: "GROOMING" },
    { id: 11, name: "Matte Clay Pomade", desc: "Strong hold, natural matte finish", price: 22.99, emoji: "💈", tag: "GROOMING" },
    { id: 12, name: "Arctic Charcoal Scrub", desc: "Deep-cleansing exfoliant with mint and charcoal", price: 18.99, emoji: "🧊", tag: "GROOMING" },
  ],
  menFragrance: [
    { id: 13, name: "Noir Vetiver", desc: "Smoky woods with earthy vetiver and leather", price: 79.99, emoji: "🌲", tag: "FRAGRANCE" },
    { id: 14, name: "Steel & Cedar", desc: "Sharp metallic top with warm cedar base", price: 54.99, emoji: "🪵", tag: "FRAGRANCE" },
    { id: 15, name: "Ocean Phantom", desc: "Aquatic freshness with white musk depth", price: 49.99, emoji: "🌊", tag: "FRAGRANCE" },
    { id: 16, name: "Midnight Smoke", desc: "Oud and black pepper for the bold", price: 88.99, emoji: "🔥", tag: "FRAGRANCE" },
  ],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #0d0b14;
    --bg2: #140f1e;
    --card: #1a1428;
    --card-hover: #211a35;
    --purple-dark: #2d1f4e;
    --purple-mid: #6b21a8;
    --purple-light: #a855f7;
    --pink: #ec4899;
    --grad: linear-gradient(135deg, #a855f7, #ec4899);
    --text: #f0e8ff;
    --text-muted: #9d8ec4;
    --border: rgba(168,85,247,0.15);
    --tag-bg: rgba(168,85,247,0.2);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .csu-root {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .csu-nav {
    background: rgba(13,11,20,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .csu-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }

  .csu-logo-icon {
    width: 36px; height: 36px;
    background: var(--grad);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .csu-search {
    flex: 1;
    max-width: 480px;
    margin: 0 32px;
    position: relative;
  }

  .csu-search input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 10px 20px 10px 44px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .csu-search input::placeholder { color: var(--text-muted); }
  .csu-search input:focus { border-color: var(--purple-light); }

  .csu-search-icon {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 14px;
    pointer-events: none;
  }

  .csu-cart-btn {
    width: 44px; height: 44px;
    background: var(--grad);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .csu-cart-btn:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(236,72,153,0.4); }

  .csu-cart-count {
    position: absolute;
    top: -6px; right: -6px;
    background: #fff;
    color: var(--purple-mid);
    font-size: 10px;
    font-weight: 700;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .csu-tabs {
    display: flex;
    margin: 28px 32px 0;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .csu-tab {
    flex: 1;
    padding: 16px 24px;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.3s;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .csu-tab.active { background: var(--grad); color: white; }
  .csu-tab:not(.active) { background: var(--bg2); color: var(--text-muted); }
  .csu-tab:not(.active):hover { background: var(--purple-dark); color: var(--text); }

  .csu-content { padding: 32px; }
  .csu-section { margin-bottom: 48px; }

  .csu-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
  }

  .csu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 900px) {
    .csu-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .csu-card {
    background: var(--card);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
    cursor: pointer;
  }

  .csu-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.1);
    background: var(--card-hover);
  }

  .csu-card-img {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, var(--purple-dark), #1a0a2e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
  }

  .csu-card-body { padding: 16px; }

  .csu-tag {
    display: inline-block;
    background: var(--tag-bg);
    color: var(--purple-light);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 50px;
    margin-bottom: 10px;
    border: 1px solid rgba(168,85,247,0.25);
  }

  .csu-card-name {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 6px;
    color: var(--text);
    line-height: 1.3;
  }

  .csu-card-desc {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 14px;
  }

  .csu-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .csu-price {
    font-size: 18px;
    font-weight: 600;
    color: var(--purple-light);
  }

  .csu-add-btn {
    background: var(--grad);
    border: none;
    border-radius: 10px;
    color: white;
    padding: 9px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .csu-add-btn:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(236,72,153,0.35); }
  .csu-add-btn:active { transform: scale(0.97); }

  /* CART OVERLAY */
  .csu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    justify-content: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .csu-overlay.open { opacity: 1; pointer-events: all; }

  .csu-cart-panel {
    width: 420px;
    max-width: 100vw;
    background: var(--bg2);
    border-left: 1px solid var(--border);
    height: 100vh;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  .csu-overlay.open .csu-cart-panel { transform: translateX(0); }

  .csu-cart-header {
    padding: 24px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .csu-cart-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .csu-close-btn {
    background: none;
    border: none;
    color: var(--text);
    font-size: 22px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s;
    line-height: 1;
  }

  .csu-close-btn:hover { background: rgba(255,255,255,0.08); }

  .csu-cart-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 28px;
  }

  .csu-cart-body::-webkit-scrollbar { width: 4px; }
  .csu-cart-body::-webkit-scrollbar-track { background: transparent; }
  .csu-cart-body::-webkit-scrollbar-thumb { background: var(--purple-mid); border-radius: 4px; }

  .csu-cart-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    text-align: center;
  }

  .csu-cart-empty-icon { font-size: 48px; opacity: 0.4; }
  .csu-cart-empty h3 { font-size: 18px; color: var(--text); font-weight: 500; }

  .csu-cart-item {
    display: flex;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    align-items: center;
    animation: csuSlideIn 0.3s ease;
  }

  @keyframes csuSlideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .csu-item-emoji {
    width: 52px; height: 52px;
    background: var(--purple-dark);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .csu-item-info { flex: 1; }
  .csu-item-name { font-weight: 600; font-size: 14px; margin-bottom: 3px; }
  .csu-item-price { font-size: 13px; color: var(--purple-light); font-weight: 600; }

  .csu-item-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .csu-qty-btn {
    width: 26px; height: 26px;
    background: var(--purple-dark);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    cursor: pointer;
    font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }

  .csu-qty-btn:hover { background: var(--purple-mid); }
  .csu-qty-num { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }

  .csu-cart-footer {
    padding: 20px 28px;
    border-top: 1px solid var(--border);
  }

  .csu-cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .csu-total-amount {
    font-size: 22px;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .csu-checkout-btn {
    width: 100%;
    background: var(--grad);
    border: none;
    border-radius: 12px;
    color: white;
    padding: 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.02em;
  }

  .csu-checkout-btn:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(236,72,153,0.4); }

  /* TOAST */
  .csu-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--grad);
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    z-index: 999;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
    white-space: nowrap;
  }

  .csu-toast.show { transform: translateX(-50%) translateY(0); }
`;

function ProductCard({ product, onAdd }) {
  return (
    <div className="csu-card">
      <div className="csu-card-img">{product.emoji}</div>
      <div className="csu-card-body">
        <span className="csu-tag">{product.tag}</span>
        <div className="csu-card-name">{product.name}</div>
        <div className="csu-card-desc">{product.desc}</div>
        <div className="csu-card-footer">
          <span className="csu-price">${product.price.toFixed(2)}</span>
          <button className="csu-add-btn" onClick={() => onAdd(product)}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease }) {
  return (
    <div className="csu-cart-item">
      <div className="csu-item-emoji">{item.emoji}</div>
      <div className="csu-item-info">
        <div className="csu-item-name">{item.name}</div>
        <div className="csu-item-price">${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div className="csu-item-controls">
        <button className="csu-qty-btn" onClick={() => onDecrease(item.id)}>−</button>
        <span className="csu-qty-num">{item.qty}</span>
        <button className="csu-qty-btn" onClick={() => onIncrease(item.id)}>+</button>
      </div>
    </div>
  );
}

export default function CSUBeauty() {
  const [activeTab, setActiveTab] = useState("women");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  // Inject styles once
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Close cart on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setCartOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: prev[product.id]
        ? { ...prev[product.id], qty: prev[product.id].qty + 1 }
        : { ...product, qty: 1 },
    }));
    showToast(`${product.name} added to cart!`);
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...item, qty: newQty } };
    });
  };

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  };

  const filterProducts = (items) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
    );
  };

  const renderSection = (title, items) => {
    const filtered = filterProducts(items);
    if (filtered.length === 0) return null;
    return (
      <div className="csu-section">
        <div className="csu-section-title">{title}</div>
        <div className="csu-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="csu-root">
      {/* NAVBAR */}
      <nav className="csu-nav">
        <div className="csu-logo">
          <div className="csu-logo-icon">✦</div>
          CSUBeauty
        </div>
        <div className="csu-search">
          <span className="csu-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search makeup, fragrance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="csu-cart-btn" onClick={() => setCartOpen(true)}>
          🛒
          {cartCount > 0 && <span className="csu-cart-count">{cartCount}</span>}
        </button>
      </nav>

      {/* TABS */}
      <div className="csu-tabs">
        <button
          className={`csu-tab${activeTab === "women" ? " active" : ""}`}
          onClick={() => setActiveTab("women")}
        >
          Women's Collection
        </button>
        <button
          className={`csu-tab${activeTab === "men" ? " active" : ""}`}
          onClick={() => setActiveTab("men")}
        >
          Men's Collection
        </button>
      </div>

      {/* CONTENT */}
      <div className="csu-content">
        {activeTab === "women" && (
          <>
            {renderSection("Women's Makeup", PRODUCTS.womenMakeup)}
            {renderSection("Women's Fragrance", PRODUCTS.womenFragrance)}
          </>
        )}
        {activeTab === "men" && (
          <>
            {renderSection("Men's Grooming", PRODUCTS.menGrooming)}
            {renderSection("Men's Fragrance", PRODUCTS.menFragrance)}
          </>
        )}
      </div>

      {/* CART OVERLAY */}
      <div
        className={`csu-overlay${cartOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target.classList.contains("csu-overlay")) setCartOpen(false); }}
      >
        <div className="csu-cart-panel">
          <div className="csu-cart-header">
            <span className="csu-cart-title">Shopping Cart</span>
            <button className="csu-close-btn" onClick={() => setCartOpen(false)}>✕</button>
          </div>

          <div className="csu-cart-body">
            {cartItems.length === 0 ? (
              <div className="csu-cart-empty">
                <div className="csu-cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={(id) => changeQty(id, 1)}
                  onDecrease={(id) => changeQty(id, -1)}
                />
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="csu-cart-footer">
              <div className="csu-cart-total">
                <span>Total</span>
                <span className="csu-total-amount">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="csu-checkout-btn">Checkout →</button>
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      <div className={`csu-toast${toast.visible ? " show" : ""}`}>
        {toast.message}
      </div>
    </div>
  );
}
