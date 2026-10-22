import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X, User, LogOut, Package } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar = () => {
  const { settings, cart, currentUser, adminUser, wishlist, setAuthModalOpen, logoutUser, cartBouncing, animatingWishlistId } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoClickTimerRef = useRef(null);

  // Clean up logo click timer on unmount
  useEffect(() => {
    return () => {
      if (logoClickTimerRef.current) {
        clearTimeout(logoClickTimerRef.current);
      }
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (e.detail === 1) {
      // Single click: navigate to home if second click doesn't occur
      logoClickTimerRef.current = setTimeout(() => {
        logoClickTimerRef.current = null;
        navigate("/");
      }, 260);
    } else if (e.detail >= 2) {
      // Double click: open Admin Panel immediately
      if (logoClickTimerRef.current) {
        clearTimeout(logoClickTimerRef.current);
        logoClickTimerRef.current = null;
      }
      navigate("/admin");
    }
  };

  const handleLogoDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
      logoClickTimerRef.current = null;
    }
    navigate("/admin");
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop-by-category?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#F5EEDC]/95 backdrop-blur-md border-b border-[#CD97A5]/60 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo (Single-click = Home, Double-click = Admin Panel) */}
        <div 
          role="button"
          tabIndex={0}
          onClick={handleLogoClick}
          onDoubleClick={handleLogoDoubleClick}
          onKeyDown={handleLogoKeyDown}
          title="Ruchi Creation (Double-click to open Admin Panel)"
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer select-none"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-xs border border-[#632736]/30 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt={settings.storeName}
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />
          </div>
          <div className="text-left leading-tight">
            <span className="font-serif italic font-bold text-lg sm:text-xl text-[#3B1822] block group-hover:text-[#632736] transition-colors">
              {settings.storeName}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#632736] font-medium tracking-wide block -mt-0.5">
              {settings.tagline}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium text-[#3B1822]">
          <Link
            to="/"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/" ? "text-[#632736] font-bold" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/about" ? "text-[#632736] font-bold" : ""
            }`}
          >
            About Us
          </Link>

          <Link
            to="/customize-gifts"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/customize-gifts" ? "text-[#632736] font-bold" : ""
            }`}
          >
            Customize Gifts
          </Link>

          <Link
            to="/product-gallery"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/product-gallery" || location.pathname === "/gallery" ? "text-[#632736] font-bold" : ""
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/rent"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/rent" || location.pathname === "/rent-products" ? "text-[#632736] font-bold" : ""
            }`}
          >
            Rent
          </Link>

          <Link
            to="/contact"
            className={`hover:text-[#632736] transition-colors ${
              location.pathname === "/contact" ? "text-[#632736] font-bold" : ""
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-start pt-1 sm:pt-1.5 gap-1 sm:gap-2 md:gap-2.5 flex-nowrap shrink-0">
          {/* 1. Search Trigger */}
          <div className="relative flex items-center h-8 sm:h-8.5 shrink-0">
            {showSearchInput ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setShowSearchInput(false)}
                  className="w-28 sm:w-36 md:w-44 h-8 px-3 text-xs rounded-full border border-[#632736] bg-white text-[#3B1822] focus:outline-none"
                />
              </form>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors shrink-0 cursor-pointer"
                title="Search"
                aria-label="Search gifts"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            )}
          </div>

          {/* 2. Heart-shaped Wishlist Icon */}
          <Link
            to="/wishlist"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors relative shrink-0"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${wishlist.length > 0 ? "fill-[#632736] text-[#632736]" : ""} ${animatingWishlistId ? "animate-heart-pop text-[#632736]" : ""}`} />
            {wishlist.length > 0 && (
              <span className={`absolute -top-1 -right-1 bg-[#632736] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none ${animatingWishlistId ? "animate-heart-pop" : ""}`}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* 3. Shopping Cart Icon */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors relative shrink-0"
            title="Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${cartBouncing ? "animate-cart-bounce text-[#632736]" : ""}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-[#632736] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none ${cartBouncing ? "animate-cart-bounce" : ""}`}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* 4. Profile Icon at the Right Corner of Cart (or Register/Login button) */}
          {currentUser ? (
            <div className="relative flex flex-col items-center justify-center shrink-0" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#FAF5EB] border border-[#632736]/35 hover:border-[#632736] flex items-center justify-center text-[#632736] shadow-2xs hover:shadow-xs transition-all cursor-pointer group shrink-0"
                title={currentUser.name}
                aria-label="User profile menu"
              >
                {/* Small circular profile icon matching the reference image */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#632736]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                </svg>
              </button>
              {/* Display only the logged-in user's name below the profile icon */}
              <span className="text-[10px] font-semibold text-[#632736] max-w-[65px] sm:max-w-[72px] truncate leading-tight mt-0.5 select-none block text-center">
                {currentUser.name}
              </span>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#CD97A5]/60 py-2.5 z-50 text-left animate-fadeIn">
                  {/* User Profile Header */}
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#632736]/30 flex items-center justify-center text-[#632736] shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-[#632736]"
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
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#3B1822] truncate">{currentUser.name}</span>
                      <span className="block text-[10px] text-gray-500 truncate">{currentUser.email}</span>
                    </div>
                  </div>

                  {/* 1. My Profile */}
                  <Link
                    to="/my-profile"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#632736]" />
                    <span>My Profile</span>
                  </Link>

                  {/* 2. My Orders */}
                  <Link
                    to="/my-orders"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#632736]" />
                    <span>My Orders</span>
                  </Link>

                  {/* 3. My Favourite List */}
                  <Link
                    to="/my-favourite-list"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                  >
                    <Heart className="w-4 h-4 text-[#632736]" />
                    <span>My Favourite List {wishlist.length > 0 ? `(${wishlist.length})` : ""}</span>
                  </Link>

                  {/* 4. Logout */}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      navigate("/", { replace: true });
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="h-8 sm:h-8.5 px-2.5 sm:px-4 inline-flex items-center justify-center bg-[#632736] hover:bg-[#4D1B28] text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">Register / </span>Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors lg:hidden shrink-0 cursor-pointer"
            title="Menu"
            aria-label="Open Navigation Menu"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-b border-[#CD97A5] px-4 py-3 space-y-2 text-left text-xs font-semibold max-h-[calc(100vh-64px)] overflow-y-auto">
          <Link to="/" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Home</Link>
          <Link to="/about" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">About Us</Link>
          <Link to="/customize-gifts" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Customize Gifts</Link>
          <Link to="/product-gallery" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Gallery</Link>
          <Link to="/rent" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Rent</Link>
          <Link to="/shop-by-category" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Shop by Category</Link>
          <Link to="/featured-products" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Featured Products</Link>
          <Link to="/my-favourite-list" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">My Favourite List ({wishlist.length})</Link>
          <Link to="/contact" onClick={() => setMobileMenu(false)} className="block py-1.5 hover:text-[#632736]">Contact Us</Link>
          
          <div className="pt-2 border-t border-gray-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2 bg-[#FAF5EB] rounded-xl border border-[#E5DAC8]">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#632736]/30 flex items-center justify-center text-[#632736] shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#632736]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#3B1822] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <Link to="/my-profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]">
                  <User className="w-3.5 h-3.5 text-[#632736]" />
                  <span>My Profile</span>
                </Link>
                <Link to="/my-orders" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]">
                  <Package className="w-3.5 h-3.5 text-[#632736]" />
                  <span>My Orders</span>
                </Link>
                <Link to="/my-favourite-list" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]">
                  <Heart className="w-3.5 h-3.5 text-[#632736]" />
                  <span>My Favourite List</span>
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenu(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-2 py-1.5 px-1 text-xs text-red-600 font-semibold text-left border-t border-gray-100 pt-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                onClick={() => setMobileMenu(false)}
                className="w-full py-2 bg-[#632736] text-white text-xs font-semibold rounded-lg block text-center"
              >
                Register/Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
    {/* Spacer to preserve exact layout flow when navbar is fixed */}
    <div className="h-16 sm:h-20 shrink-0 pointer-events-none" aria-hidden="true" />
  </>
  );
};
