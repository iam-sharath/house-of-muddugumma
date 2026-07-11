import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/categories").then(({ data }) => setItems(data)); }, []);
  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="eyebrow">Shop by</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">All Categories</h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((c) => (
          <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`}
            data-testid={`category-${c.slug}`}
            className="card-luxe p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-soft flex items-center justify-center font-serif text-gold text-2xl">{c.name.charAt(0)}</div>
            <div className="mt-4 font-medium text-brown-dark">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
