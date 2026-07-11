import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useSettings } from "../lib/store";

const cover = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=70";
const artisan = "https://images.unsplash.com/photo-1714682597753-a646ba506cee?auto=format&fit=crop&w=1000&q=70";

export default function About() {
  const { settings } = useSettings();
  return (
    <div>
      <section className="relative aspect-[16/8] md:aspect-[16/6] overflow-hidden">
        <img src={cover} alt="Boutique" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brown-dark/20 to-brown-dark/60 grid place-items-center text-center text-white px-6">
          <div>
            <div className="eyebrow text-gold">Our Story</div>
            <h1 className="mt-4 font-serif text-5xl md:text-7xl">House of Muddugumma</h1>
            <p className="mt-4 text-white/85 max-w-xl mx-auto">Where handloom heritage meets modern elegance.</p>
          </div>
        </div>
      </section>

      <section className="container-luxe py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">Crafted with Love</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">A homegrown label for the timeless woman.</h2>
          <p className="mt-6 text-brown-soft leading-relaxed">
            {settings.about_text || "House of Muddugumma is a homegrown fashion label dedicated to handcrafted, handloom-inspired women's wear. Each piece is chosen with care to celebrate timeless elegance."}
          </p>
          <p className="mt-4 text-brown-soft leading-relaxed">
            From Narayanpet dresses to mul cotton frocks, our edit celebrates India's rich textile traditions — reimagined for everyday luxury.
          </p>
          <Link to="/shop" className="btn-gold mt-8 inline-flex">Explore the Edit</Link>
        </div>
        <div className="aspect-[4/5] rounded-2xl overflow-hidden">
          <img src={artisan} alt="Craft" className="w-full h-full object-cover"/>
        </div>
      </section>

      <section className="bg-brown-dark text-white/85 py-16 md:py-24">
        <div className="container-luxe grid md:grid-cols-3 gap-8 text-center">
          {[
            { n: "01", t: "Small Batch", d: "Every piece is produced in small runs — thoughtful, never mass." },
            { n: "02", t: "Handloom First", d: "We celebrate weaves and fabrics rooted in Indian craftsmanship." },
            { n: "03", t: "Made to Love", d: "Timeless silhouettes that stay in your wardrobe for years." },
          ].map((v) => (
            <div key={v.n}>
              <div className="font-serif text-gold text-4xl">{v.n}</div>
              <div className="mt-3 font-serif text-2xl text-white">{v.t}</div>
              <p className="mt-3 text-white/70 text-sm">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
