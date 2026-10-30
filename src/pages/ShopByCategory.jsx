import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../data/defaultProducts";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import {
  Sparkles,
  Filter,
  Grid,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Check
} from "lucide-react";

export const ShopByCategory = () => {
  const { products, pageSettings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  // State Management
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'
  const [priceFilter, setPriceFilter] = useState("all"); // 'all' | 'under-500' | '500-1000' | 'above-1000'
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("All");
    }
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Categories list (Excludes 'Rent' from category list in Shop Gifts page as requested)
  const allCategories = useMemo(() => {
    return Array.from(
      new Set([
        "Customize Gifts",
        ...CATEGORIES,
        ...products.map((p) => p.category).filter(Boolean)
      ])
    ).filter((cat) => cat !== "Rent" && cat !== "Rent Products" && cat !== "Rental");
  }, [products]);

  // Handle Category Select (Automatically closes dropdown on mobile)
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setMobileCategoryOpen(false);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("featured");
    setPriceFilter("all");
    setOnlyCustomizable(false);
    setOnlyBestsellers(false);
    setSearchParams({});
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Exclude rental items from general gift catalog
        if (p.isRental || p.category === "Rent") return false;

        // 1. Category Filter
        if (selectedCategory !== "All") {
          const isCustomize =
            selectedCategory === "Customize Gifts" || selectedCategory === "Customize Gift";
          if (isCustomize) {
            const matchesCustom =
              p.category === "Customize Gifts" ||
              p.category === "Customize Gift" ||
              (p.category || "").toLowerCase().includes("custom") ||
              p.isCustomizable;
            if (!matchesCustom) return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // 2. Search Query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesName = p.name?.toLowerCase().includes(query);
          const matchesDesc = p.description?.toLowerCase().includes(query);
          const matchesCat = p.category?.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        // 3. Price Filter
        if (priceFilter === "under-500" && p.price > 500) return false;
        if (priceFilter === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
        if (priceFilter === "above-1000" && p.price <= 1000) return false;

        // 3b. Query Budget Filter
        const budgetParam = searchParams.get("budget");
        if (budgetParam === "under-99" && p.price > 99) return false;
        if (budgetParam === "100-299" && (p.price < 100 || p.price > 299)) return false;
        if (budgetParam === "300-499" && (p.price < 300 || p.price > 499)) return false;
        if (budgetParam === "500-999" && (p.price < 500 || p.price > 999)) return false;
        if (budgetParam === "above-1000" && p.price < 1000) return false;

        // 3c. Recipient Filter
        const recipientParam = searchParams.get("recipient");
        if (recipientParam) {
          const text = `${p.name} ${p.description || ""} ${p.category || ""}`.toLowerCase();
          if (recipientParam === "Kids" && !/kid|child|girl|baby|toy|teddy|sweet/i.test(text)) return false;
          if (recipientParam === "Women" && !/woman|women|girl|sister|bride|floral|rose|mala|thali|jewelry|hamper|mug/i.test(text)) return false;
          if (recipientParam === "Men" && !/man|men|brother|groom|mug|pen|hamper|frame|wood/i.test(text)) return false;
          if (recipientParam === "Couples" && !/couple|pair|wedding|anniversary|mug|frame|candle|hamper|rose/i.test(text)) return false;
          if (recipientParam === "Friends" && !/friend|bestie|birthday|mug|hamper|bouquet|frame/i.test(text)) return false;
          if (recipientParam === "Parents" && !/parent|mother|father|family|pooja|thali|mala|divine/i.test(text)) return false;
          if (recipientParam === "Bride & Groom" && !/bride|groom|bridal|wedding|haldi|coconut|thali|mala|flower/i.test(text)) return false;
        }

        // 3d. Occasion Filter
        const occasionParam = searchParams.get("occasion");
        if (occasionParam) {
          const text = `${p.name} ${p.description || ""} ${p.category || ""}`.toLowerCase();
          if (occasionParam === "Birthday" && !(p.category === "Birthday Gifts" || /birthday/i.test(text))) return false;
          if (occasionParam === "Wedding" && !(p.category === "Wedding Gifts" || /wedding|bridal|bride|groom/i.test(text))) return false;
          if (occasionParam === "Anniversary" && !/anniversary|wedding|couple|romantic|love|rose/i.test(text)) return false;
          if (occasionParam === "Engagement" && !/engagement|ring|wedding|celebration|hamper|thali/i.test(text)) return false;
          if (occasionParam === "Baby Shower" && !/baby|shower|newborn|sweet|teddy|pink/i.test(text)) return false;
          if (occasionParam === "Haldi-Kumkum" && !/haldi|kumkum|pooja|thali|shrifal|coconut|traditional/i.test(text)) return false;
          if (occasionParam === "Festivals" && !(p.category === "Diwali Gifts" || p.category === "Rakshabandhan Gifts" || p.category === "Pooja Products" || /festival|festive|sacred|diya|pooja/i.test(text))) return false;
          if (occasionParam === "Return Gifts" && !/return|gift|set|pack|mala|thali|kumkum|diya|candle/i.test(text)) return false;
        }

        // 4. Quick Toggles
        if (onlyCustomizable && !p.isCustomizable) return false;
        if (onlyBestsellers && !p.bestseller && (p.rating || 0) < 4.8) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceFilter,
    onlyCustomizable,
    onlyBestsellers,
    sortBy,
    searchParams
  ]);

  const categoryThumbnails = {
    "Customize Gifts": "/reference-assets/customize-home.jpg",
    "Wedding Gifts": "/reference-assets/cat-wedding.jpg",
    "Birthday Gifts": "/reference-assets/cat-birthday.jpg",
    "Mehendi Gifts": "/reference-assets/cat-mehendi.jpg",
    "Diwali Gifts": "/reference-assets/cat-diwali.jpg",
    "Rakshabandhan Gifts": "/reference-assets/cat-rakshabandhan.jpg",
    "Pooja Products": "/reference-assets/cat-pooja.jpg"
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    priceFilter !== "all" ||
    onlyCustomizable ||
    onlyBestsellers ||
    sortBy !== "featured" ||
    Boolean(searchParams.get("budget")) ||
    Boolean(searchParams.get("recipient")) ||
    Boolean(searchParams.get("occasion"));

  return (
    <div className="bg-[#F5EEDC] text-[#3B1822] min-h-screen">

      {/* 1. Page Header Banner */}
      <section
        className="relative w-full py-12 sm:py-16 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('${pageSettings?.shop?.bannerImage || "/banners/banner_shop.jpg"}')`,
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          {/* Breadcrumb */}
          <div className="text-xs text-[#FAF5EB]/80 flex items-center justify-center gap-1.5 mb-1">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/50" />
            <span className="text-white font-semibold">Shop All Gifts</span>
          </div>

          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.shop?.heading || "Online Gift Store"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/90 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.shop?.subheading || "Browse handpicked artisanal gifts, custom keepsakes, and festive hampers."}
          </p>
        </div>
      </section>

      {/* 2. Main Store Catalog Section with Fixed Left Sidebar */}
      <div className="max-w-[1380px] mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Main Two-Column Layout: Categories Sidebar (Left) + Handcrafted Gifts Cards (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-7 lg:gap-8 items-start">

          {/* =========================================================
              MOBILE CATEGORY DROPDOWN (Shown on screens < lg)
              - Tap to open/close category selection
              - Automatically closes when user taps any category
             ========================================================= */}
          <div className="lg:hidden w-full bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-3 sm:p-4 shadow-xs text-left">
            <button
              type="button"
              onClick={() => setMobileCategoryOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DAC8] text-[#3B1822] text-xs sm:text-sm font-bold shadow-2xs transition-colors hover:bg-gray-50 cursor-pointer"
              aria-label="Toggle Category Filter Menu"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-4 h-4 text-[#632736] shrink-0" />
                <span className="text-gray-500 font-normal">Category:</span>
                <span className="text-[#632736] truncate">
                  {selectedCategory === "All" ? "All Gifts" : selectedCategory}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-gray-500">
                <span className="text-[10px] bg-[#EDE2D5] text-[#632736] px-2 py-0.5 rounded-full font-semibold">
                  {filteredProducts.length}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#632736] transition-transform duration-200 ${mobileCategoryOpen ? "rotate-180" : ""
                    }`}
                />
              </div>
            </button>

            {/* Collapsible Mobile Dropdown Body */}
            {mobileCategoryOpen && (
              <div className="mt-2.5 pt-2.5 border-t border-[#E5DAC8] space-y-1 max-h-72 overflow-y-auto animate-fadeIn">
                {/* All Gifts Button */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange("All")}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${selectedCategory === "All"
                      ? "bg-[#632736] text-white shadow-xs"
                      : "text-[#5A2834] hover:bg-white"
                    }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Grid className="w-3.5 h-3.5 shrink-0" />
                    <span>All Gifts</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selectedCategory === "All" ? "bg-white/20 text-white" : "bg-[#EDE2D5] text-[#632736]"
                      }`}
                  >
                    {products.filter((p) => !p.isRental && p.category !== "Rent").length}
                  </span>
                </button>

                {/* Categories List (Excluding Rent) */}
                {allCategories.map((cat) => {
                  const count = products.filter((p) => {
                    if (p.isRental || p.category === "Rent") return false;
                    if (cat === "Customize Gifts") return p.isCustomizable || (p.category || "").toLowerCase().includes("custom");
                    return p.category === cat;
                  }).length;
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${isSelected
                          ? "bg-[#632736] text-white shadow-xs"
                          : "text-[#5A2834] hover:bg-white"
                        }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? "bg-white/20 text-white" : "bg-[#EDE2D5] text-[#632736]"
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================================
              DESKTOP LEFT SIDEBAR: Fixed & Independently Scrollable Categories (Hidden on mobile < lg)
              - lg:sticky lg:top-24 self-start: Keeps sidebar fixed when scrolling product cards
              - max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain: Scrolls independently without scrolling the page
             ========================================================= */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 self-start bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-4 sm:p-5 shadow-xs max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain z-20 space-y-3.5 text-left">
            {/* Sidebar Header */}
            <div className="border-b border-[#E5DAC8] pb-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif font-bold text-sm sm:text-base text-[#3B1822] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#632736]" />
                  <span>Categories</span>
                </h2>
                <span className="text-[11px] font-semibold text-[#8C6D75] bg-[#F3DEE3] px-2 py-0.5 rounded-full">
                  {products.filter((p) => !p.isRental && p.category !== "Rent").length} Gifts
                </span>
              </div>
              <p className="text-[11px] text-[#8C6D75] mt-1 font-medium">
                Shop by Occasion & Category
              </p>
            </div>

            {/* Category Buttons List */}
            <div className="flex flex-col gap-1.5">
              {/* All Gifts Button */}
              <button
                type="button"
                onClick={() => handleCategoryChange("All")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center justify-between ${selectedCategory === "All"
                  ? "bg-[#632736] text-white shadow-xs"
                  : "text-[#5A2834] hover:text-[#632736] hover:bg-white/80 font-medium"
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Grid className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">All Gifts</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${selectedCategory === "All"
                    ? "bg-white/20 text-white"
                    : "bg-[#EDE2D5] text-[#632736]"
                    }`}
                >
                  {products.filter((p) => !p.isRental && p.category !== "Rent").length}
                </span>
              </button>

              {/* Dynamic Categories (Excluding Rent) */}
              {allCategories.map((cat) => {
                const count = products.filter((p) => {
                  if (p.isRental || p.category === "Rent") return false;
                  if (cat === "Customize Gifts") return p.isCustomizable || (p.category || "").toLowerCase().includes("custom");
                  return p.category === cat;
                }).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer flex items-center justify-between ${isSelected
                      ? "bg-[#632736] text-white font-bold shadow-xs"
                      : "text-[#5A2834] hover:text-[#632736] hover:bg-white/80 font-medium"
                      }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#EDE2D5] text-[#632736]"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Reset Shortcut in Sidebar */}
            {selectedCategory !== "All" && (
              <div className="pt-2 border-t border-[#E5DAC8]">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("All")}
                  className="w-full text-center text-xs text-[#632736] font-bold hover:underline cursor-pointer py-1"
                >
                  ← Show All Gifts ({products.filter((p) => !p.isRental && p.category !== "Rent").length})
                </button>
              </div>
            )}
          </aside>

          {/* =========================================================
              RIGHT SIDE: Toolbar + Handcrafted Gifts Product Cards Grid
             ========================================================= */}
          <main className="flex-1 w-full space-y-6 text-left min-w-0">
            {/* 3. E-Commerce Toolbar: Search, Filters & Sorting */}
            <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-4 sm:p-5 shadow-xs space-y-4 text-left">

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">

                {/* Search Bar (6 cols) */}
                <div className="md:col-span-6 relative">
                  <input
                    type="text"
                    placeholder="Search gifts (e.g. Mug, Bouquet, Hamper, Frame)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      const p = new URLSearchParams(searchParams);
                      if (e.target.value.trim()) {
                        p.set("search", e.target.value.trim());
                      } else {
                        p.delete("search");
                      }
                      setSearchParams(p);
                    }}
                    className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5DAC8] bg-white text-[#3B1822] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#632736]/30 shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        const p = new URLSearchParams(searchParams);
                        p.delete("search");
                        setSearchParams(p);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Price Filter Selector (3 cols) */}
                <div className="md:col-span-3 flex items-center gap-1.5">
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E5DAC8] bg-white text-xs sm:text-sm text-[#3B1822] font-medium focus:outline-none focus:ring-2 focus:ring-[#632736]/30 shadow-2xs cursor-pointer"
                  >
                    <option value="all">Price: All Budgets</option>
                    <option value="under-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="above-1000">Above ₹1,000</option>
                  </select>
                </div>

                {/* Sort Dropdown (3 cols) */}
                <div className="md:col-span-3 flex items-center gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E5DAC8] bg-white text-xs sm:text-sm text-[#3B1822] font-medium focus:outline-none focus:ring-2 focus:ring-[#632736]/30 shadow-2xs cursor-pointer"
                  >
                    <option value="featured">Sort by: Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

              </div>

              {/* Quick Filter Badges / Toggle Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#E5DAC8]/70 text-xs">

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-[#632736]" /> QUICK FILTER:
                  </span>

                  {/* Personalized toggle */}
                  <button
                    type="button"
                    onClick={() => setOnlyCustomizable(!onlyCustomizable)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${onlyCustomizable
                      ? "bg-[#632736] text-white border-[#632736]"
                      : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
                      }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Personalized Gifts</span>
                    {onlyCustomizable && <Check className="w-3 h-3" />}
                  </button>

                  {/* Bestsellers toggle */}
                  <button
                    type="button"
                    onClick={() => setOnlyBestsellers(!onlyBestsellers)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${onlyBestsellers
                      ? "bg-[#632736] text-white border-[#632736]"
                      : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
                      }`}
                  >
                    <span>⭐ Bestsellers & Top Rated</span>
                    {onlyBestsellers && <Check className="w-3 h-3" />}
                  </button>

                  {/* Active URL parameters chips */}
                  {searchParams.get("budget") && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#632736] text-white">
                      <span>Budget: {
                        searchParams.get("budget") === "under-99" ? "Under ₹99" :
                          searchParams.get("budget") === "100-299" ? "₹100–₹299" :
                            searchParams.get("budget") === "300-499" ? "₹300–₹499" :
                              searchParams.get("budget") === "500-999" ? "₹500–₹999" : "₹1000+"
                      }</span>
                      <button
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          p.delete("budget");
                          setSearchParams(p);
                        }}
                        className="hover:text-amber-200 ml-1 font-bold cursor-pointer"
                        title="Remove budget filter"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {searchParams.get("recipient") && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#632736] text-white">
                      <span>For: {searchParams.get("recipient")}</span>
                      <button
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          p.delete("recipient");
                          setSearchParams(p);
                        }}
                        className="hover:text-amber-200 ml-1 font-bold cursor-pointer"
                        title="Remove recipient filter"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {searchParams.get("occasion") && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#632736] text-white">
                      <span>Occasion: {searchParams.get("occasion")}</span>
                      <button
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          p.delete("occasion");
                          setSearchParams(p);
                        }}
                        className="hover:text-amber-200 ml-1 font-bold cursor-pointer"
                        title="Remove occasion filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                {/* Clear Filters Button if any filter active */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-[#632736] hover:text-[#4D1B28] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                )}

              </div>

            </div>

            {/* 4. Active Results Indicator Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-1 text-left">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
                  {selectedCategory === "All" ? "All Handcrafted Gifts" : selectedCategory}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing <strong className="text-[#632736]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "handcrafted gift" : "handcrafted gifts"} matching your selection
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#632736] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#E5DAC8] font-semibold hidden sm:inline">
                  ✨ 100% Handcrafted • Doorstep Delivery
                </span>
              </div>
            </div>

            {/* 5. Handcrafted Gifts Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 pt-1">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* Empty Search & Filter State */
              <div className="py-16 px-4 text-center bg-white rounded-2xl border border-[#E5DAC8] shadow-xs space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#632736]">
                  <Search className="w-6 h-6 opacity-60" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800">
                    No matching gifts found
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    We couldn't find any products matching your current filters or search term.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Filters & Show All</span>
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

    </div>
  );
};
