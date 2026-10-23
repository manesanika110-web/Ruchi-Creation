import React, { useState } from "react";
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  Plus, 
  Eye, 
  X,
  Filter,
  Sparkles
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { compressImageFile } from "../../utils/imageCompressor";
import { saveImageToPublicFolder } from "../../services/imageStorage";

export const AdminMedia = () => {
  const { mediaLibrary, addMediaItem, deleteMediaItem } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  // New Image Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newImageForm, setNewImageForm] = useState({
    name: "",
    url: "",
    category: "General",
    preview: ""
  });

  const categories = ["All", "Banners", "Categories", "Products", "Pages", "Home Sections", "Branding"];

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.url?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const localSave = await saveImageToPublicFolder(file, file.name);
        if (localSave && localSave.success && localSave.url) {
          setNewImageForm((prev) => ({
            ...prev,
            preview: localSave.url,
            url: localSave.url,
            name: prev.name || file.name.replace(/\.[^/.]+$/, "")
          }));
        } else {
          const compressed = await compressImageFile(file, 900, 0.8);
          setNewImageForm((prev) => ({
            ...prev,
            preview: compressed,
            url: compressed,
            name: prev.name || file.name.replace(/\.[^/.]+$/, "")
          }));
        }
      } catch (err) {
        console.warn("Fallback to FileReader:", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImageForm((prev) => ({
            ...prev,
            preview: reader.result,
            url: reader.result,
            name: prev.name || file.name.replace(/\.[^/.]+$/, "")
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveUpload = (e) => {
    e.preventDefault();
    if (!newImageForm.url) {
      alert("Please upload an image or provide a valid image URL.");
      return;
    }

    addMediaItem({
      name: newImageForm.name || "Uploaded Image",
      url: newImageForm.url,
      category: newImageForm.category || "General"
    });

    setNewImageForm({ name: "", url: "", category: "General", preview: "" });
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Media Asset Manager
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Website Images & Media Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Upload new website graphics, replace banners, preview assets in high resolution, and copy image links.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4 text-[#E5DAC8]" />
          <span>Upload New Image</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240B13] p-4 rounded-3xl border border-[#4D1B28] shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search images by name, category, or path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          />
          <Search className="w-3.5 h-3.5 text-[#CD97A5] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#632736] text-white border-[#8E3E53]"
                  : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group bg-[#240B13] rounded-2xl border border-[#4D1B28] overflow-hidden shadow-xs hover:border-[#8E3E53] hover:shadow-xl transition-all flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div 
              onClick={() => setPreviewItem(item)}
              className="relative aspect-square bg-[#1A070E] overflow-hidden flex items-center justify-center cursor-pointer group"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = "/logo.png"; }}
              />

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="p-2 rounded-full bg-[#632736] text-white" title="Click to view full preview">
                  <Eye className="w-4 h-4" />
                </span>
              </div>

              {/* Category Pill */}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1A070E]/85 text-[#CD97A5] border border-white/10 backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            {/* Info and Actions */}
            <div className="p-2.5 space-y-2">
              <span className="font-semibold text-xs text-[#FAF5EB] block truncate" title={item.name}>
                {item.name}
              </span>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#3E1421]">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="px-2 py-1 rounded bg-[#1A070E] hover:bg-[#32111D] text-[#CD97A5] hover:text-white text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer border border-[#3E1421]"
                  title="Copy image URL to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Remove "${item.name}" from the media library?`)) {
                      deleteMediaItem(item.id);
                    }
                  }}
                  className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                  title="Delete from Media Library"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="bg-[#240B13] rounded-3xl p-16 text-center border border-[#4D1B28] space-y-2">
          <ImageIcon className="w-12 h-12 mx-auto text-[#CD97A5]/40" />
          <h3 className="font-serif font-bold text-lg text-[#FAF5EB]">No Images Found</h3>
          <p className="text-xs text-[#D4B8C1]">No media assets match your active search or category filter.</p>
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#240B13] rounded-3xl max-w-3xl w-full p-6 border border-[#4D1B28] shadow-2xl space-y-4 relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#CD97A5]">{previewItem.category}</span>
                <h3 className="font-serif font-bold text-lg text-white">{previewItem.name}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] rounded-2xl overflow-hidden bg-[#120408] border border-[#3E1421] flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <div className="text-xs text-[#D4B8C1] font-mono truncate max-w-md">
                {previewItem.url}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                  className="px-4 py-2 bg-[#4D1B28] hover:bg-[#632736] text-[#FAF5EB] rounded-xl text-xs font-semibold border border-[#7D2C42] flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Image URL</span>
                </button>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1A070E] hover:bg-[#32111D] text-[#CD97A5] rounded-xl text-xs font-semibold border border-[#3E1421] flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Asset</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Image Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#240B13] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#4D1B28] shadow-2xl space-y-4 relative">
            <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
              <h3 className="font-serif font-bold text-lg text-white">Upload New Website Graphic</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Asset Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={newImageForm.name}
                  onChange={(e) => setNewImageForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Diwali Special Hamper Banner"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Media Category
                </label>
                <select
                  value={newImageForm.category}
                  onChange={(e) => setNewImageForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                >
                  <option value="Banners">Banners</option>
                  <option value="Categories">Categories</option>
                  <option value="Products">Products</option>
                  <option value="Pages">Pages</option>
                  <option value="Home Sections">Home Sections</option>
                  <option value="Branding">Branding</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Upload or URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#E5DAC8]">
                  Select Image File from Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#632736] file:text-white hover:file:bg-[#7D2C42] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Or Image Web URL
                </label>
                <input
                  type="text"
                  value={newImageForm.url}
                  onChange={(e) => {
                    const u = e.target.value;
                    setNewImageForm((p) => ({ ...p, url: u, preview: u }));
                  }}
                  placeholder="https://... or /banners/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              {/* Image Preview before saving */}
              {newImageForm.preview && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[#4D1B28] bg-[#120408] flex items-center justify-center">
                  <img
                    src={newImageForm.preview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A070E] text-[#D4B8C1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold rounded-xl"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
