import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Palette,
  Award,
  Gift,
  PenTool,
  Truck,
  Smile,
  CheckCircle,
  Camera,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";
import { useApp } from "../context/AppContext";

const ICON_MAP = {
  Palette,
  Heart,
  Award,
  Gift,
  PenTool,
  Truck,
  Smile,
  Sparkles,
  CheckCircle,
  Camera,
  ShoppingBag,
  Star
};

export const Home = () => {
  const { 
    settings, 
    products, 
    homeSections, 
    homeSectionOrder, 
    toggleWishlist, 
    isInWishlist, 
    animatingWishlistId 
  } = useApp();

  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

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

  // Section configurations with fallbacks
  const heroSec = homeSections?.hero || {};
  const aboutSec = homeSections?.about || {};
  const whyChooseSec = homeSections?.whyChoose || {};
  const customizeSec = homeSections?.customizeGifts || {};
  const categorySec = homeSections?.categoryGallery || {};
  const featuredSec = homeSections?.featuredProducts || {};

  const categories = categorySec.categories || [
    { name: "Wedding Gifts", image: "/reference-assets/cat-wedding.jpg" },
    { name: "Birthday Gifts", image: "/reference-assets/cat-birthday.jpg" },
    { name: "Mehendi Gifts", image: "/reference-assets/cat-mehendi.jpg" },
    { name: "Diwali Gifts", image: "/reference-assets/cat-diwali.jpg" },
    { name: "Rakshabandhan Gifts", image: "/reference-assets/cat-rakshabandhan.jpg" },
    { name: "Pooja Products", image: "/reference-assets/cat-pooja.jpg" }
  ];

  // Quadruple repeated buffer for seamless continuous auto-play loop
  const carouselCategories = [
    ...categories,
    ...categories,
    ...categories,
    ...categories
  ];

  const [centerIndex, setCenterIndex] = useState(categories.length);
  const [animStage, setAnimStage] = useState("zooming"); // 'sliding' | 'zooming'
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const galleryTrackRef = useRef(null);
  const touchStartXRef = useRef(null);
  const whyChooseTrackRef = useRef(null);

  const handleWhyChooseScroll = (direction) => {
    if (!whyChooseTrackRef.current) return;
    const container = whyChooseTrackRef.current;
    const card = container.querySelector(".why-choose-card");
    const cardWidth = card ? card.offsetWidth : 280;
    const scrollAmount = cardWidth + 14;

    if (direction === "left") {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Measure container width for centered alignment
  useEffect(() => {
    const updateWidth = () => {
      if (galleryTrackRef.current) {
        setContainerWidth(galleryTrackRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // 2-Stage Alternating Auto-Play Gallery Animation
  useEffect(() => {
    if (isHovered) return;

    let timer;
    if (animStage === "zooming") {
      timer = setTimeout(() => {
        setAnimStage("sliding");
        setCenterIndex((prev) => {
          const next = prev + 1;
          if (next >= categories.length * 3) {
            return categories.length;
          }
          return next;
        });
      }, 2200);
    } else if (animStage === "sliding") {
      timer = setTimeout(() => {
        setAnimStage("zooming");
      }, 750);
    }

    return () => clearTimeout(timer);
  }, [animStage, isHovered, categories.length]);

  const handlePrevGallery = () => {
    setAnimStage("sliding");
    setCenterIndex((prev) => (prev > 0 ? prev - 1 : categories.length * 2));
    setTimeout(() => setAnimStage("zooming"), 750);
  };

  const handleNextGallery = () => {
    setAnimStage("sliding");
    setCenterIndex((prev) => (prev < carouselCategories.length - 1 ? prev + 1 : categories.length));
    setTimeout(() => setAnimStage("zooming"), 750);
  };

  const cardWidth = containerWidth < 380 ? 150 : containerWidth < 640 ? 175 : containerWidth < 1024 ? 210 : 240;
  const cardGap = containerWidth < 380 ? 10 : containerWidth < 640 ? 14 : containerWidth < 1024 ? 16 : 20;
  const translateX = (containerWidth / 2) - (centerIndex * (cardWidth + cardGap) + cardWidth / 2);

  // Dynamic featured products
  const featured = (products && products.filter((p) => p.featured).length > 0)
    ? products.filter((p) => p.featured).slice(0, 4)
    : [
        {
          id: "rc-custom-mug",
          name: "Personalized Gold-Rim Photo Mug",
          price: 499,
          image: "/reference-assets/prod-custom-mug.jpg",
          description: "Premium glossy white ceramic mug with luxurious gold rim, custom-printed with your photo."
        },
        {
          id: "rc-fresh-bouquet",
          name: "Scarlet Blush Rose Bouquet",
          price: 799,
          image: "/reference-assets/prod-fresh-bouquet.jpg",
          description: "Handcrafted luxury bouquet of fresh blooming roses with baby's breath & satin ribbon."
        },
        {
          id: "rc-gift-hamper",
          name: "Royal Celebration Gourmet Hamper",
          price: 1499,
          image: "/reference-assets/prod-gift-hamper.jpg",
          description: "Artisanal keepsake gift basket packed with chocolates, dry fruits, and celebratory delights."
        },
        {
          id: "rc-photo-frame",
          name: "Timeless Moments Wooden Frame",
          price: 899,
          image: "/reference-assets/prod-photo-frame.jpg",
          description: "Solid natural oak wood photo frame with personalized laser typography and glass display."
        }
      ];

  const whyChooseItems = whyChooseSec.items || [
    { id: 1, title: "Unique & Creative Gift Designs", desc: "One-of-a-kind designs that make every gift special.", icon: "Palette" },
    { id: 2, title: "Premium Quality Flowers & Materials", desc: "Only the finest materials for lasting freshness & beauty.", icon: "Award" },
    { id: 3, title: "Perfect Combination of Gifts & Chocolates", desc: "Thoughtful combos for every mood & occasion.", icon: "Gift" },
    { id: 4, title: "Customized Gifts as per Your Need", desc: "Personalized with names, photos, messages & more.", icon: "PenTool" },
    { id: 5, title: "Quick & Reliable Service", desc: "On-time delivery with safe packaging.", icon: "Truck" },
    { id: 6, title: "Affordable & Value for Money", desc: "Beautiful gifts at reasonable prices.", isRupee: true },
    { id: 7, title: "Perfect for Every Occasion", desc: "Birthdays, Weddings, Festivals, and more...", icon: "Sparkles" },
    { id: 8, title: "Customer Satisfaction is Our Priority", desc: "Your happiness matters to us the most.", icon: "Smile" }
  ];

  // Helper to render individual section
  const renderSection = (secId) => {
    switch (secId) {
      case "hero":
        if (heroSec.enabled === false) return null;
        return (
          <section key="hero" className="relative w-full min-h-[calc(100dvh-64px)] sm:min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex items-center overflow-hidden">
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
                    to={heroSec.primaryBtnLink || "/product-gallery"}
                    className="w-full sm:w-auto px-6 sm:px-7 py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                  >
                    <span>{heroSec.primaryBtnText || "Product Gallery"}</span>
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
        );

      case "about":
        if (aboutSec.enabled === false) return null;
        return (
          <section
            key="about"
            className="w-full py-16 sm:py-20 border-b border-[#E5DAC8]/60 bg-[#F5EEDC]"
            style={{
              backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
              backgroundPosition: "left top, right top",
              backgroundRepeat: "repeat-y, repeat-y",
              backgroundSize: "clamp(120px, 17.5vw, 260px) auto, clamp(120px, 17.5vw, 260px) auto"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#632736] block mb-1">
                      {aboutSec.badge || "ABOUT US"}
                    </span>
                    <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#3B1822] leading-tight">
                      {aboutSec.title || "Our Story & Heartfelt Artistry"}
                    </h2>
                    <p className="font-serif italic text-sm sm:text-base text-[#632736] mt-1">
                      {aboutSec.subtitle || "Handmade and personalized gifts that bring smiles and create memories."}
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {(aboutSec.paragraphs || [
                      "At Ruchi Creation, we believe that every gift carries a story. We specialize in handmade and personalized gifts that bring smiles, create memories, and make every occasion extra special.",
                      "Founded with a deep devotion to meaningful giving, our studio in Ichalkaranji crafts each piece with genuine warmth and precision."
                    ]).map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* 4 Feature Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {(aboutSec.pillars || [
                      { title: "Artisanal Design", desc: "Every piece thoughtfully styled and assembled by hand.", icon: "Palette" },
                      { title: "Made with Love", desc: "Personalized with custom names, photos & messages.", icon: "Heart" },
                      { title: "Finest Materials", desc: "Only premium florals, durable ceramics & luxury ribbons.", icon: "Award" },
                      { title: "Reliable Service", desc: "Safe packaging and timely delivery for your peace of mind.", icon: "Truck" }
                    ]).map((pillar, pilIdx) => {
                      const IconComp = ICON_MAP[pillar.icon] || Palette;
                      return (
                        <div key={pilIdx} className="bg-white/80 p-3.5 rounded-xl border border-[#E5DAC8] flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] text-[#632736] flex items-center justify-center shrink-0 border border-[#632736]/20">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#3B1822]">{pillar.title}</h4>
                            <p className="text-[11px] text-gray-600 mt-0.5">{pillar.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to action */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={aboutSec.primaryBtnLink || "/about"}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{aboutSec.primaryBtnText || "Learn More"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={aboutSec.secondaryBtnLink || "/contact"}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-[#632736] border border-[#632736]/30 text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all"
                    >
                      <span>{aboutSec.secondaryBtnText || "Contact Studio"}</span>
                    </Link>
                  </div>
                </div>

                {/* Right Image Showcase (5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5DAC8] shadow-xl group">
                    <img
                      src={aboutSec.image || "/reference-assets/about-home.jpg"}
                      alt="About Ruchi Creation"
                      className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = "/about-us-exact.png"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left p-3 rounded-xl bg-black/40 backdrop-blur-xs border border-white/20">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] block">
                        {aboutSec.imageTag || "Boutique Studio • Est. 2018"}
                      </span>
                      <p className="font-serif italic text-sm font-medium">
                        {aboutSec.imageCaption || "Handmade with love by Ruchi Biyani in Ichalkaranji"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );

      case "whyChoose":
        if (whyChooseSec.enabled === false) return null;
        return (
          <section
            key="whyChoose"
            className="w-full py-16 sm:py-24 border-b border-[#E5DAC8]/60 relative bg-[#F5EEDC]"
            style={{
              backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
              backgroundPosition: "left top, right top",
              backgroundRepeat: "repeat-y, repeat-y",
              backgroundSize: "clamp(120px, 17.5vw, 260px) auto, clamp(120px, 17.5vw, 260px) auto"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-8 sm:w-16 bg-[#632736]/30"></div>
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#632736] flex items-center gap-1.5">
                  {whyChooseSec.tagline || "GIFTS THAT SPEAK FROM THE HEART"}
                </span>
                <div className="h-px w-8 sm:w-16 bg-[#632736]/30"></div>
              </div>
              <div className="flex justify-center mb-3">
                <Heart className="w-3 h-3 fill-[#632736] text-[#632736] opacity-80" />
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
                <span className="text-2xl sm:text-3xl text-[#632736] select-none">❧</span>
                <h2 className="font-serif italic font-bold text-3xl sm:text-4xl lg:text-5xl text-[#632736] tracking-tight">
                  {whyChooseSec.title || "Why Choose Ruchi Creation?"}
                </h2>
                <span className="text-2xl sm:text-3xl text-[#632736] select-none">☙</span>
              </div>

              <p className="font-serif italic text-base sm:text-xl text-[#5C4E50] mb-10 sm:mb-14">
                {whyChooseSec.subtitle || "More than just gifts, we create emotions..."}
              </p>

              <div className="relative">
                {/* Left Navigation Arrow (Mobile Only) */}
                <button
                  type="button"
                  onClick={() => handleWhyChooseScroll("left")}
                  aria-label="Previous card"
                  className="sm:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-white text-[#632736] shadow-md border border-[#632736]/30 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                >
                  <ChevronLeft className="w-4.5 h-4.5 text-[#632736]" />
                </button>

                {/* Right Navigation Arrow (Mobile Only) */}
                <button
                  type="button"
                  onClick={() => handleWhyChooseScroll("right")}
                  aria-label="Next card"
                  className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-white text-[#632736] shadow-md border border-[#632736]/30 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                >
                  <ChevronRight className="w-4.5 h-4.5 text-[#632736]" />
                </button>

                {/* Carousel Track on Mobile / Grid on Desktop */}
                <div
                  ref={whyChooseTrackRef}
                  className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3.5 px-11 py-2 -mx-4 sm:mx-0 sm:px-0 sm:py-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6 sm:overflow-visible items-stretch"
                >
                  {whyChooseItems.map((item) => {
                    const IconComp = typeof item.icon === "string" ? (ICON_MAP[item.icon] || Sparkles) : (item.icon || Sparkles);
                    return (
                      <div
                        key={item.id}
                        className="why-choose-card w-[76vw] max-w-[280px] min-w-[240px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:min-w-0 sm:shrink bg-[#632736] rounded-2xl p-5 sm:p-6 text-white text-center flex flex-col items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-[#7D3240]/40 group h-[255px] sm:h-full"
                      >
                        <div className="flex flex-col items-center w-full">
                          <div className="relative mb-3 flex items-center justify-center">
                            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/15 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF5EB] text-[#632736] flex items-center justify-center shadow-xs">
                                {item.isRupee ? (
                                  <span className="text-[#632736] font-bold text-lg leading-none">₹</span>
                                ) : (
                                  <IconComp className="w-5 h-5 text-[#632736]" />
                                )}
                              </div>
                            </div>
                          </div>

                          <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-snug px-1">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#FAF5EB]/85 mt-2 leading-relaxed px-1">
                            {item.desc}
                          </p>
                        </div>

                        <Heart className="w-2.5 h-2.5 fill-[#CD97A5] text-[#CD97A5] mt-3 opacity-75 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        );

      case "customizeGifts":
        if (customizeSec.enabled === false) return null;
        return (
          <section
            key="customizeGifts"
            className="w-full py-16 sm:py-20 border-b border-[#E5DAC8]/60 bg-[#F5EEDC]"
            style={{
              backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
              backgroundPosition: "left top, right top",
              backgroundRepeat: "repeat-y, repeat-y",
              backgroundSize: "clamp(120px, 17.5vw, 260px) auto, clamp(120px, 17.5vw, 260px) auto"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Image Showcase (5 cols) */}
                <div className="lg:col-span-5 relative order-2 lg:order-1">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5DAC8] shadow-xl group">
                    <img
                      src={customizeSec.image || "/reference-assets/customize-home.jpg"}
                      alt="Customize Gifts Studio"
                      className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left p-3 rounded-xl bg-black/40 backdrop-blur-xs border border-white/20">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] block">
                        {customizeSec.imageTag || "Interactive Studio"}
                      </span>
                      <p className="font-serif italic text-sm font-medium">
                        {customizeSec.imageCaption || "Add names, heartfelt messages, and custom photos"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5 text-left order-1 lg:order-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#632736] block mb-1">
                      {customizeSec.badge || "PERSONALIZATION STUDIO"}
                    </span>
                    <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#3B1822] leading-tight">
                      {customizeSec.title || "Customize Gifts"}
                    </h2>
                    <p className="font-serif italic text-sm sm:text-base text-[#632736] mt-1">
                      {customizeSec.subtitle || "Add names, photos, messages and make it truly yours."}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {customizeSec.description || "Nothing expresses love quite like a personalized gift crafted exclusively for your special someone. From photo coffee mugs with gold accents to custom wooden frames and celebration hampers, tailor every single detail in our live design studio."}
                  </p>

                  {/* 3 Step Features */}
                  <div className="space-y-3 pt-1">
                    {(customizeSec.steps || [
                      { step: 1, title: "Select Your Gift Base", desc: "Choose from customizable mugs, laser-cut frames, hampers, and floral bouquets." },
                      { step: 2, title: "Upload Photos & Heartfelt Words", desc: "Add the recipient’s name, personal note, and your favorite memory snapshot." },
                      { step: 3, title: "Handcrafted & Delivered with Care", desc: "Carefully handcrafted in our studio, wrapped in luxury satin ribbon packaging." }
                    ]).map((st, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 bg-white/80 p-3 rounded-xl border border-[#E5DAC8]">
                        <div className="w-8 h-8 rounded-full bg-[#632736] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {st.step || sIdx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#3B1822]">{st.title}</h4>
                          <p className="text-[11px] text-gray-600">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={customizeSec.primaryBtnLink || "/customize-gifts"}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{customizeSec.primaryBtnText || "Customize Now"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={customizeSec.secondaryBtnLink || "/product-gallery"}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-[#632736] border border-[#632736]/30 text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all"
                    >
                      <span>{customizeSec.secondaryBtnText || "Browse Gallery"}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );

      case "categoryGallery":
        if (categorySec.enabled === false) return null;
        return (
          <section
            key="categoryGallery"
            className="w-full py-16 sm:py-20 border-b border-[#E5DAC8]/60 overflow-hidden bg-[#F5EEDC]"
            style={{
              backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
              backgroundPosition: "left top, right top",
              backgroundRepeat: "repeat-y, repeat-y",
              backgroundSize: "clamp(120px, 17.5vw, 260px) auto, clamp(120px, 17.5vw, 260px) auto"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 text-left">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#632736] block mb-1">
                    {categorySec.badge || "CURATED COLLECTIONS"}
                  </span>
                  <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#3B1822] leading-tight">
                    {categorySec.title || "Product Gallery"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                    {categorySec.subtitle || "Explore handpicked collections designed for birthdays, weddings, festive rituals, and celebrations."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 mr-2">
                    <button
                      type="button"
                      onClick={handlePrevGallery}
                      aria-label="Previous gallery cards"
                      className="w-8 h-8 rounded-full border border-[#E5DAC8] bg-white hover:bg-[#FAF5EB] text-[#632736] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextGallery}
                      aria-label="Next gallery cards"
                      className="w-8 h-8 rounded-full border border-[#E5DAC8] bg-white hover:bg-[#FAF5EB] text-[#632736] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to="/product-gallery"
                    className="text-xs sm:text-sm text-[#632736] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>View All Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Carousel Track Container */}
              <div 
                ref={galleryTrackRef}
                className="relative w-full overflow-hidden py-4 -my-4 touch-pan-y"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={(e) => {
                  setIsHovered(true);
                  if (e.touches && e.touches.length > 0) {
                    touchStartXRef.current = e.touches[0].clientX;
                  }
                }}
                onTouchEnd={(e) => {
                  setIsHovered(false);
                  if (touchStartXRef.current !== null && e.changedTouches && e.changedTouches.length > 0) {
                    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
                    if (diff > 40) {
                      handleNextGallery();
                    } else if (diff < -40) {
                      handlePrevGallery();
                    }
                    touchStartXRef.current = null;
                  }
                }}
              >
                <div
                  className="flex items-center"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    transition: animStage === "sliding" ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                    gap: `${cardGap}px`
                  }}
                >
                  {carouselCategories.map((cat, idx) => {
                    const isCenter = idx === centerIndex;
                    const isZoomed = isCenter && animStage === "zooming";

                    return (
                      <Link
                        key={`${cat.name}-${idx}`}
                        to={`/shop-by-category?category=${encodeURIComponent(cat.name)}`}
                        style={{ width: `${cardWidth}px` }}
                        className={`shrink-0 group bg-white rounded-2xl border p-3.5 sm:p-4 text-center flex flex-col items-center justify-between transition-all duration-700 ${
                          isZoomed
                            ? "border-[#632736] shadow-xl ring-2 ring-[#632736]/25 -translate-y-2"
                            : "border-[#E5DAC8] shadow-xs hover:border-[#632736]/40 hover:shadow-md"
                        }`}
                      >
                        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden border border-[#E5DAC8] transition-all flex items-center justify-center bg-[#FAF5EB]">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                              isZoomed
                                ? "scale-115 sm:scale-120"
                                : "scale-100 group-hover:scale-105"
                            }`}
                            loading="lazy"
                          />
                        </div>

                        <div className="mt-3 w-full">
                          <h3 className={`font-serif font-bold text-xs sm:text-sm line-clamp-1 transition-colors ${
                            isZoomed ? "text-[#632736]" : "text-[#3B1822] group-hover:text-[#632736]"
                          }`}>
                            {cat.name}
                          </h3>
                          <span className={`text-[10px] block mt-0.5 transition-colors ${
                            isZoomed ? "text-[#632736] font-semibold" : "text-gray-500 group-hover:text-[#632736]"
                          }`}>
                            Explore Gifts →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        );

      case "featuredProducts":
        if (featuredSec.enabled === false) return null;
        return (
          <section
            key="featuredProducts"
            className="w-full py-16 sm:py-20 bg-[#F5EEDC]"
            style={{
              backgroundImage: "url('/home-bg-left.png'), url('/home-bg-right.png')",
              backgroundPosition: "left top, right top",
              backgroundRepeat: "repeat-y, repeat-y",
              backgroundSize: "clamp(120px, 17.5vw, 260px) auto, clamp(120px, 17.5vw, 260px) auto"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 text-left">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#632736] block mb-1">
                    {featuredSec.badge || "SIGNATURE CREATIONS"}
                  </span>
                  <h2 className="font-serif italic font-bold text-2xl sm:text-4xl text-[#3B1822] leading-tight">
                    {featuredSec.title || "Featured Products"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                    {featuredSec.subtitle || "Our most loved handcrafted gift hampers, rose bouquets, and customizable photo keepsakes."}
                  </p>
                </div>

                <Link
                  to="/featured-products"
                  className="text-xs sm:text-sm text-[#632736] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>View All Featured</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Featured Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {featured.map((item) => {
                  const isWishlisted = isInWishlist(item.id);
                  const isPopping = animatingWishlistId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl border border-[#E5DAC8] p-4 text-left flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-[#632736]/40 relative"
                    >
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.id)}
                        className={`absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-md flex items-center justify-center hover:bg-white transition-all text-[#632736] active:scale-90 ${
                          isPopping ? "animate-heart-pop" : ""
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-[#632736] text-[#632736]" : "text-gray-400 hover:text-[#632736]"} ${isPopping ? "scale-125" : ""}`} />
                      </button>

                      <div>
                        <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#E5DAC8]/60 mb-3.5 flex items-center justify-center bg-[#FAF5EB] relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>

                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#3B1822] line-clamp-1 group-hover:text-[#632736] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E5DAC8]/60 mt-3 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-bold">Price</span>
                          <span className="text-base font-bold text-[#632736]">
                            ₹{item.price?.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <Link
                          to={`/product/${item.id}`}
                          className="px-4 py-2 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-full text-center transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <span>Order Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <Link
                  to={featuredSec.btnLink || "/product-gallery"}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <span>{featuredSec.btnText || "Explore All Products"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Enforce Section Sequence: 1. Hero Video Banner, 2. About Us Section, 3. Remaining Sections
  const displaySectionOrder = (() => {
    const rawOrder = Array.isArray(homeSectionOrder) && homeSectionOrder.length > 0
      ? homeSectionOrder
      : ["hero", "about", "whyChoose", "customizeGifts", "categoryGallery", "featuredProducts"];
    const remaining = rawOrder.filter((id) => id !== "hero" && id !== "about");
    return ["hero", "about", ...remaining];
  })();

  return (
    <div className="bg-[#F5EEDC] text-[#3B1822] overflow-hidden">
      {/* Dynamic Section Rendering: 1. Hero Video Banner, 2. About Us Section, 3. Other Sections */}
      {displaySectionOrder.map((secId) => renderSection(secId))}
    </div>
  );
};
