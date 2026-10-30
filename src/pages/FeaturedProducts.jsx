import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, Star, Flame, Search, ChevronRight, SlidersHorizontal } from "lucide-react";

export const FeaturedProducts = () => {
  const { products, pageSettings } = useApp();
  const [filterType, setFilterType] = useState("all-featured"); // 'all-featured' | 'bestsellers' | 'custom'
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const featuredList = useMemo(() => {
    return products.filter((p) => p.featured || p.rating >= 4.8 || p.isCustomizable);
  }, [products]);

  const displayedProducts = useMemo(() => {
    return featuredList
      .filter((p) => {
        if (filterType === "bestsellers" && (p.rating || 0) < 4.8 && !p.bestseller) return false;
        if (filterType === "custom" && !p.isCustomizable) return false;
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [featuredList, filterType, search, sortBy]);

  return (
    <div className="bg-[#F5EEDC] text-[#3B1822] min-h-screen">
      
      {/* 1. Header Banner */}
      <section
        className="relative w-full py-12 sm:py-16 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('${pageSettings?.featured?.bannerImage || "/banners/banner_featured.jpg"}')`,
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          {/* Breadcrumb */}
          <div className="text-xs text-[#FAF5EB]/80 flex items-center justify-center gap-1.5 mb-1">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/50" />
            <Link to="/shop-by-category" className="hover:text-white transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3 text-white/50" />
            <span className="text-white font-semibold">Featured Gifts</span>
          </div>

          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.featured?.heading || "Signature & Featured Gifts"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/90 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.featured?.subheading || "Handpicked customer favorites, bestseller hampers, and timeless personalized treasures."}
          </p>
        </div>
      </section>

      {/* 2. Content Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* Filter & Toolbar */}
        <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-4 sm:p-5 shadow-xs space-y-4 text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={() => setFilterType("all-featured")}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === "all-featured"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E5DAC8] hover:bg-gray-50"
                }`}
              >
                All Featured ({featuredList.length})
              </button>
              <button
                onClick={() => setFilterType("bestsellers")}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "bestsellers"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E5DAC8] hover:bg-gray-50"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Top Rated</span>
              </button>
              <button
                onClick={() => setFilterType("custom")}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "custom"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#E5DAC8] hover:bg-gray-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CD97A5]" />
                <span>Personalized</span>
              </button>
            </div>

            {/* Sort & Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Filter featured..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-[#E5DAC8] bg-white text-xs text-[#3B1822] font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* 3. Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E5DAC8] p-8 max-w-md mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-[#632736] mx-auto opacity-40" />
            <h3 className="font-serif font-bold text-base text-gray-800">No products match this filter</h3>
            <button
              onClick={() => { setFilterType("all-featured"); setSearch(""); }}
              className="px-4 py-2 bg-[#632736] text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
