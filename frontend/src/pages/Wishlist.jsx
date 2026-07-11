import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useCart } from "../lib/store";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!wishlist.length) { setProducts([]); setLoading(false); return; }
    api.get("/products?limit=200").then(({ data }) => {
      setProducts((data.items || []).filter((p) => wishlist.includes(p.id)));
      setLoading(false);
    });
  }, [wishlist]);
  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="eyebrow">Saved</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">Your Wishlist</h1>
      {loading ? <div className="mt-10 skeleton h-64"/> :
        products.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-brown-soft">You haven't saved any pieces yet.</p>
            <Link to="/shop" className="btn-gold mt-6 inline-flex">Explore Shop</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => <ProductCard key={p.id} product={p}/>)}
          </div>
        )
      }
    </div>
  );
}
