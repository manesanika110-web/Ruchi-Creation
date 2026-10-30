import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Save, 
  Eye, 
  Upload, 
  Check, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Compass,
  Heart,
  Share2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DEFAULT_FOOTER_SETTINGS } from "../../data/adminDefaults";

export const AdminFooter = () => {
  const { footerSettings, updateFooterSettings, addMediaItem } = useApp();

  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FOOTER_SETTINGS,
    ...(footerSettings || {})
  }));

  const [activeTab, setActiveTab] = useState("branding"); // 'branding' | 'links' | 'social' | 'newsletter'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New item inputs
  const [newQuickLabel, setNewQuickLabel] = useState("");
  const [newQuickPath, setNewQuickPath] = useState("");

  const [newShopLabel, setNewShopLabel] = useState("");
  const [newShopPath, setNewShopPath] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parentField, childField, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}),
        [childField]: value
      }
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, logo: base64 }));
        addMediaItem({
          name: "Footer Logo",
          url: base64,
          category: "Branding"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Links handlers
  const handleAddQuickLink = (e) => {
    e.preventDefault();
    if (newQuickLabel.trim() && newQuickPath.trim()) {
      setFormData((prev) => ({
        ...prev,
        quickLinks: [...(prev.quickLinks || []), { label: newQuickLabel.trim(), path: newQuickPath.trim() }]
      }));
      setNewQuickLabel("");
      setNewQuickPath("");
    }
  };

  const handleRemoveQuickLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: (prev.quickLinks || []).filter((_, i) => i !== index)
    }));
  };

  // Shop Gifts Links handlers
  const handleAddShopLink = (e) => {
    e.preventDefault();
    if (newShopLabel.trim() && newShopPath.trim()) {
      setFormData((prev) => ({
        ...prev,
        shopGiftsLinks: [...(prev.shopGiftsLinks || []), { label: newShopLabel.trim(), path: newShopPath.trim() }]
      }));
      setNewShopLabel("");
      setNewShopPath("");
    }
  };

  const handleRemoveShopLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      shopGiftsLinks: (prev.shopGiftsLinks || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFooterSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Storefront Global Footer
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Footer Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Edit footer brand text, logo, quick links, category navigation, social channels, and legal copyright.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Footer Saved & Live!</span>
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

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
        {[
          { id: "branding", label: "Branding & Store Info" },
          { id: "links", label: "Menu & Quick Links" },
          { id: "social", label: "Social Media & Contacts" },
          { id: "newsletter", label: "Newsletter & Bottom Bar" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === tab.id
                ? "bg-[#632736] text-white border-[#8E3E53] shadow-md shadow-[#16040A]"
                : "bg-[#240B13] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Form + Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#240B13] rounded-3xl p-6 sm:p-7 border border-[#4D1B28] shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* TAB 1: Branding & Description */}
            {activeTab === "branding" && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                  Store Identity & Bio
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={formData.storeName || ""}
                      onChange={(e) => handleInputChange("storeName", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Italic Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || ""}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Footer Logo (Image URL or Upload)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 overflow-hidden border border-[#CD97A5]">
                      <img
                        src={formData.logo || "/logo.png"}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => { e.target.src = "/logo.png"; }}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.logo || ""}
                      onChange={(e) => handleInputChange("logo", e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                    <label className="px-3 py-2 bg-[#32111D] hover:bg-[#4D1B28] text-[#E5DAC8] rounded-xl text-xs font-semibold cursor-pointer border border-[#4D1B28] flex items-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#CD97A5]" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Footer Brand Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] leading-relaxed resize-none"
                  />
                  <p className="text-[10px] text-[#A88B93] mt-1">
                    Displays directly under the logo in Column 1 of the official footer.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Navigation Links */}
            {activeTab === "links" && (
              <div className="space-y-6">
                {/* Column 2: Quick Links */}
                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                      Column 2: Quick Links ({formData.quickLinks?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, quickLinks: DEFAULT_FOOTER_SETTINGS.quickLinks }))}
                      className="text-[10px] text-[#CD97A5] hover:text-white underline cursor-pointer"
                    >
                      Reset to Defaults
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
                    {(formData.quickLinks || []).map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#240B13] p-2 rounded-xl border border-[#4D1B28]">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...formData.quickLinks];
                            updated[idx].label = e.target.value;
                            setFormData((prev) => ({ ...prev, quickLinks: updated }));
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#1A070E] text-white border border-[#3E1421]"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={link.path}
                          onChange={(e) => {
                            const updated = [...formData.quickLinks];
                            updated[idx].path = e.target.value;
                            setFormData((prev) => ({ ...prev, quickLinks: updated }));
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#1A070E] text-[#CD97A5] font-mono border border-[#3E1421]"
                          placeholder="/path"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuickLink(idx)}
                          className="p-1.5 text-[#CD97A5] hover:text-rose-400 cursor-pointer"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Quick Link */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#3E1421]">
                    <input
                      type="text"
                      value={newQuickLabel}
                      onChange={(e) => setNewQuickLabel(e.target.value)}
                      placeholder="Link Name (e.g. Gallery)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                    <input
                      type="text"
                      value={newQuickPath}
                      onChange={(e) => setNewQuickPath(e.target.value)}
                      placeholder="/gallery"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                    <button
                      type="button"
                      onClick={handleAddQuickLink}
                      className="px-3 py-1.5 bg-[#4D1B28] hover:bg-[#632736] text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Column 3: Shop Gifts Links */}
                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                      Column 3: Shop Gifts ({formData.shopGiftsLinks?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, shopGiftsLinks: DEFAULT_FOOTER_SETTINGS.shopGiftsLinks }))}
                      className="text-[10px] text-[#CD97A5] hover:text-white underline cursor-pointer"
                    >
                      Reset to Defaults
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
                    {(formData.shopGiftsLinks || []).map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#240B13] p-2 rounded-xl border border-[#4D1B28]">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...formData.shopGiftsLinks];
                            updated[idx].label = e.target.value;
                            setFormData((prev) => ({ ...prev, shopGiftsLinks: updated }));
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#1A070E] text-white border border-[#3E1421]"
                        />
                        <input
                          type="text"
                          value={link.path}
                          onChange={(e) => {
                            const updated = [...formData.shopGiftsLinks];
                            updated[idx].path = e.target.value;
                            setFormData((prev) => ({ ...prev, shopGiftsLinks: updated }));
                          }}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#1A070E] text-[#CD97A5] font-mono border border-[#3E1421]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveShopLink(idx)}
                          className="p-1.5 text-[#CD97A5] hover:text-rose-400 cursor-pointer"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Shop Link */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#3E1421]">
                    <input
                      type="text"
                      value={newShopLabel}
                      onChange={(e) => setNewShopLabel(e.target.value)}
                      placeholder="Category (e.g. Photo Mugs)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                    <input
                      type="text"
                      value={newShopPath}
                      onChange={(e) => setNewShopPath(e.target.value)}
                      placeholder="/shop-by-category?search=Mug"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                    <button
                      type="button"
                      onClick={handleAddShopLink}
                      className="px-3 py-1.5 bg-[#4D1B28] hover:bg-[#632736] text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Social & Contact Details */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                    Social Media Profiles
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(e) => handleNestedChange("socialLinks", "facebook", e.target.value)}
                      placeholder="https://facebook.com/ruchicreation"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(e) => handleNestedChange("socialLinks", "instagram", e.target.value)}
                      placeholder="https://instagram.com/ruchi_creation"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.youtube || ""}
                      onChange={(e) => handleNestedChange("socialLinks", "youtube", e.target.value)}
                      placeholder="https://youtube.com/@ruchicreation"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Pinterest Profile URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.pinterest || ""}
                      onChange={(e) => handleNestedChange("socialLinks", "pinterest", e.target.value)}
                      placeholder="https://pinterest.com/ruchicreation"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>

                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                    Customer Care & Contacts
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contactDetails?.phone || ""}
                        onChange={(e) => handleNestedChange("contactDetails", "phone", e.target.value)}
                        placeholder="+91 95111 12616"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                        WhatsApp Hotline
                      </label>
                      <input
                        type="text"
                        value={formData.contactDetails?.whatsapp || ""}
                        onChange={(e) => handleNestedChange("contactDetails", "whatsapp", e.target.value)}
                        placeholder="919511112616"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.contactDetails?.email || ""}
                      onChange={(e) => handleNestedChange("contactDetails", "email", e.target.value)}
                      placeholder="contact@ruchicreation.com"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Newsletter & Copyright */}
            {activeTab === "newsletter" && (
              <div className="space-y-4">
                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                    Newsletter Subscription Box
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Newsletter Title
                    </label>
                    <input
                      type="text"
                      value={formData.newsletterHeading || ""}
                      onChange={(e) => handleInputChange("newsletterHeading", e.target.value)}
                      placeholder="Newsletter"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Newsletter Subtitle Text
                    </label>
                    <textarea
                      rows={2}
                      value={formData.newsletterText || ""}
                      onChange={(e) => handleInputChange("newsletterText", e.target.value)}
                      placeholder="Get the latest updates, offers & new arrivals straight to your inbox."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Input Placeholder
                    </label>
                    <input
                      type="text"
                      value={formData.newsletterPlaceholder || ""}
                      onChange={(e) => handleInputChange("newsletterPlaceholder", e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>

                <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                    Bottom Copyright & Note
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Copyright Notice
                    </label>
                    <input
                      type="text"
                      value={formData.copyrightText || ""}
                      onChange={(e) => handleInputChange("copyrightText", e.target.value)}
                      placeholder="© 2026 Ruchi Creation. All Rights Reserved."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                      Right Note / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.loveNote || ""}
                      onChange={(e) => handleInputChange("loveNote", e.target.value)}
                      placeholder="Handmade with Love"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#8E3E53] active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Save Footer Settings & Update Website</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 bg-[#240B13] rounded-3xl p-5 border border-[#4D1B28] shadow-md space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#3E1421]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Footer Preview</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                Exact Color & Style
              </span>
            </div>

            {/* Scaled-down visual replica of the live footer */}
            <div className="rounded-2xl overflow-hidden border border-[#521C2B] bg-gradient-to-r from-[#3B121D] via-[#481624] to-[#3B121D] p-4 text-white text-left space-y-3 shadow-lg select-none">
              
              {/* Brand Header Row */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden border border-[#CD97A5]/50 shrink-0">
                  <img
                    src={formData.logo || "/logo.png"}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = "/logo.png"; }}
                  />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-white leading-tight">
                    {formData.storeName || "Ruchi Creation"}
                  </h4>
                  <span className="text-[9px] text-[#DFC9CF] block">
                    {formData.tagline || "Handmade with Love"}
                  </span>
                </div>
              </div>

              {/* Bio Paragraph */}
              <p className="text-[10px] text-[#DFC9CF] leading-relaxed line-clamp-2">
                {formData.description || "Bringing smiles with handcrafted gifts for every occasion..."}
              </p>

              {/* Mini Columns Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[9px]">
                <div>
                  <span className="font-bold text-[#FAF5EB] block mb-1">Quick Links</span>
                  <div className="space-y-0.5 text-[#DFC9CF]">
                    {(formData.quickLinks || []).slice(0, 4).map((l, i) => (
                      <span key={i} className="block truncate">{l.label}</span>
                    ))}
                    {(formData.quickLinks?.length || 0) > 4 && (
                      <span className="text-[8px] text-[#CD97A5] italic">+ more</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#FAF5EB] block mb-1">Shop Gifts</span>
                  <div className="space-y-0.5 text-[#DFC9CF]">
                    {(formData.shopGiftsLinks || []).slice(0, 4).map((l, i) => (
                      <span key={i} className="block truncate">{l.label}</span>
                    ))}
                    {(formData.shopGiftsLinks?.length || 0) > 4 && (
                      <span className="text-[8px] text-[#CD97A5] italic">+ more</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#FAF5EB] block mb-1">Customer Care</span>
                  <div className="space-y-0.5 text-[#DFC9CF]">
                    <span>FAQs</span>
                    <span>Shipping Policy</span>
                    <span>Return Policy</span>
                    <span>Terms</span>
                  </div>
                </div>
              </div>

              {/* Newsletter Pill Preview */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-white">{formData.newsletterHeading || "Newsletter"}</span>
                </div>
                <div className="relative flex items-center bg-white rounded-full p-0.5 shadow-xs">
                  <span className="text-[9px] text-gray-400 pl-2.5 truncate flex-1">
                    {formData.newsletterPlaceholder || "Enter your email..."}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#632736] text-white flex items-center justify-center text-[10px]">
                    →
                  </div>
                </div>
              </div>

              {/* Payment Methods Badges Row */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="bg-white text-[#097939] font-black italic text-[8px] px-1.5 py-0.5 rounded">UPI</span>
                <span className="bg-white text-[#1A1F71] font-black italic text-[8px] px-1.5 py-0.5 rounded">VISA</span>
                <span className="bg-white text-[#EB001B] font-bold text-[8px] px-1.5 py-0.5 rounded">Mastercard</span>
                <span className="bg-white text-[#092B66] font-bold text-[8px] px-1.5 py-0.5 rounded">RuPay</span>
                <span className="bg-white text-[#3B1822] font-bold text-[7px] px-1 py-0.5 rounded">Cash on Delivery</span>
              </div>

              {/* Bottom Copyright Preview */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-[#DFC9CF]">
                <span className="truncate">{formData.copyrightText || "© 2026 Ruchi Creation"}</span>
                <span className="italic shrink-0 font-serif text-white">♥ {formData.loveNote || "Handmade with Love"} ♥</span>
              </div>

            </div>

            <div className="text-[11px] text-[#D4B8C1] bg-[#1A070E] p-3 rounded-xl border border-[#3E1421] space-y-1">
              <span className="font-bold text-[#E5DAC8] block">Live Synchronization Info:</span>
              <p>
                Changes saved here instantly update the live footer on every page across the website.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminFooter;

