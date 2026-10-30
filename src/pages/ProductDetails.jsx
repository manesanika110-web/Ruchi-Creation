import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Zap,
  ArrowLeft,
  Heart,
  Sparkles,
  CheckCircle,
  Truck,
  Gift,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, animatingWishlistId } = useApp();

  const product = products.find((p) => p.id === id) || products[0];
  const isWishlisted = isInWishlist(product?.id);
  const isPopping = animatingWishlistId === product?.id;

  const [activeImage, setActiveImage] = useState(product?.image || "/reference-assets/detail-mug.jpg");
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product?.customizationOptions?.colors?.[0] || "Pure White"
  );
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState("");

  const originalPrice = product?.originalPrice || (product?.price ? Math.round(product.price * 1.25) : 0);
  const hasDiscount = originalPrice > (product?.price || 0);
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const colors = product?.customizationOptions?.colors?.length > 0
    ? product.customizationOptions.colors
    : ["Pure White", "Burgundy Rim", "Mocha Latte"];

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.customizationOptions?.colors?.[0]) {
        setSelectedColor(product.customizationOptions.colors[0]);
      }
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
  };

  const handleBuyNow = (e) => {
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
      null
    );
    navigate("/checkout");
  };

  const galleryImages = product?.gallery && product.gallery.length > 0
    ? product.gallery
    : [
        product?.image || "/reference-assets/detail-mug.jpg",
        "/reference-assets/prod-custom-mug.jpg",
        "/reference-assets/shop-birthday-mug.jpg",
        "/reference-assets/customize-home.jpg"
      ];

  if (!product) {
    return (
      <div className="py-20 text-center bg-[#F5EEDC] text-[#3B1822]">
        <h2 className="text-xl font-serif font-bold">Product not found</h2>
        <Link to="/shop-by-category" className="mt-4 inline-block px-5 py-2 bg-[#632736] text-white rounded-xl text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EEDC] text-[#3B1822] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-left">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#632736] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop-by-category" className="hover:text-[#632736] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to={`/shop-by-category?category=${encodeURIComponent(product.category)}`} className="hover:text-[#632736] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#632736] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Shopping Layout */}
        <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-5 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Image Gallery & Live Preview (5 cols) */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E5DAC8] shadow-xs flex items-center justify-center p-3 group">
                <img
                  src={photoPreview || activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105"
                  onError={(e) => {
                    if (product.imageData && e.target.src !== product.imageData) {
                      e.target.src = product.imageData;
                    } else {
                      e.target.src = "/logo.png";
                    }
                  }}
                />

                {/* Badges on Top-Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {discountPercent > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.bestseller && (
                    <span className="bg-[#632736] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#CD97A5]" />
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Wishlist Button on Top Right */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
                    isPopping ? "animate-heart-pop" : ""
                  } ${
                    isWishlisted
                      ? "bg-[#632736] text-white"
                      : "bg-white/95 text-gray-600 hover:text-[#632736] hover:bg-white"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-white text-white" : ""} ${isPopping ? "scale-125" : ""}`} />
                </button>

                {/* Live Customization Preview Floating Overlay */}
                {(recipientName || customMessage || photoPreview) && (
                  <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md text-white p-3 rounded-xl text-left border border-white/20 shadow-xl animate-preview-fade-slide z-10">
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

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border bg-white transition-all flex items-center justify-center p-1 cursor-pointer ${
                      activeImage === img ? "border-[#632736] ring-2 ring-[#632736]/30 shadow-xs" : "border-[#E5DAC8] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Details & Actions (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Product Header & Pricing */}
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#632736] bg-[#FAF5EB] px-2.5 py-0.5 rounded-full border border-[#CD97A5]/40">
                    {product.category}
                  </span>
                  {product.isCustomizable && (
                    <span className="text-[11px] font-bold text-[#632736] bg-[#CD97A5]/20 px-2 py-0.5 rounded-full border border-[#CD97A5]/30">
                      Personalized Gift
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#3B1822] leading-tight">
                  {product.name}
                </h1>

                {/* Star Rating & In-Stock indicator */}
                <div className="flex items-center gap-3 text-xs mt-2.5 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating || "4.8"}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount || 28} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>In Stock • Ready to Dispatch in 24 Hours</span>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 mt-3.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#632736]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 block mt-1">Price inclusive of all taxes, handcrafted design & premium packaging.</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-b border-[#E5DAC8]/80 py-3">
                {product.description}
              </p>

              {/* Customization Options (if applicable) */}
              {product.isCustomizable && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E5DAC8]">
                  <span className="text-xs font-bold text-[#632736] uppercase tracking-wider block">
                    Personalize This Gift
                  </span>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Recipient / Couple Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul & Priya"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5DAC8] bg-[#FAF5EB]/50 text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                    />
                  </div>

                  {/* Upload Photo */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Upload Custom Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#632736] file:text-white hover:file:bg-[#4D1B28] cursor-pointer"
                    />
                    {photoPreview && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={photoPreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-[#E5DAC8]" />
                        <span className="text-[11px] text-emerald-700 font-semibold">Photo attached successfully!</span>
                      </div>
                    )}
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Heartfelt Message / Greeting
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Wishing you a lifetime of joy and happiness!"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5DAC8] bg-[#FAF5EB]/50 text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
                    ></textarea>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Color Theme
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                            selectedColor === c
                              ? "bg-[#632736] text-white border-[#632736] font-semibold shadow-2xs"
                              : "bg-white text-gray-700 border-[#E5DAC8] hover:bg-[#FAF5EB]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity, Add to Cart & Buy Now Buttons */}
              <div className="pt-3 border-t border-[#E5DAC8]/80 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center bg-white rounded-xl border border-[#E5DAC8] overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-xs font-bold text-[#632736] hover:bg-[#FAF5EB] transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-[#3B1822] min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-xs font-bold text-[#632736] hover:bg-[#FAF5EB] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Total: <strong className="text-[#632736] font-bold">₹{(product.price * quantity).toLocaleString("en-IN")}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e)}
                    className="w-full py-3 px-4 bg-white hover:bg-[#FAF5EB] text-[#632736] border-2 border-[#632736] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e)}
                    className="w-full py-3 px-4 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Shopping Assurance & Trust Badges */}
              <div className="pt-4 border-t border-[#E5DAC8]/80 grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5DAC8]/70 shadow-2xs">
                  <Truck className="w-4 h-4 text-[#632736] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Fast Shipping</p>
                    <p className="text-[10px] text-gray-500">Dispatched in 24 Hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5DAC8]/70 shadow-2xs">
                  <Gift className="w-4 h-4 text-[#632736] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Gift Packaging</p>
                    <p className="text-[10px] text-gray-500">Luxury Ribbon Wrap</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5DAC8]/70 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#632736] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">100% Handcrafted</p>
                    <p className="text-[10px] text-gray-500">Made with Heart & Art</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5DAC8]/70 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#632736] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Secure Checkout</p>
                    <p className="text-[10px] text-gray-500">Safe Online Orders</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
