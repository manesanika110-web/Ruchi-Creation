import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Star, ShoppingCart, Zap, Heart, Eye, ArrowRight, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, animatingWishlistId } = useApp();
  const isWishlisted = isInWishlist(product.id);
  const isPopping = animatingWishlistId === product.id;

  const originalPrice = product.originalPrice || (product.price ? Math.round(product.price * 1.25) : 0);
  const hasDiscount = originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;
  const savingsAmount = hasDiscount ? originalPrice - product.price : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {}, 1, e);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {}, 1, null);
    navigate("/checkout");
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E5DAC8] hover:border-[#632736]/40 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full overflow-hidden text-left">
      
      {/* 1. Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF5EB]/50 flex items-center justify-center p-3 border-b border-[#E5DAC8]/60">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
            onError={(e) => {
              if (product.imageData && e.target.src !== product.imageData) {
                e.target.src = product.imageData;
              } else {
                e.target.src = "/logo.png";
              }
            }}
          />
        </Link>

        {/* Badges on Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="bg-[#632736] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#CD97A5]" />
              Bestseller
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-[#FAF5EB] text-[#632736] border border-[#CD97A5] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Personalized
            </span>
          )}
        </div>

        {/* Wishlist Heart Button on Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
            isPopping ? "animate-heart-pop" : ""
          } ${
            isWishlisted
              ? "bg-[#632736] text-white"
              : "bg-white/95 text-gray-500 hover:text-[#632736] hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isWishlisted ? "fill-white text-white" : ""
            } ${isPopping ? "scale-125" : ""}`}
          />
        </button>

        {/* Quick View Button floating on hover (clean, no image blackout) */}
        <Link
          to={`/product/${product.id}`}
          className="absolute bottom-2.5 inset-x-3 bg-white/95 hover:bg-white text-[#632736] border border-[#E5DAC8] text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 flex items-center justify-center gap-1.5 z-10"
        >
          <Eye className="w-3.5 h-3.5 text-[#632736]" />
          <span>View Details & Options</span>
        </Link>
      </div>

      {/* 2. Product Information Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5 text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#632736]/80 truncate max-w-[60%]">
              {product.category || "Gift Item"}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px] shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating || "4.8"}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#3B1822] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#632736] transition-colors">
            <Link to={`/product/${product.id}`} title={product.name}>
              {product.name}
            </Link>
          </h3>

          {/* Stock / Delivery Status */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>In Stock • Ready to Ship</span>
          </div>

          {/* Pricing Hierarchy */}
          <div className="mt-2.5 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            <span className="text-base sm:text-lg font-bold text-[#632736]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Save ₹{savingsAmount}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3. Action Buttons Section (Add to Cart & Buy Now) */}
        <div className="pt-3 mt-3 border-t border-[#E5DAC8]/70 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-2 px-1 sm:px-2 bg-white hover:bg-[#FAF5EB] text-[#632736] border border-[#632736] hover:border-[#4D1B28] text-[10px] sm:text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 flex items-center justify-center gap-1 cursor-pointer truncate"
              title="Add to shopping cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-2 px-1 sm:px-2 bg-[#632736] hover:bg-[#4D1B28] text-white text-[10px] sm:text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-md active:scale-95 flex items-center justify-center gap-1 cursor-pointer truncate"
              title="Buy now and proceed to checkout"
            >
              <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Direct Customization Cue for Customizable Gifts */}
          {product.isCustomizable && (
            <Link
              to={`/product/${product.id}`}
              className="w-full text-center block text-[11px] text-[#632736] hover:text-[#4D1B28] hover:underline font-semibold"
            >
              Custom photo & name options available →
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};
