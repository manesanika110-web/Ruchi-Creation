import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  Play,
  Pause,
  Truck,
  ShieldCheck,
  Heart,
  Gift,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Home = () => {
  const navigate = useNavigate();
  const { 
    settings, 
    products, 
    homeSections, 
    addToCart,
    toggleWishlist, 
    isInWishlist, 
    animatingWishlistId 
  } = useApp();

  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const productsCarouselRef = useRef(null);
  const [addedItemMap, setAddedItemMap] = useState({});

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => {
            setIsVideoPlaying(false);
          });
      }
    }

    // Secondary auto-play trigger upon user interaction if blocked by browser policy
    const tryAutoPlay = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener("click", tryAutoPlay, { once: true, passive: true });
    window.addEventListener("touchstart", tryAutoPlay, { once: true, passive: true });
    window.addEventListener("scroll", tryAutoPlay, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", tryAutoPlay);
      window.removeEventListener("touchstart", tryAutoPlay);
      window.removeEventListener("scroll", tryAutoPlay);
    };
  }, []);

  const heroSec = homeSections?.hero || {};
  const serviceBenefitsSec = homeSections?.serviceBenefits;
  const shopByCategorySec = homeSections?.shopByCategory;
  const featuredProductsSec = homeSections?.featuredProducts;
  const thoughtfulGiftsSec = homeSections?.thoughtfulGifts;

  const iconMap = {
    Truck,
    ShieldCheck,
    Heart,
    Gift,
    Sparkles
  };

  // 1. Service Benefits List (Matching Reference Image)
  const defaultServiceBenefits = [
    {
      id: "shipping",
      title: "Free Shipping",
      subtitle: "On orders above ₹999",
      icon: Truck
    },
    {
      id: "secure",
      title: "Secure Payments",
      subtitle: "100% secure payment",
      icon: ShieldCheck
    },
    {
      id: "handmade",
      title: "Handmade with Love",
      subtitle: "Crafted with care",
      icon: Heart
    },
    {
      id: "wrapping",
      title: "Gift Wrapping",
      subtitle: "Make it extra special",
      icon: Gift
    }
  ];

  const activeServiceBenefits = (serviceBenefitsSec?.items || defaultServiceBenefits).map((b) => ({
    ...b,
    icon: typeof b.icon === "string" ? (iconMap[b.icon] || Heart) : (b.icon || Heart)
  }));

  // 2. 8 Shop by Category Items (Matching Reference Image)
  const defaultShopCategories = [
    {
      id: "pooja-essentials",
      name: "Pooja Essentials",
      image: "/images/Pooja desing Thali.png",
      link: "/shop-by-category?category=Pooja%20Products"
    },
    {
      id: "bouquets",
      name: "Bouquets",
      image: "/reference-assets/prod-fresh-bouquet.jpg",
      link: "/shop-by-category?search=Bouquet"
    },
    {
      id: "hampers",
      name: "Hampers",
      image: "/reference-assets/prod-gift-hamper.jpg",
      link: "/shop-by-category?search=Hamper"
    },
    {
      id: "personalised-gifts",
      name: "Personalised Gifts",
      image: "/reference-assets/detail-mug.jpg",
      link: "/customize-gifts"
    },
    {
      id: "birthday-gifts",
      name: "Birthday Gifts",
      image: "/images/cat-birthday-teddy.jpg",
      link: "/shop-by-category?category=Birthday%20Gifts"
    },
    {
      id: "bridal-gifts",
      name: "Bridal Gifts",
      image: "/images/cat-bridal-gift.jpg",
      link: "/shop-by-category?category=Wedding%20Gifts"
    },
    {
      id: "rangoli-plates",
      name: "Rangoli Plates",
      image: "/images/Custmised Readymade Rangoli Plate.png",
      link: "/shop-by-category?search=Rangoli"
    },
    {
      id: "rent-products",
      name: "Rent Products",
      image: "/images/cat-rent-decor.jpg",
      link: "/rent"
    }
  ];

  const activeShopCategories = shopByCategorySec?.items || defaultShopCategories;

  // 3. 6 Featured Products List (Matching Reference Image & Prompt)
  const referenceProducts = [
    {
      id: "rc-jasvand-pooja-mala",
      name: "Jasvand Pooja Mala",
      category: "Pooja Products",
      price: 299,
      originalPrice: 399,
      image: "/images/jasvand-pooja-mala.jpg",
      description: "Handmade authentic Jasvand (hibiscus) and white flower pooja mala garland for festive devotion and deity decoration."
    },
    {
      id: "rc-red-pooja-thali",
      name: "Red Pooja Thali",
      category: "Pooja Products",
      price: 599,
      originalPrice: 799,
      image: "/images/Pooja desing Thali.png",
      description: "Artisanal handcrafted red velvet pooja thali adorned with intricate pearl beadwork and auspicious accessories."
    },
    {
      id: "rc-haldi-kumkum-set",
      name: "Haldi-Kumkum Set",
      category: "Pooja Products",
      price: 349,
      originalPrice: 449,
      image: "/images/haldi-kumkum-set.jpg",
      description: "Traditional ceremonial Haldi-Kumkum platter set with pure brass bowls and sacred festive floral accents."
    },
    {
      id: "rc-coconut-pack",
      name: "Coconut Pack",
      category: "Wedding Gifts",
      price: 249,
      originalPrice: 349,
      image: "/images/coconut-pack.jpg",
      description: "Exquisitely decorated traditional wedding and pooja coconuts (shrifal) wrapped with royal golden zari and auspicious red ribbons."
    },
    {
      id: "rc-birthday-gift-girl",
      name: "Birthday Gift for Girl",
      category: "Birthday Gifts",
      price: 799,
      originalPrice: 1099,
      image: "/images/birthday-gift-girl.jpg",
      description: "Luxury pastel pink birthday gift hamper for girls complete with keepsake boxes, plush teddy bear, flowers, and artisanal chocolates."
    },
    {
      id: "rc-customized-flower-bouquet",
      name: "Customized Flower Bouquet",
      category: "Wedding Gifts",
      price: 999,
      originalPrice: 1299,
      image: "/images/customized-flower-bouquet.jpg",
      description: "Bespoke handcrafted celebration bouquet of blooming gerberas and roses with a personalized greeting card."
    }
  ];

  // Merge with live Firestore/context products if available
  const featuredProductsList = referenceProducts.map((refProd) => {
    const liveProd = products && products.find((p) => p.id === refProd.id);
    return liveProd ? { ...refProd, ...liveProd } : refProd;
  });

  const handleScrollCarousel = (direction) => {
    if (productsCarouselRef.current) {
      const scrollAmount = 320;
      productsCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleAddToCart = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, {}, 1, e);
    setAddedItemMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  return (
    <div className="bg-[#FAF6EF] text-[#3B1822] overflow-hidden">
      
      {/* ========================================================
          HERO BANNER VIDEO (Preserved Exactly as Requested)
         ======================================================== */}
      {heroSec.enabled !== false && (
        <section className="relative w-full min-h-[calc(100dvh-64px)] sm:min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex items-center overflow-hidden">
          <video
            ref={(el) => {
              if (el) {
                el.defaultMuted = true;
                el.muted = true;
              }
              videoRef.current = el;
            }}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            poster="/reference-assets/hero-banner-hd.jpg"
            preload="auto"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onLoadedData={(e) => {
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src={heroSec.videoUrl || "/gift-video.mp4"} type="video/mp4" />
            <source src="/assets/gift-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-[1] pointer-events-none"></div>

          {/* Interactive Video Play/Pause Status Pill */}
          <button
            onClick={toggleVideoPlay}
            type="button"
            aria-label={isVideoPlaying ? "Pause banner video" : "Play banner video"}
            className="absolute bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-20 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-[#FAF5EB] backdrop-blur-md border border-white/20 text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            {isVideoPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Pause className="w-3.5 h-3.5 text-[#FAF5EB]" />
                <span className="text-[10px] sm:text-[11px] font-medium hidden xs:inline sm:inline">Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#FAF5EB] fill-current" />
                <span className="text-[10px] sm:text-[11px] font-medium">Play Video</span>
              </>
            )}
          </button>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 w-full text-left text-white py-12 sm:py-20 lg:py-24">
            <div className="max-w-2xl space-y-3.5 sm:space-y-5 animate-slide-pop-left">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[#FAF5EB] text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-white/30 shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#CD97A5]" />
                {heroSec.badge || "Bespoke Gifting Studio • Ichalkaranji"}
              </span>

              <h1 className="font-serif italic font-normal text-3xl sm:text-5xl lg:text-7xl tracking-tight leading-tight text-white drop-shadow-lg">
                {heroSec.title || settings.heroTitle || "Ruchi Creation"}
              </h1>

              <p className="font-serif italic text-base sm:text-2xl lg:text-3xl text-white/95 leading-snug drop-shadow-md">
                {heroSec.subtitle || settings.heroSubtitle || "Handcrafted with Love, Personalized for Every Special Moment"}
              </p>

              <p className="text-xs sm:text-sm md:text-base text-white/90 font-light tracking-wide leading-relaxed max-w-xl drop-shadow-sm">
                {heroSec.description || "Transforming cherished memories into timeless customized gifts, artisanal floral bouquets & luxury celebration hampers in Ichalkaranji."}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 sm:pt-3 w-full sm:w-auto">
                <Link
                  to={heroSec.primaryBtnLink && heroSec.primaryBtnLink !== "/product-gallery" ? heroSec.primaryBtnLink : "/shop-by-category"}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <span>{heroSec.primaryBtnText && heroSec.primaryBtnText !== "Product Gallery" ? heroSec.primaryBtnText : "Shop All Gifts"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={heroSec.secondaryBtnLink || "/customize-gifts"}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-[#FAF5EB] hover:bg-white text-[#632736] text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <span>{heroSec.secondaryBtnText || "Customize Gifts"}</span>
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/90 drop-shadow-sm">
                {(heroSec.trustBadges || ["100% Handcrafted", "Premium Materials", "Express Customization"]).map((badge, bIdx) => (
                  <span key={bIdx} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          1. SERVICE BENEFITS BAR (Matching Reference Image)
         ======================================================== */}
      {serviceBenefitsSec?.enabled !== false && activeServiceBenefits.length > 0 && (
        <section className="w-full bg-[#FAF5EB] border-b border-[#E8DAC8]/80 py-4 sm:py-5 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 items-center">
              {activeServiceBenefits.map((benefit, bIdx) => {
                const IconComp = benefit.icon;
                return (
                  <div
                    key={benefit.id}
                    className={`flex items-center justify-start lg:justify-center gap-3 sm:gap-3.5 px-2 lg:px-6 ${
                      bIdx < activeServiceBenefits.length - 1 ? "lg:border-r border-[#E5DAC8]" : ""
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5EEDC] text-[#632736] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-[#632736]" strokeWidth={1.75} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#3B1822] leading-tight">
                        {benefit.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#6B5E62] mt-0.5 font-sans">
                        {benefit.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main container with side festive accents */}
      <div
        className="w-full"
        style={{
          backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
          backgroundPosition: "left top, right top",
          backgroundRepeat: "repeat-y, repeat-y",
          backgroundSize: "clamp(100px, 15vw, 220px) auto, clamp(100px, 15vw, 220px) auto"
        }}
      >
        {/* ========================================================
            2. SHOP BY CATEGORY SECTION (Matching Reference Image)
           ======================================================== */}
        {shopByCategorySec?.enabled !== false && activeShopCategories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
            {/* Header with side lines and heart */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1.5">
                <span className="w-8 sm:w-16 h-px bg-[#632736]/40"></span>
                <h2 className="font-serif italic font-bold text-2xl sm:text-3xl lg:text-4xl text-[#632736] tracking-tight">
                  {shopByCategorySec?.title || "Shop by Category"}
                </h2>
                <span className="w-8 sm:w-16 h-px bg-[#632736]/40"></span>
              </div>
              <div className="flex justify-center">
                <Heart className="w-3 h-3 fill-[#632736] text-[#632736] opacity-80" />
              </div>
            </div>

            {/* 8 Circular Categories Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 lg:gap-5 items-start justify-items-center">
              {activeShopCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.link}
                  className="group flex flex-col items-center text-center cursor-pointer max-w-[105px] w-full"
                >
                  {/* Circular image with halo and subtle border matching reference */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-b from-[#F5EEDC] to-[#E5DAC8] shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-[#FAF5EB]">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.target.src = "/logo.png"; }}
                      />
                    </div>
                  </div>

                  {/* Category Name */}
                  <span className="font-serif font-bold text-[11px] sm:text-xs text-[#3B1822] group-hover:text-[#632736] transition-colors mt-2 text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            3. FEATURED PRODUCTS SECTION (Matching Reference Image)
           ======================================================== */}
        {featuredProductsSec?.enabled !== false && (
          <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16">
            <div className="bg-[#FAF5EB]/95 rounded-2xl sm:rounded-3xl border border-[#E5DAC8] p-3.5 sm:p-5 lg:p-6 shadow-xs">
              
              {/* Header row inside container */}
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 px-1 sm:px-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-[#632736] tracking-tight">
                    {featuredProductsSec?.title || "Featured Products"}
                  </h3>
                  <span className="w-8 sm:w-12 h-px bg-[#632736]/40 hidden xs:inline-block"></span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={featuredProductsSec?.viewAllLink || "/featured-products"}
                    className="text-xs sm:text-sm text-[#632736] font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>{featuredProductsSec?.viewAllText || "View All Gallery"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Navigation arrows for carousel */}
                  <div className="flex items-center gap-1.5 ml-1">
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel("left")}
                      aria-label="Scroll left"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#D5C6B5] bg-white hover:bg-[#FAF5EB] text-[#632736] flex items-center justify-center transition-colors shadow-2xs active:scale-90 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel("right")}
                      aria-label="Scroll right"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#D5C6B5] bg-white hover:bg-[#FAF5EB] text-[#632736] flex items-center justify-center transition-colors shadow-2xs active:scale-90 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            {/* 6 Product Cards in One Horizontal Row on Desktop */}
            <div
              ref={productsCarouselRef}
              className="grid grid-flow-col auto-cols-[calc(50%-6px)] sm:auto-cols-[calc(33.333%-8px)] md:auto-cols-[calc(25%-10px)] lg:grid-cols-6 lg:auto-cols-auto gap-3 sm:gap-3.5 overflow-x-auto lg:overflow-x-visible pb-2 pt-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {featuredProductsList.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                const isPopping = animatingWishlistId === product.id;
                const isAdded = !!addedItemMap[product.id];

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-[#E5DAC8] p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 text-left"
                  >
                    {/* Top: Product Image */}
                    <div>
                      <div className="w-full aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF5EB] mb-2 relative">
                        <Link to={`/product/${product.id}`} className="w-full h-full block">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/logo.png";
                            }}
                          />
                        </Link>
                      </div>

                      {/* Product Name */}
                      <Link to={`/product/${product.id}`}>
                        <h4 className="font-serif font-bold text-[11px] sm:text-xs lg:text-[13px] text-[#3B1822] group-hover:text-[#632736] transition-colors line-clamp-2 min-h-[1.9rem] sm:min-h-[2.1rem] leading-snug">
                          {product.name}
                        </h4>
                      </Link>

                      {/* Price in Rupees */}
                      <div className="text-xs sm:text-sm font-bold text-[#3B1822] mt-1">
                        ₹ {product.price}
                      </div>
                    </div>

                    {/* Bottom Action Row: Burgundy "Add to Cart" + Heart */}
                    <div className="flex items-center gap-2 mt-2.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`flex-1 py-1 sm:py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold rounded-full shadow-2xs transition-all active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#632736] hover:bg-[#4D1B28] text-white hover:shadow-xs"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <span>Add to Cart</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center hover:bg-[#FAF5EB] text-[#632736] transition-all shrink-0 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            isWishlisted
                              ? "fill-[#632736] text-[#632736]"
                              : "text-[#632736] hover:scale-110"
                          } ${isPopping ? "animate-heart-pop" : ""}`}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

        {/* ========================================================
            THOUGHTFUL GIFTS BANNER SECTION (Matching Reference Image 2)
           ======================================================== */}
        {thoughtfulGiftsSec?.enabled !== false && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
            <div className="relative rounded-2xl sm:rounded-3xl border border-[#F7D1D9] bg-gradient-to-r from-[#FDE8ED] via-[#FDECEF] to-[#FDE8ED] p-8 sm:p-12 text-center overflow-hidden shadow-xs">
              
              {/* Left Decorative Doodles (Gift Box & Floating Hearts) */}
              <div className="absolute left-4 sm:left-8 bottom-3 sm:bottom-4 pointer-events-none opacity-85 select-none">
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" className="text-[#CD97A5] stroke-current">
                  <rect x="25" y="45" width="50" height="45" rx="3" strokeWidth="2.5" fill="#FFF0F3" />
                  <rect x="20" y="36" width="60" height="12" rx="3" strokeWidth="2.5" fill="#FFE3EA" />
                  <line x1="50" y1="36" x2="50" y2="90" strokeWidth="2.5" strokeDasharray="1 1" />
                  <path d="M50 36 C42 22, 28 24, 38 36 C44 38, 50 36, 50 36" strokeWidth="2.5" fill="#FFCCD7" />
                  <path d="M50 36 C58 22, 72 24, 62 36 C56 38, 50 36, 50 36" strokeWidth="2.5" fill="#FFCCD7" />
                  <circle cx="50" cy="36" r="3" fill="#632736" />
                </svg>
              </div>

              {/* Left Floating Heart */}
              <div className="absolute left-14 sm:left-24 top-6 sm:top-8 pointer-events-none opacity-70">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CD97A5" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Top Hanging Party Bunting / Lanterns */}
              <div className="absolute top-2 left-1/3 pointer-events-none opacity-60">
                <svg width="35" height="40" viewBox="0 0 50 50" fill="none" stroke="#CD97A5" strokeWidth="1.5">
                  <line x1="25" y1="0" x2="25" y2="15" />
                  <polygon points="25,15 38,28 25,42 12,28" fill="#FFF0F3" />
                  <line x1="12" y1="28" x2="38" y2="28" />
                </svg>
              </div>

              <div className="absolute top-2 right-1/4 pointer-events-none opacity-60">
                <svg width="35" height="40" viewBox="0 0 50 50" fill="none" stroke="#CD97A5" strokeWidth="1.5">
                  <line x1="25" y1="0" x2="25" y2="15" />
                  <polygon points="25,15 38,28 25,42 12,28" fill="#FFF0F3" />
                  <line x1="12" y1="28" x2="38" y2="28" />
                </svg>
              </div>

              {/* Right Large Gift Box & Hearts */}
              <div className="absolute right-4 sm:right-10 bottom-2 sm:bottom-3 pointer-events-none opacity-85 select-none">
                <svg width="85" height="85" viewBox="0 0 100 100" fill="none" className="text-[#CD97A5] stroke-current">
                  <rect x="22" y="42" width="60" height="46" rx="4" strokeWidth="2.5" fill="#FFE6EC" />
                  <rect x="18" y="32" width="68" height="12" rx="3" strokeWidth="2.5" fill="#FFD1DC" />
                  <rect x="47" y="32" width="10" height="56" fill="#F48B9F" strokeWidth="1" />
                  <path d="M52 32 C40 16, 22 18, 36 32 C44 34, 52 32, 52 32" strokeWidth="2.5" fill="#F7A1B3" />
                  <path d="M52 32 C64 16, 82 18, 68 32 C60 34, 52 32, 52 32" strokeWidth="2.5" fill="#F7A1B3" />
                  <path d="M22 68 C-5 65, 0 45, 15 50 C28 55, 10 75, 25 72" strokeWidth="2" strokeDasharray="2 2" />
                </svg>
              </div>

              {/* Right Floating Hearts */}
              <div className="absolute right-16 sm:right-28 top-5 sm:top-7 pointer-events-none opacity-70">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CD97A5" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Centered Main Content (Exact Match to Reference Image 2) */}
              <div className="relative z-10 max-w-2xl mx-auto space-y-2.5">
                <h2 className="font-serif italic font-bold text-2xl sm:text-3xl lg:text-4xl text-[#5F2432] tracking-tight">
                  {thoughtfulGiftsSec?.heading || "Thoughtful Gifts for Every Moment"}
                </h2>
                <p className="text-xs sm:text-[13px] md:text-sm text-[#7D535E] font-medium leading-relaxed max-w-xl mx-auto">
                  {thoughtfulGiftsSec?.subheading || "From birthdays to weddings, from kids to grandparents – find the perfect gift for every person and every occasion."}
                </p>
              </div>

            </div>
          </section>
        )}
      </div>

    </div>
  );
};

export default Home;
