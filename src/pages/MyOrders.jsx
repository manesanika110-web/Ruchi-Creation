import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

export const MyOrders = () => {
  const { orders, currentUser, getUserOrders } = useApp();
  const [activeTab, setActiveTab] = useState("All"); // 'All' | 'Processing' | 'Shipped' | 'Delivered'
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!currentUser) {
    return <Navigate to="/register" replace />;
  }

  // Strictly filter orders for the currently authenticated user
  const userOrders = getUserOrders
    ? getUserOrders(currentUser)
    : orders.filter((order) => {
        const userId = currentUser.id || currentUser.uid;
        const orderUserId = order.userId || order.customerId;
        if (userId && orderUserId && String(orderUserId) === String(userId)) return true;

        const userEmail = (currentUser.email || "").trim().toLowerCase();
        const orderEmail = (order.userEmail || order.customer?.email || "").trim().toLowerCase();
        if (userEmail && orderEmail && orderEmail === userEmail) return true;

        const cleanUserPhone = (currentUser.phone || "").replace(/\D/g, "");
        const cleanOrderPhone = (order.customer?.phone || "").replace(/\D/g, "");
        if (cleanUserPhone.length >= 10 && cleanOrderPhone.length >= 10 && cleanUserPhone === cleanOrderPhone) return true;

        return false;
      });

  const filteredOrders = userOrders.filter((order) => {
    if (activeTab === "All") return true;
    return order.orderStatus?.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Processing":
        return "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]";
      case "Shipped":
        return "bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]";
      case "Delivered":
        return "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-280px)] pb-16 bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      
      {/* Banner matching reference panel */}
      <div className="bg-gradient-to-b from-[#F2EAE0]/90 to-[#FAF5EB]/85 backdrop-blur-xs py-8 border-b border-[#E5DAC8]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B1822]">
            My Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track and manage your handcrafted gift orders
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6 text-left">
        
        {/* If user has no orders placed yet, display empty state */}
        {userOrders.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-10 sm:p-14 text-center border border-[#E5DAC8] shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF5EB] border border-[#E5DAC8] text-[#632736] flex items-center justify-center mx-auto shadow-xs">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#632736]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
                No Orders Placed Yet
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                You haven't placed any orders yet. Discover our handcrafted gifts and customized creations to place your first order!
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/product-gallery"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Start Shopping</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Pills matching reference panel */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab("All")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "All"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white/90 text-gray-600 border border-[#E5DAC8] hover:bg-[#FAF5EB]"
                }`}
              >
                All Orders ({userOrders.length})
              </button>

              <button
                onClick={() => setActiveTab("Processing")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "Processing"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white/90 text-gray-600 border border-[#E5DAC8] hover:bg-[#FAF5EB]"
                }`}
              >
                • Processing ({userOrders.filter((o) => o.orderStatus?.toLowerCase() === "processing").length})
              </button>

              <button
                onClick={() => setActiveTab("Shipped")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "Shipped"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white/90 text-gray-600 border border-[#E5DAC8] hover:bg-[#FAF5EB]"
                }`}
              >
                • Shipped ({userOrders.filter((o) => o.orderStatus?.toLowerCase() === "shipped").length})
              </button>

              <button
                onClick={() => setActiveTab("Delivered")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "Delivered"
                    ? "bg-[#632736] text-white shadow-xs"
                    : "bg-white/90 text-gray-600 border border-[#E5DAC8] hover:bg-[#FAF5EB]"
                }`}
              >
                • Delivered ({userOrders.filter((o) => o.orderStatus?.toLowerCase() === "delivered").length})
              </button>
            </div>

            {/* Order Cards List */}
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const primaryItem = order.items?.[0] || {};
                  const itemImage = primaryItem.image || "/reference-assets/prod-custom-mug.jpg";

                  return (
                    <div
                      key={order.id}
                      className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 border border-[#E5DAC8] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#632736]/40"
                    >
                      {/* Left: Product Thumbnail + ID & Placed Date */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#FAF5EB] border border-[#E5DAC8] shrink-0 flex items-center justify-center p-1">
                          <img
                            src={itemImage}
                            alt={primaryItem.name || "Gift"}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "/reference-assets/detail-mug.jpg"; }}
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="font-bold text-sm sm:text-base text-[#3B1822]">
                            #{order.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            Placed on: {order.formattedDate}
                          </div>
                          {primaryItem.customization?.recipientName && (
                            <div className="text-[11px] text-[#632736] truncate">
                              Customized for: {primaryItem.customization.recipientName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Price, Status Badge, View Details */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="font-bold text-sm sm:text-base text-[#3B1822]">
                          ₹ {order.totalAmount.toLocaleString("en-IN")}
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadgeClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>

                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="text-xs text-gray-500 hover:text-[#632736] transition-colors mt-0.5 cursor-pointer"
                        >
                          {selectedOrder?.id === order.id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-10 text-center border border-[#E5DAC8] space-y-3">
                  <p className="text-xs text-gray-500">No {activeTab.toLowerCase()} orders found.</p>
                  <button
                    onClick={() => setActiveTab("All")}
                    className="inline-block px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    View All Orders
                  </button>
                </div>
              )}
            </div>

            {/* Selected Order Detailed Modal / Drawer if opened */}
            {selectedOrder && (
              <div className="bg-white/98 backdrop-blur-md rounded-2xl p-6 border-2 border-[#632736]/30 shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-[#E5DAC8]/60 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3B1822]">
                      Order #{selectedOrder.id} Details
                    </h3>
                    <span className="text-xs text-gray-500">
                      Delivering to: {selectedOrder.customer?.name}, {selectedOrder.customer?.city}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-gray-400 hover:text-gray-700 font-bold cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E5DAC8]"
                        />
                        <div>
                          <div className="font-bold text-[#3B1822]">{item.name}</div>
                          <div className="text-gray-500 text-[11px]">Qty: {item.quantity}</div>
                          {item.customization?.recipientName && (
                            <div className="text-[10px] text-[#632736]">For: {item.customization.recipientName}</div>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-[#3B1822]">
                        ₹ {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E5DAC8]/60 flex justify-between items-center text-xs">
                  <span className="text-gray-600">Payment: <strong>{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus})</span>
                  <span className="font-serif font-bold text-sm text-[#632736]">
                    Total: ₹ {selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};
