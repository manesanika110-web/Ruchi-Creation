import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUp, MessageCircle, Clock, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { InstagramIcon } from "./InstagramIcon";

export const Footer = () => {
  const { settings } = useApp();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminDoubleClick = () => {
    navigate("/admin");
  };

  return (
    <footer className="bg-[#561D2B] text-white pt-10 pb-6 border-t border-[#441420] relative text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Clean, Well-Aligned Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          
          {/* 1. Brand Logo & Short Description */}
          <div className="space-y-3.5">
            <div 
              onDoubleClick={handleAdminDoubleClick}
              title="Double click for admin access"
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-full bg-[#FAF5EB] p-0.5 overflow-hidden shadow-sm shrink-0 border border-white/40 group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt={settings.storeName || "Ruchi Creation"}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="leading-tight">
                <span className="font-serif italic font-bold text-lg text-white block">
                  {settings.storeName || "Ruchi Creation"}
                </span>
                <span className="text-[11px] text-[#E0B0BE] font-medium block">
                  Handmade with love ♥
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8CCD5] leading-relaxed">
              Personalized handcrafted gifts, floral bouquets, and bespoke hampers crafted with care to celebrate every special moment.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={settings.instagramUrl || "https://instagram.com/ruchi_creation"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E1306C] flex items-center justify-center text-white transition-all shadow-xs"
                title="Follow on Instagram"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp || "919511112616"}?text=${encodeURIComponent(
                  "Hello Ruchi Creation! I would like to enquire about gifts."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-all shadow-xs"
                title="Chat on WhatsApp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CD97A5]" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#E8CCD5]">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/product-gallery" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Gallery
                </Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Rent Products
                </Link>
              </li>
              <li>
                <Link to="/customize-gifts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Customize Gifts
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Categories */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CD97A5]" />
              <span>Categories</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#E8CCD5]">
              <li>
                <Link to="/shop-by-category?category=Wedding%20Gifts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Wedding Gifts
                </Link>
              </li>
              <li>
                <Link to="/shop-by-category?category=Birthday%20Gifts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Birthday Hampers
                </Link>
              </li>
              <li>
                <Link to="/shop-by-category?category=Mehendi%20Gifts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Mehendi Favors
                </Link>
              </li>
              <li>
                <Link to="/shop-by-category?category=Diwali%20Gifts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Festive & Diwali
                </Link>
              </li>
              <li>
                <Link to="/shop-by-category?category=Pooja%20Products" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[10px] text-[#CD97A5]">›</span> Pooja Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CD97A5]" />
              <span>Contact Us</span>
            </h4>
            <div className="space-y-2.5 text-xs text-[#E8CCD5]">
              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#E0B0BE] shrink-0 mt-0.5" />
                <span>{settings.phones || "+91 9511112616 / 9823242576"}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#E0B0BE] shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email || "ruchicreation@gmail.com"}`} className="hover:text-white transition-colors">
                  {settings.email || "ruchicreation@gmail.com"}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#E0B0BE] shrink-0 mt-0.5" />
                <span>{settings.location || "Ichalkaranji, Maharashtra, India"}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-0.5 text-[11px] text-[#E0B0BE]/80">
                <Clock className="w-3.5 h-3.5 text-[#E0B0BE] shrink-0 mt-0.5" />
                <span>Mon – Sat: 10:00 AM – 8:30 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#E0B0BE]/80">
          <p>© 2025 Ruchi Creation. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Handcrafted with love in Ichalkaranji</span>
            <Heart size={11} className="fill-[#CD97A5] text-[#CD97A5] inline" />
          </p>
        </div>

      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#632736] hover:bg-[#4D1B28] text-white border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Floating WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${settings.whatsapp || "919511112616"}?text=${encodeURIComponent(
          "Hello Ruchi Creation! I would like to enquire about gifts."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-40 w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </footer>
  );
};
