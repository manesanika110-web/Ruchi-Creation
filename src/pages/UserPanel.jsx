import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Package, Heart, User, LogOut, ShoppingBag, Phone, Mail, MapPin,
  Star, Gift, ChevronRight, Edit3, CheckCircle2
} from "lucide-react";

export const UserPanel = () => {
  const { currentUser, orders, wishlist, products, logoutUser, getUserOrders } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-20 h-20 rounded-full bg-[#FAF5EB] border-2 border-[#DDD0C0] flex items-center justify-center">
          <User size={36} className="text-[#632736]" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#3B1822]">Please Login</h2>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          You need to be logged in to view your account dashboard.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#632736] text-white text-sm font-semibold rounded-lg hover:bg-[#4D1B28] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

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

  const recentOrders = userOrders.slice(0, 5);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id)).slice(0, 4);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Shipped": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Delivered": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const initials = currentUser.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div
      className="min-h-[calc(100vh-160px)] pb-16 bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#632736] via-[#4D1B28] to-[#3B1822] py-10 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#CD97A5] flex items-center justify-center text-white font-serif font-bold text-2xl border-4 border-white/30 shadow-xl shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">Welcome back,</p>
            <h1 className="font-serif font-bold text-3xl text-white leading-tight mb-1">
              {currentUser.name}
            </h1>
            <p className="text-white/60 text-sm">{currentUser.email}</p>
            {currentUser.phone && (
              <p className="text-white/60 text-xs mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Phone size={11} /> {currentUser.phone}
              </p>
            )}
          </div>
          {/* Quick stats */}
          <div className="sm:ml-auto flex gap-4 sm:gap-6 text-center">
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
              <p className="font-serif font-bold text-2xl text-white">{userOrders.length}</p>
              <p className="text-white/60 text-[11px]">Orders</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
              <p className="font-serif font-bold text-2xl text-white">{wishlist.length}</p>
              <p className="text-white/60 text-[11px]">Wishlist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 border-b border-[#E5DAC8] bg-transparent overflow-x-auto hide-scrollbar mt-0">
          {[
            { id: "overview", label: "Overview", icon: Star },
            { id: "orders", label: "My Orders", icon: Package },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "profile", label: "Profile", icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === id
                  ? "border-[#632736] text-[#632736]"
                  : "border-transparent text-gray-500 hover:text-[#632736]"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-5">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Welcome card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200 shrink-0">
                <CheckCircle2 size={24} className="text-green-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#3B1822]">Account Active</p>
                <p className="text-xs text-gray-500">Your account is verified and ready to shop!</p>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: ShoppingBag, label: "Shop Gifts", to: "/shop-by-category", color: "#632736" },
                { icon: Package, label: "My Orders", to: "/my-orders", color: "#4D1B28" },
                { icon: Heart, label: "Wishlist", to: "/wishlist", color: "#CD97A5" },
                { icon: Gift, label: "Customize", to: "/customize-gifts", color: "#8B6340" },
              ].map(({ icon: Icon, label, to, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="bg-white rounded-2xl p-4 border border-[#E5DAC8] text-center hover:border-[#632736]/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 border" style={{ background: `${color}15`, borderColor: `${color}30` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-xs font-semibold text-[#3B1822] group-hover:text-[#632736] transition-colors">{label}</p>
                </Link>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-[#E5DAC8] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5DAC8]/60">
                <h3 className="font-serif font-bold text-sm text-[#3B1822]">Recent Orders</h3>
                <Link to="/my-orders" className="text-xs text-[#632736] font-semibold flex items-center gap-0.5 hover:underline">
                  View all <ChevronRight size={13} />
                </Link>
              </div>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-bold text-xs text-[#3B1822]">#{order.id}</p>
                      <p className="text-[11px] text-gray-400">{order.formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-xs text-[#3B1822]">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <Package size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">No orders yet.</p>
                  <Link to="/shop-by-category" className="inline-block mt-2 text-xs font-semibold text-[#632736] hover:underline">
                    Start Shopping →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-lg text-[#3B1822]">My Orders</h2>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#E5DAC8] flex items-center justify-between gap-3 shadow-xs hover:border-[#632736]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF5EB] border border-[#E5DAC8] shrink-0 flex items-center justify-center">
                      <img src={order.items?.[0]?.image || "/logo.png"} alt="" className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = "/logo.png"; }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3B1822]">#{order.id}</p>
                      <p className="text-xs text-gray-500">{order.formattedDate}</p>
                      <p className="text-[11px] text-gray-400">{order.items?.length || 1} item(s)</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="font-bold text-sm text-[#3B1822]">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#E5DAC8]">
                <Package size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-3">No orders yet. Start shopping!</p>
                <Link to="/shop-by-category" className="px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-lg hover:bg-[#4D1B28] transition-colors">
                  Browse Gifts
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {activeTab === "wishlist" && (
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-lg text-[#3B1822]">My Wishlist</h2>
            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {wishlistProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="bg-white rounded-2xl border border-[#E5DAC8] overflow-hidden hover:border-[#632736]/40 hover:shadow-sm transition-all"
                  >
                    <img src={p.image} alt={p.name} className="w-full h-28 object-cover"
                      onError={(e) => { e.target.src = "/logo.png"; }} />
                    <div className="p-3">
                      <p className="text-xs font-semibold text-[#3B1822] truncate">{p.name}</p>
                      <p className="text-xs text-[#632736] font-bold mt-0.5">₹{p.price?.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#E5DAC8]">
                <Heart size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-3">Your wishlist is empty.</p>
                <Link to="/shop-by-category" className="px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-lg hover:bg-[#4D1B28] transition-colors">
                  Explore Gifts
                </Link>
              </div>
            )}
            {wishlist.length > 4 && (
              <Link to="/wishlist" className="flex items-center justify-center gap-1 text-xs font-semibold text-[#632736] hover:underline">
                View all {wishlist.length} saved items <ChevronRight size={13} />
              </Link>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#3B1822]">My Profile</h2>
            <div className="bg-white rounded-2xl p-6 border border-[#E5DAC8] space-y-4 shadow-xs">
              {[
                { icon: User, label: "Full Name", value: currentUser.name },
                { icon: Mail, label: "Email Address", value: currentUser.email },
                { icon: Phone, label: "Mobile Number", value: currentUser.phone || "Not provided" },
                { icon: MapPin, label: "Member Since", value: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Today" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EB] flex items-center justify-center shrink-0 border border-[#E5DAC8]">
                    <Icon size={15} className="text-[#632736]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-[#3B1822]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors shadow-xs"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
