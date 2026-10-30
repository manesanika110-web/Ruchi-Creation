import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Package,
  Heart,
  ShoppingCart,
  Star,
  ChevronDown,
  Filter,
  Check,
  FileText,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Wallet,
  Home,
  CheckCircle2,
  Minus,
  Plus,
  Send
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const RentProducts = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, animatingWishlistId, submitEnquiry, settings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const rentalCategories = [
    { id: "Decor Items", label: "Decor Items" },
    { id: "Event Props", label: "Event Props" },
    { id: "Photo Booths", label: "Photo Booths" },
    { id: "Furniture", label: "Furniture" },
    { id: "Lighting", label: "Lighting" },
    { id: "Rangoli Plates", label: "Rangoli Plates" }
  ];

  // 4 Subcategories for Rangoli Plates in English
  const rangoliSubcategories = [
    {
      id: "Ready-Made Rangoli Plates",
      label: "Ready-Made Rangoli Plates",
      subtitle: "Pre-Crafted & Ready to Use",
      image: "/images/rangoli-cat-readymade.jpg",
      badge: "Instant Decor",
      desc: "Pre-crafted festive pom-pom and gota-patti border rangoli plate for instant celebration decor."
    },
    {
      id: "Pooja Rangoli Plates",
      label: "Pooja Rangoli Plates",
      subtitle: "Devotional & Sacred Decor",
      image: "/images/rangoli-cat-pooja.jpg",
      badge: "Sacred Diya Urli",
      desc: "Traditional brass urli rangoli plate with oil lamps and floating petals for poojas and rituals."
    },
    {
      id: "Wedding & Event Rangoli Plates",
      label: "Wedding & Event Rangoli Plates",
      subtitle: "Grand Royal Celebrations",
      image: "/images/rangoli-cat-wedding.jpg",
      badge: "Grand Festive",
      desc: "Royal handcrafted mandala rangoli plate adorned with golden fringe tassels for weddings and gala events."
    },
    {
      id: "Small & Large Rangoli Plates",
      label: "Small & Large Rangoli Plates",
      subtitle: "Versatile Size Options",
      image: "/images/rangoli-cat-small-large.jpg",
      badge: "8\" to 14\" Sizes",
      desc: "Artistic mirror-work centerpiece rangoli plates available in compact to grand sizes (8 to 14 inches)."
    }
  ];

  // Reference catalog products for Rent
  const defaultRentalItems = [
    // --- Rangoli Plates (Hero Products from Uploaded Reference Images) ---
    {
      id: "rc-rent-rangoli-pom-pom-readymade",
      name: "Festive Pom-Pom & Gota Ready-Made Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Ready-Made Rangoli Plates",
      price: 179,
      rating: 5.0,
      reviewsCount: 54,
      image: "/images/rangoli-cat-readymade.jpg",
      rentalUnit: "/day",
      securityDeposit: 350,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-brass-urli-pooja",
      name: "Royal Brass Diya Urli Pooja Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Pooja Rangoli Plates",
      price: 229,
      rating: 4.9,
      reviewsCount: 62,
      image: "/images/rangoli-cat-pooja.jpg",
      rentalUnit: "/day",
      securityDeposit: 450,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-mandala-tassel-wedding",
      name: "Grand Mandala Tassel Wedding & Event Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Wedding & Event Rangoli Plates",
      price: 279,
      rating: 5.0,
      reviewsCount: 47,
      image: "/images/rangoli-cat-wedding.jpg",
      rentalUnit: "/day",
      securityDeposit: 550,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-mirror-marigold-small-large",
      name: "Mirror Work Centerpiece Rangoli Plate (Small & Large)",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Small & Large Rangoli Plates",
      price: 199,
      rating: 4.9,
      reviewsCount: 58,
      image: "/images/rangoli-cat-small-large.jpg",
      rentalUnit: "/day",
      securityDeposit: 400,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-ready-made-krishna",
      name: "Ready-Made Krishna Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Ready-Made Rangoli Plates",
      price: 149,
      rating: 4.9,
      reviewsCount: 48,
      image: "/images/rangoli-ready-made-krishna.jpg",
      rentalUnit: "/day",
      securityDeposit: 300,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-wedding-peacock",
      name: "Wedding Peacock Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Wedding & Event Rangoli Plates",
      price: 249,
      rating: 5.0,
      reviewsCount: 56,
      image: "/images/rangoli-wedding-peacock.jpg",
      rentalUnit: "/day",
      securityDeposit: 500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-pooja-krishna-lotus",
      name: "Pooja Lotus Krishna Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Pooja Rangoli Plates",
      price: 199,
      rating: 4.9,
      reviewsCount: 52,
      image: "/images/rangoli-pooja-krishna-lotus.jpg",
      rentalUnit: "/day",
      securityDeposit: 400,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-event-floral-wreath",
      name: "Pooja Rose Floral Wreath Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Pooja Rangoli Plates",
      price: 149,
      rating: 4.8,
      reviewsCount: 34,
      image: "/images/rangoli-event-floral-wreath.jpg",
      rentalUnit: "/day",
      securityDeposit: 300,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-wedding-krishna-swing",
      name: "Wedding Krishna Jhula Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Wedding & Event Rangoli Plates",
      price: 249,
      rating: 4.9,
      reviewsCount: 61,
      image: "/images/rangoli-wedding-krishna-swing.jpg",
      rentalUnit: "/day",
      securityDeposit: 500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-event-yellow-marigold",
      name: "Ready-Made Marigold Peacock Rangoli Plate",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Ready-Made Rangoli Plates",
      price: 189,
      rating: 4.9,
      reviewsCount: 41,
      image: "/images/rangoli-event-yellow-marigold.jpg",
      rentalUnit: "/day",
      securityDeposit: 350,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-small-makhan-chor",
      name: "Small Makhan Chor Rangoli Plate (8 inch)",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Small & Large Rangoli Plates",
      price: 99,
      rating: 4.8,
      reviewsCount: 39,
      image: "/images/rangoli-small-makhan-chor.jpg",
      rentalUnit: "/day",
      securityDeposit: 200,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-rangoli-large-krishna-portrait",
      name: "Large Krishna Portrait Rangoli Plate (14 inch)",
      category: "Rent",
      rentalCategory: "Rangoli Plates",
      rangoliSubcategory: "Small & Large Rangoli Plates",
      price: 299,
      rating: 5.0,
      reviewsCount: 67,
      image: "/images/rangoli-large-krishna-portrait.jpg",
      rentalUnit: "/day",
      securityDeposit: 600,
      rentalDuration: "1-3 days"
    },

    // --- Other Rental Event Catalog Items ---
    {
      id: "rc-rent-wedding-mandap",
      name: "Wedding Mandap",
      category: "Rent",
      rentalCategory: "Decor Items",
      price: 2999,
      rating: 4.9,
      reviewsCount: 42,
      image: "/images/wedding-mandap.jpg",
      rentalUnit: "/day",
      securityDeposit: 5000,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-decorative-lanterns",
      name: "Decorative Lanterns",
      category: "Rent",
      rentalCategory: "Lighting",
      price: 499,
      rating: 4.7,
      reviewsCount: 38,
      image: "/images/decorative-lanterns.jpg",
      rentalUnit: "/day",
      securityDeposit: 500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-photo-booth-setup",
      name: "Photo Booth Setup",
      category: "Rent",
      rentalCategory: "Photo Booths",
      price: 1999,
      rating: 4.8,
      reviewsCount: 35,
      image: "/images/photo-booth-setup.jpg",
      rentalUnit: "/day",
      securityDeposit: 2500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-pooja-decoration",
      name: "Pooja Decoration",
      category: "Rent",
      rentalCategory: "Decor Items",
      price: 1299,
      rating: 4.9,
      reviewsCount: 46,
      image: "/images/pooja-decoration.jpg",
      rentalUnit: "/day",
      securityDeposit: 1500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-event-chairs",
      name: "Event Chairs",
      category: "Rent",
      rentalCategory: "Furniture",
      price: 99,
      rating: 4.7,
      reviewsCount: 28,
      image: "/images/event-chairs.jpg",
      rentalUnit: "/day",
      securityDeposit: 200,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-flower-vases",
      name: "Flower Vases",
      category: "Rent",
      rentalCategory: "Event Props",
      price: 399,
      rating: 4.8,
      reviewsCount: 33,
      image: "/images/flower-vases.jpg",
      rentalUnit: "/day",
      securityDeposit: 400,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-haldi-setup",
      name: "Haldi Setup",
      category: "Rent",
      rentalCategory: "Event Props",
      price: 1499,
      rating: 4.9,
      reviewsCount: 44,
      image: "/images/haldi-setup.jpg",
      rentalUnit: "/day",
      securityDeposit: 2500,
      rentalDuration: "1-3 days"
    },
    {
      id: "rc-rent-serving-cutlery",
      name: "Serving Cutlery",
      category: "Rent",
      rentalCategory: "Decor Items",
      price: 699,
      rating: 4.7,
      reviewsCount: 25,
      image: "/images/serving-cutlery.jpg",
      rentalUnit: "/day",
      securityDeposit: 1500,
      rentalDuration: "1-3 days"
    }
  ];

  // URL query param synchronization
  const initialCategory = searchParams.get("category") || "All";
  const initialSubcategory = searchParams.get("subcategory") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItemMap, setAddedItemMap] = useState({});
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Rent Enquiry Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: "",
    mobileNumber: "",
    quantity: 1,
    emailAddress: "",
    selectedItems: ["Gift Hamper", "Decoration Props"],
    rentDuration: "1 day",
    eventDate: "2024-09-12",
    returnDate: "2024-09-20",
    city: "Ichalkaranji",
    pincode: "416115",
    budgetRange: "₹5,000 – ₹15,000",
    deliveryAddress: ""
  });

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSubcategory = searchParams.get("subcategory");
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("All");
    }
    if (urlSubcategory) {
      setSelectedSubcategory(urlSubcategory);
    } else {
      setSelectedSubcategory("All");
    }
    setCurrentPage(1);
  }, [searchParams]);

  const handleCategoryClick = (catId) => {
    const nextCategory = selectedCategory === catId ? "All" : catId;
    setSelectedCategory(nextCategory);
    setSelectedSubcategory("All");
    setCurrentPage(1);
    if (nextCategory !== "Rangoli Plates") {
      setMobileCategoryOpen(false); // Close dropdown immediately unless expanding Rangoli subcategories
    }

    const newParams = new URLSearchParams(searchParams);
    if (nextCategory === "All") {
      newParams.delete("category");
      newParams.delete("subcategory");
    } else {
      newParams.set("category", nextCategory);
      newParams.delete("subcategory");
    }
    setSearchParams(newParams);
  };

  const handleSubcategoryClick = (subId) => {
    const nextSub = selectedSubcategory === subId ? "All" : subId;
    setSelectedSubcategory(nextSub);
    setCurrentPage(1);
    setMobileCategoryOpen(false); // Automatically closes mobile dropdown!

    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", "Rangoli Plates");
    if (nextSub === "All") {
      newParams.delete("subcategory");
    } else {
      newParams.set("subcategory", nextSub);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (prod, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, {}, 1, e);
    setAddedItemMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  // Open Rent Enquiry Form with pre-selected item
  const openRentModal = (product = null) => {
    if (product) {
      setEnquiryForm((prev) => {
        let matchedCategory = "Decoration Props";
        if (product.rentalCategory === "Rangoli Plates" || product.name.toLowerCase().includes("rangoli")) {
          matchedCategory = "Rangoli Plates";
        } else if (product.name.toLowerCase().includes("mandap") || product.name.toLowerCase().includes("wedding")) {
          matchedCategory = "Wedding Decor";
        } else if (product.name.toLowerCase().includes("haldi") || product.name.toLowerCase().includes("baby")) {
          matchedCategory = "Baby Shower Decor";
        } else if (product.name.toLowerCase().includes("chair") || product.name.toLowerCase().includes("furniture")) {
          matchedCategory = "Decoration Props";
        }
        const updatedSelected = Array.from(new Set([...prev.selectedItems, matchedCategory]));
        return {
          ...prev,
          selectedItems: updatedSelected,
          deliveryAddress: prev.deliveryAddress
            ? prev.deliveryAddress
            : `Enquiring for rental of: ${product.name} (Rent: ₹${product.price}/day, Security Deposit: ₹${product.securityDeposit || 300}, Duration: ${product.rentalDuration || "1-3 days"}). `
        };
      });
    }
    setFormSubmitted(false);
    setIsEnquiryModalOpen(true);
  };

  const handleCheckboxToggle = (itemLabel) => {
    setEnquiryForm((prev) => {
      const exists = prev.selectedItems.includes(itemLabel);
      if (exists) {
        return { ...prev, selectedItems: prev.selectedItems.filter((i) => i !== itemLabel) };
      } else {
        return { ...prev, selectedItems: [...prev.selectedItems, itemLabel] };
      }
    });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!enquiryForm.mobileNumber.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    if (submitEnquiry) {
      submitEnquiry({
        name: enquiryForm.fullName,
        phone: enquiryForm.mobileNumber,
        email: enquiryForm.emailAddress,
        occasion: `Rent Enquiry (${enquiryForm.rentDuration})`,
        message: `Rent Enquiry for: ${enquiryForm.selectedItems.join(", ")}. Quantity: ${enquiryForm.quantity}. Duration: ${enquiryForm.rentDuration}. Event Date: ${enquiryForm.eventDate} to Return Date: ${enquiryForm.returnDate}. Location: ${enquiryForm.city} (${enquiryForm.pincode}). Budget: ${enquiryForm.budgetRange}. Address/Details: ${enquiryForm.deliveryAddress}`
      });
    }

    setFormSubmitted(true);
  };

  // Combine items from store context (if any) or fallback to reference defaults
  const rentalItemsPool = useMemo(() => {
    const defaultIds = new Set(defaultRentalItems.map((d) => d.id));
    const contextRentalItems = products.filter((p) => p.isRental || p.category === "Rent");
    if (contextRentalItems.length > 0) {
      const customItems = contextRentalItems.filter((p) => !defaultIds.has(p.id));
      const map = new Map();
      defaultRentalItems.forEach((item) => map.set(item.id, item));
      contextRentalItems.forEach((item) => {
        if (map.has(item.id)) {
          map.set(item.id, { ...map.get(item.id), ...item });
        }
      });
      return [...customItems, ...Array.from(map.values())];
    }
    return defaultRentalItems;
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return rentalItemsPool
      .filter((p) => {
        // 1. Category Filter
        if (selectedCategory !== "All") {
          if (p.rentalCategory) {
            if (p.rentalCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
              return false;
            }
          } else {
            const text = `${p.name} ${p.description || ""}`.toLowerCase();
            switch (selectedCategory) {
              case "Decor Items":
                if (!/mandap|pooja|cutlery|decor/i.test(text)) return false;
                break;
              case "Event Props":
                if (!/vase|flower|haldi|prop/i.test(text)) return false;
                break;
              case "Photo Booths":
                if (!/booth|backdrop|arch/i.test(text)) return false;
                break;
              case "Furniture":
                if (!/chair|stool|table|seating/i.test(text)) return false;
                break;
              case "Lighting":
                if (!/lantern|light|lamp|candle/i.test(text)) return false;
                break;
              case "Rangoli Plates":
                if (!/rangoli|plate/i.test(text)) return false;
                break;
              default:
                break;
            }
          }
        }

        // 2. Subcategory Filter for Rangoli Plates
        if (selectedCategory === "Rangoli Plates" && selectedSubcategory !== "All") {
          if (p.rangoliSubcategory) {
            return p.rangoliSubcategory.toLowerCase() === selectedSubcategory.toLowerCase();
          }
          const text = `${p.name} ${p.description || ""}`.toLowerCase();
          if (selectedSubcategory === "Ready-Made Rangoli Plates") {
            return /ready-made|krishna|marigold|pom-pom|gota/i.test(text);
          }
          if (selectedSubcategory === "Pooja Rangoli Plates") {
            return /pooja|lotus|floral wreath|wreath|urli|diya/i.test(text);
          }
          if (selectedSubcategory === "Wedding & Event Rangoli Plates") {
            return /wedding|event|swing|jhula|peacock|mandala|tassel/i.test(text);
          }
          if (selectedSubcategory === "Small & Large Rangoli Plates") {
            return /small|large|inch|makhan|mirror|centerpiece/i.test(text);
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        // Newly created custom admin products appear first at the top
        const refOrder = [
          "rc-rent-rangoli-pom-pom-readymade",
          "rc-rent-rangoli-brass-urli-pooja",
          "rc-rent-rangoli-mandala-tassel-wedding",
          "rc-rent-rangoli-mirror-marigold-small-large",
          "rc-rent-rangoli-ready-made-krishna",
          "rc-rent-rangoli-wedding-peacock",
          "rc-rent-rangoli-pooja-krishna-lotus",
          "rc-rent-rangoli-event-floral-wreath",
          "rc-rent-rangoli-wedding-krishna-swing",
          "rc-rent-rangoli-event-yellow-marigold",
          "rc-rent-rangoli-small-makhan-chor",
          "rc-rent-rangoli-large-krishna-portrait",
          "rc-rent-wedding-mandap",
          "rc-rent-decorative-lanterns",
          "rc-rent-photo-booth-setup",
          "rc-rent-pooja-decoration",
          "rc-rent-event-chairs",
          "rc-rent-flower-vases",
          "rc-rent-haldi-setup",
          "rc-rent-serving-cutlery"
        ];
        const isCustomA = !refOrder.includes(a.id);
        const isCustomB = !refOrder.includes(b.id);
        if (isCustomA && !isCustomB) return -1;
        if (!isCustomA && isCustomB) return 1;

        const idxA = refOrder.indexOf(a.id);
        const idxB = refOrder.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [rentalItemsPool, selectedCategory, selectedSubcategory, sortBy]);

  // Pagination (8 items per page = 2 rows of 4)
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Count of Rangoli Plates available
  const rangoliPlatesCount = useMemo(() => {
    return rentalItemsPool.filter(
      (p) => p.rentalCategory === "Rangoli Plates" || p.name.toLowerCase().includes("rangoli")
    ).length;
  }, [rentalItemsPool]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3B1822] pt-24 sm:pt-28 pb-16 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">

        {/* =========================================================
            MAIN UNIFIED CARD CONTAINER (Matching Reference Image)
           ========================================================= */}
        <div className="bg-white rounded-[26px] border border-[#EFE5DB] shadow-[0_4px_24px_rgba(99,39,54,0.04)] p-5 sm:p-7 md:p-9">

          {/* Header Row: Left (Icon + Title/Subtitle) | Right: Rent Enquiry Form Button + Sort by (No Home > Rent breadcrumb) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#F5ECE3]">
            {/* Left Header */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FDEEF0] border border-[#F6D8DE] flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-[#632736]" />
              </div>
              <div className="text-left">
                <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#5F2432] leading-tight">
                  Rent
                </h1>
                <p className="text-xs sm:text-[13px] text-[#8C6D75] font-medium mt-0.5">
                  For your special events
                </p>
              </div>
            </div>

            {/* Right Header: Rent Enquiry Form Button (Beside Sort by) + Sort by */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap self-start sm:self-auto">
              <button
                type="button"
                onClick={() => openRentModal(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#632736] hover:bg-[#4E1C28] text-white text-xs sm:text-[13px] font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="Open Rent Enquiry Form"
              >
                <FileText className="w-4 h-4 text-[#FDEEF0]" />
                <span>Rent Enquiry Form</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <span className="text-[#8C6D75]">Sort by:</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-5 text-xs font-medium text-[#3B1822] cursor-pointer focus:outline-none hover:text-[#632736]"
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Content: Sidebar (Left) + Product Cards Grid (Right) */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-7 items-start">

            {/* =========================================================
                MOBILE CATEGORY DROPDOWN (Shown on screens < lg)
                - Automatically closes when user selects a category/subcategory
               ========================================================= */}
            <div className="lg:hidden w-full bg-[#FBF1F3] rounded-2xl p-3 border border-[#F3DEE3] text-left">
              <button
                type="button"
                onClick={() => setMobileCategoryOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#F3DEE3] text-[#3B1822] text-xs sm:text-sm font-bold shadow-2xs transition-colors hover:bg-gray-50 cursor-pointer"
                aria-label="Toggle Rental Category Filter Menu"
              >
                <div className="flex items-center gap-2 truncate">
                  <Package className="w-4 h-4 text-[#632736] shrink-0" />
                  <span className="text-gray-500 font-normal">Category:</span>
                  <span className="text-[#632736] truncate">
                    {selectedCategory === "All"
                      ? "All Rental Items"
                      : selectedCategory === "Rangoli Plates" && selectedSubcategory !== "All"
                        ? `${selectedCategory} (${selectedSubcategory.replace(" Rangoli Plates", "")})`
                        : selectedCategory}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#632736] transition-transform duration-200 ${mobileCategoryOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Collapsible Mobile Dropdown Body */}
              {mobileCategoryOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-[#F3DEE3] space-y-1 animate-fadeIn">
                  {/* All Rental Items Option */}
                  <button
                    type="button"
                    onClick={() => {
                      handleCategoryClick("All");
                      setMobileCategoryOpen(false); // Automatically closes dropdown!
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${selectedCategory === "All"
                        ? "bg-[#632736] text-white shadow-xs"
                        : "text-[#613340] hover:bg-[#F7DEE4]/70"
                      }`}
                  >
                    <span>All Rental Items</span>
                    {selectedCategory === "All" && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Rental Categories */}
                  {rentalCategories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const isRangoli = cat.id === "Rangoli Plates";
                    return (
                      <div key={cat.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleCategoryClick(cat.id);
                            if (!isRangoli) {
                              setMobileCategoryOpen(false); // Automatically closes dropdown!
                            }
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${isActive
                              ? "bg-[#632736] text-white font-bold shadow-xs"
                              : "text-[#613340] hover:text-[#632736] hover:bg-[#F7DEE4]/70 font-medium"
                            }`}
                        >
                          <span>{cat.label}</span>
                          <div className="flex items-center gap-1.5">
                            {isRangoli && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive
                                    ? "bg-white/20 text-white font-semibold"
                                    : "bg-[#F3DEE3] text-[#632736] font-bold"
                                  }`}
                              >
                                New
                              </span>
                            )}
                            {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </button>

                        {/* Rangoli Subcategories on mobile */}
                        {isRangoli && isActive && (
                          <div className="pl-3 py-1 space-y-1 border-l-2 border-[#632736]/25 ml-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleSubcategoryClick("All");
                                setMobileCategoryOpen(false); // Automatically closes dropdown!
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${selectedSubcategory === "All"
                                  ? "font-bold text-[#632736] bg-[#F7DEE4]"
                                  : "text-gray-600 hover:text-[#632736]"
                                }`}
                            >
                              • All Designs ({rangoliPlatesCount})
                            </button>
                            {rangoliSubcategories.map((sub) => {
                              const isSubActive = selectedSubcategory === sub.id;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    handleSubcategoryClick(sub.id);
                                    setMobileCategoryOpen(false); // Automatically closes dropdown!
                                  }}
                                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${isSubActive
                                      ? "font-bold text-[#632736] bg-[#F7DEE4]"
                                      : "text-gray-600 hover:text-[#632736]"
                                    }`}
                                >
                                  • {sub.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Category Sidebar (Hidden on mobile < lg, Fixed on Scroll via lg:sticky lg:top-24 self-start) */}
            <aside className="hidden lg:block w-48 xl:w-52 shrink-0 lg:sticky lg:top-24 self-start bg-[#FBF1F3] rounded-2xl p-3 border border-[#F3DEE3]/70 z-20">
              <div className="flex flex-col gap-1">
                {rentalCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const isRangoli = cat.id === "Rangoli Plates";
                  return (
                    <div key={cat.id} className="w-full">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer flex items-center justify-between ${isActive
                          ? "bg-[#632736] text-white font-bold shadow-xs"
                          : "text-[#613340] hover:text-[#632736] hover:bg-[#F7DEE4]/70 font-medium"
                          }`}
                      >
                        <span>{cat.label}</span>
                        {isRangoli && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive
                              ? "bg-white/20 text-white font-semibold"
                              : "bg-[#F3DEE3] text-[#632736] font-bold"
                              }`}
                          >
                            New
                          </span>
                        )}
                      </button>

                      {/* Subcategories list in sidebar when Rangoli Plates is active */}
                      {isRangoli && isActive && (
                        <div className="mt-1 ml-2 pl-2.5 border-l-2 border-[#632736]/25 space-y-1 animate-fadeIn py-1">
                          <button
                            type="button"
                            onClick={() => handleSubcategoryClick("All")}
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors cursor-pointer ${selectedSubcategory === "All"
                              ? "font-bold text-[#632736] bg-[#F7DEE4]"
                              : "text-gray-600 hover:text-[#632736] hover:bg-[#F7DEE4]/40"
                              }`}
                          >
                            • All Designs ({rangoliPlatesCount})
                          </button>
                          {rangoliSubcategories.map((sub) => {
                            const isSubActive = selectedSubcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleSubcategoryClick(sub.id)}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors cursor-pointer leading-tight ${isSubActive
                                  ? "font-bold text-[#632736] bg-[#F7DEE4]"
                                  : "text-gray-600 hover:text-[#632736] hover:bg-[#F7DEE4]/40"
                                  }`}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Product Cards Grid & Subcategory Image Cards Container */}
            <main className="flex-1 w-full">

              {/* ========================================================
                  RANGOLI PLATES CATEGORY CARD WITH 4 SUBCATEGORIES (In English)
                 ======================================================== */}
              {(selectedCategory === "Rangoli Plates" || selectedCategory === "All") && (
                <div className="mb-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#F7EDE2] border border-[#ECD9CC] shadow-xs animate-fadeIn">
                  {/* Category Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EAD7CA]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#632736]/10 text-[#632736] text-[11px] font-bold mb-1.5">
                        <span>✨ Exclusive Rental Collection</span>
                        <span>•</span>
                        <span>Rangoli Plates on Rent</span>
                      </div>
                      <h2 className="font-serif italic font-bold text-lg sm:text-xl text-[#4A1924]">
                        Rangoli Plates Collection
                      </h2>
                      <p className="text-xs sm:text-[13px] text-[#7A545F] mt-0.5">
                        Designer handcrafted rangoli plates available for rent on festivals, poojas, weddings, and special celebrations. Select a category below to explore designs:
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      {selectedCategory === "Rangoli Plates" && selectedSubcategory !== "All" && (
                        <button
                          type="button"
                          onClick={() => handleSubcategoryClick("All")}
                          className="text-xs text-[#632736] font-bold hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#ECD9CC] shadow-2xs hover:bg-[#FAF5EB]"
                        >
                          ← View All Rangoli Plates ({rangoliPlatesCount})
                        </button>
                      )}
                      {selectedCategory === "Rangoli Plates" && (
                        <button
                          type="button"
                          onClick={() => handleCategoryClick("All")}
                          className="text-xs text-[#8C6D75] hover:text-[#632736] font-medium hover:underline cursor-pointer"
                        >
                          View All Rental Items
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Interactive Category Cards with Provided Images and English Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                    {rangoliSubcategories.map((sub) => {
                      const isSubActive = selectedCategory === "Rangoli Plates" && selectedSubcategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubcategoryClick(sub.id)}
                          className={`group text-left flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${isSubActive
                            ? "bg-white border-[#632736] shadow-md ring-2 ring-[#632736]/25 -translate-y-0.5"
                            : "bg-white/90 hover:bg-white border-[#EAD8CC] hover:border-[#C98B9B] hover:shadow-md hover:-translate-y-0.5"
                            }`}
                        >
                          <div>
                            {/* Product Card Image Container */}
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#FAF5EB] border border-[#EFE5DB] shadow-2xs">
                              <img
                                src={sub.image}
                                alt={sub.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <span className="absolute top-2 right-2 bg-[#632736]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                {sub.badge}
                              </span>
                              {isSubActive && (
                                <span className="absolute bottom-2 left-2 bg-[#1B5E20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                  ✓ Selected
                                </span>
                              )}
                            </div>

                            {/* Category Name & Subtitle */}
                            <h3 className={`font-serif font-bold text-sm sm:text-[14px] leading-snug transition-colors line-clamp-1 ${isSubActive ? "text-[#632736]" : "text-[#2E1820] group-hover:text-[#632736]"
                              }`}>
                              {sub.label}
                            </h3>
                            <h4 className="font-serif text-xs font-semibold text-[#8C4656] mt-0.5">
                              {sub.subtitle}
                            </h4>

                            {/* English Description */}
                            <p className="mt-2 text-[11px] sm:text-xs text-[#6F4A54] leading-relaxed bg-[#FAF5EB]/80 p-2.5 rounded-xl border border-[#F0E2D6] min-h-[64px] flex items-center">
                              {sub.desc}
                            </p>
                          </div>

                          {/* Bottom Action Pill */}
                          <div className="mt-3 pt-2.5 border-t border-[#F1E4DA] flex items-center justify-between">
                            <span className={`text-[11px] font-bold ${isSubActive ? "text-[#632736]" : "text-[#8C4656] group-hover:text-[#632736]"
                              }`}>
                              {isSubActive ? "Showing Designs ●" : "View Designs →"}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${isSubActive ? "bg-[#632736] text-white" : "bg-[#FBF1F3] text-[#7A545F]"
                              }`}>
                              Rent Now
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Cards Grid */}
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {currentProducts.map((prod) => {
                    const isWish = isInWishlist(prod.id);
                    const isPopping = animatingWishlistId === prod.id;
                    const isAdded = addedItemMap[prod.id];

                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-[#EDE2D7] hover:border-[#CD97A5]/70 p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-300 text-left group"
                      >
                        {/* Top: Image, Subcategory tag, Title, Rating, Price, Deposit & Duration */}
                        <div>
                          {/* Product Image */}
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF5EB]/50 flex items-center justify-center mb-2.5">
                            <Link
                              to={`/product/${prod.id}`}
                              className="w-full h-full flex items-center justify-center"
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                loading="lazy"
                                onError={(e) => {
                                  if (prod.imageData && e.target.src !== prod.imageData) {
                                    e.target.src = prod.imageData;
                                  } else {
                                    e.target.src = "/logo.png";
                                  }
                                }}
                              />
                            </Link>

                            {/* Subcategory Tag Pill */}
                            {prod.rangoliSubcategory && (
                              <span className="absolute top-2 left-2 bg-[#632736]/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs pointer-events-none">
                                {prod.rangoliSubcategory.replace(" Rangoli Plates", "")}
                              </span>
                            )}
                          </div>

                          {/* Product Title */}
                          <h3 className="font-serif font-bold text-xs sm:text-[13px] text-[#2E1820] line-clamp-1 group-hover:text-[#632736] transition-colors">
                            <Link to={`/product/${prod.id}`} title={prod.name}>
                              {prod.name}
                            </Link>
                          </h3>

                          {/* Star Rating & Review Count */}
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold my-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{prod.rating || "4.9"}</span>
                            <span className="text-gray-400 font-normal">
                              ({prod.reviewsCount || 42})
                            </span>
                          </div>

                          {/* Price in INR + /day */}
                          <div className="flex items-baseline gap-1 text-xs sm:text-sm font-bold text-[#632736] mt-0.5">
                            <span>₹{prod.price.toLocaleString("en-IN")}</span>
                            <span className="text-[11px] text-gray-500 font-normal">
                              {prod.rentalUnit || "/day"}
                            </span>
                          </div>

                          {/* Security Deposit & Rental Duration Badges (Requested by User) */}
                          <div className="flex items-center justify-between text-[10px] text-[#7A5B64] mt-1.5 mb-2 font-medium bg-[#FBF1F3]/80 px-2 py-1 rounded-lg border border-[#F3DEE3]">
                            <span className="truncate font-semibold">
                              Deposit: ₹{prod.securityDeposit || (prod.price > 1000 ? 2000 : 300)}
                            </span>
                            <span className="text-[#A5828C]">•</span>
                            <span className="truncate">
                              {prod.rentalDuration || "1-3 days"}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Action Row:
                            1. Functional "Rent Now" Button
                            2. Cart Icon Only Button
                            3. Heart Wishlist Button */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F5ECE3] mt-auto">
                          {/* 1. Functional "Rent Now" Button */}
                          <button
                            type="button"
                            onClick={() => openRentModal(prod)}
                            className="flex-1 py-1.5 px-3 bg-[#632736] hover:bg-[#4E1C28] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer text-center"
                            title={`Rent Now - ${prod.name}`}
                          >
                            <span>Rent Now</span>
                          </button>

                          {/* 2. Cart Icon Only Button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(prod, e)}
                            className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 ${isAdded
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : "bg-[#FAF5EB] hover:bg-[#F3DEE4] text-[#632736] border-[#CD97A5]/50"
                              }`}
                            title="Add to Cart"
                            aria-label="Add to Cart"
                          >
                            {isAdded ? (
                              <Check className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* 3. Heart Wishlist Button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod.id)}
                            className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${isPopping ? "animate-heart-pop" : ""
                              } ${isWish
                                ? "bg-[#632736] text-white border-[#632736]"
                                : "bg-white text-gray-500 hover:text-[#632736] border-[#D8B4BE] hover:bg-[#FAF5EB]"
                              }`}
                            title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWish ? "fill-white" : ""}`} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#FAF5EB]/50 rounded-2xl border border-[#EDE2D7] p-12 text-center space-y-3">
                  <p className="font-serif italic text-base text-gray-600">
                    No rental products found for this category.
                  </p>
                  <button
                    onClick={() => handleCategoryClick("All")}
                    className="px-4 py-2 bg-[#632736] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    View All Rental Items
                  </button>
                </div>
              )}
            </main>

          </div>

          {/* Pagination Row at Bottom */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs transition-colors ${currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-[#FAF5EB] cursor-pointer"
                }`}
              aria-label="Previous Page"
            >
              &lt;
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${currentPage === pageNum
                  ? "bg-[#632736] text-white font-bold shadow-xs"
                  : "text-gray-600 hover:bg-[#FBF1F3]"
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs transition-colors ${currentPage >= totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-[#FAF5EB] cursor-pointer"
                }`}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================
          RENT ENQUIRY FORM MODAL (Exact Match to Reference Image 1)
         ========================================================= */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2.5 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF6F0] rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-[#CD97A5]/50 shadow-2xl overflow-hidden relative my-auto animate-scaleUp max-h-[92vh] flex flex-col">

            {/* Modal Burgundy Top Header Bar (Matching Image 1) */}
            <div className="bg-[#632736] px-4 sm:px-7 py-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="font-serif italic font-bold text-base sm:text-xl tracking-wide">
                  Ruchi Creation
                </span>
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDEEF0]" />
                <span className="text-[11px] sm:text-xs text-[#E8CCD5] font-medium hidden sm:inline">
                  Gift • Decor • Celebrations
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close Enquiry Form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-7 space-y-4 sm:space-y-5 overflow-y-auto">

              {/* Form Title & Subtitle */}
              <div className="text-center space-y-1">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5F2432]">
                  Rent Enquiry Form
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Fill out the details below and our team will get back to you shortly
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif font-bold text-xl text-emerald-900">
                    Rent Enquiry Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{enquiryForm.fullName}</strong>. We have received your rental request for <strong>{enquiryForm.selectedItems.join(", ")}</strong>. Our event team will contact you within 24 hours.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEnquiryModalOpen(false)}
                      className="px-5 py-2 bg-[#632736] text-white text-xs font-semibold rounded-xl hover:bg-[#4E1C28] cursor-pointer"
                    >
                      Close Window
                    </button>
                    <a
                      href={`https://wa.me/${settings?.whatsapp || "919511112616"}?text=${encodeURIComponent(
                        `Hello Ruchi Creation! I just submitted a Rent Enquiry for: ${enquiryForm.selectedItems.join(", ")} (Dates: ${enquiryForm.eventDate} to ${enquiryForm.returnDate}). Name: ${enquiryForm.fullName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#1EBE5D] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Connect on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">

                  {/* Row 1: Full Name, Mobile Number, Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">

                    {/* Full Name (5 cols) */}
                    <div className="sm:col-span-5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#3B1822] mb-1">
                        <User className="w-3.5 h-3.5 text-[#632736]" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={enquiryForm.fullName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:border-[#632736] shadow-2xs"
                      />
                    </div>

                    {/* Mobile Number (4 cols) */}
                    <div className="sm:col-span-4">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#3B1822] mb-1">
                        <Phone className="w-3.5 h-3.5 text-[#632736]" />
                        <span>Mobile Number</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={enquiryForm.mobileNumber}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, mobileNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:border-[#632736] shadow-2xs"
                      />
                    </div>

                    {/* Quantity (3 cols) */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-[#3B1822] mb-1 text-center sm:text-left">
                        Quantity
                      </label>
                      <div className="flex items-center justify-between sm:justify-start gap-1.5 h-8">
                        <button
                          type="button"
                          onClick={() => setEnquiryForm((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                          className="w-7 h-7 rounded-full bg-[#632736] text-white flex items-center justify-center hover:bg-[#4E1C28] cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-9 h-7 bg-white rounded-lg border border-[#CD97A5]/60 flex items-center justify-center text-xs font-bold text-[#3B1822]">
                          {enquiryForm.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEnquiryForm((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                          className="w-7 h-7 rounded-full bg-[#632736] text-white flex items-center justify-center hover:bg-[#4E1C28] cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Row 2: Email Address & What do you want to rent */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">

                    {/* Email Address (5 cols) */}
                    <div className="sm:col-span-5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#3B1822] mb-1">
                        <Mail className="w-3.5 h-3.5 text-[#632736]" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={enquiryForm.emailAddress}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, emailAddress: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#CD97A5]/60 focus:outline-none focus:border-[#632736] shadow-2xs"
                      />
                    </div>

                    {/* What do you want to rent (7 cols) */}
                    <div className="sm:col-span-7">
                      <div className="leading-tight mb-1.5">
                        <span className="text-xs font-bold text-[#3B1822] block">
                          What do you want to rent
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Select one or more options
                        </span>
                      </div>

                      {/* Checkboxes grid matching Image 1 */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          "Gift Hamper",
                          "Decoration Props",
                          "Wedding Decor",
                          "Baby Shower Decor",
                          "Return Gift Boxes",
                          "Party Supplies"
                        ].map((item) => {
                          const isChecked = enquiryForm.selectedItems.includes(item);
                          return (
                            <label
                              key={item}
                              onClick={() => handleCheckboxToggle(item)}
                              className="flex items-center gap-1.5 text-[11px] text-[#3B1822] cursor-pointer select-none"
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isChecked
                                  ? "bg-[#632736] border-[#632736] text-white"
                                  : "bg-white border-gray-400"
                                  }`}
                              >
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Row 3: Rent Duration Pills */}
                  <div className="text-center pt-1">
                    <span className="text-xs font-bold text-[#3B1822] block mb-2">
                      Rent Duration
                    </span>
                    <div className="inline-flex items-center gap-2 p-1 bg-white/70 rounded-full border border-[#CD97A5]/40">
                      {["1 day", "3 days", "1 week"].map((dur) => {
                        const isSelected = enquiryForm.rentDuration === dur;
                        return (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setEnquiryForm({ ...enquiryForm, rentDuration: dur })}
                            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${isSelected
                              ? "bg-[#632736] text-white shadow-xs"
                              : "text-[#632736] hover:bg-[#FAF5EB]"
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{dur}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 4: 3 Cards (Event Date, Return Date, Delivery Location) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">

                    {/* Card 1: Event Date */}
                    <div className="bg-white rounded-xl border border-[#CD97A5]/40 p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#632736]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Event Date</span>
                      </div>
                      <span className="text-[10px] text-gray-500 block">Select date</span>
                      <input
                        type="date"
                        value={enquiryForm.eventDate}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, eventDate: e.target.value })}
                        className="w-full text-xs text-[#3B1822] font-semibold bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>

                    {/* Card 2: Return Date */}
                    <div className="bg-white rounded-xl border border-[#CD97A5]/40 p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#632736]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Return Date</span>
                      </div>
                      <span className="text-[10px] text-gray-500 block">Select date</span>
                      <input
                        type="date"
                        value={enquiryForm.returnDate}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, returnDate: e.target.value })}
                        className="w-full text-xs text-[#3B1822] font-semibold bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>

                    {/* Card 3: Delivery Location */}
                    <div className="bg-white rounded-xl border border-[#CD97A5]/40 p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#632736]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Delivery Location</span>
                      </div>
                      <input
                        type="text"
                        placeholder="City Enter city"
                        value={enquiryForm.city}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                        className="w-full text-xs border-b border-gray-200 focus:outline-none py-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Pincode 400001"
                        value={enquiryForm.pincode}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, pincode: e.target.value })}
                        className="w-full text-xs focus:outline-none py-0.5 bg-transparent"
                      />
                    </div>

                  </div>

                  {/* Row 5: Budget Range */}
                  <div className="bg-white rounded-xl border border-[#CD97A5]/40 p-2.5 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#632736] shrink-0" />
                    <span className="text-xs font-bold text-[#3B1822] shrink-0">Budget Range:</span>
                    <input
                      type="text"
                      placeholder="e.g. ₹5,000 – ₹15,000"
                      value={enquiryForm.budgetRange}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, budgetRange: e.target.value })}
                      className="w-full text-xs text-[#3B1822] bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Row 6: Delivery Address */}
                  <div className="bg-white rounded-xl border border-[#CD97A5]/40 p-2.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B1822]">
                      <Home className="w-4 h-4 text-[#632736]" />
                      <span>Delivery Address & Special Notes</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Enter complete delivery address, apartment, street, locality, occasion details, or notes for us..."
                      value={enquiryForm.deliveryAddress}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, deliveryAddress: e.target.value })}
                      className="w-full text-xs text-[#3B1822] bg-transparent focus:outline-none resize-none"
                    />
                  </div>

                  {/* Footer Row: Guarantee text on Left | Submit Button on Right */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#CD97A5]/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>We will contact you within 24 hours • Safe & secure</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#632736] hover:bg-[#4E1C28] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Submit Rent Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RentProducts;
