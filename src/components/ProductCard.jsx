import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Star, ArrowRight, Eye, Camera, PenTool, CheckCircle, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist, animatingWishlistId } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-[#CD97A5]/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-white border-b border-[#CD97A5]/20 flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/logo.png";
          }}
        />

        {/* Badges on Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="bg-[#632736] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#CD97A5]" />
              Bestseller
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-[#CD97A5] text-[#632736] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-[#CD97A5]/40">
              Personalized
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button on Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
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

        {/* Quick View Overlay on hover */}
        <div className="absolute inset-0 bg-[#2A1E20]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-[#632736] font-semibold text-xs py-2 px-4 rounded-full shadow-lg hover:bg-[#CD97A5] transition-colors flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-4 h-4" />
            Customize & View Details
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5 text-[#CD97A5]">
            <span className="font-semibold uppercase tracking-wider text-[#632736]/80">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              {product.rating || "4.9"}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B1822] line-clamp-1 group-hover:text-[#632736] transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#3B1822]/70 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Customization capability cues */}
          {product.customizationOptions && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {product.customizationOptions.hasPhotoUpload && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF5EB] text-[#632736] px-2 py-0.5 rounded border border-[#CD97A5]/30">
                  <Camera className="w-3 h-3" /> Photo Upload
                </span>
              )}
              {product.customizationOptions.hasRecipientName && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF5EB] text-[#632736] px-2 py-0.5 rounded border border-[#CD97A5]/30">
                  <PenTool className="w-3 h-3" /> Name Engraving
                </span>
              )}
              {product.customizationOptions.colors?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF5EB] text-[#632736] px-2 py-0.5 rounded border border-[#CD97A5]/30">
                  <CheckCircle className="w-3 h-3" /> Color Choices
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA Button */}
        <div className="pt-4 mt-3 border-t border-[#CD97A5]/20 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#632736]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 block">Incl. taxes & packing</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="px-3.5 py-2 bg-[#632736] hover:bg-[#532127] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0"
          >
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
