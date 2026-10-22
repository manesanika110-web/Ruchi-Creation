import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, Award, Star, Flame } from "lucide-react";

export const FeaturedProducts = () => {
  const { products, pageSettings } = useApp();
  const [filterType, setFilterType] = useState("all-featured"); // 'all-featured' | 'bestsellers' | 'custom'

  const featuredList = products.filter((p) => p.featured || p.rating >= 4.9 || p.isCustomizable);

  const displayedProducts = featuredList.filter((p) => {
    if (filterType === "bestsellers") return p.rating >= 4.9;
    if (filterType === "custom") return p.isCustomizable;
    return true;
  });

  return (
    <div className="bg-transparent text-[#3B1822] min-h-screen">
      {/* 1. Header Banner */}
      <section
        className="relative w-full py-14 sm:py-18 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: `url('${pageSettings?.featured?.bannerImage || "/banners/banner_featured.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            {pageSettings?.featured?.name || "Most Loved & Signature Creations"}
          </span>
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.featured?.heading || "Featured Products"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/95 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.featured?.subheading || "Handpicked customer favorites, bestseller hampers, and timeless personalized treasures."}
          </p>
        </div>
      </section>

      {/* 2. Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#E5DAC8]/80 mb-8">
          <div>
            <span className="text-[11px] uppercase font-bold text-gray-500 tracking-wider block">
              Curated Selection
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
              Signature Gifts & Hampers
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("all-featured")}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                filterType === "all-featured"
                  ? "bg-[#632736] text-white border-[#632736] font-semibold shadow-xs"
                  : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
              }`}
            >
              All Featured ({featuredList.length})
            </button>
            <button
              onClick={() => setFilterType("bestsellers")}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1 ${
                filterType === "bestsellers"
                  ? "bg-[#632736] text-white border-[#632736] font-semibold shadow-xs"
                  : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Top Rated</span>
            </button>
            <button
              onClick={() => setFilterType("custom")}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1 ${
                filterType === "custom"
                  ? "bg-[#632736] text-white border-[#632736] font-semibold shadow-xs"
                  : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#632736]" />
              <span>Personalized</span>
            </button>
          </div>
        </div>

        {/* 3. Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </div>
  );
};
