import React, { useState, useMemo } from "react";
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
  ArrowRight,
  Plus,
  Trash2,
  Gift,
  Users,
  Calendar,
  Palette,
  Package,
  X,
  Clock,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Filter
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminPages = () => {
  const {
    pageSettings,
    updatePageSettings,
    addMediaItem,
    products,
    addProduct,
    deleteProduct,
    showToast
  } = useApp();

  const pageKeys = Object.keys(pageSettings);
  const [selectedPageKey, setSelectedPageKey] = useState(pageKeys[0] || "home");
  const [formData, setFormData] = useState({ ...pageSettings[selectedPageKey] });
  const [previewImage, setPreviewImage] = useState(pageSettings[selectedPageKey]?.bannerImage || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dedicated Product Modal State
  // modalType: null | 'shopGifts' | 'byRecipient' | 'byOccasion' | 'customize' | 'rent'
  const [activeModalType, setActiveModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Form State
  const initialFormState = {
    name: "",
    category: "Customize Gifts",
    recipient: "Kids",
    occasion: "Birthday",
    rentalCategory: "Decor Items",
    rangoliSubcategory: "Ready-Made Rangoli Plates",
    price: "",
    originalPrice: "",
    securityDeposit: "500",
    rentalDuration: "1-3 days",
    image: "",
    imageData: null,
    description: "",
    stock: 25,
    featured: false,
    hasRecipientName: true,
    hasCustomMessage: true,
    hasPhotoUpload: true
  };

  const [modalForm, setModalForm] = useState(initialFormState);
  const [modalImagePreview, setModalImagePreview] = useState("");

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

  // Open Modal with defaults per menu
  const openModal = (type) => {
    setActiveModalType(type);
    let defaultCat = "Gift Hampers";
    let defaultImg = "/images/detail-hamper.jpg";
    let defaultDesc = "Handcrafted bespoke gift item made with premium materials for memorable celebrations.";

    if (type === "shopGifts") {
      defaultCat = "Customize Gifts";
      defaultImg = "/images/womens-gift-box.jpg";
      defaultDesc = "Artisanal gift hamper packed with festive delights, handcrafted keepsake, and elegant ribbon packaging.";
    } else if (type === "byRecipient") {
      defaultCat = "Kids";
      defaultImg = "/images/cat-birthday-teddy.jpg";
      defaultDesc = "Specially crafted gift curated for your loved ones with heartfelt touch and premium presentation.";
    } else if (type === "byOccasion") {
      defaultCat = "Birthday";
      defaultImg = "/images/haldi-kumkum-set.jpg";
      defaultDesc = "Traditional handcrafted celebratory gift designed to make weddings, festivals, and milestones unforgettable.";
    } else if (type === "customize") {
      defaultCat = "Customize Gifts";
      defaultImg = "/images/customized-flower-bouquet.jpg";
      defaultDesc = "Personalized keepsake customizable with names, photo prints, and heartfelt greeting messages.";
    } else if (type === "rent") {
      defaultCat = "Decor Items";
      defaultImg = "/images/rangoli-cat-readymade.jpg";
      defaultDesc = "Premium event decor item available on flexible rental for weddings, receptions, poojas, and party celebrations.";
    }

    setModalForm({
      ...initialFormState,
      category: defaultCat,
      image: defaultImg,
      description: defaultDesc
    });
    setModalImagePreview(defaultImg);
  };

  const closeModal = () => {
    setActiveModalType(null);
    setModalForm(initialFormState);
    setModalImagePreview("");
    setIsSubmitting(false);
  };

  // Modal Image Upload Handler
  const handleModalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setModalImagePreview(base64);
        setModalForm((prev) => ({
          ...prev,
          image: base64,
          imageData: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Product to Context & Firebase
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!modalForm.name?.trim()) {
      showToast("Please enter a product name.", "error");
      return;
    }
    if (!modalForm.price || Number(modalForm.price) <= 0) {
      showToast("Please enter a valid price.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      const id = `rc-prod-${timestamp}`;

      let payload = {
        id,
        name: modalForm.name.trim(),
        price: Number(modalForm.price),
        image: modalForm.image || modalImagePreview || "/images/detail-hamper.jpg",
        imageData: modalForm.imageData || null,
        description: modalForm.description.trim(),
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(modalForm.stock || 25),
        featured: Boolean(modalForm.featured),
        createdAt: new Date().toISOString()
      };

      if (modalForm.originalPrice && Number(modalForm.originalPrice) > Number(modalForm.price)) {
        payload.originalPrice = Number(modalForm.originalPrice);
      }

      // 1. Shop Gifts Menu (Image 3)
      if (activeModalType === "shopGifts") {
        payload.category = modalForm.category;
        if (modalForm.category === "Customize Gifts") {
          payload.isCustomizable = true;
        }
      }
      // 2. By Recipient Menu (Image 1)
      else if (activeModalType === "byRecipient") {
        payload.category = modalForm.recipient;
        payload.recipients = [modalForm.recipient];
      }
      // 3. By Occasion Menu (Image 2)
      else if (activeModalType === "byOccasion") {
        payload.category = modalForm.occasion;
        payload.occasions = [modalForm.occasion];
      }
      // 4. Customize Gifts Menu
      else if (activeModalType === "customize") {
        payload.category = modalForm.category || "Customize Gifts";
        payload.isCustomizable = true;
        payload.customizationOptions = {
          hasRecipientName: Boolean(modalForm.hasRecipientName),
          hasCustomMessage: Boolean(modalForm.hasCustomMessage),
          hasPhotoUpload: Boolean(modalForm.hasPhotoUpload),
          colors: ["Royal Deep Burgundy", "Golden Mocha", "Rose Gold", "Ivory Cream"]
        };
      }
      // 5. Rent Menu
      else if (activeModalType === "rent") {
        payload.isRental = true;
        payload.category = "Rent";
        payload.rentalCategory = modalForm.rentalCategory;
        if (modalForm.rentalCategory === "Rangoli Plates") {
          payload.rangoliSubcategory = modalForm.rangoliSubcategory;
        }
        payload.rentalUnit = "/day";
        payload.securityDeposit = Number(modalForm.securityDeposit || 500);
        payload.rentalDuration = modalForm.rentalDuration || "1-3 days";
      }

      // Save via AppContext (syncs to LocalStorage, Cloud Firestore & Media Library)
      await addProduct(payload);

      // Automatically switch active page tab to the corresponding menu page to immediately preview newly added item
      if (activeModalType === "shopGifts" && selectedPageKey !== "shopGifts") {
        handleSelectPage("shopGifts");
      } else if (activeModalType === "byRecipient" && selectedPageKey !== "byRecipient") {
        handleSelectPage("byRecipient");
      } else if (activeModalType === "byOccasion" && selectedPageKey !== "byOccasion") {
        handleSelectPage("byOccasion");
      } else if (activeModalType === "customize" && selectedPageKey !== "customize") {
        handleSelectPage("customize");
      } else if (activeModalType === "rent" && selectedPageKey !== "rent") {
        handleSelectPage("rent");
      }

      closeModal();
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to save product. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Filter products for the currently selected menu page in Admin Panel
  const currentMenuProducts = useMemo(() => {
    if (selectedPageKey === "shopGifts" || selectedPageKey === "shop") {
      return products.filter((p) => !p.isRental && p.category !== "Rent");
    }
    if (selectedPageKey === "byRecipient") {
      return products.filter((p) => !p.isRental && p.recipients && p.recipients.length > 0);
    }
    if (selectedPageKey === "byOccasion") {
      return products.filter((p) => !p.isRental && p.occasions && p.occasions.length > 0);
    }
    if (selectedPageKey === "customize") {
      return products.filter((p) => !p.isRental && (p.isCustomizable || (p.category || "").toLowerCase().includes("custom")));
    }
    if (selectedPageKey === "rent") {
      return products.filter((p) => p.isRental || p.category === "Rent");
    }
    return products.slice(0, 8);
  }, [products, selectedPageKey]);

  // Contextual action button for the active page
  const getContextualAction = () => {
    switch (selectedPageKey) {
      case "shopGifts":
        return { label: "Add Shop Gifts", icon: Gift, type: "shopGifts" };
      case "byRecipient":
        return { label: "Add Recipient", icon: Users, type: "byRecipient" };
      case "byOccasion":
        return { label: "Add Occasion", icon: Calendar, type: "byOccasion" };
      case "customize":
        return { label: "Add Customize", icon: Palette, type: "customize" };
      case "rent":
        return { label: "Add Rent Product", icon: Package, type: "rent" };
      default:
        return null;
    }
  };

  const contextualAction = getContextualAction();

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

      {/* =========================================================
          DEDICATED MENU BUTTONS (Matching User Request)
          - Shop Gifts: Add Shop Gifts
          - By Recipient: Add Recipient
          - By Occasion: Add Occasion
          - Customize Gifts: Add Customize
          - Rent: Add Rent Product
         ========================================================= */}
      <div className="bg-gradient-to-r from-[#240B13] via-[#2A0E18] to-[#240B13] p-4 sm:p-5 rounded-2xl border border-[#4D1B28] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#3E1421]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#CD97A5]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FAF5EB]">
              Menu Catalog Actions (Add Dedicated Products)
            </h2>
          </div>
          <span className="text-[11px] text-[#CD97A5]/80">
            Click any button below to open its dedicated creation form
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">

          {/* 1. Shop Gifts: Add Shop Gifts */}
          <button
            type="button"
            onClick={() => openModal("shopGifts")}
            className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#1A070E] hover:bg-[#32111D] border border-[#4D1B28] hover:border-[#8E3E53] text-[#FAF5EB] text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3A101C] group-hover:bg-[#632736] flex items-center justify-center text-[#CD97A5] group-hover:text-white transition-colors">
                <Gift className="w-4 h-4" />
              </div>
              <span>Add Shop Gifts</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-[#CD97A5] group-hover:text-white transition-transform group-hover:rotate-90" />
          </button>

          {/* 2. By Recipient: Add Recipient */}
          <button
            type="button"
            onClick={() => openModal("byRecipient")}
            className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#1A070E] hover:bg-[#32111D] border border-[#4D1B28] hover:border-[#8E3E53] text-[#FAF5EB] text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3A101C] group-hover:bg-[#632736] flex items-center justify-center text-[#CD97A5] group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <span>Add Recipient</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-[#CD97A5] group-hover:text-white transition-transform group-hover:rotate-90" />
          </button>

          {/* 3. By Occasion: Add Occasion */}
          <button
            type="button"
            onClick={() => openModal("byOccasion")}
            className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#1A070E] hover:bg-[#32111D] border border-[#4D1B28] hover:border-[#8E3E53] text-[#FAF5EB] text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3A101C] group-hover:bg-[#632736] flex items-center justify-center text-[#CD97A5] group-hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Add Occasion</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-[#CD97A5] group-hover:text-white transition-transform group-hover:rotate-90" />
          </button>

          {/* 4. Customize Gifts: Add Customize */}
          <button
            type="button"
            onClick={() => openModal("customize")}
            className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#1A070E] hover:bg-[#32111D] border border-[#4D1B28] hover:border-[#8E3E53] text-[#FAF5EB] text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3A101C] group-hover:bg-[#632736] flex items-center justify-center text-[#CD97A5] group-hover:text-white transition-colors">
                <Palette className="w-4 h-4" />
              </div>
              <span>Add Customize</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-[#CD97A5] group-hover:text-white transition-transform group-hover:rotate-90" />
          </button>

          {/* 5. Rent: Add Rent Product */}
          <button
            type="button"
            onClick={() => openModal("rent")}
            className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#1A070E] hover:bg-[#32111D] border border-[#4D1B28] hover:border-[#8E3E53] text-[#FAF5EB] text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3A101C] group-hover:bg-[#632736] flex items-center justify-center text-[#CD97A5] group-hover:text-white transition-colors">
                <Package className="w-4 h-4" />
              </div>
              <span>Add Rent Product</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-[#CD97A5] group-hover:text-white transition-transform group-hover:rotate-90" />
          </button>

        </div>
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
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${isSelected
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3E1421]">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#FAF5EB]">
                Editing: {activePage.name}
              </h2>
              <span className="text-[11px] text-[#CD97A5] font-mono">
                Route path: {activePage.path}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Contextual Quick Add Button */}
              {contextualAction && (
                <button
                  type="button"
                  onClick={() => openModal(contextualAction.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#632736] hover:bg-[#7D2C42] border border-[#8E3E53] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <contextualAction.icon className="w-3.5 h-3.5" />
                  <span>{contextualAction.label}</span>
                </button>
              )}

              {/* Visibility Toggle Button */}
              <button
                type="button"
                onClick={handleToggleVisibility}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${formData.visible !== false
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-rose-950/60 border-rose-800 text-rose-300"
                  }`}
              >
                {formData.visible !== false ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-400" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <Link
                to={activePage.path || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-xl bg-[#1A070E] hover:bg-[#32111D] text-[#CD97A5] hover:text-white border border-[#3E1421] transition-colors"
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

            {/* Submenu Management (for pages that have submenus) */}
            {formData.submenus && (
              <div className="pt-2 border-t border-[#3E1421] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5] block">
                    Submenus & Dropdown Links ({formData.submenus.length})
                  </span>
                  <span className="text-[10px] text-[#A88B93]">Displayed in header dropdown</span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#4D1B28]">
                  {formData.submenus.map((sub, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 bg-[#1A070E] p-2 rounded-xl border border-[#3E1421]">
                      <input
                        type="text"
                        value={sub.label}
                        onChange={(e) => {
                          const updated = [...formData.submenus];
                          updated[sIdx].label = e.target.value;
                          setFormData((prev) => ({ ...prev, submenus: updated }));
                        }}
                        placeholder="Submenu Label"
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#240B13] text-white border border-[#4D1B28]"
                      />
                      <input
                        type="text"
                        value={sub.path}
                        onChange={(e) => {
                          const updated = [...formData.submenus];
                          updated[sIdx].path = e.target.value;
                          setFormData((prev) => ({ ...prev, submenus: updated }));
                        }}
                        placeholder="/path"
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#240B13] text-[#CD97A5] font-mono border border-[#4D1B28]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            submenus: prev.submenus.filter((_, i) => i !== sIdx)
                          }));
                        }}
                        className="p-1.5 text-[#CD97A5] hover:text-rose-400 cursor-pointer"
                        title="Delete submenu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Submenu */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    id="newSubLabel"
                    placeholder="New Submenu (e.g. Gift Boxes)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <input
                    type="text"
                    id="newSubPath"
                    placeholder="/path"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const lEl = document.getElementById("newSubLabel");
                      const pEl = document.getElementById("newSubPath");
                      if (lEl?.value?.trim() && pEl?.value?.trim()) {
                        setFormData((prev) => ({
                          ...prev,
                          submenus: [...(prev.submenus || []), { label: lEl.value.trim(), path: pEl.value.trim() }]
                        }));
                        lEl.value = "";
                        pEl.value = "";
                      }
                    }}
                    className="px-3 py-1.5 bg-[#4D1B28] hover:bg-[#632736] text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

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

        {/* Right: Live Image Preview & Page Directory (5 cols) */}
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
              <span className="font-bold text-[#E5DAC8] block">Live Cloud Synchronization</span>
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
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedPageKey === key
                        ? "bg-[#32111D] border-[#8E3E53] text-white"
                        : "bg-[#1A070E] border-[#3E1421] text-[#D4B8C1] hover:border-[#632736]"
                      }`}
                  >
                    <div>
                      <span className="font-bold block">{p.name || key}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.visible !== false ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
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

      {/* =========================================================
          LIVE PRODUCTS DISPLAY IN ADMIN PANEL (Matching User Request)
          "After saving, display the product and image in the Admin Panel
          and automatically show it in the correct category on the User Panel."
         ========================================================= */}
      <div id="adminMenuProductsCatalog" className="bg-[#240B13] rounded-3xl p-6 sm:p-7 border border-[#4D1B28] shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3E1421]">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#CD97A5]" />
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#FAF5EB]">
                Catalog Products in "{activePage.name || selectedPageKey}" ({currentMenuProducts.length})
              </h2>
            </div>
            <p className="text-xs text-[#D4B8C1] mt-0.5">
              Live products saved in Cloud Firestore & LocalStorage that display under this menu on the User Panel.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {contextualAction && (
              <button
                type="button"
                onClick={() => openModal(contextualAction.type)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#632736] hover:bg-[#7D2C42] border border-[#8E3E53] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{contextualAction.label}</span>
              </button>
            )}

            <Link
              to={activePage.path || "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1A070E] hover:bg-[#32111D] text-[#CD97A5] hover:text-white border border-[#4D1B28] text-xs font-semibold transition-colors"
            >
              <span>View On Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {currentMenuProducts.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#1A070E] border border-dashed border-[#4D1B28] space-y-3">
            <Package className="w-10 h-10 text-[#CD97A5]/50 mx-auto" />
            <h3 className="font-serif text-base text-[#FAF5EB]">
              No custom products added for this menu yet
            </h3>
            <p className="text-xs text-[#D4B8C1] max-w-md mx-auto">
              Click the button above to add a new product with image, category, price, and description.
            </p>
            {contextualAction && (
              <button
                type="button"
                onClick={() => openModal(contextualAction.type)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#632736] text-white text-xs font-bold rounded-xl border border-[#8E3E53] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{contextualAction.label}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentMenuProducts.map((prod) => {
              const isRentItem = prod.isRental || prod.category === "Rent";
              return (
                <div
                  key={prod.id}
                  className="bg-[#1A070E] rounded-2xl border border-[#3E1421] hover:border-[#632736] p-3 flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#240B13] border border-[#3E1421] mb-2.5">
                      <img
                        src={prod.image || prod.imageData || "/images/detail-hamper.jpg"}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/logo.png"; }}
                      />

                      {/* Badge / Category Tag */}
                      <span className="absolute top-2 left-2 bg-[#632736]/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {isRentItem
                          ? (prod.rangoliSubcategory || prod.rentalCategory || "Rent")
                          : (prod.recipients?.[0] || prod.occasions?.[0] || prod.category)}
                      </span>

                      {prod.isCustomizable && (
                        <span className="absolute bottom-2 left-2 bg-amber-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Customizable
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif font-bold text-xs text-[#FAF5EB] line-clamp-1 group-hover:text-[#CD97A5] transition-colors" title={prod.name}>
                      {prod.name}
                    </h3>

                    {/* Pricing Display */}
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-[#E5DAC8]">
                        ₹{prod.price?.toLocaleString("en-IN")}
                      </span>
                      {isRentItem && (
                        <span className="text-[10px] text-[#CD97A5] font-normal">
                          {prod.rentalUnit || "/day"}
                        </span>
                      )}
                      {prod.originalPrice && (
                        <span className="text-[10px] text-gray-500 line-through">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Rental Specific Details */}
                    {isRentItem && (
                      <div className="mt-1.5 p-1.5 rounded-lg bg-[#240B13] border border-[#3E1421] text-[10px] text-[#CD97A5] flex items-center justify-between">
                        <span>Deposit: ₹{prod.securityDeposit || 500}</span>
                        <span>•</span>
                        <span>{prod.rentalDuration || "1-3 days"}</span>
                      </div>
                    )}

                    {/* Description preview */}
                    <p className="text-[11px] text-[#D4B8C1]/80 line-clamp-2 mt-1.5">
                      {prod.description}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#3E1421]">
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live on User Panel</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${prod.name}" from catalog?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#CD97A5] hover:text-rose-400 hover:bg-[#3A101C] transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================
          DEDICATED MODAL CREATION FORM (For Each Menu)
         ========================================================= */}
      {activeModalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="bg-[#240B13] border border-[#4D1B28] rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#4D1B28]">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#3E1421]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3A101C] border border-[#632736] flex items-center justify-center text-[#CD97A5]">
                  {activeModalType === "shopGifts" && <Gift className="w-5 h-5 text-white" />}
                  {activeModalType === "byRecipient" && <Users className="w-5 h-5 text-white" />}
                  {activeModalType === "byOccasion" && <Calendar className="w-5 h-5 text-white" />}
                  {activeModalType === "customize" && <Palette className="w-5 h-5 text-white" />}
                  {activeModalType === "rent" && <Package className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-[#FAF5EB]">
                    {activeModalType === "shopGifts" && "Add Shop Gifts Product"}
                    {activeModalType === "byRecipient" && "Add Product By Recipient"}
                    {activeModalType === "byOccasion" && "Add Product By Occasion"}
                    {activeModalType === "customize" && "Add Customizable Gift"}
                    {activeModalType === "rent" && "Add Rental Product (Decor, Props & Rangoli)"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#D4B8C1]">
                    Fill in details below to publish live to Cloud Firestore & User Panel.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#1A070E] hover:bg-[#3A101C] border border-[#3E1421] text-[#CD97A5] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                {/* Left Fields Column (7 cols) */}
                <div className="md:col-span-7 space-y-3.5 text-left">

                  {/* Category Dropdown relevant to menu */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      {activeModalType === "byRecipient" && "Recipient Category"}
                      {activeModalType === "byOccasion" && "Occasion Category"}
                      {activeModalType === "rent" && "Rental Category"}
                      {activeModalType === "customize" && "Customizable Category"}
                      {activeModalType === "shopGifts" && "Shop Gifts Category"}
                    </label>

                    {/* 1. Shop Gifts Categories (Matching Reference Image 3) */}
                    {activeModalType === "shopGifts" && (
                      <select
                        value={modalForm.category}
                        onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                      >
                        <option value="Customize Gifts">Customize Gifts</option>
                        <option value="Wedding Gifts">Wedding Gifts</option>
                        <option value="Birthday Gifts">Birthday Gifts</option>
                        <option value="Mehendi Gifts">Mehendi Gifts</option>
                        <option value="Diwali Gifts">Diwali Gifts</option>
                        <option value="Rakshabandhan Gifts">Rakshabandhan Gifts</option>
                        <option value="Pooja Products">Pooja Products</option>
                      </select>
                    )}

                    {/* 2. By Recipient Categories (Matching Reference Image 1) */}
                    {activeModalType === "byRecipient" && (
                      <select
                        value={modalForm.recipient}
                        onChange={(e) => setModalForm((prev) => ({ ...prev, recipient: e.target.value, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                      >
                        <option value="Kids">Kids</option>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Couples">Couples</option>
                        <option value="Friends">Friends</option>
                        <option value="Parents">Parents</option>
                        <option value="Bride & Groom">Bride & Groom</option>
                      </select>
                    )}

                    {/* 3. By Occasion Categories (Matching Reference Image 2) */}
                    {activeModalType === "byOccasion" && (
                      <select
                        value={modalForm.occasion}
                        onChange={(e) => setModalForm((prev) => ({ ...prev, occasion: e.target.value, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                      >
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Haldi-Kumkum">Haldi-Kumkum</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Return Gifts">Return Gifts</option>
                      </select>
                    )}

                    {/* 4. Customize Gifts Categories */}
                    {activeModalType === "customize" && (
                      <select
                        value={modalForm.category}
                        onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                      >
                        <option value="Customize Gifts">Customize Gifts (General)</option>
                        <option value="Personalized Hampers">Personalized Hampers</option>
                        <option value="Custom Wooden Plaques">Custom Wooden Plaques</option>
                        <option value="Custom Ceramic Mugs">Custom Ceramic Mugs</option>
                        <option value="Photo Frames & Acrylics">Photo Frames & Acrylics</option>
                        <option value="Engraved Keepsakes">Engraved Keepsakes</option>
                        <option value="Custom Water Bottles & Flasks">Custom Water Bottles & Flasks</option>
                        <option value="Artisanal Floral Bouquets">Artisanal Floral Bouquets</option>
                      </select>
                    )}

                    {/* 5. Rent Categories */}
                    {activeModalType === "rent" && (
                      <div className="space-y-2.5">
                        <select
                          value={modalForm.rentalCategory}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, rentalCategory: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                        >
                          <option value="Decor Items">Decor Items</option>
                          <option value="Event Props">Event Props</option>
                          <option value="Photo Booths">Photo Booths</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Lighting">Lighting</option>
                          <option value="Rangoli Plates">Rangoli Plates (Subcategories Available)</option>
                        </select>

                        {/* Rangoli Subcategory Dropdown (if Rangoli Plates is selected) */}
                        {modalForm.rentalCategory === "Rangoli Plates" && (
                          <div className="p-3 rounded-xl bg-[#1A070E] border border-[#632736]/60 animate-fade-in">
                            <label className="block text-[11px] font-bold text-[#CD97A5] mb-1">
                              Rangoli Plates Subcategory:
                            </label>
                            <select
                              value={modalForm.rangoliSubcategory}
                              onChange={(e) => setModalForm((prev) => ({ ...prev, rangoliSubcategory: e.target.value }))}
                              className="w-full px-3 py-2 text-xs rounded-lg bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none cursor-pointer"
                            >
                              <option value="Ready-Made Rangoli Plates">Ready-Made Rangoli Plates (Pre-Crafted & Ready to Use)</option>
                              <option value="Pooja Rangoli Plates">Pooja Rangoli Plates (Devotional & Sacred Diya Urli)</option>
                              <option value="Wedding & Event Rangoli Plates">Wedding & Event Rangoli Plates (Royal Grand Celebration)</option>
                              <option value="Small & Large Rangoli Plates">Small & Large Rangoli Plates (8" to 14" Centerpieces)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.name}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={activeModalType === "rent" ? "e.g. Royal Brass Urli Pooja Rangoli Plate" : "e.g. Personalized Wooden Keepsake Frame"}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                    />
                  </div>

                  {/* Pricing Inputs */}
                  {activeModalType === "rent" ? (
                    // Rent Specific Rates: Rental Price per Day, Security Deposit, Rental Duration
                    <div className="p-3.5 rounded-2xl bg-[#1A070E] border border-[#4D1B28] space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#CD97A5]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Rental Rates & Terms</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#E5DAC8] mb-1">
                            Rent Price (₹/day)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={modalForm.price}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="e.g. 179"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#E5DAC8] mb-1">
                            Security Deposit (₹)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={modalForm.securityDeposit}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, securityDeposit: e.target.value }))}
                            placeholder="e.g. 500"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#E5DAC8] mb-1">
                            Rental Duration
                          </label>
                          <select
                            value={modalForm.rentalDuration}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, rentalDuration: e.target.value }))}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-[#240B13] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] cursor-pointer"
                          >
                            <option value="1 day">1 day</option>
                            <option value="1-3 days">1-3 days</option>
                            <option value="3 days">3 days</option>
                            <option value="1 week">1 week</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Shop Products Pricing
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={modalForm.price}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. 799"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                          Original / Strikethrough Price (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={modalForm.originalPrice}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                          placeholder="e.g. 999"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Upload / URL Input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Product Image (Upload File or Enter URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={modalForm.image}
                        onChange={(e) => {
                          setModalForm((prev) => ({ ...prev, image: e.target.value }));
                          setModalImagePreview(e.target.value);
                        }}
                        placeholder="/images/sample.jpg or https://..."
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
                      />
                      <label className="px-3.5 py-2.5 bg-[#3A101C] hover:bg-[#521D2C] border border-[#632736] text-[#E5DAC8] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#E5DAC8] mb-1.5">
                      Product Description
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={modalForm.description}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of features, materials, and contents..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53] leading-relaxed"
                    ></textarea>
                  </div>

                </div>

                {/* Right Preview Column (5 cols) */}
                <div className="md:col-span-5 bg-[#1A070E] p-4 sm:p-5 rounded-2xl border border-[#3E1421] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#3E1421]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#CD97A5]">
                        Live Card Preview
                      </span>
                      <span className="text-[10px] text-emerald-400">User Panel View</span>
                    </div>

                    {/* Preview Product Card */}
                    <div className="bg-white rounded-2xl p-3 border border-[#EFE5DB] text-left shadow-lg">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF5EB] mb-2.5">
                        {modalImagePreview ? (
                          <img
                            src={modalImagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "/logo.png"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                            <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                            <span>No image</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-[#632736] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {activeModalType === "rent"
                            ? (modalForm.rangoliSubcategory || modalForm.rentalCategory)
                            : activeModalType === "byRecipient"
                              ? modalForm.recipient
                              : activeModalType === "byOccasion"
                                ? modalForm.occasion
                                : modalForm.category}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-xs text-[#2E1820] line-clamp-1">
                        {modalForm.name || "Product Name"}
                      </h4>

                      <div className="flex items-baseline gap-1 mt-1 text-xs font-bold text-[#632736]">
                        <span>₹{Number(modalForm.price || 0).toLocaleString("en-IN")}</span>
                        {activeModalType === "rent" && (
                          <span className="text-[10px] text-gray-500 font-normal">/day</span>
                        )}
                        {modalForm.originalPrice && activeModalType !== "rent" && (
                          <span className="text-[10px] text-gray-400 line-through font-normal">
                            ₹{modalForm.originalPrice}
                          </span>
                        )}
                      </div>

                      {activeModalType === "rent" && (
                        <div className="mt-1.5 p-1 rounded-lg bg-[#FAF5EB] border border-[#EFE5DB] text-[9px] text-[#7A5B64] flex items-center justify-between">
                          <span>Deposit: ₹{modalForm.securityDeposit || 500}</span>
                          <span>•</span>
                          <span>{modalForm.rentalDuration || "1-3 days"}</span>
                        </div>
                      )}

                      <p className="mt-1 text-[10px] text-gray-500 line-clamp-2">
                        {modalForm.description || "Product description will appear here..."}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#F5ECE3] flex items-center gap-1.5">
                        <div className="flex-1 py-1.5 bg-[#632736] text-white text-[11px] font-bold rounded-lg text-center">
                          {activeModalType === "rent" ? "Rent Now" : "Add to Cart"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cloud Firebase Note */}
                  <div className="mt-4 p-2.5 rounded-xl bg-[#240B13] border border-[#4D1B28] text-[10px] text-[#CD97A5] space-y-1">
                    <span className="font-bold text-[#E5DAC8] block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Firebase & Cloud Storage</span>
                    </span>
                    <p className="leading-relaxed">
                      Saves directly to Cloud Firestore collection <span className="font-mono text-white">products</span> and browser cache for instant sync.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3E1421]">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-[#D4B8C1] hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btnSubmitModalProduct"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#632736] hover:bg-[#7D2C42] border border-[#8E3E53] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Publish & Save to Website</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
