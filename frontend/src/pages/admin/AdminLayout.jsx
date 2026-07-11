import React from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../lib/store";
import { LayoutDashboard, Package, Tag, Layers, Percent, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/collections", label: "Collections", icon: Layers },
  { to: "/admin/offers", label: "Offers", icon: Percent },
  { to: "/admin/banners", label: "Banners", icon: ImageIcon },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();

  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace/>;

  const onLogout = async () => { await logout(); toast.success("Signed out"); nav("/admin/login"); };

  return (
    <div className="min-h-screen bg-cream">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="lg:min-h-screen bg-white border-r border-border">
          <div className="p-6 flex items-center gap-3 border-b border-border">
            <img src="/brand/logo.png" alt="logo" className="h-10 w-10 rounded-full"/>
            <div>
              <div className="font-serif text-lg leading-none">Muddugumma</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-gold mt-0.5">Admin</div>
            </div>
          </div>
          <nav className="p-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                data-testid={`admin-nav-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-1 transition-colors ${
                    isActive ? "bg-gold-soft text-brown-dark font-medium" : "text-brown-soft hover:bg-cream hover:text-brown-dark"
                  }`
                }>
                <l.icon className="w-4 h-4"/> {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 mt-4 border-t border-border">
            <div className="text-xs text-brown-soft mb-2">Signed in as</div>
            <div className="text-sm font-medium truncate">{user.email}</div>
            <button onClick={onLogout} data-testid="admin-logout"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 h-10 border border-border rounded-full text-sm hover:border-gold">
              <LogOut className="w-4 h-4"/> Sign out
            </button>
          </div>
        </aside>
        <main className="p-6 md:p-10">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
