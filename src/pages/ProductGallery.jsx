import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { ChevronRight } from "lucide-react";

export const ProductGallery = () => {
  const { products, pageSettings } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTabs = [
    "All",
    ...new Set([
      "Customize Gifts",
      "Wedding Gifts",
      "Birthday Gifts",
      "Mehendi Gifts",
      "Diwali Gifts",
      "Rakshabandhan Gifts",
      "Pooja Products",
      ...products.map((p) => p.category).filter(Boolean)
    ])
  ];

  const filteredItems = activeFilter === "All"
    ? products
    : products.filter((item) => {
        if (item.category === activeFilter) return true;
        if (
          (activeFilter === "Customize Gifts" || activeFilter === "Customize Gift") &&
          (item.category === "Customize Gifts" || item.category === "Customize Gift" || (item.category || "").toLowerCase().includes("custom") || item.isCustomizable)
        ) {
          return true;
        }
        return false;
      });

  return (
    <div
      className="text-[#3B1822] min-h-screen bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      {/* 1. Header Banner */}
      <section
        className="relative w-full py-12 sm:py-16 bg-cover bg-center flex items-center justify-center text-center overflow-hidden shadow-xs"
        style={{ backgroundImage: `url('${pageSettings?.gallery?.bannerImage || "/banners/banner_gallery.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/45 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          {/* Breadcrumb */}
          <div className="text-xs text-[#FAF5EB]/80 flex items-center justify-center gap-1.5 mb-1">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/50" />
            <span className="text-white font-semibold">Product Gallery</span>
          </div>

          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.gallery?.heading || "Product Gallery & Shop"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/95 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.gallery?.subheading || "Explore high-definition photographs of our handcrafted personalized gifts & celebratory hampers."}
          </p>
        </div>
      </section>

      {/* 2. Gallery Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                activeFilter === tab
                  ? "bg-[#632736] text-white border-[#632736] shadow-sm font-bold"
                  : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-[#FAF5EB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

      </div>

    </div>
  );
};
