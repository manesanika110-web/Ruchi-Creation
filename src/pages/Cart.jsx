import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, currentUser } = useApp();
  const navigate = useNavigate();

  // Subtotal & Shipping calculation matching the reference mockup (Shipping: ₹ 100)
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = cart.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center mx-auto text-[#632736]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3B1822]">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our handcrafted customized gifts and bouquets to add personalized treasures to your cart.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#632736] hover:bg-[#5a242b] text-white font-medium text-xs rounded-lg transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5EB] min-h-[calc(100vh-280px)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title - Exactly matching the reference image */}
        <div className="text-left">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B1822]">
            Shopping Cart
          </h1>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-[#E5DAC8] shadow-xs space-y-6 text-left">
            <div className="divide-y divide-[#E5DAC8]/60">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="py-4 sm:py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                >
                  {/* Left: Thumbnail + Name + Price */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-[#E5DAC8] shrink-0 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = "/reference-assets/detail-mug.jpg"; }}
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#3B1822] truncate">
                        <Link to={`/product/${item.productId}`} className="hover:text-[#632736] transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <div className="text-xs sm:text-sm font-semibold text-[#3B1822]">
                        ₹ {item.unitPrice.toLocaleString("en-IN")}
                      </div>
                      {item.customization?.recipientName && (
                        <div className="text-[11px] text-[#632736] truncate">
                          Name: {item.customization.recipientName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity Selector & Trash Icon */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-[#E5DAC8] rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-[#FAF5EB] hover:text-[#632736] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-[#3B1822]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-[#FAF5EB] hover:text-[#632736] transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-4 text-left">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B1822]">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-[#3B1822]">₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-medium text-[#3B1822]">₹ {shipping}</span>
              </div>

              <div className="border-t border-[#E5DAC8]/80 pt-3 flex justify-between items-center">
                <span className="font-serif font-bold text-sm sm:text-base text-[#3B1822]">Total</span>
                <span className="font-bold text-sm sm:text-base text-[#3B1822]">
                  ₹ {total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  navigate("/register", { state: { from: { pathname: "/checkout" } } });
                } else {
                  navigate("/checkout");
                }
              }}
              className="w-full py-3 bg-[#632736] hover:bg-[#5a242b] text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping Link */}
            <div className="text-center pt-1">
              <Link
                to="/shop"
                className="text-xs text-gray-500 hover:text-[#632736] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
