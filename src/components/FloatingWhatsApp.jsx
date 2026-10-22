import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const FloatingWhatsApp = () => {
  const { settings } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    "Hello Ruchi Creation! I would like to enquire about customizing a gift hamper."
  )}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#3B1822] text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-xl border border-[#CD97A5]/40 animate-fade-in">
          <span>Need custom gifts? Chat on WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-700 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white/60"
        aria-label="Chat on WhatsApp"
        title="Chat with Ruchi Creation on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current transition-transform group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>
      </a>
    </div>
  );
};
