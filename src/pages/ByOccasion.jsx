import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Heart,
  ShoppingCart,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Filter,
  Check
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const ByOccasion = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, animatingWishlistId } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const occasionCategories = [
    { id: "Birthday", label: "Birthday" },
    { id: "Wedding", label: "Wedding" },
    { id: "Anniversary", label: "Anniversary" },
    { id: "Engagement", label: "Engagement" },
    { id: "Baby Shower", label: "Baby Shower" },
    { id: "Haldi-Kumkum", label: "Haldi-Kumkum" },
    { id: "Festivals", label: "Festivals" },
    { id: "Return Gifts", label: "Return Gifts" }
  ];

  // URL query param synchronization
  const initialOccasion = searchParams.get("occasion") || "All";
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItemMap, setAddedItemMap] = useState({});
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  useEffect(() => {
    const urlOccasion = searchParams.get("occasion");
    if (urlOccasion) {
      setSelectedOccasion(urlOccasion);
    } else {
      setSelectedOccasion("All");
    }
    setCurrentPage(1);
  }, [searchParams]);

  const handleCategoryClick = (catId) => {
    // Toggle if clicked again
    const nextOccasion = selectedOccasion === catId ? "All" : catId;
    setSelectedOccasion(nextOccasion);
    setCurrentPage(1);
    setMobileCategoryOpen(false); // Automatically closes mobile dropdown!

    const newParams = new URLSearchParams(searchParams);
    if (nextOccasion === "All") {
      newParams.delete("occasion");
    } else {
      newParams.set("occasion", nextOccasion);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (prod, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, {}, 1, e);
    setAddedItemMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.isRental || p.category === "Rent") return false;

        if (selectedOccasion === "All") {
          // When All is selected, include all items marked with occasions
          // OR items whose category fits occasions
          return (p.occasions && p.occasions.length > 0) || Boolean(p.featured);
        }

        // 1. Direct tag match if present
        if (p.occasions && Array.isArray(p.occasions)) {
          if (p.occasions.includes(selectedOccasion)) return true;
        }

        // 2. Keyword/Semantic match
        const text = `${p.name} ${p.description || ""} ${p.category || ""}`.toLowerCase();
        switch (selectedOccasion) {
          case "Birthday":
            return /birthday|bday|cake|candle|balloon|teddy|party/i.test(text);
          case "Wedding":
            return /wedding|shadi|shaadi|bride|groom|bridal|shrifal|coconut|mala|sindoor|pooja thali/i.test(text);
          case "Anniversary":
            return /anniversary|couple|love|heart|romantic/i.test(text);
          case "Engagement":
            return /engagement|sagai|ring|floral|pampas|ceremony/i.test(text);
          case "Baby Shower":
            return /baby|shower|newborn|infant|plush/i.test(text);
          case "Haldi-Kumkum":
            return /haldi|kumkum|turmeric|rooli|thali|pooja plate|marigold/i.test(text);
          case "Festivals":
            return /diwali|festival|festive|pooja|diya|rakhi|rangoli/i.test(text);
          case "Return Gifts":
            return /return|favor|potli|pouch|gift bag|pack/i.test(text);
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        // Default Popular: prioritized reference items first
        const refOrder = [
          "rc-birthday-cake-gift",
          "rc-wedding-gift-set-ref",
          "rc-anniversary-hamper-ref",
          "rc-engagement-gift-ref",
          "rc-baby-shower-gift-ref",
          "rc-haldi-kumkum-thali-ref",
          "rc-festival-gift-box-ref",
          "rc-return-gift-pack-ref"
        ];
        const idxA = refOrder.indexOf(a.id);
        const idxB = refOrder.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedOccasion, sortBy]);

  // Pagination (8 items per page = 2 rows of 4)
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3B1822] pt-24 sm:pt-28 pb-16 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* =========================================================
            MAIN UNIFIED CARD CONTAINER (Matching Reference Image)
           ========================================================= */}
        <div className="bg-white rounded-[26px] border border-[#EFE5DB] shadow-[0_4px_24px_rgba(99,39,54,0.04)] p-5 sm:p-7 md:p-9">
          
          {/* Header Row: Icon + Title/Subtitle on Left | Breadcrumbs + Sort on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#F5ECE3]">
            {/* Left Header */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FDEEF0] border border-[#F6D8DE] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-[#632736]" />
              </div>
              <div className="text-left">
                <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#5F2432] leading-tight">
                  By Occasion
                </h1>
                <p className="text-xs sm:text-[13px] text-[#8C6D75] font-medium mt-0.5">
                  Perfect gifts for every celebration
                </p>
              </div>
            </div>

            {/* Right Header: Breadcrumb & Sort */}
            <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
              <nav className="text-xs text-[#8C6D75] flex items-center gap-1.5">
                <Link to="/" className="hover:text-[#632736] transition-colors">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-[#632736] font-medium">By Occasion</span>
              </nav>

              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <span className="text-[#8C6D75]">Sort by:</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-5 text-xs font-medium text-[#3B1822] cursor-pointer focus:outline-none hover:text-[#632736]"
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Content: Sidebar (Left) + Product Cards Grid (Right) */}
          <div className="flex flex-col md:flex-row gap-5 lg:gap-7 items-start">
            
            {/* =========================================================
                MOBILE CATEGORY DROPDOWN (Shown on phones < md)
                - Automatically closes when user taps any category
               ========================================================= */}
            <div className="md:hidden w-full bg-[#FBF1F3] rounded-2xl p-3 border border-[#F3DEE3] text-left">
              <button
                type="button"
                onClick={() => setMobileCategoryOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#F3DEE3] text-[#3B1822] text-xs sm:text-sm font-bold shadow-2xs transition-colors hover:bg-gray-50 cursor-pointer"
                aria-label="Toggle Occasion Filter Menu"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 text-[#632736] shrink-0" />
                  <span className="text-gray-500 font-normal">Occasion:</span>
                  <span className="text-[#632736] truncate">
                    {selectedOccasion === "All"
                      ? "All Occasions"
                      : occasionCategories.find((c) => c.id === selectedOccasion)?.label || selectedOccasion}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#632736] transition-transform duration-200 ${
                    mobileCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Collapsible Mobile Dropdown Body */}
              {mobileCategoryOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-[#F3DEE3] space-y-1 animate-fadeIn">
                  {/* All Occasions Option */}
                  <button
                    type="button"
                    onClick={() => handleCategoryClick("All")}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      selectedOccasion === "All"
                        ? "bg-[#632736] text-white shadow-xs"
                        : "text-[#613340] hover:bg-[#F7DEE4]/70"
                    }`}
                  >
                    <span>All Occasions</span>
                    {selectedOccasion === "All" && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Occasion Categories */}
                  {occasionCategories.map((cat) => {
                    const isActive = selectedOccasion === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? "bg-[#632736] text-white font-bold shadow-xs"
                            : "text-[#613340] hover:text-[#632736] hover:bg-[#F7DEE4]/70 font-medium"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop & Tablet Category Sidebar (Visible on Tablet md: and Laptop lg:, Fixed on Scroll) */}
            <aside className="hidden md:block w-40 lg:w-44 xl:w-48 shrink-0 sticky top-24 self-start bg-[#FBF1F3] rounded-2xl p-3 border border-[#F3DEE3]/70 z-20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex flex-col gap-1">
                {occasionCategories.map((cat) => {
                  const isActive = selectedOccasion === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#632736] text-white font-bold shadow-xs"
                          : "text-[#613340] hover:text-[#632736] hover:bg-[#F7DEE4]/70 font-medium"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Product Cards Grid */}
            <main className="flex-1 w-full">
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {currentProducts.map((prod) => {
                    const isWish = isInWishlist(prod.id);
                    const isPopping = animatingWishlistId === prod.id;
                    const isAdded = addedItemMap[prod.id];

                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-[#EDE2D7] hover:border-[#CD97A5]/70 p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-300 text-left group"
                      >
                        {/* Top: Image, Title, Rating, Price */}
                        <div>
                          {/* Product Image */}
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF5EB]/50 flex items-center justify-center mb-2.5">
                            <Link
                              to={`/product/${prod.id}`}
                              className="w-full h-full flex items-center justify-center"
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                loading="lazy"
                                onError={(e) => {
                                  if (prod.imageData && e.target.src !== prod.imageData) {
                                    e.target.src = prod.imageData;
                                  } else {
                                    e.target.src = "/logo.png";
                                  }
                                }}
                              />
                            </Link>
                          </div>

                          {/* Product Title */}
                          <h3 className="font-serif font-bold text-xs sm:text-[13px] text-[#2E1820] line-clamp-1 group-hover:text-[#632736] transition-colors">
                            <Link to={`/product/${prod.id}`} title={prod.name}>
                              {prod.name}
                            </Link>
                          </h3>

                          {/* Star Rating & Review Count */}
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold my-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{prod.rating || "4.8"}</span>
                            <span className="text-gray-400 font-normal">
                              ({prod.reviewsCount || 45})
                            </span>
                          </div>

                          {/* Price in INR */}
                          <div className="text-xs sm:text-sm font-bold text-[#632736] mt-0.5 mb-2">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </div>
                        </div>

                        {/* Bottom Action Row: Burgundy Add to Cart + Heart Wishlist Button */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#F5ECE3] mt-auto">
                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(prod, e)}
                            className="flex-1 py-1.5 px-2.5 bg-[#632736] hover:bg-[#4E1C28] text-white text-[11px] sm:text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Add to Cart"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-300" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <span>Add to Cart</span>
                            )}
                          </button>

                          {/* Heart Wishlist Button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod.id)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              isPopping ? "animate-heart-pop" : ""
                            } ${
                              isWish
                                ? "bg-[#632736] text-white border-[#632736]"
                                : "bg-white text-gray-500 hover:text-[#632736] border-[#D8B4BE] hover:bg-[#FAF5EB]"
                            }`}
                            title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWish ? "fill-white" : ""}`} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#FAF5EB]/50 rounded-2xl border border-[#EDE2D7] p-12 text-center space-y-3">
                  <p className="font-serif italic text-base text-gray-600">
                    No products found for this category.
                  </p>
                  <button
                    onClick={() => handleCategoryClick("All")}
                    className="px-4 py-2 bg-[#632736] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    View All Occasions
                  </button>
                </div>
              )}
            </main>

          </div>

          {/* Pagination Row at Bottom */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-[#FAF5EB] cursor-pointer"
              }`}
              aria-label="Previous Page"
            >
              &lt;
            </button>

            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#632736] text-white font-bold shadow-xs"
                    : "text-gray-600 hover:bg-[#FBF1F3]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs transition-colors ${
                currentPage >= totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-[#FAF5EB] cursor-pointer"
              }`}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ByOccasion;
