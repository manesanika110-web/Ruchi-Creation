import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Save, 
  Eye, 
  Upload, 
  Check, 
  ExternalLink, 
  Globe, 
  ToggleLeft, 
  ToggleRight,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminPages = () => {
  const { pageSettings, updatePageSettings, addMediaItem } = useApp();

  const pageKeys = Object.keys(pageSettings);
  const [selectedPageKey, setSelectedPageKey] = useState(pageKeys[0] || "home");
  const [formData, setFormData] = useState({ ...pageSettings[selectedPageKey] });
  const [previewImage, setPreviewImage] = useState(pageSettings[selectedPageKey]?.bannerImage || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectPage = (key) => {
    setSelectedPageKey(key);
    setFormData({ ...pageSettings[key] });
    setPreviewImage(pageSettings[key]?.bannerImage || "");
    setSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "bannerImage") {
      setPreviewImage(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewImage(base64);
        setFormData((prev) => ({ ...prev, bannerImage: base64 }));
        // Add to media library
        addMediaItem({
          name: `Banner: ${formData.name || selectedPageKey}`,
          url: base64,
          category: "Banners"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({ ...prev, visible: !prev.visible }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePageSettings(selectedPageKey, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const activePage = pageSettings[selectedPageKey] || {};

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Content Administration
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Website Menu Page Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Configure headings, hero banners, text descriptions, action buttons, and visibility for every storefront page.
          </p>
        </div>

        {saveSuccess && (
          <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Page Changes Saved Successfully!</span>
          </span>
        )}
      </div>

      {/* Page Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#4D1B28]">
        {pageKeys.map((key) => {
          const page = pageSettings[key];
          const isSelected = selectedPageKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectPage(key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? "bg-[#632736] text-white border-[#8E3E53] shadow-md shadow-[#16040A]"
                  : "bg-[#240B13] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${isSelected ? "text-[#E5DAC8]" : "text-[#CD97A5]"}`} />
              <span>{page.name || key}</span>
              <span className={`w-2 h-2 rounded-full ${page.visible !== false ? "bg-emerald-400" : "bg-rose-400"}`} title={page.visible !== false ? "Published" : "Hidden"} />
            </button>
          );
        })}
      </div>

      {/* Main Page Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-[#240B13] rounded-3xl p-6 sm:p-7 border border-[#4D1B28] shadow-md space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#FAF5EB]">
                Editing: {activePage.name}
              </h2>
              <span className="text-[11px] text-[#CD97A5] font-mono">
                Route path: {activePage.path}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Visibility Toggle Button */}
              <button
                type="button"
                onClick={handleToggleVisibility}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  formData.visible !== false
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-rose-950/60 border-rose-800 text-rose-300"
                }`}
              >
                {formData.visible !== false ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Page Visible</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-400" />
                    <span>Page Hidden</span>
                  </>
                )}
              </button>

              <Link
                to={activePage.path || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1A070E] hover:bg-[#32111D] text-[#CD97A5] hover:text-white border border-[#3E1421] transition-colors"
                title="Open live page in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title & Navigation Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Page Title (Browser & Nav)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Section / Banner Badge
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>
            </div>

            {/* Main Heading */}
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Main Banner Heading
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading || ""}
                onChange={handleInputChange}
                placeholder="e.g. Bespoke Gifting Studio"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            {/* Subheading */}
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Subheading / Tagline
              </label>
              <input
                type="text"
                name="subheading"
                value={formData.subheading || ""}
                onChange={handleInputChange}
                placeholder="e.g. Handcrafted with Love, Personalized for Every Special Moment"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            {/* Description Text */}
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Introductory Description Paragraph
              </label>
              <textarea
                rows="3"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] leading-relaxed"
              ></textarea>
            </div>

            {/* Action Buttons: Label & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Explore Gifts"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Button Destination Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. /customize-gifts or https://wa.me/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>
            </div>

            {/* Banner Image Input & Uploader */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-[#E5DAC8]">
                Page Header Banner Image URL or Upload File
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="bannerImage"
                  value={formData.bannerImage || ""}
                  onChange={handleInputChange}
                  placeholder="/banners/banner_contact.jpg or https://..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
                <label className="px-3.5 py-2 bg-[#3A101C] hover:bg-[#521D2C] border border-[#632736] text-[#E5DAC8] text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* SEO Meta Fields */}
            <div className="pt-2 border-t border-[#3E1421] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                SEO & Search Engine Optimization
              </span>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Ruchi Creation - Handmade Gifts"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Meta Description
                </label>
                <textarea
                  rows="2"
                  name="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={handleInputChange}
                  placeholder="Brief description for Google search previews..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                ></textarea>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save {activePage.name} Settings</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Live Image Preview & Page Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#FAF5EB] flex items-center gap-2 pb-2 border-b border-[#3E1421]">
              <ImageIcon className="w-4 h-4 text-[#CD97A5]" />
              <span>Header Banner Preview</span>
            </h3>

            {/* Banner Preview Card */}
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-[#4D1B28] bg-[#1A070E] flex items-center justify-center shadow-inner group">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={formData.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "/banners/banner_contact.jpg"; }}
                />
              ) : (
                <div className="text-center text-xs text-gray-500 p-4 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto text-[#CD97A5]/50" />
                  <p>No banner image set for this page.</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] block">
                  {formData.name || selectedPageKey}
                </span>
                <h4 className="font-serif italic font-bold text-lg leading-tight text-white drop-shadow">
                  {formData.heading || formData.title}
                </h4>
                <p className="text-[11px] text-[#FAF5EB]/90 line-clamp-1 mt-0.5">
                  {formData.subheading || formData.description}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#1A070E] border border-[#3E1421] text-xs text-[#D4B8C1] space-y-1">
              <span className="font-bold text-[#E5DAC8] block">Live Synchronization</span>
              <p className="text-[11px] leading-relaxed">
                When you click "Save", changes to headings, banners, and button labels immediately reflect on the user-facing website without reloading or modifying source files!
              </p>
            </div>
          </div>

          {/* Quick List of All Pages Status */}
          <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#FAF5EB] pb-2 border-b border-[#3E1421]">
              Website Pages Directory
            </h3>

            <div className="space-y-2 text-xs">
              {pageKeys.map((key) => {
                const p = pageSettings[key];
                return (
                  <div
                    key={key}
                    onClick={() => handleSelectPage(key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedPageKey === key
                        ? "bg-[#32111D] border-[#8E3E53] text-white"
                        : "bg-[#1A070E] border-[#3E1421] text-[#D4B8C1] hover:border-[#632736]"
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{p.name || key}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.visible !== false ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                      }`}>
                        {p.visible !== false ? "Active" : "Hidden"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#CD97A5]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
