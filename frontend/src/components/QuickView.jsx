import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { fileUrl } from "../lib/api";
import { Link } from "react-router-dom";
import { useCart } from "../lib/store";
import { toast } from "sonner";

export default function QuickView({ product, onOpenChange }) {
  const { addToCart } = useCart();
  if (!product) return null;
  const img = product.images?.[0] ? fileUrl(product.images[0]) : "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=800";
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          <img src={img} alt={product.name} className="w-full h-full object-cover aspect-square md:aspect-auto"/>
          <div className="p-8 flex flex-col">
            <div className="eyebrow">Quick View</div>
            <h2 className="font-serif text-3xl mt-2">{product.name}</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-lg font-medium">₹{Number(product.price_inr).toLocaleString("en-IN")}</span>
              {product.price_gbp ? <span className="text-brown-soft">£{Number(product.price_gbp).toLocaleString("en-GB")}</span> : null}
            </div>
            <p className="mt-4 text-sm text-brown-soft line-clamp-4">{product.description}</p>
            {product.colors?.length ? (
              <div className="mt-5">
                <div className="text-xs uppercase tracking-[0.2em] text-brown-soft">Colors</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full border border-border text-xs">{c}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-auto pt-6 flex gap-3">
              <button data-testid="quickview-add-cart" onClick={() => { addToCart(product); toast.success("Added to cart"); onOpenChange(false); }} className="btn-gold flex-1">Add to Cart</button>
              <Link to={`/product/${product.slug}`} className="btn-outline-gold flex-1" onClick={() => onOpenChange(false)}>View Details</Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
