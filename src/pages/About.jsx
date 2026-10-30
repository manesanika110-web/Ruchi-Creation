import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Palette,
  Heart,
  Award,
  Truck,
  ArrowRight,
  Gift,
  PenTool,
  Sparkles,
  Smile
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const About = () => {
  const { settings, pageSettings, homeSections } = useApp();
  const customBanner = pageSettings?.about?.bannerImage;
  const isCustomImage = customBanner && customBanner !== "/about-us-exact.png";
  const primaryPhone = settings?.phones?.split("/")[0]?.trim() || settings?.phone || "9511112616";
  const email = settings?.email || "ruchicreation@gmail.com";
  const whyChooseSec = homeSections?.whyChoose || {};

  const pillars = [
    { title: "Artisanal Design", desc: "Thoughtfully styled and assembled by hand.", icon: Palette },
    { title: "Made with Love", desc: "Personalized with custom names, photos & messages.", icon: Heart },
    { title: "Finest Materials", desc: "Premium florals, ceramics and luxury ribbons.", icon: Award },
    { title: "Reliable Service", desc: "Safe packaging and dependable, timely delivery.", icon: Truck }
  ];

  const whyChooseItems = [
    { id: 1, title: "Unique & Creative Gift Designs", desc: "One-of-a-kind designs that make every gift special.", icon: Palette },
    { id: 2, title: "Premium Quality Flowers & Materials", desc: "Only the finest materials for lasting freshness & beauty.", icon: Award },
    { id: 3, title: "Perfect Combination of Gifts & Chocolates", desc: "Thoughtful combos for every mood & occasion.", icon: Gift },
    { id: 4, title: "Customized Gifts as per Your Need", desc: "Personalized with names, photos, messages & more.", icon: PenTool },
    { id: 5, title: "Quick & Reliable Service", desc: "On-time delivery with safe packaging.", icon: Truck },
    { id: 6, title: "Affordable & Value for Money", desc: "Beautiful gifts at reasonable prices.", isRupee: true },
    { id: 7, title: "Perfect for Every Occasion", desc: "Birthdays, Weddings, Festivals, and more...", icon: Sparkles },
    { id: 8, title: "Customer Satisfaction is Our Priority", desc: "Your happiness matters to us the most.", icon: Smile }
  ];

  return (
    <div
      className="min-h-[calc(100vh-140px)] text-[#3B1822] flex flex-col justify-start items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto space-y-12 sm:space-y-16">
        
        {/* ========================================================
            SECTION 1: Our Story & Heartfelt Artistry
           ======================================================== */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E8DAC8]/80 bg-[#FAF5E9]">
          {isCustomImage ? (
            <div className="relative w-full overflow-hidden select-none">
              <img
                src={customBanner}
                alt="About Us - Ruchi Creation"
                className="w-full h-auto block object-cover"
              />
            </div>
          ) : (
            <div className="p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#632736] block mb-1">
                      ABOUT US
                    </span>
                    <h1 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#3B1822] leading-tight">
                      Our Story &amp; Heartfelt Artistry
                    </h1>
                    <p className="font-serif italic text-sm sm:text-base text-[#632736] mt-1">
                      Handmade and personalized gifts that bring smiles and create memories.
                    </p>
                  </div>

                  {/* Short Attractive Introduction */}
                  <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <p>
                      At Ruchi Creation, we craft handmade and personalized gifts designed to celebrate your special moments. Every piece is thoughtfully made with love and care to bring joy, smiles, and lasting memories.
                    </p>
                  </div>

                  {/* 4 Feature Cards (One-line descriptions) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {pillars.map((pillar, idx) => {
                      const IconComp = pillar.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-white/80 p-3.5 rounded-xl border border-[#E5DAC8] flex items-start gap-3 shadow-xs"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] text-[#632736] flex items-center justify-center shrink-0 border border-[#632736]/20">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <h2 className="font-bold text-xs text-[#3B1822]">{pillar.title}</h2>
                            <p className="text-[11px] text-gray-600 mt-0.5">{pillar.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Studio Details & Call to Action */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Contact Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={`https://wa.me/91${primaryPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-gray-50 text-[#632736] border border-[#632736]/30 text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#632736] font-medium ml-1">
                      <MapPin className="w-3.5 h-3.5 text-[#632736]" />
                      <span>Ichalkaranji, Maharashtra</span>
                    </div>
                  </div>
                </div>

                {/* Right Image Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5DAC8] shadow-xl group">
                    <img
                      src="/reference-assets/about-home.jpg"
                      alt="About Ruchi Creation"
                      className="w-full h-80 sm:h-96 lg:h-full lg:min-h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "/about-us-exact.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left p-3 rounded-xl bg-black/45 backdrop-blur-xs border border-white/20">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] block">
                        Boutique Studio • Est. 2018
                      </span>
                      <p className="font-serif italic text-sm font-medium">
                        Handmade with love in Ichalkaranji
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Quick Contact Strip */}
          <div className="p-4 bg-[#632736] text-white flex flex-wrap items-center justify-around gap-2.5 sm:hidden border-t border-[#7D3240]">
            <a
              href={`tel:${primaryPhone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/91${primaryPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#FAF5EB]" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: Why Choose Ruchi Creation? (Matching img1)
           ======================================================== */}
        <div className="w-full text-center py-4">
          
          {/* Header Tagline & Heart */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 sm:w-16 bg-[#632736]/30"></div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#632736]">
              {whyChooseSec.tagline || "GIFTS THAT SPEAK FROM THE HEART"}
            </span>
            <div className="h-px w-8 sm:w-16 bg-[#632736]/30"></div>
          </div>
          <div className="flex justify-center mb-3">
            <Heart className="w-3 h-3 fill-[#632736] text-[#632736] opacity-80" />
          </div>

          {/* Heading with Ornaments */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
            <span className="text-2xl sm:text-3xl text-[#632736] select-none">❧</span>
            <h2 className="font-serif italic font-bold text-3xl sm:text-4xl lg:text-5xl text-[#632736] tracking-tight">
              {whyChooseSec.title || "Why Choose Ruchi Creation?"}
            </h2>
            <span className="text-2xl sm:text-3xl text-[#632736] select-none">☙</span>
          </div>

          {/* Subtitle */}
          <p className="font-serif italic text-base sm:text-xl text-[#5C4E50] mb-8 sm:mb-12">
            {whyChooseSec.subtitle || "More than just gifts, we create emotions..."}
          </p>

          {/* 8 Cards Grid (Default: White/cream with maroon text & icons | Hover: Maroon with white text & icons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            {whyChooseItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white hover:bg-[#632736] rounded-2xl sm:rounded-3xl p-6 text-center flex flex-col items-center justify-between shadow-[0_4px_20px_rgba(99,39,54,0.06)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-[#EDE2D7] hover:border-[#632736] group min-h-[220px]"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Icon Badge */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FDEEF0] group-hover:bg-white/15 flex items-center justify-center p-1 mb-4 group-hover:scale-105 transition-all duration-300">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF5EB] group-hover:bg-white/20 text-[#632736] group-hover:text-white flex items-center justify-center shadow-xs transition-all duration-300">
                        {item.isRupee ? (
                          <span className="text-[#632736] group-hover:text-white font-bold text-lg leading-none transition-colors duration-300">₹</span>
                        ) : (
                          <IconComp className="w-5 h-5 text-[#632736] group-hover:text-white transition-colors duration-300" />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#632736] group-hover:text-white leading-snug px-1 transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#6B5E62] group-hover:text-[#FAF5EB]/90 mt-2.5 leading-relaxed px-1 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Heart Accent */}
                  <Heart className="w-2.5 h-2.5 fill-[#CD97A5] text-[#CD97A5] group-hover:fill-white/80 group-hover:text-white/80 mt-4 opacity-75 group-hover:opacity-100 shrink-0 transition-all duration-300" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
