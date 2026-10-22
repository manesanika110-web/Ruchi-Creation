import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  Sparkles, 
  Camera, 
  Package,
  Upload,
  Image as ImageIcon,
  Tag,
  Star,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/defaultProducts";
import { compressImageFile } from "../../utils/imageCompressor";

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const initialForm = {
    name: "",
    category: "Wedding Gifts",
    price: 999,
    originalPrice: 1399,
    stock: 20,
    image: "",
    description: "",
    featured: true,
    bestseller: false,
    isCustomizable: true,
    hasRecipientName: true,
    hasCustomMessage: true,
    hasPhotoUpload: true,
    colors: "Deep Burgundy, Golden Mocha, Pastel Pink"
  };

  const [formData, setFormData] = useState(initialForm);

  // All unique categories in the system
  const allCategories = [
    ...new Set([
      "Wedding Gifts",
      "Birthday Gifts",
      "Mehendi Gifts",
      "Diwali Gifts",
      "Rakshabandhan Gifts",
      "Pooja Products",
      ...CATEGORIES,
      ...products.map((p) => p.category).filter(Boolean)
    ])
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "Wedding Gifts",
      price: product.price || 0,
      originalPrice: product.originalPrice || "",
      stock: product.stock ?? 25,
      image: product.image || "",
      description: product.description || "",
      featured: product.featured || false,
      bestseller: product.bestseller || false,
      isCustomizable: product.isCustomizable !== false,
      hasRecipientName: product.customizationOptions?.hasRecipientName ?? true,
      hasCustomMessage: product.customizationOptions?.hasCustomMessage ?? true,
      hasPhotoUpload: product.customizationOptions?.hasPhotoUpload ?? false,
      colors: product.customizationOptions?.colors?.join(", ") || "Deep Burgundy, Golden Mocha"
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        // Downscale to max 800px and compress to lightweight JPEG ~40-70KB
        const compressedBase64 = await compressImageFile(file, 800, 0.78);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (err) {
        console.warn("Image compression fallback:", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price) {
      alert("Please provide product name and price");
      return;
    }

    try {
      setIsSaving(true);
      const colorArray = formData.colors
        ? formData.colors.split(",").map((c) => c.trim()).filter(Boolean)
        : ["Deep Burgundy", "Mocha Cream"];

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        image: formData.image?.trim() || "/reference-assets/detail-mug.jpg",
        description: formData.description?.trim() || "",
        featured: Boolean(formData.featured),
        bestseller: Boolean(formData.bestseller),
        isCustomizable: Boolean(formData.isCustomizable),
        customizationOptions: {
          hasRecipientName: Boolean(formData.hasRecipientName),
          hasCustomMessage: Boolean(formData.hasCustomMessage),
          hasPhotoUpload: Boolean(formData.hasPhotoUpload),
          colors: colorArray,
          occasions: ["Birthday", "Anniversary", "Special Surprise", "Festival"]
        }
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData(initialForm);
    } catch (err) {
      console.error("Save product error:", err);
      alert("Error saving product: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Catalog Administration
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Add gift hampers, floral bouquets, custom mugs, festive collections, and adjust prices or stock.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E5DAC8]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240B13] p-4 rounded-3xl border border-[#4D1B28] shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search by product name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          />
          <Search className="w-3.5 h-3.5 text-[#CD97A5] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "All"
                ? "bg-[#632736] text-white border-[#8E3E53]"
                : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
            }`}
          >
            All Categories ({products.length})
          </button>
          {allCategories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-[#632736] text-white border-[#8E3E53]"
                    : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
                }`}
              >
                {cat} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const isLowStock = product.stock !== undefined && product.stock <= 5;
          const isOutOfStock = product.stock !== undefined && product.stock <= 0;

          return (
            <div
              key={product.id}
              className="group bg-[#240B13] rounded-3xl border border-[#4D1B28] p-4 text-left flex flex-col justify-between shadow-xs hover:border-[#8E3E53] hover:shadow-xl transition-all relative"
            >
              <div>
                {/* Product Image Thumbnail */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A070E] border border-[#3E1421] mb-3.5 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "/logo.png"; }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {product.featured && (
                      <span className="bg-[#632736] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-white/20">
                        Featured
                      </span>
                    )}
                    {product.isCustomizable && (
                      <span className="bg-[#1A070E]/85 text-[#CD97A5] text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                        Customizable
                      </span>
                    )}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    {isOutOfStock ? (
                      <span className="bg-rose-950 text-rose-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-rose-800">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-amber-950 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-amber-800">
                        Low: {product.stock} left
                      </span>
                    ) : (
                      <span className="bg-[#1A070E]/80 text-[#E5DAC8] text-[9px] font-medium px-2 py-0.5 rounded-md">
                        Stock: {product.stock ?? 25}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category & Title */}
                <span className="text-[10px] uppercase font-bold text-[#CD97A5] tracking-wider block">
                  {product.category}
                </span>
                <h3 className="font-serif italic font-bold text-sm text-white line-clamp-1 mt-0.5">
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#D4B8C1] line-clamp-2 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-[#3E1421] mt-3 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-white">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-gray-500 line-through ml-1.5">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="p-1.5 rounded-lg bg-[#3A101C] hover:bg-[#521D2C] text-[#E5DAC8] transition-colors cursor-pointer border border-[#632736]"
                    title="Edit Product"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#1A070E] hover:bg-rose-950/40 text-rose-400 transition-colors cursor-pointer border border-[#3E1421]"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-[#240B13] rounded-3xl p-16 text-center border border-[#4D1B28] space-y-2">
          <Package className="w-12 h-12 mx-auto text-[#CD97A5]/40" />
          <h3 className="font-serif font-bold text-lg text-[#FAF5EB]">No Products Found</h3>
          <p className="text-xs text-[#D4B8C1]">No products match the selected category or search filter.</p>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="bg-[#240B13] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto border border-[#4D1B28] shadow-2xl relative text-left">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
              <h2 className="font-serif font-bold text-xl text-white">
                {editingProduct ? "Edit Product Listing" : "Add New Gift Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Personalized Gold-Rim Ceramic Mug"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#240B13]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                    Available Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                    Original / MRP Price (₹) (Optional strikethrough)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                </div>
              </div>

              {/* Product Image URL & Uploader with Live Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#E5DAC8]">
                  Product Image URL or Upload File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                    placeholder="/reference-assets/... or https://..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white"
                  />
                  <label className={`px-3.5 py-2 ${isCompressing ? "bg-[#521D2C] opacity-75" : "bg-[#3A101C] hover:bg-[#521D2C]"} text-[#E5DAC8] text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#632736] transition-colors`}>
                    {isCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isCompressing ? "Optimizing..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressing || isSaving}
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.image && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#4D1B28] bg-[#1A070E] mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/logo.png"; }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#E5DAC8] mb-1">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed gift description, materials, inclusions..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                ></textarea>
              </div>

              {/* Customization Options */}
              <div className="p-4 rounded-2xl bg-[#1A070E] border border-[#3E1421] space-y-3">
                <span className="font-bold text-[#E5DAC8] block">Gift Customization Options</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasRecipientName}
                      onChange={(e) => setFormData((p) => ({ ...p, hasRecipientName: e.target.checked }))}
                      className="rounded accent-[#632736]"
                    />
                    <span>Recipient Name</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasCustomMessage}
                      onChange={(e) => setFormData((p) => ({ ...p, hasCustomMessage: e.target.checked }))}
                      className="rounded accent-[#632736]"
                    />
                    <span>Custom Note</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasPhotoUpload}
                      onChange={(e) => setFormData((p) => ({ ...p, hasPhotoUpload: e.target.checked }))}
                      className="rounded accent-[#632736]"
                    />
                    <span>Photo Upload</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                      className="rounded accent-[#632736]"
                    />
                    <span>Show in Featured Section</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1A070E] text-[#D4B8C1] hover:text-white cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-6 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#9E4459] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-2 transition-all shadow-md"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin text-[#E5DAC8]" />}
                  <span>{isSaving ? "Saving Product..." : editingProduct ? "Update Product" : "Save Product"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
