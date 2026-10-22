// Default configuration and structured data for Admin Panel content management

export const DEFAULT_PAGE_SETTINGS = {
  home: {
    id: "home",
    name: "Home Page",
    path: "/",
    title: "Home",
    metaTitle: "Ruchi Creation | Handcrafted with Love | Bespoke Gifts Ichalkaranji",
    metaDescription: "Transforming cherished memories into timeless customized gifts, floral bouquets & luxury celebration hampers in Ichalkaranji.",
    bannerImage: "/banners/banner_home.jpg",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  about: {
    id: "about",
    name: "About Us",
    path: "/about",
    title: "About Us",
    heading: "Our Story & Heartfelt Artistry",
    subheading: "Handmade and personalized gifts that bring smiles and create memories.",
    bannerImage: "/about-us-exact.png",
    description: "At Ruchi Creation, we believe that every gift carries a story. Founded with a deep devotion to meaningful giving, our studio in Ichalkaranji crafts each piece with genuine warmth and precision.",
    buttonText: "Contact Studio",
    buttonLink: "/contact",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  customize: {
    id: "customize",
    name: "Customize Gifts",
    path: "/customize-gifts",
    title: "Customize Gifts",
    heading: "Personalization Studio",
    subheading: "Add names, heartfelt messages, and photos to craft a one-of-a-kind keepsake.",
    bannerImage: "/banners/banner_customize.jpg",
    description: "Tailor photo mugs, bespoke wooden frames, celebration hampers, and bouquets with customized recipient names, colors, and memorable photos.",
    buttonText: "Browse Collection",
    buttonLink: "/product-gallery",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  gallery: {
    id: "gallery",
    name: "Product Gallery",
    path: "/product-gallery",
    title: "Product Gallery",
    heading: "Visual Exhibition",
    subheading: "Explore high-definition photographs of our handcrafted personalized gifts & celebratory hampers.",
    bannerImage: "/banners/banner_gallery.jpg",
    description: "Curated portfolio of wedding return gifts, birthday celebrations, mehendi favors, diwali gift platters, rakhi sets, and pooja accessories.",
    buttonText: "Order on WhatsApp",
    buttonLink: "/contact",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  shop: {
    id: "shop",
    name: "Shop by Category",
    path: "/shop-by-category",
    title: "Shop by Category",
    heading: "Handcrafted Categories",
    subheading: "Find the perfect handmade gift for every festival, celebration, and cherished milestone.",
    bannerImage: "/banners/banner_shop.jpg",
    description: "Explore curated gift lines across Wedding, Birthday, Mehendi, Diwali, Rakshabandhan, and Pooja collections.",
    buttonText: "View Featured",
    buttonLink: "/featured-products",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  featured: {
    id: "featured",
    name: "Featured Products",
    path: "/featured-products",
    title: "Featured Products",
    heading: "Signature Creations",
    subheading: "Our most celebrated artisanal creations, chosen by thousands of satisfied customers.",
    bannerImage: "/banners/banner_featured.jpg",
    description: "Our top-rated gold-rim ceramic mugs, fresh rose bouquets, and royal celebration gourmet hampers.",
    buttonText: "Shop All Gifts",
    buttonLink: "/shop-by-category",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  contact: {
    id: "contact",
    name: "Contact Us",
    path: "/contact",
    title: "Contact Us",
    heading: "Connect with Ruchi Creation",
    subheading: "Have a custom gift design in mind, need bulk corporate hampers, or want urgent delivery?",
    bannerImage: "/banners/banner_contact.jpg",
    description: "Get in touch with our studio in Ichalkaranji via phone, WhatsApp, or instant contact inquiry form.",
    buttonText: "Chat on WhatsApp",
    buttonLink: "https://wa.me/919511112616",
    visible: true,
    lastUpdated: new Date().toISOString()
  }
};

export const DEFAULT_HOME_SECTIONS = {
  hero: {
    id: "hero",
    name: "Hero Banner",
    badge: "Bespoke Gifting Studio • Ichalkaranji",
    title: "Ruchi Creation",
    subtitle: "Handcrafted with Love, Personalized for Every Special Moment",
    description: "Transforming cherished memories into timeless customized gifts, artisanal floral bouquets & luxury celebration hampers in Ichalkaranji.",
    videoUrl: "/gift-video.mp4",
    bannerImage: "/reference-assets/about-home.jpg",
    primaryBtnText: "Product Gallery",
    primaryBtnLink: "/product-gallery",
    secondaryBtnText: "Customize Gifts",
    secondaryBtnLink: "/customize-gifts",
    trustBadges: [
      "100% Handcrafted",
      "Premium Materials",
      "Express Customization"
    ],
    enabled: true
  },
  about: {
    id: "about",
    name: "About Us Story",
    badge: "ABOUT US",
    title: "Our Story & Heartfelt Artistry",
    subtitle: "Handmade and personalized gifts that bring smiles and create memories.",
    paragraphs: [
      "At Ruchi Creation, we believe that every gift carries a story. We specialize in handmade and personalized gifts that bring smiles, create memories, and make every occasion extra special.",
      "Founded with a deep devotion to meaningful giving, our studio in Ichalkaranji crafts each piece with genuine warmth and precision. From custom-printed golden mugs to fragrant rose bouquets, artisanal chocolate arrangements, and sacred pooja accessories, we bring your heartfelt emotions to life."
    ],
    pillars: [
      { id: 1, title: "Artisanal Design", desc: "Every piece thoughtfully styled and assembled by hand.", icon: "Palette" },
      { id: 2, title: "Made with Love", desc: "Personalized with custom names, photos & messages.", icon: "Heart" },
      { id: 3, title: "Finest Materials", desc: "Only premium florals, durable ceramics & luxury ribbons.", icon: "Award" },
      { id: 4, title: "Reliable Service", desc: "Safe packaging and timely delivery for your peace of mind.", icon: "Truck" }
    ],
    image: "/reference-assets/about-home.jpg",
    imageTag: "Boutique Studio • Est. 2018",
    imageCaption: "Handmade with love by Ruchi Biyani in Ichalkaranji",
    primaryBtnText: "Learn More",
    primaryBtnLink: "/about",
    secondaryBtnText: "Contact Studio",
    secondaryBtnLink: "/contact",
    enabled: true
  },
  whyChoose: {
    id: "whyChoose",
    name: "Why Choose Ruchi Creation",
    tagline: "GIFTS THAT SPEAK FROM THE HEART",
    title: "Why Choose Ruchi Creation?",
    subtitle: "More than just gifts, we create emotions...",
    items: [
      { id: 1, title: "Unique & Creative Gift Designs", desc: "One-of-a-kind designs that make every gift special.", icon: "Palette" },
      { id: 2, title: "Premium Quality Flowers & Materials", desc: "Only the finest materials for lasting freshness & beauty.", icon: "Award" },
      { id: 3, title: "Perfect Combination of Gifts & Chocolates", desc: "Thoughtful combos for every mood & occasion.", icon: "Gift" },
      { id: 4, title: "Customized Gifts as per Your Need", desc: "Personalized with names, photos, messages & more.", icon: "PenTool" },
      { id: 5, title: "Quick & Reliable Service", desc: "On-time delivery with safe packaging.", icon: "Truck" },
      { id: 6, title: "Affordable & Value for Money", desc: "Beautiful gifts at reasonable prices.", isRupee: true },
      { id: 7, title: "Perfect for Every Occasion", desc: "Birthdays, Weddings, Festivals, and more...", icon: "Sparkles" },
      { id: 8, title: "Customer Satisfaction is Our Priority", desc: "Your happiness matters to us the most.", icon: "Smile" }
    ],
    enabled: true
  },
  customizeGifts: {
    id: "customizeGifts",
    name: "Customize Gifts Studio",
    badge: "PERSONALIZATION STUDIO",
    title: "Customize Gifts",
    subtitle: "Add names, photos, messages and make it truly yours.",
    description: "Nothing expresses love quite like a personalized gift crafted exclusively for your special someone. From photo coffee mugs with gold accents to custom wooden frames and celebration hampers, tailor every single detail in our live design studio.",
    steps: [
      { step: 1, title: "Select Your Gift Base", desc: "Choose from customizable mugs, laser-cut frames, hampers, and floral bouquets." },
      { step: 2, title: "Upload Photos & Heartfelt Words", desc: "Add the recipient’s name, personal note, and your favorite memory snapshot." },
      { step: 3, title: "Handcrafted & Delivered with Care", desc: "Carefully handcrafted in our studio, wrapped in luxury satin ribbon packaging." }
    ],
    image: "/reference-assets/customize-home.jpg",
    imageTag: "Interactive Studio",
    imageCaption: "Add names, heartfelt messages, and custom photos",
    primaryBtnText: "Customize Now",
    primaryBtnLink: "/customize-gifts",
    secondaryBtnText: "Browse Gallery",
    secondaryBtnLink: "/product-gallery",
    enabled: true
  },
  categoryGallery: {
    id: "categoryGallery",
    name: "Shop by Category Carousel",
    badge: "CURATED COLLECTIONS",
    title: "Product Gallery",
    subtitle: "Explore handpicked collections designed for birthdays, weddings, festive rituals, and celebrations.",
    categories: [
      { id: 1, name: "Wedding Gifts", image: "/reference-assets/cat-wedding.jpg" },
      { id: 2, name: "Birthday Gifts", image: "/reference-assets/cat-birthday.jpg" },
      { id: 3, name: "Mehendi Gifts", image: "/reference-assets/cat-mehendi.jpg" },
      { id: 4, name: "Diwali Gifts", image: "/reference-assets/cat-diwali.jpg" },
      { id: 5, name: "Rakshabandhan Gifts", image: "/reference-assets/cat-rakshabandhan.jpg" },
      { id: 6, name: "Pooja Products", image: "/reference-assets/cat-pooja.jpg" }
    ],
    enabled: true
  },
  featuredProducts: {
    id: "featuredProducts",
    name: "Featured Products Showcase",
    badge: "SIGNATURE CREATIONS",
    title: "Featured Products",
    subtitle: "Our most loved handcrafted gift hampers, rose bouquets, and customizable photo keepsakes.",
    productIds: [
      "rc-custom-mug",
      "rc-fresh-bouquet",
      "rc-gift-hamper",
      "rc-photo-frame"
    ],
    btnText: "Explore All Products",
    btnLink: "/product-gallery",
    enabled: true
  }
};

export const DEFAULT_SECTION_ORDER = [
  "hero",
  "about",
  "whyChoose",
  "customizeGifts",
  "categoryGallery",
  "featuredProducts"
];

export const DEFAULT_MEDIA_ITEMS = [
  { id: "m-logo", name: "Store Logo", url: "/logo.png", category: "Branding", dimensions: "512x512" },
  { id: "m-about-exact", name: "About Us Reference Banner", url: "/about-us-exact.png", category: "Pages", dimensions: "1200x800" },
  { id: "m-banner-contact", name: "Contact Page Banner", url: "/banners/banner_contact.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-customize", name: "Customize Page Banner", url: "/banners/banner_customize.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-gallery", name: "Product Gallery Banner", url: "/banners/banner_gallery.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-shop", name: "Shop by Category Banner", url: "/banners/banner_shop.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-featured", name: "Featured Products Banner", url: "/banners/banner_featured.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-cat-wedding", name: "Category: Wedding Gifts", url: "/reference-assets/cat-wedding.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-birthday", name: "Category: Birthday Gifts", url: "/reference-assets/cat-birthday.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-mehendi", name: "Category: Mehendi Gifts", url: "/reference-assets/cat-mehendi.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-diwali", name: "Category: Diwali Gifts", url: "/reference-assets/cat-diwali.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-rakhi", name: "Category: Rakshabandhan Gifts", url: "/reference-assets/cat-rakshabandhan.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-pooja", name: "Category: Pooja Products", url: "/reference-assets/cat-pooja.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-prod-mug", name: "Product: Gold-Rim Photo Mug", url: "/reference-assets/detail-mug.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-bouquet", name: "Product: Rose Bouquet", url: "/reference-assets/prod-fresh-bouquet.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-hamper", name: "Product: Gourmet Hamper", url: "/reference-assets/prod-gift-hamper.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-frame", name: "Product: Wooden Photo Frame", url: "/reference-assets/prod-photo-frame.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-about-home", name: "Home: About Us Showcase", url: "/reference-assets/about-home.jpg", category: "Home Sections", dimensions: "800x800" },
  { id: "m-customize-home", name: "Home: Customize Studio", url: "/reference-assets/customize-home.jpg", category: "Home Sections", dimensions: "800x800" }
];
