import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, MessageCircle } from "lucide-react";
import { useCart, useSettings } from "../lib/store";
import { fileUrl } from "../lib/api";
import { buildWhatsAppUrl } from "../lib/whatsapp";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const { settings } = useSettings();

  const subtotalINR = items.reduce((s, i) => s + i.qty * Number(i.price_inr || 0), 0);
  const subtotalGBP = items.reduce((s, i) => s + i.qty * Number(i.price_gbp || 0), 0);

  const onCheckout = () => {
    if (items.length === 0) return;
    const url = buildWhatsAppUrl(items, settings);
    window.open(url, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="container-luxe py-24 text-center">
        <div className="eyebrow">Cart</div>
        <h1 className="font-serif text-5xl mt-3">Your cart awaits.</h1>
        <p className="mt-4 text-brown-soft">Add pieces you love — we'll help you check out over WhatsApp.</p>
        <Link to="/shop" className="btn-gold mt-8 inline-flex" data-testid="cart-shop-cta">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="eyebrow">Bag</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">Your Cart</h1>
      <p className="mt-3 text-brown-soft">{items.length} item{items.length > 1 ? "s" : ""}. Checkout completes on WhatsApp.</p>

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-5">
          {items.map((it) => (
            <div key={it.key} data-testid={`cart-item-${it.slug}`} className="card-luxe p-5 flex gap-5 items-center">
              <Link to={`/product/${it.slug}`} className="shrink-0">
                <img src={it.image ? fileUrl(it.image) : "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=200"}
                     alt={it.name} className="w-24 h-28 object-cover rounded-lg"/>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.slug}`} className="font-serif text-lg hover:text-gold line-clamp-1">{it.name}</Link>
                {it.color && <div className="mt-1 text-xs text-brown-soft">Color: {it.color}</div>}
                {it.size && <div className="mt-1 text-xs text-brown-soft">Size: {it.size}</div>}
                <div className="mt-2 text-sm font-medium">₹{Number(it.price_inr).toLocaleString("en-IN")}
                  {it.price_gbp ? <span className="ml-3 text-brown-soft">£{Number(it.price_gbp).toLocaleString("en-GB")}</span> : null}
                </div>
              </div>
              <div className="flex items-center border border-border rounded-full">
                <button data-testid={`cart-dec-${it.slug}`} onClick={() => updateQty(it.key, it.qty - 1)} className="p-2 hover:text-gold"><Minus className="w-4 h-4"/></button>
                <span className="px-3 min-w-8 text-center text-sm font-medium">{it.qty}</span>
                <button data-testid={`cart-inc-${it.slug}`} onClick={() => updateQty(it.key, it.qty + 1)} className="p-2 hover:text-gold"><Plus className="w-4 h-4"/></button>
              </div>
              <button data-testid={`cart-remove-${it.slug}`} onClick={() => removeItem(it.key)} className="p-2 text-brown-soft hover:text-red-600" aria-label="Remove">
                <X className="w-4 h-4"/>
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-xs text-brown-soft hover:text-red-600 uppercase tracking-[0.2em]" data-testid="cart-clear">Clear cart</button>
        </div>

        <aside>
          <div className="card-luxe p-7 sticky top-24">
            <div className="eyebrow">Summary</div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brown-soft">Subtotal (INR)</span><span className="font-medium">₹{subtotalINR.toLocaleString("en-IN")}</span></div>
              {subtotalGBP > 0 && (
                <div className="flex justify-between"><span className="text-brown-soft">Subtotal (GBP)</span><span className="font-medium">£{subtotalGBP.toLocaleString("en-GB")}</span></div>
              )}
              <div className="text-xs text-brown-soft pt-3 border-t border-border">Prices exclude shipping. Our team will confirm total and delivery on WhatsApp.</div>
            </div>
            <button onClick={onCheckout} className="btn-wa w-full mt-6" data-testid="cart-checkout-whatsapp">
              <MessageCircle className="w-4 h-4"/> Place Order on WhatsApp
            </button>
            <Link to="/shop" className="btn-outline-gold w-full mt-3">Continue Shopping</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
