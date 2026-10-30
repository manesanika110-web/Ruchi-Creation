import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminLogin = () => {
  const { adminLogin, settings } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@ruchicreation.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      setLoading(false);
      if (res.success) {
        navigate("/admin");
      } else {
        setError(res.message || "Invalid credentials. Please verify your admin email and password.");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120408] via-[#200A12] to-[#120408] flex items-center justify-center py-10 sm:py-16 px-4 selection:bg-[#632736] selection:text-white">
      <div className="max-w-[420px] w-full bg-[#240B13] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#4D1B28] shadow-2xl space-y-5 text-left relative overflow-hidden my-auto">

        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#632736]/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#4D1B28]/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        {/* Logo and Header */}
        <div className="text-center space-y-2.5 relative z-10">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-[#CD97A5] mx-auto shadow-xl overflow-hidden shrink-0 p-0.5">
            <img
              src={settings.logo || "/logo.png"}
              alt={settings.storeName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.target.src = "/logo.png"; }}
            />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-[#FAF5EB] bg-[#4D1B28] px-3.5 py-1 rounded-full border border-[#7D2C42] inline-block shadow-xs">
              Secure Administration
            </span>
            <h1 className="font-serif italic font-bold text-xl sm:text-2xl text-[#FAF5EB] mt-1.5">
              {settings.storeName}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#D4B8C1] mt-0.5 font-light">
              Management Portal for Orders, Users, Products & Website Content
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-[#3A101A] border border-rose-500/50 text-rose-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10">
          <div>
            <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] focus:outline-none focus:ring-2 focus:ring-[#8E3E53] focus:border-transparent text-[#FAF5EB] placeholder-gray-500 transition-all"
              />
              <Mail className="w-4 h-4 text-[#CD97A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] focus:outline-none focus:ring-2 focus:ring-[#8E3E53] focus:border-transparent text-[#FAF5EB] placeholder-gray-500 transition-all"
              />
              <Lock className="w-4 h-4 text-[#CD97A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459]/50 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#16040A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#FAF5EB]" />
                <span>Enter Admin Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Website */}
        <div className="text-center pt-1 relative z-10">
          <Link
            to="/"
            className="text-xs text-[#CD97A5] hover:text-white transition-colors"
          >
            ← Return to Ruchi Creation Website
          </Link>
        </div>

      </div>
    </div>
  );
};
