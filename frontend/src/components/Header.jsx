import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X } from "lucide-react";
import { useCart, useSettings } from "../lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { items } = useCart();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const count = items.reduce((s, i) => s + i.qty, 0);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/shop?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/85 border-b border-border/60">
      <div className="container-luxe">
        <div className="h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3" data-testid="brand-logo">
            <img src="/brand/logo.png" alt={settings.business_name || "House of Muddugumma"}
                 className="h-14 w-14 rounded-full object-cover shadow-soft"/>
            <div className="hidden sm:block leading-tight">
              <div className="font-serif text-xl text-brown-dark">{settings.business_name || "House of Muddugumma"}</div>
              <div className="eyebrow text-[10px]">Handwoven Elegance</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <NavLink
                key={l.to} to={l.to} end={l.to === "/"}
                data-testid={`nav-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-[13px] uppercase tracking-[0.22em] link-underline transition-colors ${isActive ? "text-gold" : "text-brown-dark hover:text-gold"}`
                }>{l.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={onSearch} className="hidden md:flex items-center bg-white border border-border rounded-full pl-4 pr-1 py-1 w-56">
              <Search className="w-4 h-4 text-brown-soft"/>
              <input
                data-testid="search-input"
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none px-2 text-sm flex-1"/>
            </form>
            <Link to="/wishlist" data-testid="wishlist-link" className="p-2 hover:text-gold" aria-label="Wishlist">
              <Heart className="w-5 h-5"/>
            </Link>
            <Link to="/cart" data-testid="cart-link" className="p-2 hover:text-gold relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5"/>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-medium">{count}</span>
              )}
            </Link>
            <button data-testid="menu-toggle" onClick={() => setOpen(true)} className="lg:hidden p-2" aria-label="Menu">
              <Menu className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-cream" data-testid="mobile-menu">
          <div className="container-luxe pt-6">
            <div className="flex items-center justify-between">
              <div className="font-serif text-xl">{settings.business_name || "House of Muddugumma"}</div>
              <button onClick={() => setOpen(false)} className="p-2" aria-label="Close" data-testid="menu-close"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={onSearch} className="mt-6 flex items-center bg-white border border-border rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-brown-soft"/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="bg-transparent outline-none px-3 py-1 flex-1"/>
            </form>
            <div className="mt-10 flex flex-col gap-6">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                  className="font-serif text-3xl text-brown-dark hover:text-gold">{l.label}</NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
