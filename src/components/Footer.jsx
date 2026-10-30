import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  MessageCircle,
  Clock,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  FileText
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { DEFAULT_FOOTER_SETTINGS } from "../data/adminDefaults";

export const Footer = () => {
  const { settings, footerSettings } = useApp();
  const navigate = useNavigate();

  const footer = footerSettings || DEFAULT_FOOTER_SETTINGS;

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'faq' | 'shipping' | 'return' | 'terms' | 'privacy' | null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminDoubleClick = () => {
    navigate("/admin");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setSubscribed(false);
      }, 3500);
    }
  };

  // Policy Modal Content Definitions
  const policyData = {
    faq: {
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="w-5 h-5 text-[#632736]" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-[#3B1822]">How can I customize a gift?</h4>
            <p className="text-gray-600 mt-1">
              You can personalize gifts directly on our website through the <strong>Customize Gifts</strong> studio or select options like recipient name, custom message, and photo upload directly on product pages.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#3B1822]">What are the delivery timelines?</h4>
            <p className="text-gray-600 mt-1">
              For Ichalkaranji and nearby areas, same-day or next-day delivery is available. For pan-India shipping, standard orders take 3–5 business days.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#3B1822]">Can I place bulk orders for weddings or corporate events?</h4>
            <p className="text-gray-600 mt-1">
              Yes! We specialize in bulk hampers, return gifts, shagun boxes, and corporate gifting. Please reach out to us via WhatsApp or the Contact Us page for discounted bulk pricing.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#3B1822]">How do I track my order?</h4>
            <p className="text-gray-600 mt-1">
              You can track your active orders by navigating to <strong>My Orders</strong> in your account or entering your Order ID.
            </p>
          </div>
        </div>
      )
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      icon: <Truck className="w-5 h-5 text-[#632736]" />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            At <strong>Ruchi Creation</strong>, every gift is handcrafted with the utmost love and care. We package all delicate products—including pooja platters, bouquets, and fragile keepsakes—in premium multi-layer protective packaging.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Free Delivery:</strong> Enjoy complimentary shipping on all orders above ₹999.</li>
            <li><strong>Standard Shipping:</strong> A flat ₹49 fee applies to orders below ₹999.</li>
            <li><strong>Processing Time:</strong> Ready products ship within 24 hours. Customized items take 1–2 business days for crafting.</li>
            <li><strong>Local Delivery:</strong> Express same-day delivery available across Ichalkaranji.</li>
          </ul>
        </div>
      )
    },
    return: {
      title: "Return & Refund Policy",
      icon: <RotateCcw className="w-5 h-5 text-[#632736]" />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            Your complete happiness is our highest priority. Because each personalized item is custom-crafted with unique names and photos, customized orders cannot be restocked.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Damaged in Transit:</strong> If your product arrives damaged, send us an unboxing photo or video on WhatsApp within 24 hours, and we will issue a free replacement or 100% full refund immediately.</li>
            <li><strong>Non-Customized Items:</strong> Eligible for return within 7 days of delivery in original condition.</li>
            <li><strong>Refund Timeline:</strong> Approved refunds are credited to the original payment method within 3–5 working days.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      icon: <FileText className="w-5 h-5 text-[#632736]" />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            By accessing and shopping with Ruchi Creation, you agree to our standard terms of service. All prices are listed in Indian Rupees (INR) and include applicable taxes.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Handmade Variations:</strong> Handcrafted items may have minor, unique natural variations that celebrate the artisanal creation process.</li>
            <li><strong>Order Confirmation:</strong> Orders are verified upon receipt. For custom photo printing, customers are responsible for providing clear images.</li>
            <li><strong>Intellectual Property:</strong> All original gift designs, logos, and product photographs belong to Ruchi Creation.</li>
          </ul>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      icon: <ShieldCheck className="w-5 h-5 text-[#632736]" />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            Ruchi Creation is committed to safeguarding your personal data and privacy. We strictly never sell, trade, or share your contact or payment details with third parties.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Information Collected:</strong> Only information needed to deliver your gifts (name, delivery address, phone number, and custom gift text).</li>
            <li><strong>Payment Security:</strong> All digital transactions are processed through 100% encrypted, RBI-compliant payment gateways. We never store credit card or UPI PINs.</li>
            <li><strong>Photo Privacy:</strong> Photos uploaded for custom gifts are strictly deleted after production.</li>
          </ul>
        </div>
      )
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#491D26] to-[#3B141C] text-white pt-10 sm:pt-14 pb-6 border-t border-[#340F16] relative overflow-hidden text-left">

      {/* Delicate Floral Watermark on the Right (Matching Reference Image) */}
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-[0.06] flex items-center justify-end overflow-hidden z-0">
        <svg
          className="w-[420px] h-[420px] translate-x-16"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M100 20 C120 40, 150 40, 160 60 C170 80, 160 110, 140 130 C120 150, 90 160, 70 140 C50 120, 40 90, 50 60 C60 30, 80 20, 100 20 Z" />
          <path d="M100 20 C100 60, 120 90, 140 130" />
          <path d="M70 140 C90 110, 110 80, 160 60" />
          <circle cx="100" cy="100" r="45" strokeDasharray="3 3" />
          <path d="M130 50 C145 65, 175 60, 185 85 C195 110, 175 145, 150 165" />
          <path d="M40 70 C25 95, 35 130, 60 155" />
        </svg>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =========================================================
            MAIN 5-COLUMN FOOTER ROW
           ========================================================= */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 pb-8 sm:pb-10">

          {/* -------------------------------------------------------
              COLUMN 1: BRAND INFORMATION (~28% width)
             ------------------------------------------------------- */}
          <div className="w-full lg:w-[28%] lg:pr-8 space-y-3.5">
            {/* Logo + Store Name + Tagline */}
            <div
              onDoubleClick={handleAdminDoubleClick}
              title="Double click for admin access"
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden shadow-xs shrink-0 border border-[#CD97A5]/40 group-hover:scale-105 transition-transform">
                <img
                  src={footer.logo || settings.logo || "/logo.png"}
                  alt={footer.storeName || settings.storeName || "Ruchi Creation"}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.src = "/logo.png"; }}
                />
              </div>
              <div className="leading-tight">
                <span className="font-serif italic font-bold text-xl sm:text-2xl text-white block tracking-wide">
                  {footer.storeName || settings.storeName || "Ruchi Creation"}
                </span>
                <span className="text-xs text-[#DFC9CF] font-medium block mt-0.5">
                  {footer.tagline || settings.tagline || "Handmade with Love"}
                </span>
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-[13px] text-[#DFC9CF] leading-relaxed max-w-sm pt-1">
              {footer.description || "Bringing smiles with handcrafted gifts for every occasion. From heartfelt personalized gifts to elegant hampers, we make your special moments more memorable."}
            </p>

            {/* Social Icons Row: Facebook, Instagram, YouTube, Pinterest */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Facebook */}
              <a
                href={footer.socialLinks?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="Follow on Facebook"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={footer.socialLinks?.instagram || settings.instagramUrl || "https://instagram.com/ruchi_creation"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="Follow on Instagram"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={footer.socialLinks?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="Watch on YouTube"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href={footer.socialLinks?.pinterest || "https://pinterest.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="Pin on Pinterest"
                aria-label="Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.28 1.7-2.28.8 0 1.18.6 1.18 1.33 0 .8-.52 2.01-.78 3.12-.22.95.48 1.72 1.42 1.72 1.7 0 3.01-1.8 3.01-4.39 0-2.3-1.65-3.9-4.01-3.9-2.73 0-4.33 2.05-4.33 4.16 0 .82.32 1.7.71 2.18.08.1.09.18.07.28l-.27 1.09c-.04.18-.15.22-.34.13-1.28-.6-2.08-2.46-2.08-3.96 0-3.23 2.35-6.19 6.77-6.19 3.55 0 6.32 2.53 6.32 5.92 0 3.53-2.22 6.37-5.31 6.37-1.04 0-2.01-.54-2.35-1.18l-.64 2.44c-.23.89-.86 2.01-1.28 2.7A12 12 0 1 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* -------------------------------------------------------
              COLUMN 2: QUICK LINKS (~16% width)
             ------------------------------------------------------- */}
          <div className="w-full sm:w-1/2 lg:w-[15%] space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DFC9CF]">
              {(footer.quickLinks && footer.quickLinks.length > 0 ? footer.quickLinks : DEFAULT_FOOTER_SETTINGS.quickLinks).map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-white transition-colors block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------
              COLUMN 3: SHOP GIFTS (~16% width)
             ------------------------------------------------------- */}
          <div className="w-full sm:w-1/2 lg:w-[16%] lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Shop Gifts
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DFC9CF]">
              {(footer.shopGiftsLinks && footer.shopGiftsLinks.length > 0 ? footer.shopGiftsLinks : DEFAULT_FOOTER_SETTINGS.shopGiftsLinks).map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-white transition-colors block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------
              COLUMN 4: CUSTOMER CARE (~16% width)
             ------------------------------------------------------- */}
          <div className="w-full sm:w-1/2 lg:w-[16%] lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DFC9CF]">
              {(footer.customerCareLinks && footer.customerCareLinks.length > 0 ? footer.customerCareLinks : DEFAULT_FOOTER_SETTINGS.customerCareLinks).map((link, idx) => (
                <li key={idx}>
                  {link.modal ? (
                    <button
                      type="button"
                      onClick={() => setActiveModal(link.modal)}
                      className="hover:text-white transition-colors block text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link to={link.path || "/"} className="hover:text-white transition-colors block">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------
              COLUMN 5: NEWSLETTER & PAYMENT METHODS (~24% width)
             ------------------------------------------------------- */}
          <div className="w-full sm:w-1/2 lg:w-[24%] lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              {footer.newsletterHeading || "Newsletter"}
            </h4>
            <p className="text-xs text-[#DFC9CF] leading-relaxed">
              {footer.newsletterText || "Get the latest updates, offers & new arrivals straight to your inbox."}
            </p>

            {/* Newsletter Pill Input Form */}
            <form onSubmit={handleNewsletterSubmit} className="relative flex items-center w-full max-w-[280px] pt-1">
              <input
                type="email"
                required
                placeholder={footer.newsletterPlaceholder || "Enter your email address"}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full h-9 pl-4 pr-10 rounded-full bg-white text-xs text-[#3B1822] placeholder:text-[#A88B93] focus:outline-none shadow-xs border border-transparent focus:border-[#CD97A5]"
              />
              <button
                type="submit"
                className="absolute right-1 w-7 h-7 rounded-full bg-[#632736] hover:bg-[#4E1C28] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                title="Subscribe to Newsletter"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-300 font-medium animate-fadeIn">
                ✓ Thank you for subscribing to Ruchi Creation!
              </p>
            )}

            {/* Payment Methods Section */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-white/95 block mb-2">
                Payment Methods
              </span>

              {/* 5 Payment Badges (UPI, VISA, Mastercard, RuPay, Cash on Delivery) */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* 1. UPI */}
                <div
                  className="bg-white rounded px-2 py-0.5 h-7 flex items-center justify-center shadow-xs select-none"
                  title="Unified Payments Interface (UPI)"
                >
                  <span className="font-black italic text-[11px] tracking-tight text-[#097939]">
                    UP<span className="text-[#E76C24]">I</span>
                  </span>
                </div>

                {/* 2. VISA */}
                <div
                  className="bg-white rounded px-2 py-0.5 h-7 flex items-center justify-center shadow-xs select-none"
                  title="Visa"
                >
                  <span className="font-black italic text-[11px] tracking-wider text-[#1A1F71]">
                    VISA
                  </span>
                </div>

                {/* 3. Mastercard */}
                <div
                  className="bg-white rounded px-2 py-0.5 h-7 flex items-center justify-center shadow-xs select-none"
                  title="Mastercard"
                >
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                  </div>
                </div>

                {/* 4. RuPay */}
                <div
                  className="bg-white rounded px-1.5 py-0.5 h-7 flex items-center justify-center shadow-xs select-none"
                  title="RuPay"
                >
                  <div className="flex items-center">
                    <span className="font-bold text-[10px] text-[#092B66]">Ru</span>
                    <span className="font-bold text-[10px] text-[#097939]">Pay</span>
                    <span className="text-[8px] text-[#E76C24] ml-0.5">▶</span>
                  </div>
                </div>

                {/* 5. Cash on Delivery */}
                <div
                  className="bg-white rounded px-1.5 py-0.5 h-7 flex items-center justify-center gap-1 shadow-xs select-none"
                  title="Cash on Delivery Available"
                >
                  <Clock className="w-3.5 h-3.5 text-[#3B1822] shrink-0" />
                  <span className="text-[7.5px] font-bold text-[#3B1822] leading-[1.05] text-left">
                    Cash on<br />Delivery
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            BOTTOM BAR: COPYRIGHT & HANDMADE WITH LOVE
           ========================================================= */}
        <div className="pt-4 pb-2 sm:pb-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#DFC9CF]">
          <p className="text-[#DFC9CF] tracking-wide">{footer.copyrightText || "© 2026 Ruchi Creation. All Rights Reserved."}</p>
          <p className="flex items-center gap-2.5 text-white">
            <span className="text-white text-xs">♥</span>
            <span className="font-serif italic text-sm text-white tracking-wide">{footer.loveNote || "Handmade with Love"}</span>
            <span className="text-white text-xs">♥</span>
          </p>
        </div>

      </div>

      {/* =========================================================
          POLICY POPUP MODAL (For FAQs, Shipping, Return, Terms, Privacy)
         ========================================================= */}
      {activeModal && policyData[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white text-[#3B1822] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#CD97A5]/40 relative animate-scaleUp max-h-[85vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E6DD] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF5EB] flex items-center justify-center shrink-0">
                  {policyData[activeModal].icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-[#5A202D]">
                  {policyData[activeModal].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#F3DEE4] flex items-center justify-center text-gray-500 hover:text-[#632736] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div>
              {policyData[activeModal].content}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-3.5 border-t border-[#F0E6DD] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#632736] hover:bg-[#4E1C28] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#632736] hover:bg-[#4D1B28] text-white border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Floating WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${settings.whatsapp || "919511112616"}?text=${encodeURIComponent(
          "Hello Ruchi Creation! I would like to enquire about gifts."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-40 w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </footer>
  );
};

export default Footer;
