import React from "react";
import { Phone, Mail, MessageCircle, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

export const About = () => {
  const { settings, pageSettings } = useApp();
  const aboutImage = pageSettings?.about?.bannerImage || "/about-us-exact.png";
  const primaryPhone = settings?.phones?.split('/')[0]?.trim() || settings?.phone || "9511112616";

  return (
    <div
      className="min-h-[calc(100vh-140px)] text-[#3B1822] flex flex-col justify-center items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      <div className="max-w-[1100px] w-full mx-auto relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E8DAC8]/80 bg-[#FAF5E9]">
        {/* Exact Reference Design Display */}
        <div className="relative w-full overflow-hidden select-none">
          <img
            src={aboutImage}
            alt="About Us - Ruchi Creation"
            className="w-full h-auto block object-cover"
          />

          {/* Interactive Accessible Contact Hotspots */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Phone Link */}
            <a
              href={`tel:${primaryPhone}`}
              className="absolute pointer-events-auto rounded-xs transition-all duration-200 hover:bg-[#632736]/10"
              style={{ left: "5.8%", top: "86.5%", width: "15%", height: "7%" }}
              title="Call Ruchi Creation"
              aria-label="Call Ruchi Creation"
            />
            {/* Email Link */}
            <a
              href={`mailto:${settings?.email || "ruchicreation@gmail.com"}`}
              className="absolute pointer-events-auto rounded-xs transition-all duration-200 hover:bg-[#632736]/10"
              style={{ left: "22.5%", top: "86.5%", width: "16.5%", height: "7%" }}
              title="Email Ruchi Creation"
              aria-label="Email Ruchi Creation"
            />
            {/* Website Link */}
            <a
              href="https://www.ruchicreation.com"
              className="absolute pointer-events-auto rounded-xs transition-all duration-200 hover:bg-[#632736]/10"
              style={{ left: "40.5%", top: "86.5%", width: "16%", height: "7%" }}
              title="Visit www.ruchicreation.com"
              aria-label="Visit Website"
            />
          </div>
        </div>

        {/* Mobile-Friendly Quick Contact Strip (Visible on mobile/tablet) */}
        <div className="p-4 bg-[#632736] text-white flex flex-wrap items-center justify-around gap-2.5 sm:hidden border-t border-[#7D3240]">
          <a
            href={`tel:${primaryPhone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/91${primaryPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`mailto:${settings?.email || "ruchicreation@gmail.com"}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-[#FAF5EB]" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};
