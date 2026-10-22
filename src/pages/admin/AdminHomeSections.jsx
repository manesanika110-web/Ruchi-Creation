import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Layers, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Upload, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminHomeSections = () => {
  const { 
    homeSections, 
    homeSectionOrder, 
    updateHomeSection, 
    toggleHomeSection, 
    reorderHomeSections,
    addMediaItem
  } = useApp();

  const [activeSectionId, setActiveSectionId] = useState(homeSectionOrder[0] || "hero");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for active section form
  const [sectionData, setSectionData] = useState(() => ({
    ...homeSections[activeSectionId]
  }));

  const handleSelectSection = (id) => {
    setActiveSectionId(id);
    setSectionData({ ...homeSections[id] });
    setSaveSuccess(false);
  };

  const handleInputChange = (field, value) => {
    setSectionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parentField, index, field, value) => {
    setSectionData((prev) => {
      const arr = [...(prev[parentField] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [parentField]: arr };
    });
  };

  const handleImageUpload = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setSectionData((prev) => ({ ...prev, [field]: base64 }));
      addMediaItem({
        name: `Home Section: ${activeSectionId} (${field})`,
        url: base64,
        category: "Home Sections"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateHomeSection(activeSectionId, sectionData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reordering helpers
  const moveSection = (index, direction) => {
    const newOrder = [...homeSectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    reorderHomeSections(newOrder);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Homepage Architecture
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Home Page Section Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Customize, reorder, enable, or disable every section of the official Home page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Section Updated Live!</span>
            </span>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#2D0F19] hover:bg-[#3E1421] text-[#FAF5EB] rounded-xl text-xs font-semibold border border-[#521D2C] flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#CD97A5]" />
            <span>View Home Live</span>
          </Link>
        </div>
      </div>

      {/* Sections Sequence & Ordering Bar */}
      <div className="bg-[#240B13] rounded-3xl p-5 border border-[#4D1B28] shadow-md space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#3E1421]">
          <h2 className="font-serif font-bold text-sm text-[#FAF5EB] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#CD97A5]" />
            <span>Section Order & Display Sequence (Top to Bottom)</span>
          </h2>
          <span className="text-[11px] text-[#CD97A5]">
            Use arrows to reorder sections on the homepage
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
          {homeSectionOrder.map((secId, idx) => {
            const sec = homeSections[secId] || { name: secId, enabled: true };
            const isSelected = activeSectionId === secId;

            return (
              <div
                key={secId}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#4D1B28] border-[#8E3E53] text-white shadow-md shadow-[#16040A]"
                    : "bg-[#1A070E] border-[#3E1421] text-[#D4B8C1] hover:border-[#632736]"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#120408] text-[#CD97A5] flex items-center justify-center font-bold text-[10px]">
                  {idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectSection(secId)}
                  className="font-semibold text-xs text-left cursor-pointer"
                >
                  {sec.name || secId}
                </button>

                <div className="flex items-center gap-1 border-l border-[#3E1421] pl-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    className="p-1 text-[#CD97A5] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === homeSectionOrder.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    className="p-1 text-[#CD97A5] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHomeSection(secId)}
                    className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                      sec.enabled !== false
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-rose-950 text-rose-300"
                    }`}
                    title="Click to toggle section visibility"
                  >
                    {sec.enabled !== false ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Content Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Form (8 cols) */}
        <div className="lg:col-span-8 bg-[#240B13] rounded-3xl p-6 sm:p-7 border border-[#4D1B28] shadow-md space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] block">
                Editing Section
              </span>
              <h2 className="font-serif font-bold text-xl text-[#FAF5EB] mt-0.5">
                {sectionData.name || activeSectionId}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const updated = { ...sectionData, enabled: sectionData.enabled === false };
                  setSectionData(updated);
                  updateHomeSection(activeSectionId, updated);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  sectionData.enabled !== false
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-rose-950/60 border-rose-800 text-rose-300"
                }`}
              >
                {sectionData.enabled !== false ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Enabled on Website</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-400" />
                    <span>Disabled (Hidden)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Common Fields: Badge & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Category Tag / Badge
                </label>
                <input
                  type="text"
                  value={sectionData.badge || sectionData.tagline || ""}
                  onChange={(e) => handleInputChange("badge", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={sectionData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  required
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                Section Subtitle / Tagline
              </label>
              <input
                type="text"
                value={sectionData.subtitle || ""}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
              />
            </div>

            {/* Section Specific Fields */}
            {activeSectionId === "hero" && (
              <div className="space-y-4 pt-2 border-t border-[#3E1421]">
                <h3 className="font-bold text-xs uppercase text-[#CD97A5] tracking-wider">
                  Hero Banner Controls
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Hero Sub-description
                  </label>
                  <textarea
                    rows="2"
                    value={sectionData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={sectionData.primaryBtnText || ""}
                      onChange={(e) => handleInputChange("primaryBtnText", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Primary Button Destination
                    </label>
                    <input
                      type="text"
                      value={sectionData.primaryBtnLink || ""}
                      onChange={(e) => handleInputChange("primaryBtnLink", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      value={sectionData.secondaryBtnText || ""}
                      onChange={(e) => handleInputChange("secondaryBtnText", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Secondary Button Destination
                    </label>
                    <input
                      type="text"
                      value={sectionData.secondaryBtnLink || ""}
                      onChange={(e) => handleInputChange("secondaryBtnLink", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Background Video URL (or fallback banner)
                  </label>
                  <input
                    type="text"
                    value={sectionData.videoUrl || ""}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>
              </div>
            )}

            {activeSectionId === "about" && (
              <div className="space-y-4 pt-2 border-t border-[#3E1421]">
                <h3 className="font-bold text-xs uppercase text-[#CD97A5] tracking-wider">
                  About Us Story & 4 Pillars
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Main Story Paragraphs
                  </label>
                  {sectionData.paragraphs?.map((p, idx) => (
                    <textarea
                      key={idx}
                      rows="2"
                      value={p}
                      onChange={(e) => {
                        const arr = [...(sectionData.paragraphs || [])];
                        arr[idx] = e.target.value;
                        setSectionData((prev) => ({ ...prev, paragraphs: arr }));
                      }}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] mb-2"
                    ></textarea>
                  ))}
                </div>

                {/* 4 Feature Pillars */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#E5DAC8]">
                    4 Artisanal Pillars
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sectionData.pillars?.map((pillar, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#1A070E] border border-[#3E1421] space-y-1.5">
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => handleNestedChange("pillars", idx, "title", e.target.value)}
                          className="w-full px-2 py-1 text-xs font-bold rounded bg-[#240B13] text-[#FAF5EB] border border-[#4D1B28]"
                        />
                        <textarea
                          rows="2"
                          value={pillar.desc}
                          onChange={(e) => handleNestedChange("pillars", idx, "desc", e.target.value)}
                          className="w-full px-2 py-1 text-[11px] rounded bg-[#240B13] text-[#D4B8C1] border border-[#4D1B28]"
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image and Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Showcase Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sectionData.image || ""}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white"
                      />
                      <label className="px-3 py-2 bg-[#3A101C] text-[#E5DAC8] text-xs font-semibold rounded-xl cursor-pointer hover:bg-[#521D2C] flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload("image", e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Image Badge Subtext
                    </label>
                    <input
                      type="text"
                      value={sectionData.imageTag || ""}
                      onChange={(e) => handleInputChange("imageTag", e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSectionId === "whyChoose" && (
              <div className="space-y-4 pt-2 border-t border-[#3E1421]">
                <h3 className="font-bold text-xs uppercase text-[#CD97A5] tracking-wider">
                  8 Why Choose Us Feature Cards
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
                  {sectionData.items?.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#1A070E] border border-[#3E1421] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#CD97A5]">Card #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleNestedChange("items", idx, "title", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs font-bold rounded bg-[#240B13] text-[#FAF5EB] border border-[#4D1B28]"
                      />
                      <textarea
                        rows="2"
                        value={item.desc}
                        onChange={(e) => handleNestedChange("items", idx, "desc", e.target.value)}
                        className="w-full px-2.5 py-1 text-[11px] rounded bg-[#240B13] text-[#D4B8C1] border border-[#4D1B28]"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionId === "customizeGifts" && (
              <div className="space-y-4 pt-2 border-t border-[#3E1421]">
                <h3 className="font-bold text-xs uppercase text-[#CD97A5] tracking-wider">
                  Customize Gifts Studio Section
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Section Description
                  </label>
                  <textarea
                    rows="3"
                    value={sectionData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white"
                  ></textarea>
                </div>

                {/* 3 Steps */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#E5DAC8]">
                    3 Personalization Steps
                  </label>
                  <div className="space-y-2">
                    {sectionData.steps?.map((st, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#1A070E] border border-[#3E1421] flex gap-3 items-center">
                        <span className="w-6 h-6 rounded-full bg-[#632736] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={st.title}
                            onChange={(e) => handleNestedChange("steps", idx, "title", e.target.value)}
                            className="w-full px-2 py-0.5 text-xs font-bold rounded bg-[#240B13] text-[#FAF5EB] border border-[#4D1B28]"
                          />
                          <input
                            type="text"
                            value={st.desc}
                            onChange={(e) => handleNestedChange("steps", idx, "desc", e.target.value)}
                            className="w-full px-2 py-0.5 text-[11px] rounded bg-[#240B13] text-[#D4B8C1] border border-[#4D1B28]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                    Showcase Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sectionData.image || ""}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white"
                    />
                    <label className="px-3 py-2 bg-[#3A101C] text-[#E5DAC8] text-xs font-semibold rounded-xl cursor-pointer hover:bg-[#521D2C] flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload("image", e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Section Changes</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Section Preview & Live Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#FAF5EB] flex items-center gap-2 pb-2 border-b border-[#3E1421]">
              <Eye className="w-4 h-4 text-[#CD97A5]" />
              <span>Section Live Preview</span>
            </h3>

            {/* Image Preview if available */}
            {(sectionData.image || sectionData.bannerImage) && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#4D1B28] bg-[#1A070E]">
                <img
                  src={sectionData.image || sectionData.bannerImage}
                  alt={sectionData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/reference-assets/about-home.jpg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3.5 text-white">
                  <span className="text-[10px] font-bold text-[#CD97A5] uppercase tracking-wider">
                    {sectionData.badge || sectionData.tagline}
                  </span>
                  <span className="font-serif italic font-bold text-base leading-tight">
                    {sectionData.title}
                  </span>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#1A070E] border border-[#3E1421] text-xs text-[#D4B8C1] space-y-2">
              <div className="flex justify-between items-center text-white">
                <span className="font-bold">Visibility Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sectionData.enabled !== false ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                }`}>
                  {sectionData.enabled !== false ? "Active on Home" : "Hidden from Home"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Toggling this section or reordering its sequence updates the homepage layout dynamically without editing JSX files.
              </p>
            </div>
          </div>

          {/* Quick List of All Sections */}
          <div className="bg-[#240B13] rounded-3xl p-6 border border-[#4D1B28] shadow-md space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#FAF5EB] pb-2 border-b border-[#3E1421]">
              All Home Sections
            </h3>

            <div className="space-y-1.5 text-xs">
              {homeSectionOrder.map((secId) => {
                const sec = homeSections[secId] || { name: secId, enabled: true };
                return (
                  <button
                    key={secId}
                    type="button"
                    onClick={() => handleSelectSection(secId)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      activeSectionId === secId
                        ? "bg-[#32111D] border-[#8E3E53] text-white"
                        : "bg-[#1A070E] border-[#3E1421] text-[#D4B8C1] hover:border-[#632736]"
                    }`}
                  >
                    <span className="font-semibold">{sec.name || secId}</span>
                    <span className={`w-2 h-2 rounded-full ${sec.enabled !== false ? "bg-emerald-400" : "bg-rose-400"}`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
