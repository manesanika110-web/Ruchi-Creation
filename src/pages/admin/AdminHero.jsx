import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Save,
  Eye,
  Upload,
  Check,
  ExternalLink,
  Video,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Play,
  ArrowRight,
  CheckCircle,
  Film
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminHero = () => {
  const { homeSections, updateHomeSection, addMediaItem } = useApp();

  const heroData = homeSections?.hero || {
    name: "Hero Banner",
    badge: "Bespoke Gifting Studio • Ichalkaranji",
    title: "Ruchi Creation",
    subtitle: "Handcrafted with Love, Personalized for Every Special Moment",
    description: "Transforming cherished memories into timeless customized gifts, artisanal floral bouquets & luxury celebration hampers in Ichalkaranji.",
    primaryBtnText: "Shop All Gifts",
    primaryBtnLink: "/shop-by-category",
    secondaryBtnText: "Customize Gifts",
    secondaryBtnLink: "/customize-gifts",
    videoUrl: "/gift-video.mp4",
    posterUrl: "/reference-assets/hero-banner-hd.jpg",
    trustBadges: ["100% Handcrafted", "Premium Materials", "Express Customization"],
    enabled: true
  };

  const [formData, setFormData] = useState({ ...heroData });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newBadgeText, setNewBadgeText] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, posterUrl: base64 }));
        addMediaItem({
          name: "Hero Poster HD",
          url: base64,
          category: "Hero"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, videoUrl: base64 }));
        addMediaItem({
          name: "Hero Video File",
          url: base64,
          category: "Hero"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrustBadge = (e) => {
    e.preventDefault();
    if (newBadgeText.trim()) {
      setFormData((prev) => ({
        ...prev,
        trustBadges: [...(prev.trustBadges || []), newBadgeText.trim()]
      }));
      setNewBadgeText("");
    }
  };

  const handleRemoveTrustBadge = (index) => {
    setFormData((prev) => ({
      ...prev,
      trustBadges: (prev.trustBadges || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHomeSection("hero", formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Homepage Hero Controls
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Hero Section Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Manage background video, fallback images, headings, call-to-action buttons, and trust badges on the homepage hero.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Hero Saved & Live!</span>
            </span>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#240B13] hover:bg-[#32111D] text-[#E5DAC8] border border-[#4D1B28] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#CD97A5]" />
            <span>View Live Website</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Controls (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Hero Editor Form */}
        <div className="lg:col-span-7 bg-[#240B13] rounded-3xl p-6 sm:p-7 border border-[#4D1B28] shadow-md space-y-6">

          <div className="flex items-center justify-between pb-3 border-b border-[#3E1421]">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#CD97A5]" />
              <h2 className="font-serif font-bold text-base text-[#FAF5EB]">
                Hero Media & Content Parameters
              </h2>
            </div>

            {/* Visibility Toggle */}
            <button
              type="button"
              onClick={handleToggleVisibility}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${formData.enabled !== false
                  ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                  : "bg-rose-950/60 border-rose-800 text-rose-300"
                }`}
            >
              {formData.enabled !== false ? (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                  <span>Hero Enabled</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-rose-400" />
                  <span>Hero Hidden</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Video & Poster Settings */}
            <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                1. Background Video & Poster Asset
              </span>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Background Video URL / Path
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.videoUrl || ""}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    placeholder="/gift-video.mp4"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("videoUrl", "/gift-video.mp4")}
                    className="px-2.5 py-2 text-[11px] font-semibold bg-[#32111D] hover:bg-[#4D1B28] text-[#CD97A5] hover:text-white rounded-xl border border-[#4D1B28] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Reset Video
                  </button>
                </div>
                <p className="text-[10px] text-[#A88B93] mt-1">
                  Plays in an infinite silent loop with graceful HTML5 video support on mobile and desktop.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Fallback Poster Image (Shown before video loads or if video paused)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.posterUrl || ""}
                    onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                    placeholder="/reference-assets/hero-banner-hd.jpg"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <label className="px-3 py-2 bg-[#32111D] hover:bg-[#4D1B28] text-[#E5DAC8] rounded-xl text-xs font-semibold cursor-pointer border border-[#4D1B28] flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#CD97A5]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Headings & Text */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Top Category Tag / Badge Text
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => handleInputChange("badge", e.target.value)}
                    placeholder="Bespoke Gifting Studio • Ichalkaranji"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-[#CD97A5] absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Main Storefront Heading (Title)
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ruchi Creation"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Italic Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    placeholder="Handmade with Love, Personalized for Every Special Moment"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Hero Paragraph / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Transforming cherished memories into timeless customized gifts, artisanal floral bouquets & luxury celebration hampers in Ichalkaranji."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Buttons Setup */}
            <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                2. Call to Action Buttons
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-emerald-400 block">
                    Primary Button (Solid Burgundy)
                  </span>
                  <input
                    type="text"
                    value={formData.primaryBtnText || ""}
                    onChange={(e) => handleInputChange("primaryBtnText", e.target.value)}
                    placeholder="Shop All Gifts"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <input
                    type="text"
                    value={formData.primaryBtnLink || ""}
                    onChange={(e) => handleInputChange("primaryBtnLink", e.target.value)}
                    placeholder="/shop-by-category"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-[#CD97A5] font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-amber-300 block">
                    Secondary Button (Cream Outline)
                  </span>
                  <input
                    type="text"
                    value={formData.secondaryBtnText || ""}
                    onChange={(e) => handleInputChange("secondaryBtnText", e.target.value)}
                    placeholder="Customize Gifts"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <input
                    type="text"
                    value={formData.secondaryBtnLink || ""}
                    onChange={(e) => handleInputChange("secondaryBtnLink", e.target.value)}
                    placeholder="/customize-gifts"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-[#CD97A5] font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                3. Trust Badges (Bottom of Hero)
              </span>

              <div className="flex flex-wrap gap-2">
                {(formData.trustBadges || []).map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#240B13] border border-[#4D1B28] text-xs text-[#FAF5EB]"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{badge}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrustBadge(bIdx)}
                      className="ml-1 text-[#CD97A5] hover:text-rose-400 cursor-pointer"
                      title="Remove badge"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  placeholder="e.g. Free Gift Wrapping, Express Shipping..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
                <button
                  type="button"
                  onClick={handleAddTrustBadge}
                  className="px-3 py-1.5 bg-[#4D1B28] hover:bg-[#632736] text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Badge</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#8E3E53] active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes & Publish to Website</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Live Interactive Hero Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 bg-[#240B13] rounded-3xl p-5 border border-[#4D1B28] shadow-md space-y-4">

            <div className="flex items-center justify-between pb-2 border-b border-[#3E1421]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Hero Preview</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                16:9 Aspect
              </span>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#4D1B28] shadow-inner bg-black flex items-center justify-center">
              {/* Background poster/video simulation */}
              <img
                src={formData.posterUrl || "/reference-assets/hero-banner-hd.jpg"}
                alt="Hero Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={(e) => { e.target.src = "/reference-assets/hero-banner-hd.jpg"; }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 pointer-events-none" />

              {/* Video Play Pill in corner */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] flex items-center gap-1 border border-white/20 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Video Ready</span>
              </div>

              {/* Hero Preview Content Overlay */}
              <div className="relative z-10 p-4 sm:p-5 text-left text-white w-full space-y-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[#FAF5EB] text-[9px] font-semibold tracking-wider uppercase border border-white/30 backdrop-blur-sm">
                  <Sparkles className="w-2.5 h-2.5 text-[#CD97A5]" />
                  {formData.badge || "Bespoke Gifting Studio"}
                </span>

                <h3 className="font-serif italic font-normal text-xl sm:text-2xl text-white leading-tight drop-shadow-md">
                  {formData.title || "Ruchi Creation"}
                </h3>

                <p className="font-serif italic text-xs sm:text-sm text-white/95 leading-snug drop-shadow-sm line-clamp-1">
                  {formData.subtitle || "Handmade with Love"}
                </p>

                <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-2 max-w-xs font-light">
                  {formData.description || "Transforming cherished memories into timeless customized gifts..."}
                </p>

                {/* Buttons in Preview */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1 bg-[#632736] text-white text-[10px] font-semibold rounded-full shadow-sm">
                    {formData.primaryBtnText || "Shop All Gifts"}
                  </span>
                  <span className="px-3 py-1 bg-[#FAF5EB] text-[#632736] text-[10px] font-semibold rounded-full shadow-sm">
                    {formData.secondaryBtnText || "Customize Gifts"}
                  </span>
                </div>

                {/* Trust Badges in Preview */}
                <div className="flex flex-wrap gap-2 pt-1 text-[8px] sm:text-[9px] text-white/85">
                  {(formData.trustBadges || []).slice(0, 3).map((badge, bIdx) => (
                    <span key={bIdx} className="flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#D4B8C1] bg-[#1A070E] p-3 rounded-xl border border-[#3E1421] space-y-1">
              <span className="font-bold text-[#E5DAC8] block">Live Synchronization Info:</span>
              <p>
                When you click "Save Hero Changes", updates are immediately stored in browser cache and reflected across desktop & mobile visitors without code deployment.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminHero;

