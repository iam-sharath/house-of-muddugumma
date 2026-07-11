import React from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { fileUrl } from "../lib/api";
import { useCart } from "../lib/store";
import { toast } from "sonner";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(product.id);
  const img = product.images?.[0] ? fileUrl(product.images[0]) : "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=800&q=70";

  return (
    <div className="group" data-testid={`product-card-${product.slug}`}>
      <div className="relative overflow-hidden rounded-xl bg-cream-light aspect-[3/4]">
        <Link to={`/product/${product.slug}`}>
          <img
            src={img} alt={product.name} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"/>
        </Link>
        <button
          data-testid={`wish-toggle-${product.slug}`}
          onClick={() => { toggleWish(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 backdrop-blur grid place-items-center hover:bg-white shadow-soft"
          aria-label="Toggle wishlist">
          <Heart className={`w-4 h-4 ${wished ? "fill-gold text-gold" : "text-brown-dark"}`}/>
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {onQuickView && (
            <button
              data-testid={`quick-view-${product.slug}`}
              onClick={() => onQuickView(product)}
              className="flex-1 h-10 rounded-full bg-white/95 text-brown-dark text-[11px] uppercase tracking-[0.18em] hover:bg-white flex items-center justify-center gap-1.5 shadow-soft">
              <Eye className="w-3.5 h-3.5"/> Quick View
            </button>
          )}
          <button
            data-testid={`add-to-cart-${product.slug}`}
            onClick={() => { addToCart(product); toast.success("Added to cart"); }}
            className="flex-1 h-10 rounded-full bg-gold text-white text-[11px] uppercase tracking-[0.18em] hover:bg-gold-hover flex items-center justify-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5"/> Add
          </button>
        </div>
      </div>

      <div className="mt-4 px-1">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-lg text-brown-dark line-clamp-1 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-3 text-sm text-brown">
          <span className="font-medium text-brown-dark">₹{Number(product.price_inr || 0).toLocaleString("en-IN")}</span>
          {product.price_gbp ? <span className="text-brown-soft/80">£{Number(product.price_gbp).toLocaleString("en-GB")}</span> : null}
        </div>
      </div>
    </div>
  );
}
