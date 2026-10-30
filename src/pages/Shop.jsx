import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Search, ChevronRight, Gift, Sparkles, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/defaultProducts";
import { ProductCard } from "../components/ProductCard";

export const Shop = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isCustomizeRoute = location.pathname.includes("customize");
  const initialCategory = searchParams.get("category") || (isCustomizeRoute ? "Customized Gifts" : "All");

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchParams.get("category")) {
      setCategory(searchParams.get("category"));
    } else if (isCustomizeRoute) {
      setCategory("Customized Gifts");
    } else {
      setCategory("All");
    }
    if (searchParams.get("search")) setSearch(searchParams.get("search"));
    window.scrollTo(0, 0);
  }, [searchParams, isCustomizeRoute, location.pathname]);

  const isCustomize = category === "Customize Gifts" || category === "Customized Gifts" || category === "Customize Gift" || isCustomizeRoute;

  const allCategories = Array.from(
    new Set([
      "Customize Gifts",
      ...CATEGORIES,
      ...products.map((p) => p.category).filter(Boolean)
    ])
  );

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      category === "All" ||
      p.category === category ||
      (isCustomize && (p.isCustomizable || (p.category || "").toLowerCase().includes("custom")));
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // newest
  });

  return (
    <div className="bg-transparent text-[#3B1822]">

      {/* 1. Header Banner */}
      <section className="relative w-full py-16 sm:py-20 bg-cover bg-center overflow-hidden flex items-center justify-center text-center" style={{ backgroundImage: "url('/reference-assets/hero-banner.jpg')", backgroundRepeat: "no-repeat" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 space-y-1 text-white px-4">
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {isCustomize ? "Customize Gifts" : "Our Collection"}
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-white/95 drop-shadow-sm">
            {isCustomize ? "Personalized Gifts Crafted Just for You" : "Thoughtful Gifts for Every Occasion"}
          </p>
        </div>
      </section>

      {/* 2. Main Shop Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar: Categories (~3 cols, Sticky on Scroll) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-5 text-left shadow-xs space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-[#3B1822] border-b border-[#E5DAC8]/80 pb-2">
              Categories
            </h3>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setCategory("All");
                  setSearchParams({});
                }}
                className={`w-full text-left py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-between ${category === "All"
                    ? "bg-[#632736] text-white font-bold"
                    : "text-gray-700 hover:bg-white/80"
                  }`}
              >
                <span>All Categories</span>
                {category === "All" && <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setSearchParams({ category: cat });
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-between ${category === cat
                      ? "bg-[#632736] text-white font-bold"
                      : "text-gray-700 hover:bg-white/80"
                    }`}
                >
                  <span className="truncate">{cat}</span>
                  {category === cat && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Main Grid (~9 cols) */}
          <main className="lg:col-span-9 space-y-6">

            {/* Search and Sort Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF5EB] p-3 rounded-xl border border-[#E5DAC8]">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                <span className="text-gray-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-1.5 px-3 rounded-lg border border-[#E5DAC8] bg-white text-xs text-[#3B1822] focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid (2 columns on mobile, 3 columns on tablet/desktop) */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-gray-500 bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8]">
                No products found in this category.
              </div>
            )}

            {/* Pagination Controls Matching Reference (< 1 2 3 >) */}
            <div className="pt-6 flex items-center justify-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-[#E5DAC8] bg-white text-gray-600 hover:bg-[#FAF5EB] flex items-center justify-center"
              >
                &lt;
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${currentPage === 1 ? "bg-[#632736] text-white" : "border border-[#E5DAC8] bg-white text-gray-700"
                  }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${currentPage === 2 ? "bg-[#632736] text-white" : "border border-[#E5DAC8] bg-white text-gray-700"
                  }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${currentPage === 3 ? "bg-[#632736] text-white" : "border border-[#E5DAC8] bg-white text-gray-700"
                  }`}
              >
                3
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-7 h-7 rounded-lg border border-[#E5DAC8] bg-white text-gray-600 hover:bg-[#FAF5EB] flex items-center justify-center"
              >
                &gt;
              </button>
            </div>

          </main>

        </div>
      </div>

    </div>
  );
};
