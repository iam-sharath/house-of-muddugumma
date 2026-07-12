import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const CartCtx = createContext(null);
const SettingsCtx = createContext({});
const AuthCtx = createContext({ user: null, loading: true });

export function AppProviders({ children }) {
  // Cart
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hom-cart") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem("hom-cart", JSON.stringify(items)); }, [items]);

  const addToCart = (product, opts = {}) => {
    const color = opts.color || (product.colors?.[0] || "");
    const qty = opts.qty || 1;
    setItems((prev) => {
      const key = `${product.id}-${color}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, {
        key, id: product.id, slug: product.slug, name: product.name,
        image: product.images?.[0] || "", price_inr: product.price_inr,
        price_gbp: product.price_gbp, color, qty
      }];
    });
  };
  const updateQty = (key, qty) => setItems((p) => p.map(i => i.key === key ? { ...i, qty: Math.max(1, qty) } : i));
  const removeItem = (key) => setItems((p) => p.filter(i => i.key !== key));
  const clearCart = () => setItems([]);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hom-wish") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem("hom-wish", JSON.stringify(wishlist)); }, [wishlist]);
  const toggleWish = (pid) => setWishlist((w) => w.includes(pid) ? w.filter(x => x !== pid) : [...w, pid]);

  // Settings
  const [settings, setSettings] = useState({});
  const loadSettings = useCallback(async () => {
    try {
      const { data } = await api.get("/settings/public");
      setSettings(data);
    } catch {}
  }, []);
  useEffect(() => { loadSettings(); }, [loadSettings]);

  // Auth
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/session");
      setUser(data.user);
    } catch { setUser(null); }
    setAuthLoading(false);
  }, []);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    setUser(null);
  };

  return (
    <SettingsCtx.Provider value={{ settings, reload: loadSettings }}>
      <AuthCtx.Provider value={{ user, loading: authLoading, login, logout, refresh: checkAuth }}>
        <CartCtx.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, wishlist, toggleWish }}>
          {children}
        </CartCtx.Provider>
      </AuthCtx.Provider>
    </SettingsCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
export const useSettings = () => useContext(SettingsCtx);
export const useAuth = () => useContext(AuthCtx);
