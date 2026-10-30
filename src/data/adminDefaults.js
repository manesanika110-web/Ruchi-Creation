// Default configuration and structured data for Admin Panel content management

export const DEFAULT_PAGE_SETTINGS = {
  home: {
    id: "home",
    name: "Home",
    navLabel: "Home",
    path: "/",
    title: "Home",
    metaTitle: "Ruchi Creation | Handcrafted with Love | Bespoke Gifts Ichalkaranji",
    metaDescription: "Transforming cherished memories into timeless customized gifts, floral bouquets & luxury celebration hampers in Ichalkaranji.",
    bannerImage: "/banners/banner_home.jpg",
    heading: "Ruchi Creation",
    subheading: "Handcrafted with Love, Personalized for Every Special Moment",
    description: "Welcome to Ruchi Creation. Explore our curated gift lines, personal keepsakes, bouquets, and festive event rentals.",
    buttonText: "Shop All Gifts",
    buttonLink: "/shop-by-category",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  shopGifts: {
    id: "shopGifts",
    name: "Shop Gifts",
    navLabel: "Shop Gifts",
    path: "/shop-by-category",
    title: "Shop Gifts",
    heading: "Handcrafted Categories & Collections",
    subheading: "Find the perfect handmade gift for every festival, celebration, and cherished milestone.",
    bannerImage: "/banners/banner_shop.jpg",
    description: "Explore curated gift lines across Gift Hampers, Bouquets, Pooja Gifts, Personalized Gifts, Handmade Gifts, and Gifts by Budget.",
    buttonText: "View Featured",
    buttonLink: "/featured-products",
    badge: "",
    submenus: [
      { label: "Gift Hampers", path: "/shop-by-category?search=Hamper" },
      { label: "Bouquets", path: "/shop-by-category?search=Bouquet" },
      { label: "Pooja Gifts", path: "/shop-by-category?category=Pooja%20Products" },
      { label: "Personalized Gifts", path: "/customize-gifts" },
      { label: "Handmade Gifts", path: "/shop-by-category?search=Handmade" },
      { label: "Gift Sets", path: "/shop-by-category?search=Set" },
      { label: "Gifts by Budget", path: "/shop-by-category?budget=100-299" }
    ],
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  byRecipient: {
    id: "byRecipient",
    name: "By Recipient",
    navLabel: "By Recipient",
    path: "/by-recipient",
    title: "By Recipient",
    heading: "Gifts for Every Special Person",
    subheading: "Explore tailored gift collections designed thoughtfully for every relationship in your life.",
    bannerImage: "/banners/banner_shop.jpg",
    description: "Choose heartfelt gifts specifically chosen for Kids, Women, Men, Couples, Friends, Parents, and Bride & Groom.",
    buttonText: "Browse Gifts",
    buttonLink: "/by-recipient",
    badge: "",
    submenus: [
      { label: "Gifts for Kids", path: "/by-recipient?recipient=Kids" },
      { label: "Women", path: "/by-recipient?recipient=Women" },
      { label: "Men", path: "/by-recipient?recipient=Men" },
      { label: "Couples", path: "/by-recipient?recipient=Couples" },
      { label: "Friends", path: "/by-recipient?recipient=Friends" },
      { label: "Parents", path: "/by-recipient?recipient=Parents" },
      { label: "Bride & Groom", path: "/by-recipient?recipient=Bride%20%26%20Groom" }
    ],
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  byOccasion: {
    id: "byOccasion",
    name: "By Occasion",
    navLabel: "By Occasion",
    path: "/by-occasion",
    title: "By Occasion",
    heading: "Perfect Gifts for Every Celebration",
    subheading: "Celebrate birthdays, weddings, anniversaries, and sacred festivals with bespoke artistry.",
    bannerImage: "/banners/banner_shop.jpg",
    description: "Curated gifts for Birthday, Wedding, Anniversary, Engagement, Baby Shower, Haldi-Kumkum, Festivals, and Return Gifts.",
    buttonText: "Explore Occasions",
    buttonLink: "/by-occasion",
    badge: "",
    submenus: [
      { label: "Birthday", path: "/by-occasion?occasion=Birthday" },
      { label: "Wedding", path: "/by-occasion?occasion=Wedding" },
      { label: "Anniversary", path: "/by-occasion?occasion=Anniversary" },
      { label: "Engagement", path: "/by-occasion?occasion=Engagement" },
      { label: "Baby Shower", path: "/by-occasion?occasion=Baby%20Shower" },
      { label: "Haldi-Kumkum", path: "/by-occasion?occasion=Haldi-Kumkum" },
      { label: "Festivals", path: "/by-occasion?occasion=Festivals" },
      { label: "Return Gifts", path: "/by-occasion?occasion=Return%20Gifts" }
    ],
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  customize: {
    id: "customize",
    name: "Customize Gifts",
    navLabel: "Customize Gifts",
    path: "/customize-gifts",
    title: "Customize Gifts",
    heading: "Personalization Studio",
    subheading: "Add names, heartfelt messages, and photos to craft a one-of-a-kind keepsake.",
    bannerImage: "/banners/banner_customize.jpg",
    description: "Tailor photo mugs, bespoke wooden frames, celebration hampers, and bouquets with customized recipient names, colors, and memorable photos.",
    buttonText: "Browse Collection",
    buttonLink: "/shop-by-category",
    badge: "✨",
    submenus: [
      { label: "Photo Coffee Mugs", path: "/customize-gifts" },
      { label: "Custom Wooden Frames", path: "/customize-gifts" },
      { label: "Name Bouquets", path: "/customize-gifts" },
      { label: "Personalized Hampers", path: "/customize-gifts" }
    ],
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  rent: {
    id: "rent",
    name: "Rent",
    navLabel: "Rent",
    path: "/rent",
    title: "Rent Products",
    heading: "Rent for Special Events & Celebrations",
    subheading: "Premium event decor, mandaps, props, and handcrafted Rangoli plates on rent.",
    bannerImage: "/banners/banner_gallery.jpg",
    description: "Cost-effective rental service for weddings, baby showers, poojas, and photography setups with instant enquiry form.",
    buttonText: "Rent Enquiry Form",
    buttonLink: "/rent",
    badge: "New",
    submenus: [
      { label: "Rangoli Plates (Ready-Made)", path: "/rent?category=Rangoli%20Plates&subcategory=Ready-Made%20Rangoli%20Plates" },
      { label: "Pooja Rangoli Plates", path: "/rent?category=Rangoli%20Plates&subcategory=Pooja%20Rangoli%20Plates" },
      { label: "Wedding & Event Rangoli Plates", path: "/rent?category=Rangoli%20Plates&subcategory=Wedding%20%26%20Event%20Rangoli%20Plates" },
      { label: "Small & Large Rangoli Plates", path: "/rent?category=Rangoli%20Plates&subcategory=Small%20%26%20Large%20Rangoli%20Plates" },
      { label: "Decor Items", path: "/rent?category=Decor%20Items" },
      { label: "Event Props", path: "/rent?category=Event%20Props" },
      { label: "Photo Booths", path: "/rent?category=Photo%20Booths" },
      { label: "Furniture & Lighting", path: "/rent?category=Furniture" }
    ],
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  about: {
    id: "about",
    name: "About Us",
    navLabel: "About Us",
    path: "/about",
    title: "About Us",
    heading: "Our Story & Heartfelt Artistry",
    subheading: "Handmade and personalized gifts that bring smiles and create memories.",
    bannerImage: "/about-us-exact.png",
    description: "At Ruchi Creation, we craft handmade and personalized gifts designed to celebrate your special moments. Every piece is thoughtfully made with love and care to bring joy, smiles, and lasting memories.",
    buttonText: "Contact Studio",
    buttonLink: "/contact",
    badge: "",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  contact: {
    id: "contact",
    name: "Contact Us",
    navLabel: "Contact",
    path: "/contact",
    title: "Contact Us",
    heading: "Connect with Ruchi Creation",
    subheading: "Have a custom gift design in mind, need bulk corporate hampers, or want urgent delivery?",
    bannerImage: "/banners/banner_contact.jpg",
    description: "Get in touch with our studio in Ichalkaranji via phone, WhatsApp, or instant contact inquiry form.",
    buttonText: "Chat on WhatsApp",
    buttonLink: "https://wa.me/919511112616",
    badge: "",
    visible: true,
    lastUpdated: new Date().toISOString()
  },
  // Backward compatibility aliases
  shop: {
    id: "shop",
    name: "Shop by Category",
    path: "/shop-by-category",
    title: "Shop by Category",
    heading: "Handcrafted Categories",
    subheading: "Find the perfect handmade gift for every festival, celebration, and cherished milestone.",
    bannerImage: "/banners/banner_shop.jpg",
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
    bannerImage: "/reference-assets/hero-banner-hd.jpg",
    primaryBtnText: "Shop All Gifts",
    primaryBtnLink: "/shop-by-category",
    secondaryBtnText: "Customize Gifts",
    secondaryBtnLink: "/customize-gifts",
    trustBadges: [
      "100% Handcrafted",
      "Premium Materials",
      "Express Customization"
    ],
    enabled: true
  },
  serviceBenefits: {
    id: "serviceBenefits",
    name: "Service Benefits Bar",
    items: [
      { id: "shipping", title: "Free Shipping", subtitle: "On orders above ₹999", icon: "Truck" },
      { id: "secure", title: "Secure Payments", subtitle: "100% secure payment", icon: "ShieldCheck" },
      { id: "handmade", title: "Handmade with Love", subtitle: "Crafted with care", icon: "Heart" },
      { id: "wrapping", title: "Gift Wrapping", subtitle: "Make it extra special", icon: "Gift" }
    ],
    enabled: true
  },
  shopByCategory: {
    id: "shopByCategory",
    name: "Shop by Category Section",
    heading: "Shop by Category",
    items: [
      { id: "pooja-essentials", name: "Pooja Essentials", image: "/images/Pooja desing Thali.png", link: "/shop-by-category?category=Pooja%20Products" },
      { id: "bouquets", name: "Bouquets", image: "/images/customized-flower-bouquet.jpg", link: "/shop-by-category?search=Bouquet" },
      { id: "hampers", name: "Hampers", image: "/images/anniversary-hamper.jpg", link: "/shop-by-category?search=Hamper" },
      { id: "personalised-gifts", name: "Personalised Gifts", image: "/images/couple-gift-set.jpg", link: "/customize-gifts" },
      { id: "birthday-gifts", name: "Birthday Gifts", image: "/images/cat-birthday-teddy.jpg", link: "/by-occasion?occasion=Birthday" },
      { id: "bridal-gifts", name: "Bridal Gifts", image: "/images/cat-bridal-gift.jpg", link: "/by-recipient?recipient=Bride%20%26%20Groom" },
      { id: "rangoli-plates", name: "Rangoli Plates", image: "/images/Custmised Readymade Rangoli Plate.png", link: "/rent?category=Rangoli%20Plates" },
      { id: "rent-products", name: "Rent Products", image: "/images/cat-rent-decor.jpg", link: "/rent" }
    ],
    enabled: true
  },
  featuredProducts: {
    id: "featuredProducts",
    name: "Featured Products Showcase",
    heading: "Featured Products",
    viewAllText: "View All Gallery",
    viewAllLink: "/featured-products",
    productIds: [
      "rc-jasvand-pooja-mala",
      "rc-red-pooja-thali",
      "rc-haldi-kumkum-set",
      "rc-coconut-pack",
      "rc-birthday-gift-girl",
      "rc-customized-flower-bouquet"
    ],
    enabled: true
  },
  thoughtfulGifts: {
    id: "thoughtfulGifts",
    name: "Thoughtful Gifts Banner",
    heading: "Thoughtful Gifts for Every Moment",
    subheading: "From birthdays to weddings, from kids to grandparents – find the perfect gift for every person and every occasion.",
    enabled: true
  },
  about: {
    id: "about",
    name: "About Us Story",
    badge: "ABOUT US",
    title: "Our Story & Heartfelt Artistry",
    subtitle: "Handmade and personalized gifts that bring smiles and create memories.",
    paragraphs: [
      "At Ruchi Creation, we craft handmade and personalized gifts designed to celebrate your special moments. Every piece is thoughtfully made with love and care to bring joy, smiles, and lasting memories."
    ],
    pillars: [
      { id: 1, title: "Artisanal Design", desc: "Thoughtfully styled and assembled by hand.", icon: "Palette" },
      { id: 2, title: "Made with Love", desc: "Personalized with custom names, photos & messages.", icon: "Heart" },
      { id: 3, title: "Finest Materials", desc: "Premium florals, ceramics and luxury ribbons.", icon: "Award" },
      { id: 4, title: "Reliable Service", desc: "Safe packaging and dependable, timely delivery.", icon: "Truck" }
    ],
    image: "/reference-assets/about-home.jpg",
    imageTag: "Boutique Studio • Est. 2018",
    imageCaption: "Handmade with love by Ruchi Biyani in Ichalkaranji",
    primaryBtnText: "Learn More",
    primaryBtnLink: "/about",
    secondaryBtnText: "Contact Studio",
    secondaryBtnLink: "/contact",
    enabled: false
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
    enabled: false
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
    enabled: false
  }
};

export const DEFAULT_SECTION_ORDER = [
  "hero",
  "serviceBenefits",
  "shopByCategory",
  "featuredProducts",
  "thoughtfulGifts"
];

export const DEFAULT_FOOTER_SETTINGS = {
  storeName: "Ruchi Creation",
  tagline: "Handmade with Love",
  logo: "/logo.png",
  description: "Bringing smiles with handcrafted gifts for every occasion. From heartfelt personalized gifts to elegant hampers, we make your special moments more memorable.",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com/ruchi_creation",
    youtube: "https://youtube.com",
    pinterest: "https://pinterest.com"
  },
  contactDetails: {
    email: "contact@ruchicreation.com",
    phone: "+91 95111 12616",
    whatsapp: "919511112616",
    location: "Ichalkaranji, Maharashtra, India"
  },
  quickLinks: [
    { label: "Home", path: "/" },
    { label: "Shop Gifts", path: "/shop-by-category" },
    { label: "By Recipient", path: "/by-recipient" },
    { label: "By Occasion", path: "/by-occasion" },
    { label: "Customize Gifts", path: "/customize-gifts" },
    { label: "Rent", path: "/rent" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" }
  ],
  shopGiftsLinks: [
    { label: "Gift Hampers", path: "/shop-by-category?search=Hamper" },
    { label: "Bouquets", path: "/shop-by-category?search=Bouquet" },
    { label: "Pooja Gifts", path: "/shop-by-category?category=Pooja%20Products" },
    { label: "Personalized Gifts", path: "/customize-gifts" },
    { label: "Handmade Gifts", path: "/shop-by-category?search=Handmade" },
    { label: "Gift Sets", path: "/shop-by-category?search=Set" },
    { label: "Gifts by Budget", path: "/shop-by-category?budget=100-299" }
  ],
  customerCareLinks: [
    { label: "FAQs", modal: "faq" },
    { label: "Shipping Policy", modal: "shipping" },
    { label: "Return & Refund", modal: "return" },
    { label: "Terms & Conditions", modal: "terms" },
    { label: "Privacy Policy", modal: "privacy" },
    { label: "Track Order", path: "/my-orders" }
  ],
  newsletterHeading: "Newsletter",
  newsletterText: "Get the latest updates, offers & new arrivals straight to your inbox.",
  newsletterPlaceholder: "Enter your email address",
  copyrightText: "© 2026 Ruchi Creation. All Rights Reserved.",
  loveNote: "Handmade with Love",
  paymentMethods: ["UPI", "VISA", "Mastercard", "RuPay", "Cash on Delivery"]
};

export const DEFAULT_MEDIA_ITEMS = [
  { id: "m-logo", name: "Store Logo", url: "/logo.png", category: "Branding", dimensions: "512x512" },
  { id: "m-hero-video", name: "Hero Background Video", url: "/gift-video.mp4", category: "Hero", dimensions: "1920x1080" },
  { id: "m-hero-poster", name: "Hero Poster HD", url: "/reference-assets/hero-banner-hd.jpg", category: "Hero", dimensions: "1920x1080" },
  { id: "m-about-exact", name: "About Us Reference Banner", url: "/about-us-exact.png", category: "Pages", dimensions: "1200x800" },
  { id: "m-banner-contact", name: "Contact Page Banner", url: "/banners/banner_contact.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-customize", name: "Customize Page Banner", url: "/banners/banner_customize.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-gallery", name: "Product Gallery Banner", url: "/banners/banner_gallery.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-shop", name: "Shop by Category Banner", url: "/banners/banner_shop.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-banner-featured", name: "Featured Products Banner", url: "/banners/banner_featured.jpg", category: "Banners", dimensions: "1600x500" },
  { id: "m-cat-pooja", name: "Category: Pooja Essentials", url: "/images/Pooja desing Thali.png", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-bouquet", name: "Category: Bouquets", url: "/images/customized-flower-bouquet.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-hamper", name: "Category: Hampers", url: "/images/anniversary-hamper.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-customize", name: "Category: Personalised Gifts", url: "/images/couple-gift-set.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-birthday", name: "Category: Birthday Gifts", url: "/images/cat-birthday-teddy.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-bridal", name: "Category: Bridal Gifts", url: "/images/cat-bridal-gift.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-rangoli", name: "Category: Rangoli Plates", url: "/images/Custmised Readymade Rangoli Plate.png", category: "Categories", dimensions: "600x600" },
  { id: "m-cat-rent", name: "Category: Rent Products", url: "/images/cat-rent-decor.jpg", category: "Categories", dimensions: "600x600" },
  { id: "m-rangoli-readymade", name: "Rangoli: Ready-Made Floral Plate", url: "/images/rangoli-cat-readymade.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-pooja", name: "Rangoli: Pooja Diya Urli Plate", url: "/images/rangoli-cat-pooja.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-wedding", name: "Rangoli: Wedding Mandala Tassel Plate", url: "/images/rangoli-cat-wedding.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-small-large", name: "Rangoli: Small & Large Mirror Plate", url: "/images/rangoli-cat-small-large.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-collection", name: "Rangoli Plates Collection", url: "/images/rangoli-plates-collection.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-krishna-readymade", name: "Rangoli: Ready-Made Bal Krishna", url: "/images/rangoli-ready-made-krishna.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-peacock", name: "Rangoli: Wedding Peacock", url: "/images/rangoli-wedding-peacock.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-krishna-lotus", name: "Rangoli: Pooja Krishna Lotus", url: "/images/rangoli-pooja-krishna-lotus.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-rose-wreath", name: "Rangoli: Pooja Rose Wreath", url: "/images/rangoli-event-floral-wreath.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-krishna-swing", name: "Rangoli: Wedding Krishna Jhula", url: "/images/rangoli-wedding-krishna-swing.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-marigold-peacock", name: "Rangoli: Marigold Peacock", url: "/images/rangoli-event-yellow-marigold.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-makhan-chor", name: "Rangoli: Small Makhan Chor (8 inch)", url: "/images/rangoli-small-makhan-chor.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-rangoli-krishna-large", name: "Rangoli: Large Krishna Portrait (14 inch)", url: "/images/rangoli-large-krishna-portrait.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-womens-box", name: "Product: Women's Gift Box", url: "/images/womens-gift-box.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-mens-kit", name: "Product: Men's Grooming Kit", url: "/images/mens-grooming-kit.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-couple-set", name: "Product: Couple Gift Set", url: "/images/couple-gift-set.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-parents-gift", name: "Product: Parents Day Gift", url: "/images/parents-day-gift.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-haldi-kumkum", name: "Product: Haldi-Kumkum Platter Set", url: "/images/haldi-kumkum-set.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-jasvand-mala", name: "Product: Jasvand Pooja Mala", url: "/images/jasvand-pooja-mala.jpg", category: "Products", dimensions: "800x800" },
  { id: "m-prod-coconut-pack", name: "Product: Coconut Shrifal Pack", url: "/images/coconut-pack.jpg", category: "Products", dimensions: "800x800" }
];
