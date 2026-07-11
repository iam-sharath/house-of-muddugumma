import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, fileUrl } from "../lib/api";
import { useCart, useSettings } from "../lib/store";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { Minus, Plus, Heart, Share2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const { addToCart, wishlist, toggleWish } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data);
      setColor(data.colors?.[0] || "");
      setActiveImg(0);
      if (data.categories?.[0]) {
        api.get(`/products?category=${encodeURIComponent(data.categories[0])}&limit=8`)
          .then((r) => setRelated((r.data.items || []).filter((p) => p.id !== data.id).slice(0, 4)));
      }
    }).catch(() => setProduct({ notFound: true }));
  }, [slug]);

  if (!product) return <div className="container-luxe py-24"><div className="skeleton h-96"/></div>;
  if (product.notFound) return <div className="container-luxe py-24 text-center"><h1 className="font-serif text-4xl">Product not found</h1><Link to="/shop" className="btn-outline-gold mt-6 inline-flex">Back to Shop</Link></div>;

  const images = product.images?.length ? product.images.map(fileUrl) : ["https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200"];
  const wished = wishlist.includes(product.id);

  const onWhatsApp = () => {
    const url = buildWhatsAppUrl([{
      name: product.name, color, qty, price_inr: product.price_inr, price_gbp: product.price_gbp
    }], settings);
    window.open(url, "_blank");
  };

  return (
    <div className="container-luxe py-10 md:py-16">
      <div className="text-xs text-brown-soft uppercase tracking-[0.2em] mb-6">
        <Link to="/" className="hover:text-gold">Home</Link> · <Link to="/shop" className="hover:text-gold">Shop</Link> · <span className="text-brown-dark">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-cream-light cursor-zoom-in"
            onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}
            data-testid="product-main-image">
            <img src={images[activeImg]} alt={product.name}
                 className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}/>
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImg === i ? "border-gold" : "border-transparent"}`}>
                  <img src={img} alt={`view-${i}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="eyebrow">{product.categories?.[0] || "Handloom"}</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-2xl font-medium">₹{Number(product.price_inr).toLocaleString("en-IN")}</span>
            {product.price_gbp ? <span className="text-lg text-brown-soft">£{Number(product.price_gbp).toLocaleString("en-GB")}</span> : null}
          </div>
          <p className="mt-6 text-brown-soft leading-relaxed">{product.description}</p>

          {product.colors?.length ? (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.2em] text-brown-soft mb-3">Color: <span className="text-brown-dark font-medium">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} data-testid={`color-${c}`} onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-full text-xs border transition-colors ${c === color ? "border-gold bg-gold-soft text-brown-dark" : "border-border hover:border-gold"}`}>{c}</button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-4">
            <div className="text-xs uppercase tracking-[0.2em] text-brown-soft">Quantity</div>
            <div className="flex items-center border border-border rounded-full">
              <button data-testid="qty-dec" onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:text-gold"><Minus className="w-4 h-4"/></button>
              <span className="px-4 w-10 text-center font-medium" data-testid="qty-value">{qty}</span>
              <button data-testid="qty-inc" onClick={() => setQty(qty + 1)} className="p-2.5 hover:text-gold"><Plus className="w-4 h-4"/></button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button data-testid="pd-add-cart"
              onClick={() => { addToCart(product, { color, qty }); toast.success("Added to cart"); }}
              className="btn-gold flex-1 min-w-[180px]">Add to Cart</button>
            <button data-testid="pd-whatsapp" onClick={onWhatsApp} className="btn-wa flex-1 min-w-[180px]">
              <MessageCircle className="w-4 h-4"/> Order on WhatsApp
            </button>
            <button data-testid="pd-wish" onClick={() => toggleWish(product.id)} className="p-3 border border-border rounded-full hover:border-gold" aria-label="Wishlist">
              <Heart className={`w-5 h-5 ${wished ? "fill-gold text-gold" : ""}`}/>
            </button>
          </div>

          <div className="mt-10 border-t border-border pt-8 space-y-5 text-sm">
            {product.fabric && (
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="eyebrow">Fabric</div>
                <div className="text-brown-soft">{product.fabric}</div>
              </div>
            )}
            {product.wash && (
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="eyebrow">Wash Care</div>
                <div className="text-brown-soft">{product.wash}</div>
              </div>
            )}
            {product.tags?.length ? (
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="eyebrow">Tags</div>
                <div className="text-brown-soft flex flex-wrap gap-2">
                  {product.tags.map((t) => <span key={t} className="px-2.5 py-0.5 border border-border rounded-full text-xs">{t}</span>)}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <div className="eyebrow">You may also like</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-8">Related Pieces</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {related.map((p) => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
