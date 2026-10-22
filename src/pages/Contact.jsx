import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  Gift
} from "lucide-react";
import { InstagramIcon } from "../components/InstagramIcon";
import { useApp } from "../context/AppContext";

export const Contact = () => {
  const { settings, submitEnquiry, pageSettings } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    occasion: "Birthday",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.name.trim()) {
      alert("Please provide your name.");
      return;
    }
    if (cleanPhone.length !== 10) {
      alert("Please provide a valid 10-digit mobile number (numbers only, no alphabets).");
      return;
    }

    submitEnquiry({ ...formData, phone: cleanPhone });
    setSubmitted(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      occasion: "Birthday",
      message: ""
    });
  };

  return (
    <div
      className="w-full min-h-screen bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div 
        className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden bg-cover bg-center border border-[#E5DAC8]/50 shadow-xs"
        style={{ backgroundImage: `url('${pageSettings?.contact?.bannerImage || "/banners/banner_contact.jpg"}')`, backgroundRepeat: "no-repeat" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/35 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FAF5EB] bg-black/40 backdrop-blur-xs px-4 py-1.5 rounded-full inline-block border border-white/20">
            {pageSettings?.contact?.name || "Get in Touch"}
          </span>
          <h1 className="font-serif italic text-3xl sm:text-5xl font-bold text-white drop-shadow-md">
            {pageSettings?.contact?.heading || "Connect with Ruchi Creation"}
          </h1>
          <p className="text-sm text-white/95 leading-relaxed drop-shadow-sm">
            {pageSettings?.contact?.subheading || "Have a custom gift design in mind, need bulk corporate hampers, or want urgent anniversary delivery in Ichalkaranji? We are here to help!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Official Contact Details & Socials (5 cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CD97A5]/30 shadow-md space-y-6">
            <h2 className="font-serif font-bold text-2xl text-[#3B1822] border-b border-[#CD97A5]/20 pb-4">
              Store Contact Details
            </h2>

            <div className="space-y-5 text-sm text-[#3B1822]">
              {/* Call */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] text-[#632736] flex items-center justify-center shrink-0 border border-[#CD97A5]/30">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Phone / Call</span>
                  <a href={`tel:${settings.phone}`} className="font-bold text-[#632736] hover:underline text-base">
                    {settings.phoneDisplay}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Available 9:00 AM – 9:00 PM</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">WhatsApp Orders</span>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline text-base"
                  >
                    {settings.phoneDisplay}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Instant photo previews & design customization</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] text-[#632736] flex items-center justify-center shrink-0 border border-[#CD97A5]/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Email Address</span>
                  <a href={`mailto:${settings.email}`} className="font-bold text-[#632736] hover:underline text-sm break-all">
                    {settings.email}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">For corporate hampers & bulk queries</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] text-[#632736] flex items-center justify-center shrink-0 border border-[#CD97A5]/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Workshop & Studio Location</span>
                  <p className="font-bold text-[#3B1822]">
                    {settings.fullAddress}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Ichalkaranji, Maharashtra - 416115</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Instagram Handle</span>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#632736] hover:underline text-base"
                  >
                    @{settings.instagram}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Check customer unboxings & live reels</p>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Callout Button */}
            <div className="pt-4 border-t border-[#CD97A5]/20">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hi%20Ruchi%20Creation,%20I%20am%20reaching%20out%20from%20your%20website%20contact%20page.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Enquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CD97A5]/30 shadow-md text-left space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#632736] bg-[#CD97A5] px-3 py-1 rounded-full">
                Custom Enquiry Form
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#3B1822] mt-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill in your details below and we will get back to you with custom design ideas and pricing!
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-emerald-900">Enquiry Received!</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out to Ruchi Creation. We have registered your inquiry in our system and will connect via WhatsApp or phone shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-xl hover:bg-[#532127]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B1822] mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Snehal Kulkarni"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:ring-1 focus:ring-[#632736]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B1822] mb-1">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:ring-1 focus:ring-[#632736]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B1822] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:ring-1 focus:ring-[#632736]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B1822] mb-1">
                      Gift Occasion / Category
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:ring-1 focus:ring-[#632736] bg-white"
                    >
                      <option value="Birthday">Birthday Surprise</option>
                      <option value="Anniversary">Anniversary Celebration</option>
                      <option value="Explosion Box">Explosion Box Customization</option>
                      <option value="LED Marquee Light">Personalized LED Name Light</option>
                      <option value="Wedding / Shagun">Wedding / Shagun Hamper</option>
                      <option value="Raksha Bandhan / Festive">Raksha Bandhan / Festival</option>
                      <option value="Bulk Corporate">Corporate & Bulk Gifting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B1822] mb-1">
                    Describe Your Custom Gift Requirement
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Tell us what you want to include, recipient's name, preferred delivery date in Ichalkaranji or other cities..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:ring-1 focus:ring-[#632736]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#632736] hover:bg-[#532127] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
);
};
