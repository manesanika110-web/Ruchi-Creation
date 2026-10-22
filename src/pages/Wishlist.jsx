import React from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Trash2, ArrowRight, UserCheck, ArrowLeft } from "lucide-react";

export const Wishlist = () => {
  const { wishlist, products, removeFromWishlist, addToCart, currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/register" replace />;
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product, e) => {
    addToCart(product, {}, 1, e);
    removeFromWishlist(product.id);
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
        className="relative w-full py-12 sm:py-16 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: "url('/reference-assets/hero-banner.jpg')", backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Saved Creations
          </span>
          <h1 className="font-serif italic font-normal text-3xl sm:text-5xl text-white drop-shadow-md">
            My Favourite List
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-white/95 max-w-xl mx-auto drop-shadow-sm">
            Keep track of your favorite personalized gifts and order whenever you're ready.
          </p>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <Heart className="w-12 h-12 text-gray-300 mx-auto" />
            <h2 className="font-serif font-bold text-lg text-[#3B1822]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-gray-500">
              Browse our collections and tap the heart icon on any gift to save it for later.
            </p>
            <div className="pt-2">
              <Link
                to="/product-gallery"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full shadow-sm transition-all"
              >
                <span>Explore Gift Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DAC8]">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "Item" : "Items"} Saved
              </span>
              <Link
                to="/shop-by-category"
                className="text-xs text-[#632736] font-semibold hover:underline"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border border-[#E5DAC8] p-4 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative"
                >
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-600 shadow-sm flex items-center justify-center transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 mb-3 bg-[#FAF5EB] flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#632736]">
                      {p.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#3B1822] line-clamp-1 mt-0.5 group-hover:text-[#632736] transition-colors">
                      <Link to={`/product/${p.id}`}>
                        {p.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#632736]">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={(e) => handleMoveToCart(p, e)}
                      className="px-4 py-1.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
