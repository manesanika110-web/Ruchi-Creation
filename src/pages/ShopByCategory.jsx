import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../data/defaultProducts";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, Filter, Grid, Tag } from "lucide-react";

export const ShopByCategory = () => {
  const { products, pageSettings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categoryThumbnails = {
    "Customize Gifts": "/reference-assets/customize-home.jpg",
    "Customize Gift": "/reference-assets/customize-home.jpg",
    "Wedding Gifts": "/reference-assets/cat-wedding.jpg",
    "Birthday Gifts": "/reference-assets/cat-birthday.jpg",
    "Mehendi Gifts": "/reference-assets/cat-mehendi.jpg",
    "Diwali Gifts": "/reference-assets/cat-diwali.jpg",
    "Rakshabandhan Gifts": "/reference-assets/cat-rakshabandhan.jpg",
    "Pooja Products": "/reference-assets/cat-pooja.jpg"
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const allCategories = Array.from(
    new Set([
      "Customize Gifts",
      ...CATEGORIES,
      ...products.map((p) => p.category).filter(Boolean)
    ])
  );

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => {
        if (p.category === selectedCategory) return true;
        if (
          (selectedCategory === "Customize Gifts" || selectedCategory === "Customize Gift") &&
          (p.category === "Customize Gifts" || p.category === "Customize Gift" || (p.category || "").toLowerCase().includes("custom"))
        ) {
          return true;
        }
        return false;
      });

  return (
    <div className="bg-transparent text-[#3B1822] min-h-screen">
      {/* 1. Page Header */}
      <section
        className="relative w-full py-14 sm:py-18 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: `url('${pageSettings?.shop?.bannerImage || "/banners/banner_shop.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            {pageSettings?.shop?.name || "Curated Collections"}
          </span>
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.shop?.heading || "Shop by Category"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/95 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.shop?.subheading || "Handcrafted for birthdays, sacred weddings, festive celebrations and devotional moments."}
          </p>
        </div>
      </section>

      {/* 2. Category Cards Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-5 sm:p-6 shadow-xs text-left mb-8">
          <h2 className="font-serif font-bold text-lg text-[#3B1822] mb-4">
            Select an Occasion Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {/* All button */}
            <button
              onClick={() => handleCategoryChange("All")}
              className={`group p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selectedCategory === "All"
                  ? "border-[#632736] bg-white ring-2 ring-[#632736]/20 shadow-xs"
                  : "border-[#E5DAC8] bg-white/70 hover:bg-white hover:border-[#632736]/40"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#632736]/10 flex items-center justify-center mb-1 text-[#632736] group-hover:scale-110 transition-transform duration-500 ease-out">
                <Grid className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">All Gifts</span>
              <span className="text-[10px] text-gray-400 font-medium">({products.length})</span>
            </button>

            {/* Individual categories */}
            {allCategories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              const catThumb = categoryThumbnails[cat] || products.find((p) => p.category === cat)?.image || "/reference-assets/cat-wedding.jpg";
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`group p-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    isSelected
                      ? "border-[#632736] bg-white ring-2 ring-[#632736]/20 shadow-xs"
                      : "border-[#E5DAC8] bg-white/70 hover:bg-white hover:border-[#632736]/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E5DAC8] mb-1.5 flex items-center justify-center bg-white group-hover:border-[#632736]">
                    <img
                      src={catThumb}
                      alt={cat}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 line-clamp-1 group-hover:text-[#632736] transition-colors">{cat}</span>
                  <span className="text-[10px] text-[#632736] font-medium">({count} items)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Products Grid */}
        <div className="text-left space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E5DAC8]/80">
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-500 tracking-wider">
                Showing Category
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
                {selectedCategory === "All" ? "All Handcrafted Gifts" : selectedCategory}
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-[#E5DAC8]">
              {filteredProducts.length} Products Found
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#E5DAC8] p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-[#632736] mx-auto opacity-40" />
              <h3 className="font-serif font-bold text-lg text-gray-700">No products in this category yet</h3>
              <p className="text-xs text-gray-500">Explore our other celebration collections.</p>
              <button
                onClick={() => handleCategoryChange("All")}
                className="px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-full shadow-sm"
              >
                View All Categories
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
