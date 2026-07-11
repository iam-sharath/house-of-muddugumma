import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const covers = [
  "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1714682597753-a646ba506cee?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1569810020669-aa9d38003ea7?auto=format&fit=crop&w=800&q=70",
];

export default function CollectionsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/collections").then(({ data }) => setItems(data)); }, []);
  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="eyebrow">Curated</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">Our Collections</h1>
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((c, i) => (
          <Link key={c.id} to={`/shop?collection=${encodeURIComponent(c.name)}`}
            data-testid={`collection-${c.slug}`}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
            <img src={c.cover_image || covers[i % covers.length]} alt={c.name}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/75 to-transparent"/>
            <div className="absolute inset-x-6 bottom-6 text-white">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Collection</div>
              <div className="font-serif text-2xl mt-1">{c.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
