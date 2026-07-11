import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin, Clock } from "lucide-react";
import { useSettings } from "../lib/store";

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="mt-24 bg-brown-dark text-white/85">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" className="h-14 w-14 rounded-full object-cover" alt="logo"/>
            <div>
              <div className="font-serif text-xl text-white">{settings.business_name || "House of Muddugumma"}</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-gold">Handwoven Elegance</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            {settings.footer_text || "Handcrafted premium women's wear celebrating timeless elegance."}
          </p>
        </div>

        <div>
          <div className="eyebrow text-gold">Explore</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/shop" className="hover:text-gold">Shop All</Link></li>
            <li><Link to="/collections" className="hover:text-gold">Collections</Link></li>
            <li><Link to="/categories" className="hover:text-gold">Categories</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold">Contact</div>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.business_email && <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-gold"/> {settings.business_email}</li>}
            {settings.business_address && <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-gold"/> {settings.business_address}</li>}
            {settings.business_hours && <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 text-gold"/> {settings.business_hours}</li>}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold">Follow</div>
          <div className="mt-4 flex gap-3">
            {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="p-2 border border-white/20 rounded-full hover:border-gold hover:text-gold" aria-label="Instagram"><Instagram className="w-4 h-4"/></a>}
            {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="p-2 border border-white/20 rounded-full hover:border-gold hover:text-gold" aria-label="Facebook"><Facebook className="w-4 h-4"/></a>}
            {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="p-2 border border-white/20 rounded-full hover:border-gold hover:text-gold" aria-label="YouTube"><Youtube className="w-4 h-4"/></a>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-luxe py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} {settings.business_name || "House of Muddugumma"}. All rights reserved.</div>
          <div>Made with care · Order via WhatsApp</div>
        </div>
      </div>
    </footer>
  );
}
