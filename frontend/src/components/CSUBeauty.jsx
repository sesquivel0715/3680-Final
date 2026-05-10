// ============================================================
// CSUBeauty.jsx — Main Frontend Component
// This is the entire frontend of the CSUBeauty e-commerce app.
// It handles: Auth (login/register), Products, Cart, Coupons,
// and a Checkout confirmation screen.
// It talks to the backend running on http://localhost:3000
// ============================================================

import { useState, useEffect, useRef } from "react";

// Base URL for all API calls — points to the Express backend
const API = "http://localhost:3000";

// ============================================================
// STYLES — all CSS is written here as a string and injected
// into the page's <head> when the component loads.
// This keeps everything in one file without needing a .css file.
// ============================================================
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

  /* ── Navbar ── */
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

  .csu-nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .csu-user-info { font-size: 13px; color: var(--text-muted); }
  .csu-user-info span { color: var(--purple-light); font-weight: 600; }

  .csu-logout-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .csu-logout-btn:hover { border-color: var(--purple-light); color: var(--text); }

  /* ── Cart Button (top right) ── */
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

  /* Badge showing number of items in cart */
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

  /* ── Auth Modal (Login / Register popup) ── */
  .csu-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .csu-modal {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    width: 380px;
    max-width: 90vw;
  }

  .csu-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }

  .csu-modal-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }

  .csu-input-group { margin-bottom: 16px; }

  .csu-input-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .csu-input-group input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .csu-input-group input:focus { border-color: var(--purple-light); }

  .csu-modal-btn {
    width: 100%;
    background: var(--grad);
    border: none;
    border-radius: 12px;
    color: white;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .csu-modal-btn:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(236,72,153,0.4); }
  .csu-modal-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .csu-modal-switch {
    text-align: center;
    margin-top: 16px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .csu-modal-switch button {
    background: none;
    border: none;
    color: var(--purple-light);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    padding: 0;
  }

  /* Error box shown inside auth modal */
  .csu-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #fca5a5;
    margin-bottom: 14px;
  }

  /* ── Collection Tabs (Women / Men) ── */
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

  /* ── Product Grid ── */
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

  @media (max-width: 900px) { .csu-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ── Product Card ── */
  .csu-card {
    background: var(--card);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
  }

  .csu-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.1);
    background: var(--card-hover);
  }

  .csu-card-img { width: 100%; height: 200px; object-fit: cover; display: block; }

  /* Shown when product has no image_url in the database */
  .csu-card-img-placeholder {
    width: 100%; height: 200px;
    background: linear-gradient(135deg, var(--purple-dark), #1a0a2e);
    display: flex; align-items: center; justify-content: center;
    font-size: 56px;
  }

  .csu-card-body { padding: 16px; }

  /* Category badge (e.g. MAKEUP, FRAGRANCE) */
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

  .csu-card-name { font-weight: 700; font-size: 16px; margin-bottom: 4px; color: var(--text); line-height: 1.3; }
  .csu-card-brand { font-size: 12px; color: var(--purple-light); margin-bottom: 6px; font-weight: 500; }
  .csu-card-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px; }
  .csu-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .csu-price { font-size: 18px; font-weight: 600; color: var(--purple-light); }
  .csu-stock { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  /* Add to Cart button on each product card */
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
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .csu-add-btn:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(236,72,153,0.35); }
  .csu-add-btn:active { transform: scale(0.97); }
  .csu-add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Loading spinner shown while fetching products */
  .csu-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 60px; color: var(--text-muted); font-size: 15px; gap: 12px;
  }

  .csu-spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--purple-light);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .csu-empty { text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px; }

  /* ── Cart Slide-in Panel ── */
  .csu-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex; justify-content: flex-end;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s;
  }

  .csu-overlay.open { opacity: 1; pointer-events: all; }

  .csu-cart-panel {
    width: 420px; max-width: 100vw;
    background: var(--bg2);
    border-left: 1px solid var(--border);
    height: 100vh;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  .csu-overlay.open .csu-cart-panel { transform: translateX(0); }

  .csu-cart-header {
    padding: 24px 28px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .csu-cart-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .csu-close-btn {
    background: none; border: none; color: var(--text);
    font-size: 22px; cursor: pointer; padding: 4px 8px;
    border-radius: 6px; transition: background 0.2s; line-height: 1;
  }

  .csu-close-btn:hover { background: rgba(255,255,255,0.08); }

  .csu-cart-body { flex: 1; overflow-y: auto; padding: 20px 28px; }
  .csu-cart-body::-webkit-scrollbar { width: 4px; }
  .csu-cart-body::-webkit-scrollbar-track { background: transparent; }
  .csu-cart-body::-webkit-scrollbar-thumb { background: var(--purple-mid); border-radius: 4px; }

  /* Empty cart state */
  .csu-cart-empty {
    height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; color: var(--text-muted); text-align: center;
  }

  .csu-cart-empty-icon { font-size: 48px; opacity: 0.4; }
  .csu-cart-empty h3 { font-size: 18px; color: var(--text); font-weight: 500; }

  /* Each item row inside the cart */
  .csu-cart-item {
    display: flex; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid var(--border); align-items: center;
    animation: csuSlideIn 0.3s ease;
  }

  @keyframes csuSlideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .csu-item-img {
    width: 52px; height: 52px; background: var(--purple-dark);
    border-radius: 10px; display: flex; align-items: center;
    justify-content: center; font-size: 22px; flex-shrink: 0; overflow: hidden;
  }

  .csu-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .csu-item-info { flex: 1; min-width: 0; }
  .csu-item-name { font-weight: 600; font-size: 14px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .csu-item-price { font-size: 13px; color: var(--purple-light); font-weight: 600; }
  .csu-item-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  /* +/- quantity buttons in the cart */
  .csu-qty-btn {
    width: 26px; height: 26px; background: var(--purple-dark);
    border: 1px solid var(--border); border-radius: 6px; color: var(--text);
    cursor: pointer; font-size: 14px; display: flex;
    align-items: center; justify-content: center; transition: background 0.2s;
  }

  .csu-qty-btn:hover { background: var(--purple-mid); }
  .csu-qty-num { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }

  /* ── Coupon Code Section ── */
  .csu-coupon { display: flex; gap: 8px; margin-bottom: 12px; }

  .csu-coupon input {
    flex: 1; background: rgba(255,255,255,0.05);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 10px 14px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.2s;
  }

  .csu-coupon input:focus { border-color: var(--purple-light); }

  .csu-coupon-btn {
    background: var(--purple-dark); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); padding: 10px 16px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: background 0.2s; white-space: nowrap;
  }

  .csu-coupon-btn:hover { background: var(--purple-mid); }
  .csu-coupon-success { font-size: 12px; color: #86efac; margin-bottom: 10px; }
  .csu-coupon-error { font-size: 12px; color: #fca5a5; margin-bottom: 10px; }

  /* ── Cart Footer (total + checkout) ── */
  .csu-cart-footer { padding: 20px 28px; border-top: 1px solid var(--border); }

  .csu-cart-total {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 4px;
    font-size: 16px; font-weight: 700;
  }

  .csu-cart-discount {
    display: flex; justify-content: space-between;
    font-size: 13px; color: #86efac; margin-bottom: 12px;
  }

  .csu-total-amount {
    font-size: 22px; background: var(--grad);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .csu-checkout-btn {
    width: 100%; background: var(--grad); border: none;
    border-radius: 12px; color: white; padding: 15px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.02em;
  }

  .csu-checkout-btn:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(236,72,153,0.4); }

  /* ── Checkout Confirmation Screen ── */
  /* Shown inside the cart panel after clicking Checkout */
  .csu-confirm {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
    gap: 16px;
    animation: csuSlideIn 0.4s ease;
  }

  .csu-confirm-icon {
    font-size: 64px;
    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes pop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .csu-confirm-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .csu-confirm-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  .csu-confirm-total {
    font-size: 28px; font-weight: 700;
    background: var(--grad);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .csu-confirm-items {
    width: 100%;
    background: rgba(168,85,247,0.06);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    text-align: left;
    max-height: 180px;
    overflow-y: auto;
  }

  .csu-confirm-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 5px 0;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
  }

  .csu-confirm-item:last-child { border-bottom: none; }
  .csu-confirm-item span:last-child { color: var(--purple-light); font-weight: 600; }

  .csu-continue-btn {
    width: 100%; background: var(--grad); border: none;
    border-radius: 12px; color: white; padding: 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 8px;
  }

  .csu-continue-btn:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(236,72,153,0.4); }

  /* ── Toast Notification ── */
  /* Small popup at the bottom when item is added to cart */
  .csu-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--grad); color: white;
    padding: 12px 24px; border-radius: 50px;
    font-size: 14px; font-weight: 600; z-index: 999;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none; white-space: nowrap;
  }

  .csu-toast.show { transform: translateX(-50%) translateY(0); }
`;

// ============================================================
// HELPER — returns an emoji based on the product category name
// Used when a product has no image_url in the database
// ============================================================
const categoryEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("makeup") || n.includes("lipstick")) return "💄";
  if (n.includes("fragrance") || n.includes("perfume")) return "🌹";
  if (n.includes("grooming") || n.includes("beard")) return "🧔";
  if (n.includes("eye")) return "👁️";
  if (n.includes("highlighter")) return "✨";
  if (n.includes("men")) return "🖤";
  return "🛍️";
};

// ============================================================
// COMPONENT — ProductCard
// Renders a single product card in the grid.
// Props:
//   product   — product object from the DB (name, price, etc.)
//   onAdd     — function to call when "+ Add" is clicked
//   isAdding  — true while the add-to-cart API call is in flight
// ============================================================
function ProductCard({ product, onAdd, isAdding }) {
  const emoji = categoryEmoji(product.category_name || product.name);

  return (
    <div className="csu-card">
      {/* Show real image if available, otherwise show emoji placeholder */}
      {product.image_url
        ? <img className="csu-card-img" src={product.image_url} alt={product.name} />
        : <div className="csu-card-img-placeholder">{emoji}</div>}

      <div className="csu-card-body">
        {/* Category tag pulled from the categories table via JOIN */}
        <span className="csu-tag">{product.category_name || "PRODUCT"}</span>
        <div className="csu-card-name">{product.name}</div>
        {product.brand && <div className="csu-card-brand">{product.brand}</div>}
        {product.description && <div className="csu-card-desc">{product.description}</div>}

        <div className="csu-card-footer">
          <div>
            <div className="csu-price">${Number(product.price).toFixed(2)}</div>
            {/* Stock quantity from the products table */}
            <div className="csu-stock">
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </div>
          </div>
          {/* Disabled if out of stock or currently adding */}
          <button
            className="csu-add-btn"
            onClick={() => onAdd(product)}
            disabled={isAdding || product.stock_quantity === 0}
          >
            {isAdding ? "..." : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT — CartItemRow
// Renders a single item inside the shopping cart panel.
// Props:
//   item        — cart row (id, name, price, quantity, image_url)
//   onIncrease  — called when "+" is clicked
//   onDecrease  — called when "−" is clicked (removes if qty hits 0)
// ============================================================
function CartItemRow({ item, onIncrease, onDecrease }) {
  const emoji = categoryEmoji(item.name);

  return (
    <div className="csu-cart-item">
      <div className="csu-item-img">
        {item.image_url ? <img src={item.image_url} alt={item.name} /> : emoji}
      </div>
      <div className="csu-item-info">
        <div className="csu-item-name">{item.name}</div>
        {/* Price × quantity */}
        <div className="csu-item-price">${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <div className="csu-item-controls">
        <button className="csu-qty-btn" onClick={onDecrease}>−</button>
        <span className="csu-qty-num">{item.quantity}</span>
        <button className="csu-qty-btn" onClick={onIncrease}>+</button>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT — CheckoutConfirm
// Shown inside the cart panel after clicking "Checkout".
// Displays a summary of the order and a "Continue Shopping" button.
// Props:
//   items      — the cart items array
//   total      — final total after discount
//   onClose    — closes the cart and resets to shopping view
// ============================================================
function CheckoutConfirm({ items, total, onClose }) {
  return (
    <div className="csu-confirm">
      {/* Animated checkmark icon */}
      <div className="csu-confirm-icon">✅</div>
      <div className="csu-confirm-title">Order Placed!</div>
      <div className="csu-confirm-sub">
        Thank you for your purchase! Your order has been received and is being processed.
      </div>

      {/* Show the final total */}
      <div className="csu-confirm-total">${total.toFixed(2)}</div>

      {/* List each item in the order */}
      <div className="csu-confirm-items">
        {items.map(item => (
          <div className="csu-confirm-item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Closes cart and goes back to browsing */}
      <button className="csu-continue-btn" onClick={onClose}>
        Continue Shopping →
      </button>
    </div>
  );
}

// ============================================================
// COMPONENT — AuthModal
// Shown on first load — user must log in or register.
// Calls POST /auth/login or POST /auth/register on the backend.
// On success, calls onAuth({ user_id, username }) to store the user.
// ============================================================
function AuthModal({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      // Hit either /auth/login or /auth/register depending on mode
      const res = await fetch(`${API}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }

      // Pass user info up to the parent component
      onAuth({ user_id: data.user_id, username: data.username || username });
    } catch {
      setError("Could not connect to server. Make sure the backend is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csu-modal-overlay">
      <div className="csu-modal">
        <div className="csu-modal-title">
          {mode === "login" ? "Welcome Back 💜" : "Join CSUBeauty ✦"}
        </div>
        <div className="csu-modal-sub">
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </div>

        {/* Error message from the backend or validation */}
        {error && <div className="csu-error">{error}</div>}

        <div className="csu-input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
        <div className="csu-input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>

        <button className="csu-modal-btn" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Toggle between login and register */}
        <div className="csu-modal-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT — CSUBeauty
// This is the root component that manages all state and
// renders everything: navbar, tabs, products, cart panel.
// ============================================================
export default function CSUBeauty() {

  // ── State ──────────────────────────────────────────────────
  const [user, setUser] = useState(null);           // logged-in user { user_id, username }
  const [activeTab, setActiveTab] = useState("women"); // which collection tab is active
  const [searchQuery, setSearchQuery] = useState(""); // search bar input value
  const [products, setProducts] = useState([]);      // products array from GET /products
  const [cartItems, setCartItems] = useState([]);    // items from GET /cart/:user_id
  const [cartTotal, setCartTotal] = useState(0);     // raw total from the backend
  const [cartOpen, setCartOpen] = useState(false);   // whether the cart panel is visible
  const [loadingProducts, setLoadingProducts] = useState(false); // spinner while fetching
  const [addingId, setAddingId] = useState(null);   // product id currently being added
  const [couponCode, setCouponCode] = useState(""); // coupon input value
  const [couponMsg, setCouponMsg] = useState(null); // { type: "success"|"error", text }
  const [discount, setDiscount] = useState(0);      // dollar amount saved from coupon
  const [checkedOut, setCheckedOut] = useState(false); // shows confirmation screen
  const [toast, setToast] = useState({ visible: false, message: "" }); // bottom toast
  const toastTimer = useRef(null); // ref to clear the toast timeout

  // ── Inject CSS into the page on mount ─────────────────────
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = styles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el); // cleanup on unmount
  }, []);

  // ── Fetch products when user logs in or search changes ─────
  useEffect(() => {
    if (user) fetchProducts();
  }, [searchQuery, user]);

  // ── Fetch cart whenever the cart panel opens ───────────────
  useEffect(() => {
    if (user && cartOpen) fetchCart();
  }, [user, cartOpen]);

  // ── API: GET /products — loads products from the database ──
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      // If there's a search query, add it as ?search=...
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await fetch(`${API}/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ── API: GET /cart/:user_id — loads the user's cart ────────
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/cart/${user.user_id}`);
      const data = await res.json();
      setCartItems(data.items || []);
      setCartTotal(data.total || 0);
    } catch {
      setCartItems([]);
    }
  };

  // ── API: POST /cart — adds a product to the cart ───────────
  const addToCart = async (product) => {
    setAddingId(product.id);
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, product_id: product.id, quantity: 1 }),
      });
      if (res.ok) {
        showToast(`${product.name} added!`);
        fetchCart(); // refresh cart after adding
      }
    } catch {
      showToast("Failed to add item.");
    } finally {
      setAddingId(null);
    }
  };

  // ── API: PUT /cart/:id or DELETE /cart/:id ─────────────────
  // Called when user clicks +/- on a cart item
  const updateQty = async (cartId, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      // Remove item entirely if quantity drops to 0
      await fetch(`${API}/cart/${cartId}`, { method: "DELETE" });
    } else {
      // Otherwise update quantity
      await fetch(`${API}/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    }
    fetchCart(); // refresh cart after change
  };

  // ── API: POST /coupons/apply — validates and applies coupon ─
  const applyCoupon = async () => {
    setCouponMsg(null);
    if (!couponCode.trim()) return;
    try {
      const res = await fetch(`${API}/coupons/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cart_total: cartTotal, user_id: user.user_id }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponMsg({ type: "error", text: data.error }); return; }
      setDiscount(data.discount);
      setCouponMsg({ type: "success", text: `Saved $${data.discount.toFixed(2)}!` });
    } catch {
      setCouponMsg({ type: "error", text: "Could not apply coupon." });
    }
  };

  // ── Checkout handler ───────────────────────────────────────
  // Shows the confirmation screen (no backend call needed for Option A)
  const handleCheckout = () => {
    setCheckedOut(true);
  };

  // ── Called after user clicks "Continue Shopping" ───────────
  // Resets cart state and closes the panel
  const handleContinueShopping = () => {
    setCheckedOut(false);
    setCartOpen(false);
    setCartItems([]);
    setCartTotal(0);
    setDiscount(0);
    setCouponCode("");
    setCouponMsg(null);
  };

  // ── Logout — clears all user state ────────────────────────
  const logout = () => {
    setUser(null);
    setCartItems([]);
    setProducts([]);
    setDiscount(0);
    setCouponMsg(null);
    setCheckedOut(false);
  };

  // ── Toast helper — shows a temporary bottom notification ───
  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: "" }), 2200);
  };

  // ── Filter products by tab ─────────────────────────────────
  // Women's tab: everything that isn't men/grooming
  // Men's tab: anything with "men" or "grooming" in category name
  const womenProducts = products.filter(p => {
    const cat = (p.category_name || "").toLowerCase();
    return !cat.includes("men") && !cat.includes("grooming");
  });

  const menProducts = products.filter(p => {
    const cat = (p.category_name || "").toLowerCase();
    return cat.includes("men") || cat.includes("grooming");
  });

  // Fall back to all products if no category split is possible
  const displayProducts = activeTab === "women"
    ? (womenProducts.length ? womenProducts : products)
    : menProducts;

  // ── Derived values ─────────────────────────────────────────
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0); // total item count for badge
  const finalTotal = Math.max(0, cartTotal - discount);             // total after coupon

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="csu-root">

      {/* Auth gate — blocks the page until user is logged in */}
      {!user && <AuthModal onAuth={setUser} />}

      {/* ── Navbar ── */}
      <nav className="csu-nav">
        <div className="csu-logo">
          <div className="csu-logo-icon">✦</div>
          CSUBeauty
        </div>

        {/* Search bar — calls fetchProducts via useEffect on change */}
        <div className="csu-search">
          <span className="csu-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search makeup, fragrance..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="csu-nav-right">
          {user && (
            <>
              <div className="csu-user-info">Hi, <span>{user.username}</span></div>
              <button className="csu-logout-btn" onClick={logout}>Logout</button>
            </>
          )}
          {/* Cart button — shows item count badge */}
          <button className="csu-cart-btn" onClick={() => setCartOpen(true)}>
            🛒
            {cartCount > 0 && <span className="csu-cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* ── Collection Tabs ── */}
      <div className="csu-tabs">
        <button className={`csu-tab${activeTab === "women" ? " active" : ""}`} onClick={() => setActiveTab("women")}>
          Women's Collection
        </button>
        <button className={`csu-tab${activeTab === "men" ? " active" : ""}`} onClick={() => setActiveTab("men")}>
          Men's Collection
        </button>
      </div>

      {/* ── Products Grid ── */}
      <div className="csu-content">
        {loadingProducts ? (
          // Spinner while products are loading
          <div className="csu-loading"><div className="csu-spinner" /> Loading products...</div>
        ) : displayProducts.length === 0 ? (
          // Shown if DB has no products or search returns nothing
          <div className="csu-empty">No products found.</div>
        ) : (
          <div className="csu-section">
            <div className="csu-section-title">
              {activeTab === "women" ? "Women's Collection" : "Men's Collection"}
            </div>
            <div className="csu-grid">
              {displayProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={addToCart}
                  isAdding={addingId === p.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Cart Slide-in Panel ── */}
      <div
        className={`csu-overlay${cartOpen ? " open" : ""}`}
        // Click the dark backdrop to close the cart
        onClick={e => { if (e.target.classList.contains("csu-overlay")) setCartOpen(false); }}
      >
        <div className="csu-cart-panel">

          {/* Cart header */}
          <div className="csu-cart-header">
            <span className="csu-cart-title">
              {checkedOut ? "Order Confirmed" : "Shopping Cart"}
            </span>
            <button className="csu-close-btn" onClick={() => {
              setCartOpen(false);
              if (checkedOut) handleContinueShopping();
            }}>✕</button>
          </div>

          {/* Show confirmation screen or normal cart items */}
          {checkedOut ? (
            <CheckoutConfirm
              items={cartItems}
              total={finalTotal}
              onClose={handleContinueShopping}
            />
          ) : (
            <>
              <div className="csu-cart-body">
                {cartItems.length === 0 ? (
                  // Empty cart state
                  <div className="csu-cart-empty">
                    <div className="csu-cart-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started</p>
                  </div>
                ) : (
                  // Render each cart item
                  cartItems.map(item => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onIncrease={() => updateQty(item.id, 1, item.quantity)}
                      onDecrease={() => updateQty(item.id, -1, item.quantity)}
                    />
                  ))
                )}
              </div>

              {/* Footer only shown when cart has items */}
              {cartItems.length > 0 && (
                <div className="csu-cart-footer">
                  {/* Coupon code input — calls POST /coupons/apply */}
                  <div className="csu-coupon">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()}
                    />
                    <button className="csu-coupon-btn" onClick={applyCoupon}>Apply</button>
                  </div>

                  {/* Success or error message after applying coupon */}
                  {couponMsg && (
                    <div className={couponMsg.type === "success" ? "csu-coupon-success" : "csu-coupon-error"}>
                      {couponMsg.text}
                    </div>
                  )}

                  {/* Total price display */}
                  <div className="csu-cart-total">
                    <span>Total</span>
                    <span className="csu-total-amount">${finalTotal.toFixed(2)}</span>
                  </div>

                  {/* Discount line shown only if coupon was applied */}
                  {discount > 0 && (
                    <div className="csu-cart-discount">
                      <span>Discount</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Checkout button — triggers confirmation screen */}
                  <button className="csu-checkout-btn" onClick={handleCheckout}>
                    Checkout →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {/* Pops up briefly at the bottom when an item is added */}
      <div className={`csu-toast${toast.visible ? " show" : ""}`}>{toast.message}</div>
    </div>
  );
}
