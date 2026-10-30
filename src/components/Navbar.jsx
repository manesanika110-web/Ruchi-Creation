import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Palette,
  Calendar
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar = () => {
  const {
    settings,
    cart,
    currentUser,
    wishlist,
    logoutUser,
    cartBouncing,
    animatingWishlistId
  } = useApp();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null); // 'shop' | 'recipient' | 'occasion' | 'budget'
  const [activeDropdown, setActiveDropdown] = useState(null); // 'shop' | 'recipient' | 'occasion' | 'customize' | 'rent' | 'account' | null
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const navContainerRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const logoClickTimerRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll listener for enhanced backdrop blur when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setShowSearchInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenu(false);
    setMobileExpanded(null);
    setShowSearchInput(false);
  }, [location.pathname, location.search]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
    };
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  // Dropdown hover helpers with debounce
  const handleMouseEnter = (dropdownKey) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdownKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleDropdown = (dropdownKey) => {
    setActiveDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  // Double click logo logic
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (e.detail === 1) {
      logoClickTimerRef.current = setTimeout(() => {
        logoClickTimerRef.current = null;
        navigate("/");
      }, 260);
    } else if (e.detail >= 2) {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop-by-category?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery("");
      setMobileMenu(false);
    }
  };

  // Dropdown data definitions
  const shopGiftsItems = [
    { label: "Gift Hampers", path: "/shop-by-category?search=Hamper" },
    { label: "Bouquets", path: "/shop-by-category?search=Bouquet" },
    { label: "Pooja Gifts", path: "/shop-by-category?category=Pooja%20Products" },
    { label: "Personalized Gifts", path: "/customize-gifts" },
    { label: "Handmade Gifts", path: "/shop-by-category?search=Handmade" },
    { label: "Gift Sets", path: "/shop-by-category?search=Set" }
  ];

  const budgetItems = [
    { label: "Under ₹99", path: "/shop-by-category?budget=under-99" },
    { label: "₹100 – ₹299", path: "/shop-by-category?budget=100-299" },
    { label: "₹300 – ₹499", path: "/shop-by-category?budget=300-499" },
    { label: "₹500 – ₹999", path: "/shop-by-category?budget=500-999" },
    { label: "₹1000+", path: "/shop-by-category?budget=above-1000" }
  ];

  const recipientItems = [
    { label: "Gifts for Kids", path: "/by-recipient?recipient=Kids" },
    { label: "Women", path: "/by-recipient?recipient=Women" },
    { label: "Men", path: "/by-recipient?recipient=Men" },
    { label: "Couples", path: "/by-recipient?recipient=Couples" },
    { label: "Friends", path: "/by-recipient?recipient=Friends" },
    { label: "Parents", path: "/by-recipient?recipient=Parents" },
    { label: "Bride & Groom", path: "/by-recipient?recipient=Bride%20%26%20Groom" }
  ];

  const occasionItems = [
    { label: "Birthday", path: "/by-occasion?occasion=Birthday" },
    { label: "Wedding", path: "/by-occasion?occasion=Wedding" },
    { label: "Anniversary", path: "/by-occasion?occasion=Anniversary" },
    { label: "Engagement", path: "/by-occasion?occasion=Engagement" },
    { label: "Baby Shower", path: "/by-occasion?occasion=Baby%20Shower" },
    { label: "Haldi-Kumkum", path: "/by-occasion?occasion=Haldi-Kumkum" },
    { label: "Festivals", path: "/by-occasion?occasion=Festivals" },
    { label: "Return Gifts", path: "/by-occasion?occasion=Return%20Gifts" }
  ];

  const toggleMobileSubmenu = (key) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <header
        ref={navContainerRef}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "glass-nav-scrolled border-[#CD97A5]/50 shadow-sm"
            : "glass-nav border-[#CD97A5]/35 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          
          {/* =========================================================
              LEFT: Brand Logo (Single click: Home, Double click: Admin)
             ========================================================= */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleLogoClick}
            onDoubleClick={handleLogoDoubleClick}
            title="Ruchi Creation (Double-click to open Admin Panel)"
            className="flex items-center gap-2 group shrink-0 cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-xs border border-[#632736]/30 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt={settings.storeName}
                className="w-full h-full object-cover rounded-full pointer-events-none"
              />
            </div>
            <div className="text-left leading-tight">
              <span className="font-serif italic font-bold text-base sm:text-lg xl:text-xl text-[#3B1822] block group-hover:text-[#632736] transition-colors whitespace-nowrap">
                {settings.storeName}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#632736] font-medium tracking-wide block -mt-0.5 whitespace-nowrap">
                {settings.tagline}
              </span>
            </div>
          </div>

          {/* =========================================================
              CENTER: Desktop Navigation Links with Smooth Dropdowns
             ========================================================= */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4.5 2xl:gap-6 text-[12px] xl:text-[13px] font-semibold text-[#3B1822] whitespace-nowrap shrink-0">
            
            {/* 1. Home */}
            <Link
              to="/"
              className={`whitespace-nowrap hover:text-[#632736] py-2 transition-colors ${
                location.pathname === "/" ? "text-[#632736] font-bold" : ""
              }`}
            >
              Home
            </Link>

            {/* 2. Shop Gifts (Dropdown & Direct Page Link) */}
            <div
              className="relative shrink-0 flex items-center"
              onMouseEnter={() => handleMouseEnter("shop")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/shop-by-category"
                className={`whitespace-nowrap flex items-center gap-1 hover:text-[#632736] py-2 transition-colors ${
                  activeDropdown === "shop" || location.pathname.startsWith("/shop")
                    ? "text-[#632736] font-bold"
                    : ""
                }`}
              >
                <span>Shop Gifts</span>
              </Link>
              <button
                type="button"
                onClick={() => toggleDropdown("shop")}
                className="p-1 -ml-0.5 text-gray-500 hover:text-[#632736] cursor-pointer"
                aria-label="Toggle Shop Gifts Dropdown"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    activeDropdown === "shop" ? "rotate-180 text-[#632736]" : "text-gray-500"
                  }`}
                />
              </button>

              {activeDropdown === "shop" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[460px] glass-dropdown rounded-2xl p-4 z-50 text-left animate-dropdown">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Column 1: Main Gift Categories */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#632736] mb-2 px-2.5 border-b border-[#CD97A5]/25 pb-1">
                        Featured Gifts
                      </span>
                      <div className="space-y-0.5">
                        {shopGiftsItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Gifts by Budget */}
                    <div className="border-l border-[#CD97A5]/25 pl-4">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#632736] mb-2 px-1 border-b border-[#CD97A5]/25 pb-1">
                        Gifts by Budget
                      </span>
                      <div className="space-y-0.5">
                        {budgetItems.map((b) => (
                          <Link
                            key={b.label}
                            to={b.path}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors group"
                          >
                            <span>{b.label}</span>
                            <ChevronRight className="w-3 h-3 text-[#CD97A5] group-hover:text-[#632736] group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Link */}
                  <div className="mt-3 pt-2.5 border-t border-[#CD97A5]/30 flex items-center justify-between px-2">
                    <span className="text-[11px] text-gray-500 italic">Artisanal gifts with express delivery</span>
                    <Link
                      to="/shop-by-category"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-bold text-[#632736] hover:underline flex items-center gap-1"
                    >
                      <span>View All Gifts</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. By Recipient (Dropdown) */}
            <div
              className="relative shrink-0 flex items-center"
              onMouseEnter={() => handleMouseEnter("recipient")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/by-recipient"
                className={`whitespace-nowrap flex items-center gap-1 hover:text-[#632736] py-2 transition-colors ${
                  activeDropdown === "recipient" || location.pathname.startsWith("/by-recipient") || location.pathname.startsWith("/recipient")
                    ? "text-[#632736] font-bold"
                    : ""
                }`}
              >
                <span>By Recipient</span>
              </Link>
              <button
                type="button"
                onClick={() => toggleDropdown("recipient")}
                className="p-1 -ml-0.5 text-gray-500 hover:text-[#632736] cursor-pointer"
                aria-label="Toggle By Recipient Dropdown"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    activeDropdown === "recipient" ? "rotate-180 text-[#632736]" : "text-gray-500"
                  }`}
                />
              </button>

              {activeDropdown === "recipient" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 glass-dropdown rounded-2xl p-2.5 z-50 text-left animate-dropdown">
                  <div className="px-2 py-1 mb-1 border-b border-[#CD97A5]/25 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#632736]">
                      Gifts By Recipient
                    </span>
                    <Link
                      to="/by-recipient"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[10px] text-[#632736] hover:underline font-semibold"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    {recipientItems.map((r) => (
                      <Link
                        key={r.label}
                        to={r.path}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors group"
                      >
                        <span>{r.label}</span>
                        <ChevronRight className="w-3 h-3 text-[#CD97A5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. By Occasion (Dropdown) */}
            <div
              className="relative shrink-0 flex items-center"
              onMouseEnter={() => handleMouseEnter("occasion")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/by-occasion"
                className={`whitespace-nowrap flex items-center gap-1 hover:text-[#632736] py-2 transition-colors ${
                  activeDropdown === "occasion" || location.pathname.startsWith("/by-occasion") || location.pathname.startsWith("/occasion")
                    ? "text-[#632736] font-bold"
                    : ""
                }`}
              >
                <span>By Occasion</span>
              </Link>
              <button
                type="button"
                onClick={() => toggleDropdown("occasion")}
                className="p-1 -ml-0.5 text-gray-500 hover:text-[#632736] cursor-pointer"
                aria-label="Toggle By Occasion Dropdown"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    activeDropdown === "occasion" ? "rotate-180 text-[#632736]" : "text-gray-500"
                  }`}
                />
              </button>

              {activeDropdown === "occasion" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-60 glass-dropdown rounded-2xl p-2.5 z-50 text-left animate-dropdown">
                  <div className="px-2 py-1 mb-1 border-b border-[#CD97A5]/25 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#632736]">
                      Celebrate Every Occasion
                    </span>
                    <Link
                      to="/by-occasion"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[10px] text-[#632736] hover:underline font-semibold"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    {occasionItems.map((o) => (
                      <Link
                        key={o.label}
                        to={o.path}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors group"
                      >
                        <span>{o.label}</span>
                        <ChevronRight className="w-3 h-3 text-[#CD97A5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Customize Gifts */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => handleMouseEnter("customize")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/customize-gifts"
                className={`whitespace-nowrap hover:text-[#632736] py-2 transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith("/customize") ? "text-[#632736] font-bold" : ""
                }`}
              >
                <span>Customize Gifts</span>
                <Sparkles className="w-3 h-3 text-[#CD97A5] shrink-0" />
              </Link>

              {activeDropdown === "customize" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-72 glass-dropdown rounded-2xl p-4 z-50 text-left animate-dropdown">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#CD97A5]/25">
                    <div className="w-7 h-7 rounded-full bg-[#FAF5EB] flex items-center justify-center text-[#632736]">
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#632736]">Personalization Studio</h4>
                      <p className="text-[10px] text-gray-500">Craft a unique keepsake</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug mb-3">
                    Personalize gifts with custom names, photos, heartfelt messages, colors, and your preferred budget.
                  </p>
                  <Link
                    to="/customize-gifts"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <span>Start Customizing</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Rent */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => handleMouseEnter("rent")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/rent"
                className={`whitespace-nowrap hover:text-[#632736] py-2 transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith("/rent") ? "text-[#632736] font-bold" : ""
                }`}
              >
                <span>Rent</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#632736]/10 text-[#632736] rounded-full font-bold shrink-0">
                  New
                </span>
              </Link>

              {activeDropdown === "rent" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-72 glass-dropdown rounded-2xl p-4 z-50 text-left animate-dropdown">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#CD97A5]/25">
                    <div className="w-7 h-7 rounded-full bg-[#FAF5EB] flex items-center justify-center text-[#632736]">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#632736]">Event & Décor Rentals</h4>
                      <p className="text-[10px] text-gray-500">Curated party setups</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-gray-600 mb-3">
                    <p className="flex items-center justify-between">
                      <span className="text-gray-500">Rental Price:</span>
                      <span className="font-bold text-[#632736]">From ₹1,500/day</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-700">1 Day, 3 Days, 1 Week</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-gray-500">Security Deposit:</span>
                      <span className="font-medium text-green-700">₹2,000 (Refundable)</span>
                    </p>
                  </div>
                  <Link
                    to="/rent"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <span>View Rentals & Rent Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* 7. About Us */}
            <Link
              to="/about"
              className={`whitespace-nowrap hover:text-[#632736] py-2 transition-colors ${
                location.pathname === "/about" ? "text-[#632736] font-bold" : ""
              }`}
            >
              About Us
            </Link>

            {/* 8. Contact */}
            <Link
              to="/contact"
              className={`whitespace-nowrap hover:text-[#632736] py-2 transition-colors ${
                location.pathname === "/contact" ? "text-[#632736] font-bold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* =========================================================
              RIGHT: Actions (Search | Wishlist | Cart | Account)
             ========================================================= */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 flex-nowrap shrink-0">
            
            {/* 1. Search */}
            <div className="relative flex items-center shrink-0">
              {showSearchInput ? (
                <form onSubmit={handleSearch} className="flex items-center animate-fadeIn">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search gifts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setShowSearchInput(false)}
                    className="w-28 sm:w-36 md:w-44 h-8 sm:h-8.5 px-3 text-xs rounded-full border border-[#632736] bg-white text-[#3B1822] focus:outline-none shadow-xs"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 sm:w-8 sm:h-8 -ml-8 flex items-center justify-center text-[#632736] hover:text-[#4D1B28] cursor-pointer"
                    title="Submit search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSearchInput(true)}
                  className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors shrink-0 cursor-pointer"
                  title="Search"
                  aria-label="Search gifts"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              )}
            </div>

            {/* 2. Wishlist */}
            <Link
              to="/wishlist"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors relative shrink-0"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                  wishlist.length > 0 ? "fill-[#632736] text-[#632736]" : ""
                } ${animatingWishlistId ? "animate-heart-pop text-[#632736]" : ""}`}
              />
              {wishlist.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-[#632736] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none ${
                    animatingWishlistId ? "animate-heart-pop" : ""
                  }`}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 3. Cart */}
            <Link
              to="/cart"
              id="nav-cart-btn"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors relative shrink-0"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                  cartBouncing ? "animate-cart-bounce text-[#632736]" : ""
                }`}
              />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-[#632736] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none ${
                    cartBouncing ? "animate-cart-bounce" : ""
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 4. Account (Search | Wishlist | Cart | Account) */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => handleMouseEnter("account")}
              onMouseLeave={handleMouseLeave}
            >
              {currentUser ? (
                /* Logged In User Profile Button */
                <button
                  type="button"
                  onClick={() => toggleDropdown("account")}
                  className="flex items-center gap-1.5 h-8 sm:h-8.5 px-2 rounded-full bg-[#FAF5EB] border border-[#632736]/30 hover:border-[#632736] text-[#632736] shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none"
                  title={currentUser.name}
                  aria-label="Account Menu"
                >
                  <div className="w-5 h-5 rounded-full bg-[#632736] text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[65px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              ) : (
                /* Guest Account Button */
                <button
                  type="button"
                  onClick={() => toggleDropdown("account")}
                  className="flex items-center gap-1 h-8 sm:h-8.5 px-2.5 rounded-lg hover:bg-[#FAF5EB]/90 text-[#3B1822] hover:text-[#632736] transition-colors cursor-pointer"
                  title="Account"
                  aria-label="Account Menu"
                >
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#632736]" />
                  <span className="hidden md:inline text-xs font-semibold">Account</span>
                  <ChevronDown className="w-3 h-3 opacity-60 hidden md:inline" />
                </button>
              )}

              {/* Account Dropdown */}
              {activeDropdown === "account" && (
                <div className="absolute right-0 top-full mt-1.5 w-52 glass-dropdown rounded-2xl p-2.5 z-50 text-left animate-dropdown">
                  {currentUser ? (
                    <>
                      {/* User Header */}
                      <div className="px-3 py-2 border-b border-[#CD97A5]/25 flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-[#632736] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#3B1822] truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                      </div>

                      {/* User Menu Links */}
                      <Link
                        to="/my-profile"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#632736]" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#632736]" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/my-favourite-list"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#632736]" />
                        <span>My Favourite List {wishlist.length > 0 ? `(${wishlist.length})` : ""}</span>
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          logoutUser();
                          navigate("/", { replace: true });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left border-t border-[#CD97A5]/25 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest Header */}
                      <div className="px-3 py-2 border-b border-[#CD97A5]/25 mb-1.5">
                        <p className="text-xs font-bold text-[#3B1822]">Welcome to Ruchi Creation</p>
                        <p className="text-[10px] text-gray-500">Access orders, wishlist & more</p>
                      </div>

                      {/* Sign In / Register Button */}
                      <Link
                        to="/register"
                        onClick={() => setActiveDropdown(null)}
                        className="w-full py-2 px-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-xl block text-center shadow-xs transition-colors mb-2"
                      >
                        Register / Login
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#632736]" />
                        <span>Track My Orders</span>
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#632736] hover:bg-[#FAF5EB] transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#632736]" />
                        <span>Customer Help</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
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

        {/* =========================================================
            MOBILE DRAWER (Fully Responsive with Collapsible Accordions)
           ========================================================= */}
        {mobileMenu && (
          <div className="lg:hidden glass-dropdown border-b border-[#CD97A5] px-4 py-3 space-y-2.5 text-left text-xs font-semibold max-h-[calc(100vh-64px)] overflow-y-auto animate-fadeIn">
            
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearch} className="relative pb-2 border-b border-[#CD97A5]/30">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#CD97A5]/60 bg-white text-[#3B1822] focus:outline-none focus:ring-1 focus:ring-[#632736]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            {/* 1. Home */}
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className="block py-1.5 hover:text-[#632736]"
            >
              Home
            </Link>

            {/* 2. Shop Gifts Accordion */}
            <div className="border-b border-gray-100 pb-1.5">
              <div className="w-full flex items-center justify-between py-1.5">
                <Link
                  to="/shop-by-category"
                  onClick={() => setMobileMenu(false)}
                  className="font-bold text-[#3B1822] hover:text-[#632736]"
                >
                  Shop Gifts
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu("shop")}
                  className="p-1 text-gray-500 hover:text-[#632736] cursor-pointer"
                  aria-label="Toggle Shop Gifts Submenu"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === "shop" ? "rotate-180 text-[#632736]" : ""
                    }`}
                  />
                </button>
              </div>
              {mobileExpanded === "shop" && (
                <div className="pl-3 py-1 space-y-1.5 border-l-2 border-[#632736]/20 ml-1 mt-1">
                  {shopGiftsItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenu(false)}
                      className="block py-1 text-gray-700 hover:text-[#632736]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Gifts by Budget Sub-heading */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="block text-[11px] font-bold text-[#632736] uppercase tracking-wider mb-1">
                      Gifts by Budget:
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {budgetItems.map((b) => (
                        <Link
                          key={b.label}
                          to={b.path}
                          onClick={() => setMobileMenu(false)}
                          className="py-1 px-2 bg-[#FAF5EB] rounded text-[11px] font-medium text-gray-700 hover:text-[#632736]"
                        >
                          {b.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. By Recipient Accordion */}
            <div className="border-b border-gray-100 pb-1.5">
              <div className="w-full flex items-center justify-between py-1.5">
                <Link
                  to="/by-recipient"
                  onClick={() => setMobileMenu(false)}
                  className="font-bold text-[#3B1822] hover:text-[#632736]"
                >
                  By Recipient
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu("recipient")}
                  className="p-1 text-gray-500 hover:text-[#632736] cursor-pointer"
                  aria-label="Toggle By Recipient Submenu"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === "recipient" ? "rotate-180 text-[#632736]" : ""
                    }`}
                  />
                </button>
              </div>
              {mobileExpanded === "recipient" && (
                <div className="pl-3 py-1 space-y-1.5 border-l-2 border-[#632736]/20 ml-1 mt-1">
                  {recipientItems.map((r) => (
                    <Link
                      key={r.label}
                      to={r.path}
                      onClick={() => setMobileMenu(false)}
                      className="block py-1 text-gray-700 hover:text-[#632736]"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. By Occasion Accordion */}
            <div className="border-b border-gray-100 pb-1.5">
              <div className="w-full flex items-center justify-between py-1.5">
                <Link
                  to="/by-occasion"
                  onClick={() => setMobileMenu(false)}
                  className="font-bold text-[#3B1822] hover:text-[#632736]"
                >
                  By Occasion
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu("occasion")}
                  className="p-1 text-gray-500 hover:text-[#632736] cursor-pointer"
                  aria-label="Toggle By Occasion Submenu"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === "occasion" ? "rotate-180 text-[#632736]" : ""
                    }`}
                  />
                </button>
              </div>
              {mobileExpanded === "occasion" && (
                <div className="pl-3 py-1 space-y-1.5 border-l-2 border-[#632736]/20 ml-1 mt-1">
                  {occasionItems.map((o) => (
                    <Link
                      key={o.label}
                      to={o.path}
                      onClick={() => setMobileMenu(false)}
                      className="block py-1 text-gray-700 hover:text-[#632736]"
                    >
                      {o.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Customize Gifts */}
            <Link
              to="/customize-gifts"
              onClick={() => setMobileMenu(false)}
              className="block py-1.5 hover:text-[#632736] flex items-center justify-between"
            >
              <span>Customize Gifts</span>
              <Sparkles className="w-3.5 h-3.5 text-[#CD97A5]" />
            </Link>

            {/* 6. Rent */}
            <Link
              to="/rent"
              onClick={() => setMobileMenu(false)}
              className="block py-1.5 hover:text-[#632736] flex items-center justify-between"
            >
              <span>Rent</span>
              <span className="text-[10px] font-bold text-[#632736] bg-[#632736]/10 px-2 py-0.5 rounded-full">
                ₹1,500/day
              </span>
            </Link>

            {/* 7. About Us */}
            <Link
              to="/about"
              onClick={() => setMobileMenu(false)}
              className="block py-1.5 hover:text-[#632736]"
            >
              About Us
            </Link>

            {/* 8. Contact */}
            <Link
              to="/contact"
              onClick={() => setMobileMenu(false)}
              className="block py-1.5 hover:text-[#632736]"
            >
              Contact
            </Link>

            {/* Mobile Account Section */}
            <div className="pt-2 border-t border-[#CD97A5]/30">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 bg-[#FAF5EB] rounded-xl border border-[#E5DAC8]">
                    <div className="w-8 h-8 rounded-full bg-[#632736] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#3B1822] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/my-profile"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]"
                  >
                    <User className="w-3.5 h-3.5 text-[#632736]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]"
                  >
                    <Package className="w-3.5 h-3.5 text-[#632736]" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/my-favourite-list"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 py-1.5 px-1 hover:text-[#632736]"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#632736]" />
                    <span>My Favourite List ({wishlist.length})</span>
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
                <div className="space-y-2 pt-1">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenu(false)}
                    className="w-full py-2.5 bg-[#632736] text-white text-xs font-semibold rounded-xl block text-center shadow-xs"
                  >
                    Register / Login
                  </Link>
                </div>
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
