import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Camera, PenTool, CheckCircle, Heart, ArrowRight, Upload, Palette, Gift, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

export const CustomizeGifts = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, animatingWishlistId, pageSettings } = useApp();
  const navigate = useNavigate();

  const customizableProducts = products.filter((p) => p.isCustomizable);
  const [selectedProduct, setSelectedProduct] = useState(customizableProducts[0] || products[0]);

  // Customization Form State
  const [recipientName, setRecipientName] = useState("Best Sister Ever");
  const [customMessage, setCustomMessage] = useState("Wishing you all the joy and happiness on your special day!");
  const [selectedColor, setSelectedColor] = useState("Royal Deep Burgundy");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState("");

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = (e) => {
    addToCart(
      selectedProduct,
      {
        recipientName,
        customMessage,
        photoPreview,
        photoFileName,
        selectedColor
      },
      1,
      e
    );
    setTimeout(() => {
      navigate("/cart");
    }, 750);
  };

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
        style={{ backgroundImage: `url('${pageSettings?.customize?.bannerImage || "/banners/banner_customize.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FAF5EB] block">
            {pageSettings?.customize?.name || "Personalization Studio"}
          </span>
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            {pageSettings?.customize?.heading || "Customize Gifts"}
          </h1>
          <p className="font-serif italic text-sm sm:text-lg text-white/95 max-w-xl mx-auto drop-shadow-sm">
            {pageSettings?.customize?.subheading || "Add names, heartfelt messages, and photos to craft a one-of-a-kind keepsake."}
          </p>
        </div>
      </section>

      {/* 2. Live Customizer Studio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-6 sm:p-10 shadow-xs">
          <div className="text-left mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Step-by-Step Customizer
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1822] mt-0.5">
              Personalize Your Selected Gift
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Customization Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Product Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  1. Select Gift to Customize
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {customizableProducts.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className={`p-2 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedProduct?.id === p.id
                          ? "border-[#632736] bg-white ring-2 ring-[#632736]/20 shadow-sm"
                          : "border-[#E5DAC8] bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-800 text-center line-clamp-1">
                        {p.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#632736]">₹{p.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[#632736]" />
                  <span>2. Name or Title to Engrave / Print</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Rahul & Sneha / Best Sister"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:border-[#632736]"
                />
              </div>

              {/* Custom Message Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#632736]" />
                  <span>3. Personal Message or Date</span>
                </label>
                <textarea
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write your heartfelt blessing, quote or anniversary message..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:border-[#632736]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#632736]" />
                  <span>4. Upload Your Photo (Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FAF5EB] text-[#632736] border border-[#632736]/30 text-xs font-semibold rounded-xl transition-all shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {photoFileName ? (
                    <span className="text-xs text-gray-600 truncate max-w-[200px]">✓ {photoFileName}</span>
                  ) : (
                    <span className="text-xs text-gray-400">JPG, PNG supported</span>
                  )}
                </div>
              </div>

              {/* Color Choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#632736]" />
                  <span>5. Choose Finish / Accent Color</span>
                </label>
                <div className="flex items-center gap-2">
                  {["Royal Deep Burgundy", "Pure White", "Golden Mocha"].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedColor === col
                          ? "bg-[#632736] text-white border-[#632736] font-semibold"
                          : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-gray-50"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  className="px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Add Customized Gift to Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-[#632736]">₹{selectedProduct?.price}</span>
              </div>
            </div>

            {/* Right Column: Live Visual Preview Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5DAC8] p-5 text-center space-y-4 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#632736] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#E5DAC8] flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#CD97A5]" />
                  Live Customizer Preview
                </span>
              </div>

              {/* Preview Canvas with Smooth Fade/Slide */}
              <div className="relative aspect-square rounded-xl overflow-hidden border border-[#E5DAC8] bg-gradient-to-b from-[#FAF5EB] to-white p-4 flex flex-col items-center justify-center group">
                <img
                  src={photoPreview || selectedProduct?.image}
                  alt={selectedProduct?.name}
                  className="w-full h-full object-contain rounded-lg transition-all duration-500 ease-out"
                />

                {/* Overlaid customization badge preview with smooth slide/fade animation */}
                <div
                  key={`${recipientName}-${customMessage}-${selectedColor}-${photoPreview ? 'photo' : 'no'}`}
                  className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md text-white p-3 rounded-xl text-left border border-white/20 shadow-xl animate-preview-fade-slide"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] uppercase font-bold text-[#CD97A5] tracking-wider block">
                      Custom Engraving:
                    </span>
                    <span className="text-[9px] text-white/80 font-medium">
                      {selectedColor}
                    </span>
                  </div>
                  <p className="text-xs font-serif italic font-bold truncate text-white">{recipientName || "Recipient Name"}</p>
                  <p className="text-[10px] text-white/90 line-clamp-1 italic font-serif mt-0.5">
                    "{customMessage || "Your custom message"}"
                  </p>
                  {photoPreview && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-1">
                      <CheckCircle className="w-2.5 h-2.5" /> Photo Attached
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#3B1822]">
                  {selectedProduct?.name}
                </h3>
                <span className="text-xs font-bold text-[#632736] block mt-0.5">
                  ₹{selectedProduct?.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Accent: {selectedColor}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Showcase Grid of All Customizable Items */}
        <div className="mt-12 text-left space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Curated Catalog
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
              All Personalized Creations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customizableProducts.map((p) => {
              const isWish = isInWishlist(p.id);
              const isPopping = animatingWishlistId === p.id;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#E5DAC8] p-4 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative group"
                >
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
                      isPopping ? "animate-heart-pop" : ""
                    } ${
                      isWish ? "bg-[#632736] text-white" : "bg-white/90 text-gray-600 hover:text-[#632736]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isWish ? "fill-white text-white" : ""} ${isPopping ? "scale-125" : ""}`} />
                  </button>

                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 mb-3 flex items-center justify-center bg-[#FAF5EB]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#632736] tracking-wider block">
                      {p.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#3B1822] line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    <span className="text-xs font-bold text-[#632736] block pt-1">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        window.scrollTo({ top: 320, behavior: "smooth" });
                      }}
                      className="w-full py-1.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full text-center transition-colors block active:scale-95"
                    >
                      Customize This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
