import React, { useState } from "react";
import { 
  Save, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Upload, 
  Check, 
  Building, 
  ShieldCheck,
  Cloud,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getCloudinaryConfig, setCloudinaryConfig } from "../../services/imageStorage";

export const AdminContent = () => {
  const { settings, updateSettings, addMediaItem } = useApp();

  const [formData, setFormData] = useState(() => {
    const cloudCfg = getCloudinaryConfig();
    return {
      ...settings,
      cloudinaryCloudName: settings.cloudinaryCloudName || cloudCfg.cloudName || "",
      cloudinaryUploadPreset: settings.cloudinaryUploadPreset || cloudCfg.uploadPreset || ""
    };
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, logo: base64 }));
        addMediaItem({
          name: "Brand Logo (Uploaded)",
          url: base64,
          category: "Branding"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setCloudinaryConfig({
      cloudName: formData.cloudinaryCloudName,
      uploadPreset: formData.cloudinaryUploadPreset
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Brand Identity & System Settings
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Store & Website Settings
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Manage your store brand name, official phone numbers, WhatsApp, studio location, announcement banners, and admin credentials.
          </p>
        </div>

        {savedSuccess && (
          <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved Successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Brand Identity & Logo */}
        <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
          <h2 className="font-serif font-bold text-base text-[#FAF5EB] border-b border-[#3E1421] pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CD97A5]" />
            <span>Store Brand Identity & Logo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
              Store Logo Graphic
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-[#CD97A5] overflow-hidden p-0.5 bg-white shadow-md shrink-0">
                <img
                  src={formData.logo || "/logo.png"}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.src = "/logo.png"; }}
                />
              </div>
              <input
                type="text"
                name="logo"
                value={formData.logo || ""}
                onChange={handleInputChange}
                placeholder="/logo.png or https://..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
              <label className="px-3.5 py-2 bg-[#3A101C] hover:bg-[#521D2C] border border-[#632736] text-[#E5DAC8] text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 2. Official Contact Information */}
        <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
          <h2 className="font-serif font-bold text-base text-[#FAF5EB] border-b border-[#3E1421] pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#CD97A5]" />
            <span>Storefront Contact Numbers & Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Primary Phone Number (Callable)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Phone Display Format (e.g. +91 95111 12616)
              </label>
              <input
                type="text"
                name="phoneDisplay"
                value={formData.phoneDisplay || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                WhatsApp Direct Number (Without +, e.g. 919511112616)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Store Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                City / Region Tag (e.g. Ichalkaranji, Maharashtra)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleInputChange}
                placeholder="ruchi_creation"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
              Full Physical Studio Address
            </label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress || ""}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
            />
          </div>
        </div>

        {/* 3. Top Announcement Bar */}
        <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
          <h2 className="font-serif font-bold text-base text-[#FAF5EB] border-b border-[#3E1421] pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#CD97A5]" />
            <span>Announcement Ticker & Experience</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
              Top Announcement Ticker
            </label>
            <input
              type="text"
              name="announcement"
              value={formData.announcement || ""}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Founder / Owner Name
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Years of Experience Badge
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>
          </div>
        </div>

        {/* 4. Cloud Image Storage (Cloudinary & Firebase Storage) */}
        <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#3E1421] pb-3">
            <h2 className="font-serif font-bold text-base text-[#FAF5EB] flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#CD97A5]" />
              <span>Persistent Product Image Storage (Cloudinary & Firebase)</span>
            </h2>
            <span className="text-[10px] bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
              <CheckCircle2 className="w-3 h-3" />
              <span>Persistent Storage Active</span>
            </span>
          </div>

          <p className="text-xs text-[#D4B8C1]">
            Product images uploaded in the Admin Dashboard are persistently stored and linked in Firebase Firestore, appearing in the storefront in real time without refreshing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Cloudinary Cloud Name (Optional)
              </label>
              <input
                type="text"
                name="cloudinaryCloudName"
                value={formData.cloudinaryCloudName || ""}
                onChange={handleInputChange}
                placeholder="e.g. dxym7qabc"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
              <span className="text-[10px] text-gray-400 block mt-1">Found in your Cloudinary Dashboard.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Cloudinary Upload Preset (Unsigned)
              </label>
              <input
                type="text"
                name="cloudinaryUploadPreset"
                value={formData.cloudinaryUploadPreset || ""}
                onChange={handleInputChange}
                placeholder="e.g. ruchi_products"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
              <span className="text-[10px] text-gray-400 block mt-1">Configured in Cloudinary Settings → Upload → Upload Presets.</span>
            </div>
          </div>
        </div>

        {/* 5. Security & Admin Credentials */}
        <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
          <h2 className="font-serif font-bold text-base text-[#FAF5EB] border-b border-[#3E1421] pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#CD97A5]" />
            <span>Admin Security & Login Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Admin Password
              </label>
              <input
                type="text"
                name="adminPassword"
                value={formData.adminPassword || ""}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#E5DAC8]" />
            <span>Save All Brand Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
