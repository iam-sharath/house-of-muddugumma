import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Package, Tag, Layers, Percent, Image as ImageIcon, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(({ data }) => setStats(data)); }, []);

  const cards = [
    { key: "products", label: "Products", icon: Package },
    { key: "published", label: "Published", icon: TrendingUp },
    { key: "categories", label: "Categories", icon: Tag },
    { key: "collections", label: "Collections", icon: Layers },
    { key: "offers", label: "Offers", icon: Percent },
    { key: "banners", label: "Banners", icon: ImageIcon },
  ];

  return (
    <div>
      <div className="eyebrow">Overview</div>
      <h1 className="font-serif text-4xl mt-2">Dashboard</h1>
      <p className="text-brown-soft mt-2">Welcome back. Here's what's happening.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.key} className="card-luxe p-6" data-testid={`stat-${c.key}`}>
            <div className="flex items-center justify-between">
              <div className="eyebrow">{c.label}</div>
              <c.icon className="w-5 h-5 text-gold"/>
            </div>
            <div className="mt-3 font-serif text-4xl">{stats ? stats[c.key] : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
