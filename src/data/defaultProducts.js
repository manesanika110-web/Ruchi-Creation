// Exact catalog items matching the reference sheet
export const CATEGORIES = [
  "Wedding Gifts",
  "Birthday Gifts",
  "Mehendi Gifts",
  "Diwali Gifts",
  "Rakshabandhan Gifts",
  "Pooja Products"
];

export const DEFAULT_PRODUCTS = [
  {
    id: "rc-custom-mug",
    name: "Personalized Gold-Rim Photo Mug",
    category: "Birthday Gifts",
    price: 499,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 28,
    image: "/reference-assets/detail-mug.jpg",
    gallery: [
      "/reference-assets/detail-mug.jpg",
      "/reference-assets/prod-custom-mug.jpg",
      "/reference-assets/shop-birthday-mug.jpg",
      "/reference-assets/customize-home.jpg"
    ],
    description: "Premium glossy white ceramic coffee mug with luxurious gold rim, custom-printed with your favorite photo and heartwarming message.",
    stock: 50,
    featured: true,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: true,
      colors: ["Pure White", "Burgundy Rim", "Mocha Latte"]
    }
  },
  {
    id: "rc-fresh-bouquet",
    name: "Scarlet Blush Rose Bouquet",
    category: "Wedding Gifts",
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 35,
    image: "/reference-assets/prod-fresh-bouquet.jpg",
    gallery: ["/reference-assets/prod-fresh-bouquet.jpg"],
    description: "Handcrafted luxury bouquet of fresh blooming red and blush pink roses with baby's breath, wrapped in elegant Korean matte paper with satin ribbon.",
    stock: 25,
    featured: true,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Red & Gold", "Pastel Blush"]
    }
  },
  {
    id: "rc-gift-hamper",
    name: "Royal Celebration Gourmet Hamper",
    category: "Wedding Gifts",
    price: 1499,
    originalPrice: 1899,
    rating: 5.0,
    reviewsCount: 44,
    image: "/reference-assets/prod-gift-hamper.jpg",
    gallery: ["/reference-assets/prod-gift-hamper.jpg", "/reference-assets/shop-wedding-hamper.jpg"],
    description: "Opulent woven basket packed with roasted dry fruits in glass jars, artisanal Belgian chocolates, and a scented celebration candle with a burgundy bow.",
    stock: 20,
    featured: true,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: true,
      colors: ["Royal Deep Burgundy", "Golden Mocha"]
    }
  },
  {
    id: "rc-photo-frame",
    name: "Timeless Moments Wooden Frame",
    category: "Birthday Gifts",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 39,
    image: "/reference-assets/prod-photo-frame.jpg",
    gallery: ["/reference-assets/prod-photo-frame.jpg", "/reference-assets/customize-home.jpg"],
    description: "Handcrafted natural oak wood photo frame showcasing your cherished memories, featuring UV-protected acrylic glass and an elegant standing easel.",
    stock: 30,
    featured: true,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: true,
      colors: ["Classic Wood", "Deep Burgundy"]
    }
  },
  {
    id: "rc-wedding-hamper",
    name: "Regal Heritage Wedding Hamper",
    category: "Wedding Gifts",
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 52,
    image: "/reference-assets/shop-wedding-hamper.jpg",
    gallery: ["/reference-assets/shop-wedding-hamper.jpg"],
    description: "Royal maroon and gold embroidered luxury wedding gift box with brass dry fruit bowls, gourmet saffron sweets, and auspicious silk blessing potlis.",
    stock: 15,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Deep Burgundy & Gold"]
    }
  },
  {
    id: "rc-birthday-mug",
    name: "Celebration Confetti Birthday Mug",
    category: "Birthday Gifts",
    price: 499,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 40,
    image: "/reference-assets/shop-birthday-mug.jpg",
    gallery: ["/reference-assets/shop-birthday-mug.jpg", "/reference-assets/detail-mug.jpg"],
    description: "Cheerful celebration ceramic mug adorned with colorful confetti artwork, glossy finish, and customized birthday greetings.",
    stock: 40,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: true,
      colors: ["Ceramic White"]
    }
  },
  {
    id: "rc-mehendi-box",
    name: "Emerald Bloom Mehendi Favor Box",
    category: "Mehendi Gifts",
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 26,
    image: "/reference-assets/shop-mehendi-box.jpg",
    gallery: ["/reference-assets/shop-mehendi-box.jpg"],
    description: "Handcrafted festive emerald green and gold favor box featuring fresh organic henna cones, ornate bangles, and herbal treats.",
    stock: 22,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Emerald Green & Gold"]
    }
  },
  {
    id: "rc-diwali-set",
    name: "Shubh Deepawali Brass Diya & Dry Fruit Hamper",
    category: "Diwali Gifts",
    price: 1499,
    originalPrice: 1899,
    rating: 5.0,
    reviewsCount: 48,
    image: "/reference-assets/shop-diwali-set.jpg",
    gallery: ["/reference-assets/shop-diwali-set.jpg"],
    description: "Auspicious festive royal tray with twin glowing engraved brass oil diyas, airtight glass jars of California almonds and cashews, and artisan sweets.",
    stock: 25,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Festive Golden"]
    }
  },
  {
    id: "rc-rakhi-hamper",
    name: "Designer Zardosi Rakhi Gift Platter",
    category: "Rakshabandhan Gifts",
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 31,
    image: "/reference-assets/shop-rakhi-hamper.jpg",
    gallery: ["/reference-assets/shop-rakhi-hamper.jpg"],
    description: "Exquisite handcrafted pearl and zardosi designer Rakhi presented on an embroidered silk platter with silver roli-chawal containers and Belgian chocolates.",
    stock: 18,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Red & Gold"]
    }
  },
  {
    id: "rc-pooja-thali",
    name: "Antique Brass Engraved Pooja Thali Set",
    category: "Pooja Products",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 37,
    image: "/reference-assets/shop-pooja-thali.jpg",
    gallery: ["/reference-assets/shop-pooja-thali.jpg"],
    description: "Pure solid brass sacred thali featuring intricately embossed floral motifs, complete with a brass diya, bell with Nandi figure, and kumkum bowls.",
    stock: 20,
    featured: false,
    isCustomizable: true,
    customizationOptions: {
      hasRecipientName: true,
      hasCustomMessage: true,
      hasPhotoUpload: false,
      colors: ["Antique Brass"]
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: "RC1287",
    orderNumber: "1287",
    createdAt: "2025-04-12T10:30:00Z",
    formattedDate: "12 Apr 2025",
    customer: {
      name: "Snehal Kulkarni",
      phone: "9511112616",
      email: "snehal@example.com",
      address: "Shivaji Chowk, Main Road",
      city: "Ichalkaranji",
      state: "Maharashtra",
      pincode: "416115"
    },
    items: [
      {
        cartId: "item-1",
        productId: "rc-custom-mug",
        name: "Personalized Gold-Rim Photo Mug",
        price: 1499,
        unitPrice: 1499,
        quantity: 1,
        image: "/reference-assets/prod-custom-mug.jpg",
        customization: {
          recipientName: "Best Sister Ever",
          customMessage: "Wishing you happiness on your special day!"
        }
      }
    ],
    subtotal: 1499,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 1499,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Processing"
  },
  {
    id: "RC1266",
    orderNumber: "1266",
    createdAt: "2025-04-10T14:15:00Z",
    formattedDate: "10 Apr 2025",
    customer: {
      name: "Rohit Jadhav",
      phone: "9823242576",
      email: "rohit@example.com",
      address: "Gandhi Nagar, Station Road",
      city: "Ichalkaranji",
      state: "Maharashtra",
      pincode: "416115"
    },
    items: [
      {
        cartId: "item-2",
        productId: "rc-photo-frame",
        name: "Timeless Moments Wooden Frame",
        price: 699,
        unitPrice: 699,
        quantity: 1,
        image: "/reference-assets/prod-photo-frame.jpg",
        customization: {
          recipientName: "Rohit & Sneha",
          customMessage: "Forever together"
        }
      }
    ],
    subtotal: 699,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 699,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Shipped"
  },
  {
    id: "RC1245",
    orderNumber: "1245",
    createdAt: "2025-04-05T18:00:00Z",
    formattedDate: "5 Apr 2025",
    customer: {
      name: "Pooja Patil",
      phone: "9123456780",
      email: "pooja@example.com",
      address: "Rajwada Complex, Near Bus Stand",
      city: "Ichalkaranji",
      state: "Maharashtra",
      pincode: "416115"
    },
    items: [
      {
        cartId: "item-3",
        productId: "rc-pooja-thali",
        name: "Antique Brass Engraved Pooja Thali Set",
        price: 1999,
        unitPrice: 1999,
        quantity: 1,
        image: "/reference-assets/shop-pooja-thali.jpg",
        customization: {
          recipientName: "Kunal & Riya",
          customMessage: "Happy Married Life!"
        }
      }
    ],
    subtotal: 1999,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 1999,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered"
  }
];

export const INITIAL_CART = [];
