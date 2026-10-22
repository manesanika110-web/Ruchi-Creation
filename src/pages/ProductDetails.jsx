import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Upload, Check, ShoppingCart, ArrowLeft, X, Heart, Sparkles, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, animatingWishlistId } = useApp();

  const product = products.find((p) => p.id === id) || products[0];
  const isWishlisted = isInWishlist(product?.id);

  const [activeImage, setActiveImage] = useState(product?.image || "/reference-assets/detail-mug.jpg");
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState("Pure White");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState("");

  const colors = ["Pure White", "Burgundy Rim", "Mocha Latte"];

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
    window.scrollTo(0, 0);
  }, [product]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = (e) => {
    addToCart(
      product,
      {
        recipientName,
        customMessage,
        photoPreview,
        photoFileName,
        selectedColor
      },
      quantity,
      e
    );
    setTimeout(() => {
      navigate("/cart");
    }, 750);
  };

  const galleryImages = product.gallery || [
    product.image,
    "/reference-assets/prod-custom-mug.jpg",
    "/reference-assets/shop-birthday-mug.jpg",
    "/reference-assets/customize-home.jpg"
  ];

  return (
    <div className="bg-[#F5EEDC] text-[#3B1822] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        
        {/* Breadcrumb matching reference: Home > Shop > Birthday Gifts > Custom Mug */}
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#632736]">Home</Link>
          <span>&gt;</span>
          <Link to="/shop" className="hover:text-[#632736]">Shop</Link>
          <span>&gt;</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#632736]">
            {product.category}
          </Link>
          <span>&gt;</span>
          <span className="text-[#632736] font-semibold">{product.name}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Image Gallery with Live Customization Preview (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E5DAC8] shadow-xs flex items-center justify-center p-3 group">
                <img
                  src={photoPreview || activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-500 ease-out"
                />

                {/* Wishlist Button on Top Right */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
                    animatingWishlistId === product.id ? "animate-heart-pop" : ""
                  } ${
                    isWishlisted
                      ? "bg-[#632736] text-white"
                      : "bg-white/95 text-gray-600 hover:text-[#632736] hover:bg-white"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-white text-white" : ""} ${animatingWishlistId === product.id ? "scale-125" : ""}`} />
                </button>

                {/* Live Customization Preview Floating Overlay */}
                {(recipientName || customMessage || photoPreview) && (
                  <div
                    key={`${recipientName}-${customMessage}-${selectedColor}-${photoPreview ? 'img' : 'no'}`}
                    className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md text-white p-3 rounded-xl text-left border border-white/20 shadow-xl animate-preview-fade-slide z-10"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#CD97A5] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Live Preview
                      </span>
                      <span className="text-[9px] text-[#FAF5EB]/80 font-medium">
                        {selectedColor}
                      </span>
                    </div>
                    {recipientName && (
                      <p className="text-xs font-serif italic font-bold text-white tracking-wide truncate">
                        {recipientName}
                      </p>
                    )}
                    {customMessage && (
                      <p className="text-[10px] text-white/90 line-clamp-1 italic font-serif mt-0.5">
                        "{customMessage}"
                      </p>
                    )}
                    {photoPreview && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Photo Attached
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 4 Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border bg-white transition-all flex items-center justify-center p-1 ${
                      activeImage === img ? "border-[#632736] ring-1 ring-[#632736]" : "border-[#E5DAC8] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Details & Customization (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h1 className="font-serif font-bold text-2xl text-[#3B1822]">
                  {product.name}
                </h1>
                <div className="text-xl font-bold text-[#632736] mt-1">
                  ₹ {product.price.toLocaleString("en-IN")}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs text-amber-600 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-700">({product.rating || "4.8"})</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed border-t border-b border-[#E5DAC8]/80 py-3">
                {product.description}
              </p>

              {/* Customization Options */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#632736] uppercase tracking-wider block">
                  Customization Options
                </span>

                {/* Name Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                  />
                </div>

                {/* Upload Photo Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Upload Photo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#632736] file:text-white hover:file:bg-[#4D1B28] cursor-pointer"
                  />
                  {photoPreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={photoPreview} alt="Preview" className="w-10 h-10 object-cover rounded border border-[#E5DAC8]" />
                      <span className="text-[11px] text-emerald-700 font-semibold">Photo attached!</span>
                    </div>
                  )}
                </div>

                {/* Message Field (optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Write your message..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                  ></textarea>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                          selectedColor === c
                            ? "bg-[#632736] text-white border-[#632736] font-semibold"
                            : "bg-white text-gray-700 border-[#E5DAC8]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quantity and Add to Cart Button */}
              <div className="pt-3 flex items-center gap-4">
                <div className="flex items-center bg-white rounded-lg border border-[#E5DAC8] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-xs font-bold text-[#632736] hover:bg-[#FAF5EB]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#3B1822]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#632736] hover:bg-[#FAF5EB]"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  className="flex-grow py-2.5 px-6 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
