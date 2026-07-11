import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import { ArrowRight, Sparkles, Star, Instagram } from "lucide-react";
import { useSettings } from "../lib/store";

const heroFallback = "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800";
const galleryFallback = [
  "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1714682597753-a646ba506cee?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1569810020669-aa9d38003ea7?auto=format&fit=crop&w=800&q=70",
];

const reviews = [
  { name: "Ananya S.", text: "The Narayanpet dress is stunning. Fabric feels premium and the fit is perfect.", rating: 5 },
  { name: "Priya R.", text: "Ordered via WhatsApp — smoothest experience. The mul cotton frock is a dream.", rating: 5 },
  { name: "Meera K.", text: "Timeless designs. My festival wear go-to now.", rating: 5 },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [quick, setQuick] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: c }, { data: cats }, { data: off }, { data: bn }] = await Promise.all([
        api.get("/products?limit=12"),
        api.get("/collections"),
        api.get("/categories"),
        api.get("/offers"),
        api.get("/banners?kind=hero"),
      ]);
      setProducts(p.items || []);
      setCollections(c || []);
      setCategories(cats || []);
      setOffers(off || []);
      setBanners(bn || []);
    })();
  }, []);

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(0, 8);
  const trending = products.slice(4, 12);
  const heroImg = banners[0]?.image || heroFallback;
  const heroTitle = banners[0]?.title || settings.homepage_title || "Handwoven Elegance";
  const heroSub = banners[0]?.subtitle || "Discover handcrafted pieces made for the modern woman.";

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="container-luxe pt-10 lg:pt-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-up">
              <div className="eyebrow">Autumn Edit · 2026</div>
              <h1 className="mt-4 font-serif font-light text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
                {heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="italic text-gold">{heroTitle.split(" ").slice(-1)[0]}</span>
              </h1>
              <p className="mt-6 text-base text-brown-soft max-w-md leading-relaxed">
                {heroSub} {settings.about_text ? "" : "Every piece tells a story of heritage, craftsmanship, and quiet luxury."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/shop" className="btn-gold" data-testid="hero-shop">Shop the Edit <ArrowRight className="w-4 h-4"/></Link>
                <Link to="/collections" className="btn-outline-gold" data-testid="hero-collections">Explore Collections</Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-brown-soft">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold"/> Handloom Craft</div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-gold"/> Small Batch</div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-2xl overflow-hidden shadow-floating">
                <img src={heroImg} alt="Hero" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/30 via-transparent to-transparent"/>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] opacity-80">New Arrival</div>
                    <div className="font-serif text-2xl mt-1">The Muddu Edit</div>
                  </div>
                  <div className="hidden sm:block text-right text-xs opacity-80">
                    <div>Handloom · 2026</div>
                    <div className="mt-1">Made in India</div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block absolute -left-8 -bottom-8 w-40 h-52 rounded-xl overflow-hidden shadow-medium border-4 border-cream">
                <img src={galleryFallback[1]} alt="detail" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <Section eyebrow="Featured" title="Featured Collection" cta={{ to: "/shop", label: "View all" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuick}/>)}
          </div>
        </Section>
      )}

      {/* CATEGORIES */}
      <Section eyebrow="Shop by" title="Categories">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((c, i) => (
            <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`}
              data-testid={`home-cat-${c.slug}`}
              className="card-luxe p-4 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold-soft flex items-center justify-center font-serif text-gold text-lg">
                {c.name.charAt(0)}
              </div>
              <div className="mt-3 text-sm font-medium text-brown-dark">{c.name}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <Section eyebrow="Just In" title="New Arrivals" cta={{ to: "/shop?tag=New%20Arrival", label: "See more" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuick}/>)}
          </div>
        </Section>
      )}

      {/* OFFERS */}
      {offers.length > 0 && (
        <section className="container-luxe py-16 md:py-24">
          <div className="rounded-2xl bg-brown-dark text-white overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-14">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Limited Time</div>
                <h3 className="mt-3 font-serif text-4xl md:text-5xl leading-tight">{offers[0].title}</h3>
                <p className="mt-4 text-white/75 leading-relaxed">{offers[0].description}</p>
                <Link to="/shop" className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 text-gold text-sm uppercase tracking-[0.2em]">Shop the offer <ArrowRight className="w-4 h-4"/></Link>
              </div>
              <div className="min-h-[280px] md:min-h-full bg-cover bg-center"
                   style={{ backgroundImage: `url(${offers[0].banner || galleryFallback[3]})` }}/>
            </div>
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      {collections.length > 0 && (
        <Section eyebrow="Curated" title="Collections">
          <div className="grid md:grid-cols-3 gap-6">
            {collections.slice(0, 3).map((col, i) => (
              <Link key={col.id} to={`/shop?collection=${encodeURIComponent(col.name)}`}
                data-testid={`home-col-${col.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5]">
                <img src={col.cover_image || galleryFallback[i % galleryFallback.length]} alt={col.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/70 via-brown-dark/10 to-transparent"/>
                <div className="absolute inset-x-6 bottom-6 text-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Collection</div>
                  <div className="font-serif text-2xl mt-1">{col.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <Section eyebrow="Loved by You" title="Trending Now">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {trending.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuick}/>)}
          </div>
        </Section>
      )}

      {/* ABOUT */}
      <section className="container-luxe py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=70" alt="Boutique" className="w-full h-full object-cover"/>
          </div>
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">A love letter to <span className="italic text-gold">handloom.</span></h2>
            <p className="mt-6 text-brown-soft leading-relaxed">
              {settings.about_text || "House of Muddugumma is a homegrown label crafted for women who love timeless, handloom-inspired pieces. Every silhouette is thoughtfully designed, every fabric handpicked."}
            </p>
            <Link to="/about" className="btn-outline-gold mt-8" data-testid="home-about-link">Discover more</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <Section eyebrow="Kind Words" title="From Our Customers">
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="card-luxe p-8">
              <div className="flex text-gold">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-gold"/>)}</div>
              <p className="mt-4 text-brown-soft italic">"{r.text}"</p>
              <div className="mt-6 font-medium text-brown-dark">— {r.name}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* INSTAGRAM */}
      <Section eyebrow="Follow us on" title="Instagram">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryFallback.concat(galleryFallback).slice(0, 4).map((g, i) => (
            <a key={i} href={settings.instagram_url || "#"} target="_blank" rel="noreferrer" className="group relative aspect-square rounded-xl overflow-hidden">
              <img src={g} alt={`ig-${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-brown-dark/0 group-hover:bg-brown-dark/40 transition-colors grid place-items-center">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <QuickView product={quick} onOpenChange={(v) => { if (!v) setQuick(null); }}/>
    </div>
  );
}

function Section({ eyebrow, title, cta, children }) {
  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">{title}</h2>
        </div>
        {cta && (
          <Link to={cta.to} className="hidden sm:inline-flex items-center gap-2 text-sm text-gold uppercase tracking-[0.2em] link-underline">
            {cta.label} <ArrowRight className="w-4 h-4"/>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
