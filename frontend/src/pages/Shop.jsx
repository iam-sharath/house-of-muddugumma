import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import { X, SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [quick, setQuick] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = sp.get("q") || "";
  const category = sp.get("category") || "";
  const collection = sp.get("collection") || "";
  const tag = sp.get("tag") || "";

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/collections")]).then(([c, cl]) => {
      setCategories(c.data); setCollections(cl.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (collection) params.set("collection", collection);
    if (tag) params.set("tag", tag);
    params.set("limit", "60");
    api.get(`/products?${params.toString()}`).then(({ data }) => {
      setItems(data.items || []);
      setLoading(false);
    });
  }, [q, category, collection, tag]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(sp);
    if (val) next.set(key, val); else next.delete(key);
    setSp(next);
  };

  const activeFilters = useMemo(() => [
    q && ["q", q, "Search"],
    category && ["category", category, "Category"],
    collection && ["collection", collection, "Collection"],
    tag && ["tag", tag, "Tag"],
  ].filter(Boolean), [q, category, collection, tag]);

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="mb-10">
        <div className="eyebrow">Shop</div>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">All Products</h1>
        <p className="mt-3 text-brown-soft">{items.length} pieces{q ? ` for "${q}"` : ""}</p>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(([k, v, label]) => (
            <button key={k} onClick={() => setParam(k, "")} className="inline-flex items-center gap-2 rounded-full bg-gold-soft text-brown-dark px-4 py-1.5 text-xs">
              {label}: {v} <X className="w-3 h-3"/>
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="card-luxe p-6 sticky top-24">
            <div className="eyebrow mb-4">Categories</div>
            <div className="space-y-2">
              <button onClick={() => setParam("category", "")} className={`block w-full text-left text-sm py-1 ${!category ? "text-gold font-medium" : "hover:text-gold"}`}>All</button>
              {categories.map((c) => (
                <button key={c.id} data-testid={`filter-cat-${c.slug}`} onClick={() => setParam("category", c.name)}
                  className={`block w-full text-left text-sm py-1 ${category === c.name ? "text-gold font-medium" : "hover:text-gold"}`}>{c.name}</button>
              ))}
            </div>
            <div className="eyebrow mt-8 mb-4">Collections</div>
            <div className="space-y-2">
              {collections.map((c) => (
                <button key={c.id} data-testid={`filter-col-${c.slug}`} onClick={() => setParam("collection", c.name)}
                  className={`block w-full text-left text-sm py-1 ${collection === c.name ? "text-gold font-medium" : "hover:text-gold"}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden mb-4 inline-flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4"/> Filters
          </button>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] skeleton"/>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <div className="eyebrow">Empty</div>
              <p className="mt-3 font-serif text-2xl">No products found.</p>
              <p className="text-brown-soft mt-2">Try clearing filters or search again.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {items.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuick}/>)}
            </div>
          )}
        </div>
      </div>

      <QuickView product={quick} onOpenChange={(v) => { if (!v) setQuick(null); }}/>
    </div>
  );
}
