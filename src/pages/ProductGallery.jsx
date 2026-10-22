import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Eye, X, ArrowRight, Heart, Sparkles, ShoppingBag } from "lucide-react";

export const ProductGallery = () => {
  const { products, toggleWishlist, isInWishlist, animatingWishlistId, pageSettings } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeImage, setActiveImage] = useState(null); // Lightbox item

  const filterTabs = [
    "All",
    ...new Set([
      "Wedding Gifts",
      "Birthday Gifts",
      "Mehendi Gifts",
      "Diwali Gifts",
      "Rakshabandhan Gifts",
      "Pooja Products",
      ...products.map((p) => p.category).filter(Boolean)
    ])
  ];

  const galleryItems = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    image: p.image,
    isCustomizable: p.isCustomizable
  }));

  const filteredItems = activeFilter === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

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
        className="relative w-full py-14 sm:py-18 bg-cover bg-center flex items-center justify-center text-center overflow-hidden shadow-xs"
        style={{ backgroundImage: `url('${pageSettings?.gallery?.bannerImage || "/banners/banner_gallery.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FAF5EB] block">
            {pageSettings?.gallery?.name || "Visual Exhibition"}
          </span>
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.gallery?.heading || "Product Gallery"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/95 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.gallery?.subheading || "Explore high-definition photographs of our handcrafted personalized gifts & celebratory hampers."}
          </p>
        </div>
      </section>

      {/* 2. Gallery Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                activeFilter === tab
                  ? "bg-[#632736] text-white border-[#632736] shadow-sm"
                  : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-[#FAF5EB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isWish = isInWishlist(item.id);
            const isPopping = animatingWishlistId === item.id;
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5DAC8] shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div
                  className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => setActiveImage(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <span className="p-2.5 bg-white text-[#632736] rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
                      isPopping ? "animate-heart-pop" : ""
                    } ${
                      isWish ? "bg-[#632736] text-white" : "bg-white/95 text-gray-600 hover:text-[#632736]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isWish ? "fill-white text-white" : ""} ${isPopping ? "scale-125" : ""}`} />
                  </button>

                  <span className="absolute bottom-3 left-3 bg-[#FAF5EB]/90 backdrop-blur-xs text-[#632736] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#E5DAC8]">
                    {item.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 text-left flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#3B1822] line-clamp-1 group-hover:text-[#632736] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#632736]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>

                    <Link
                      to={`/product/${item.id}`}
                      className="px-3.5 py-1.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-[11px] font-semibold rounded-full transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5DAC8] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] sm:aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.image}
                alt={activeImage.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 space-y-3 bg-[#FAF5EB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#632736]">
                    {activeImage.category}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#3B1822]">
                    {activeImage.name}
                  </h3>
                </div>
                <span className="text-xl font-bold text-[#632736] shrink-0">
                  ₹{activeImage.price.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {activeImage.description}
              </p>

              <div className="pt-3 border-t border-[#E5DAC8] flex items-center gap-3">
                <Link
                  to={`/product/${activeImage.id}`}
                  onClick={() => setActiveImage(null)}
                  className="px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order / Customize This Gift</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(activeImage.id)}
                  className="px-4 py-2.5 border border-[#632736]/30 bg-white text-[#632736] hover:bg-[#FAF5EB] text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(activeImage.id) ? "fill-[#632736]" : ""}`} />
                  <span>{isInWishlist(activeImage.id) ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
