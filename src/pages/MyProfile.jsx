import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  User, Mail, Phone, MapPin, Edit3, Save, CheckCircle2,
  Package, Heart, ArrowLeft, LogOut, ShieldCheck, Sparkles
} from "lucide-react";

export const MyProfile = () => {
  const { currentUser, updateUserProfile, logoutUser, orders, wishlist, getUserOrders } = useApp();
  const navigate = useNavigate();

  const userOrders = getUserOrders
    ? getUserOrders(currentUser)
    : orders.filter((order) => {
        const userId = currentUser?.id || currentUser?.uid;
        const orderUserId = order.userId || order.customerId;
        if (userId && orderUserId && String(orderUserId) === String(userId)) return true;

        const userEmail = (currentUser?.email || "").trim().toLowerCase();
        const orderEmail = (order.userEmail || order.customer?.email || "").trim().toLowerCase();
        if (userEmail && orderEmail && orderEmail === userEmail) return true;

        const cleanUserPhone = (currentUser?.phone || "").replace(/\D/g, "");
        const cleanOrderPhone = (order.customer?.phone || "").replace(/\D/g, "");
        if (cleanUserPhone.length >= 10 && cleanOrderPhone.length >= 10 && cleanUserPhone === cleanOrderPhone) return true;

        return false;
      });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "Ichalkaranji",
        state: currentUser.state || "Maharashtra",
        pincode: currentUser.pincode || "416115"
      });
    }
  }, [currentUser]);

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RC";

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.name.trim()) {
      return setErrorMsg("Please enter your full name.");
    }

    if (!formData.email.trim()) {
      return setErrorMsg("Please enter your email address.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return setErrorMsg("Please enter a valid email address.");
    }

    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        return setErrorMsg("Please enter a valid 10-digit mobile number (numbers only).");
      }
    }

    setSaving(true);
    try {
      const res = await updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      });

      setSaving(false);
      if (res.success) {
        setIsEditing(false);
        setSuccessMsg("Your personal details have been updated successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res.message || "Failed to update profile.");
      }
    } catch {
      setSaving(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
    logoutUser();
  };

  return (
    <div
      className="min-h-[calc(100vh-140px)] pb-16 text-left bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      
      {/* ── Top Hero Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#632736] via-[#4D1B28] to-[#3B1822] text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Circular Profile Avatar (matching the reference styling) */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF5EB] border-3 border-white/60 text-[#632736] flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-[#632736]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Customer">
                <ShieldCheck size={13} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-[#F5EEDC] uppercase tracking-wider">
                  Customer Profile
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-medium border border-emerald-400/30">
                  Active
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
                {currentUser?.name || "My Account"}
              </h1>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={13} className="shrink-0" />
                <span>{currentUser?.email}</span>
              </p>
              {currentUser?.phone && (
                <p className="text-white/70 text-xs mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={13} className="shrink-0" />
                  <span>{currentUser.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <Link
              to="/my-orders"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 text-center transition-all group"
            >
              <div className="flex items-center justify-center gap-1.5 text-white/90">
                <Package size={15} />
                <span className="font-serif font-bold text-lg text-white">{userOrders.length}</span>
              </div>
              <span className="text-[10px] text-white/70 group-hover:text-white uppercase tracking-wider block">Orders</span>
            </Link>

            <Link
              to="/my-favourite-list"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 text-center transition-all group"
            >
              <div className="flex items-center justify-center gap-1.5 text-white/90">
                <Heart size={15} />
                <span className="font-serif font-bold text-lg text-white">{wishlist?.length || 0}</span>
              </div>
              <span className="text-[10px] text-white/70 group-hover:text-white uppercase tracking-wider block">Favourites</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Main Profile Details Section ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Breadcrumb / Actions */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#632736] hover:underline font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#632736]/30 hover:border-[#632736] text-[#632736] text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#FAF5EB] transition-all cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
            <span className="shrink-0 font-bold">!</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-[#E5DAC8] p-6 sm:p-8 shadow-xs">
          <div className="border-b border-[#E5DAC8]/60 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#3B1822]">
                Personal Details
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your contact info, shipping address, and preferences.
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#632736]">
              <Sparkles size={15} />
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822] flex items-center gap-2.5">
                    <User size={15} className="text-[#632736]" />
                    <span>{formData.name || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822] flex items-center gap-2.5">
                    <Mail size={15} className="text-[#632736]" />
                    <span className="truncate">{formData.email || "Not provided"}</span>
                    <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-medium">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  Mobile Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822] flex items-center gap-2.5">
                    <Phone size={15} className="text-[#632736]" />
                    <span>{formData.phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                    placeholder="City"
                  />
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822]">
                    {formData.city || "Ichalkaranji"}
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                    placeholder="State"
                  />
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822]">
                    {formData.state || "Maharashtra"}
                  </div>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                  Pincode
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all"
                    placeholder="Pincode"
                  />
                ) : (
                  <div className="p-2.5 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822]">
                    {formData.pincode || "416115"}
                  </div>
                )}
              </div>

            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-semibold text-[#3B1822] mb-1">
                Street Address / Delivery Location
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF5EB] border border-[#DDD0C0] focus:border-[#632736] focus:ring-1 focus:ring-[#632736]/20 rounded-xl text-xs sm:text-sm text-[#3B1822] outline-none transition-all resize-none"
                    placeholder="Apartment, building, landmark, street name..."
                  />
                </div>
              ) : (
                <div className="p-3 bg-[#FAF5EB]/60 rounded-xl border border-[#E5DAC8]/60 text-xs sm:text-sm font-medium text-[#3B1822] flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#632736] shrink-0 mt-0.5" />
                  <span>{formData.address || "No delivery address added yet."}</span>
                </div>
              )}
            </div>

            {/* Edit / Save Actions */}
            {isEditing && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Save size={15} />
                  <span>{saving ? "Saving Changes…" : "Save Changes"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

        </div>

        {/* ── Secondary Cards: Orders, Favourites & Sign Out ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link
            to="/my-orders"
            className="bg-white p-5 rounded-2xl border border-[#E5DAC8] hover:border-[#632736]/40 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#632736]/10 text-[#632736] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Package size={20} />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3B1822] group-hover:text-[#632736] transition-colors">
              My Orders
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Track status, view items and order history
            </p>
          </Link>

          <Link
            to="/my-favourite-list"
            className="bg-white p-5 rounded-2xl border border-[#E5DAC8] hover:border-[#632736]/40 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#CD97A5]/20 text-[#632736] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Heart size={20} />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3B1822] group-hover:text-[#632736] transition-colors">
              My Favourite List
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {wishlist?.length || 0} saved creations ready to order
            </p>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white p-5 rounded-2xl border border-red-200 hover:bg-red-50 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LogOut size={20} />
            </div>
            <h3 className="font-serif font-bold text-sm text-red-600">
              Sign Out
            </h3>
            <p className="text-xs text-red-500/80 mt-0.5">
              Securely log out of this account
            </p>
          </button>
        </div>

      </div>

    </div>
  );
};
