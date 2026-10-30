import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_PRODUCTS } from "../data/defaultProducts";
import { 
  DEFAULT_PAGE_SETTINGS, 
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_HOME_SECTIONS, 
  DEFAULT_SECTION_ORDER, 
  DEFAULT_MEDIA_ITEMS 
} from "../data/adminDefaults";
import { 
  firebaseRegisterUser, 
  firebaseLoginUser, 
  firebaseSignOutUser,
  subscribeToAuthChanges,
  subscribeToProducts,
  firestoreSetDoc,
  firestoreGetCollection,
  firestoreDeleteDoc,
  COLLECTIONS,
  isConfigured,
  db
} from "../services/firebase";
import { persistProductImage } from "../services/imageStorage";

const AppContext = createContext();

const INITIAL_SETTINGS = {
  storeName: "Ruchi Creation",
  tagline: "Handmade with Love",
  phones: "9511112616 / 9823242576",
  phone: "9511112616",
  phoneDisplay: "+91 95111 12616",
  altPhone: "9823242576",
  whatsapp: "919511112616",
  email: "ruchicreation@gmail.com",
  website: "www.ruchicreation.com",
  owner: "Ruchika Anvekar",
  experience: "9+ Years of Experience",
  location: "Ichalkaranji, Maharashtra",
  fullAddress: "Ruchi Creation Studio, Near Main Market, Ichalkaranji - 416115",
  logo: "/logo.png",
  heroTitle: "Ruchi Creation",
  heroSubtitle: "Handmade with Love",
  heroTag: "Personalized Gifts | Bouquets | Hampers | Special Moments",
  announcement: "✨ Free Express Delivery on Custom Gift Hampers in Ichalkaranji! Order Today.",
  adminPassword: "admin123",
  adminEmail: "admin@ruchicreation.com",
  instagram: "ruchi_creation",
  instagramUrl: "https://instagram.com/ruchi_creation"
};

// Helper to get unique user-specific wishlist key
const getUserWishlistKey = (user) => {
  if (!user) return null;
  const uid = user.id || user.uid || (user.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : null);
  return uid ? `rc_wishlist_${uid}` : null;
};

// Helper to get unique user-specific cart key
const getUserCartKey = (user) => {
  if (!user) return null;
  const uid = user.id || user.uid || (user.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : null);
  return uid ? `rc_cart_${uid}` : null;
};

// Helper to safely write to localStorage without crashing React on QuotaExceededError
const safeStorageSet = (key, value) => {
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`[Storage Warning] Failed to write key "${key}":`, err);
    // If quota exceeded, clean up non-critical cache keys
    if (err && (err.name === "QuotaExceededError" || err.code === 22 || err.code === 1014)) {
      try {
        localStorage.removeItem("rc_replica_cart");
        const rawMedia = localStorage.getItem("rc_media_library");
        if (rawMedia && rawMedia.length > 400000) {
          localStorage.removeItem("rc_media_library");
        }
        if (key === "rc_media_library" && Array.isArray(value)) {
          const compactMedia = value.filter((m) => !(m.url && typeof m.url === "string" && m.url.startsWith("data:") && m.url.length > 100000)).slice(0, 15);
          localStorage.setItem(key, JSON.stringify(compactMedia));
        } else if (key === "rc_replica_products" && Array.isArray(value)) {
          const cleanProducts = value.map((p) => {
            if (p.image && typeof p.image === "string" && p.image.length > 100000) {
              return { ...p, image: "/reference-assets/detail-mug.jpg" };
            }
            return p;
          });
          localStorage.setItem(key, JSON.stringify(cleanProducts));
        }
      } catch (innerErr) {
        console.warn("[Storage Recovery] Could not recover space:", innerErr);
      }
    }
  }
};

export const AppProvider = ({ children }) => {
  // 1. Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("rc_replica_settings");
    if (saved) {
      try {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved), logo: "/logo.png" };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SETTINGS;
  });

  // 2. Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("rc_replica_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p) => p.id));
          const missingDefaults = DEFAULT_PRODUCTS.filter((dp) => !existingIds.has(dp.id));
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults];
            safeStorageSet("rc_replica_products", merged);
            return merged;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PRODUCTS;
  });

  // 3. Cart (User-isolated: loads only for currently authenticated user)
  const [cart, setCart] = useState(() => {
    const savedUser = localStorage.getItem("rc_current_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const cartKey = getUserCartKey(u);
        if (cartKey) {
          const saved = localStorage.getItem(cartKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.filter((item) => item.cartId !== "cart-mug" && item.cartId !== "cart-hamper");
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Clean up any stale legacy global cart so it never leaks across users
    try {
      localStorage.removeItem("rc_replica_cart");
    } catch {}
    return [];
  });

  // 4. Orders (Only real orders stored, no dummy or sample orders)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("rc_replica_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((o) => o.id !== "RC1244" && o.id !== "RC1245");
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // 5. Enquiries & Customization Requests
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem("rc_replica_enquiries");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // 6. Registered Users (No sample/dummy users)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("rc_registered_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((u) => !u.id?.startsWith("usr-demo"));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // 7. Website Menu Pages Content & Visibility
  const [pageSettings, setPageSettings] = useState(() => {
    const saved = localStorage.getItem("rc_page_settings");
    if (saved) {
      try {
        return { ...DEFAULT_PAGE_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PAGE_SETTINGS;
  });

  // 8. Home Page Sections Content & Settings
  const [homeSections, setHomeSections] = useState(() => {
    const saved = localStorage.getItem("rc_home_sections");
    if (saved) {
      try {
        return { ...DEFAULT_HOME_SECTIONS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_HOME_SECTIONS;
  });

  // 9. Home Section Order Sequence
  const [homeSectionOrder, setHomeSectionOrder] = useState(() => {
    const saved = localStorage.getItem("rc_home_section_order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const rest = parsed.filter((id) => id !== "hero" && id !== "about");
          return ["hero", "about", ...rest];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SECTION_ORDER;
  });

  // 10. Media Library (Image & Text Management)
  const [mediaLibrary, setMediaLibrary] = useState(() => {
    const saved = localStorage.getItem("rc_media_library");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MEDIA_ITEMS;
  });

  // 11. Footer Content & Management
  const [footerSettings, setFooterSettings] = useState(() => {
    const saved = localStorage.getItem("rc_footer_settings");
    if (saved) {
      try {
        return { ...DEFAULT_FOOTER_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_FOOTER_SETTINGS;
  });

  // Admin User
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("rc_replica_admin");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Registered / Logged-in Customer User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("rc_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Wishlist (Product IDs)
  const [wishlist, setWishlist] = useState(() => {
    const savedUser = localStorage.getItem("rc_current_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const uid = u?.id || u?.uid || (u?.email ? u.email.toLowerCase().replace(/[^a-z0-9]/g, "_") : null);
        if (uid) {
          const savedWishlist = localStorage.getItem(`rc_wishlist_${uid}`);
          if (savedWishlist) {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) return parsed;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Auth modal toggle
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Animations State
  const [flyingCartItem, setFlyingCartItem] = useState(null);
  const [cartBouncing, setCartBouncing] = useState(false);
  const [animatingWishlistId, setAnimatingWishlistId] = useState(null);

  const triggerCartBounce = () => {
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 600);
  };

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Persist to localStorage safely
  useEffect(() => {
    safeStorageSet("rc_replica_settings", settings);
  }, [settings]);

  useEffect(() => {
    safeStorageSet("rc_replica_products", products);
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      const key = getUserCartKey(currentUser);
      if (key) {
        safeStorageSet(key, cart);
      }
    }
  }, [cart, currentUser]);

  useEffect(() => {
    safeStorageSet("rc_replica_orders", orders);
  }, [orders]);

  useEffect(() => {
    safeStorageSet("rc_replica_enquiries", enquiries);
  }, [enquiries]);

  useEffect(() => {
    safeStorageSet("rc_registered_users", registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    safeStorageSet("rc_page_settings", pageSettings);
  }, [pageSettings]);

  useEffect(() => {
    safeStorageSet("rc_home_sections", homeSections);
  }, [homeSections]);

  useEffect(() => {
    safeStorageSet("rc_home_section_order", homeSectionOrder);
  }, [homeSectionOrder]);

  useEffect(() => {
    safeStorageSet("rc_media_library", mediaLibrary);
  }, [mediaLibrary]);

  useEffect(() => {
    safeStorageSet("rc_footer_settings", footerSettings);
  }, [footerSettings]);

  useEffect(() => {
    if (adminUser) {
      safeStorageSet("rc_replica_admin", adminUser);
    } else {
      try { localStorage.removeItem("rc_replica_admin"); } catch {}
    }
  }, [adminUser]);

  useEffect(() => {
    if (currentUser) {
      safeStorageSet("rc_current_user", currentUser);
      const key = getUserWishlistKey(currentUser);
      if (key) {
        try {
          const savedWishlist = localStorage.getItem(key);
          if (savedWishlist) {
            const parsed = JSON.parse(savedWishlist);
            setWishlist(Array.isArray(parsed) ? parsed : []);
          } else {
            setWishlist((prev) => (prev && prev.length === 0 ? prev : []));
          }
        } catch {
          setWishlist((prev) => (prev && prev.length === 0 ? prev : []));
        }
      }

      // Load user's cart
      const cartKey = getUserCartKey(currentUser);
      if (cartKey) {
        try {
          const savedCart = localStorage.getItem(cartKey);
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCart(parsed.filter((item) => item.cartId !== "cart-mug" && item.cartId !== "cart-hamper"));
            } else {
              setCart((prev) => (prev && prev.length === 0 ? prev : []));
            }
          } else {
            setCart((prev) => (prev && prev.length === 0 ? prev : []));
          }
        } catch {
          setCart((prev) => (prev && prev.length === 0 ? prev : []));
        }
      }
    } else {
      try {
        localStorage.removeItem("rc_current_user");
        localStorage.removeItem("rc_replica_cart");
      } catch {}
      setWishlist((prev) => (prev && prev.length === 0 ? prev : []));
      setCart((prev) => (prev && prev.length === 0 ? prev : []));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const key = getUserWishlistKey(currentUser);
      if (key) {
        safeStorageSet(key, wishlist);
      }
    }
  }, [wishlist, currentUser]);

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((fbUser) => {
      if (fbUser) {
        setCurrentUser((prev) => {
          if (prev && prev.id === fbUser.uid && prev.email === fbUser.email && prev.name === (fbUser.displayName || prev.name)) {
            return prev;
          }
          const userObj = {
            id: fbUser.uid,
            uid: fbUser.uid,
            name: fbUser.displayName || prev?.name || fbUser.email.split("@")[0],
            email: fbUser.email,
            phone: prev?.phone || "",
            createdAt: fbUser.metadata?.creationTime || prev?.createdAt || new Date().toISOString()
          };
          safeStorageSet("rc_current_user", userObj);
          return userObj;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch orders from Cloud Firestore on mount (Only order data is stored in Firestore)
  useEffect(() => {
    let isMounted = true;
    const loadFirestoreOrders = async () => {
      if (isConfigured && db) {
        try {
          const res = await firestoreGetCollection(COLLECTIONS.ORDERS);
          if (res.success && Array.isArray(res.data) && isMounted) {
            const cleanOrders = res.data.filter((o) => o.id !== "RC1244" && o.id !== "RC1245");
            if (cleanOrders.length > 0) {
              setOrders(cleanOrders);
            }
          }
        } catch (e) {
          console.warn("Could not load orders from Firestore:", e);
        }
      }
    };
    loadFirestoreOrders();
    return () => { isMounted = false; };
  }, []);

  // Helper to ensure clean, strictly serializable document for Cloud Firestore
  const sanitizeProductForFirestore = (prod) => {
    const doc = {
      id: String(prod.id || ("rc-prod-" + Date.now())),
      name: String(prod.name || "Custom Gift").trim(),
      category: String(prod.category || "Customize Gifts").trim(),
      price: Number(prod.price || 0),
      stock: Number(prod.stock ?? 25),
      image: typeof prod.image === "string" ? prod.image : "/reference-assets/detail-mug.jpg",
      description: String(prod.description || "").trim(),
      featured: Boolean(prod.featured),
      bestseller: Boolean(prod.bestseller),
      isCustomizable: Boolean(prod.isCustomizable || (prod.category || "").toLowerCase().includes("custom")),
      rating: Number(prod.rating || 4.9),
      reviewsCount: Number(prod.reviewsCount || 25),
      gallery: Array.isArray(prod.gallery) && prod.gallery.length > 0
        ? prod.gallery.filter((g) => typeof g === "string")
        : [typeof prod.image === "string" ? prod.image : "/reference-assets/detail-mug.jpg"],
      customizationOptions: {
        hasRecipientName: Boolean(prod.customizationOptions?.hasRecipientName ?? true),
        hasCustomMessage: Boolean(prod.customizationOptions?.hasCustomMessage ?? true),
        hasPhotoUpload: Boolean(prod.customizationOptions?.hasPhotoUpload ?? false),
        colors: Array.isArray(prod.customizationOptions?.colors)
          ? prod.customizationOptions.colors
          : ["Deep Burgundy", "Golden Mocha"],
        occasions: Array.isArray(prod.customizationOptions?.occasions)
          ? prod.customizationOptions.occasions
          : ["Birthday", "Anniversary", "Special Surprise", "Festival"]
      },
      createdAt: prod.createdAt || new Date().toISOString()
    };

    if (prod.originalPrice != null && !isNaN(Number(prod.originalPrice))) {
      doc.originalPrice = Number(prod.originalPrice);
    }
    if (prod.imageData && typeof prod.imageData === "string") {
      doc.imageData = prod.imageData;
    }
    if (prod.recipients && Array.isArray(prod.recipients)) {
      doc.recipients = prod.recipients;
    }
    if (prod.occasions && Array.isArray(prod.occasions)) {
      doc.occasions = prod.occasions;
    }
    if (prod.isRental != null) {
      doc.isRental = Boolean(prod.isRental);
    }
    if (prod.rentalCategory) {
      doc.rentalCategory = String(prod.rentalCategory);
    }
    if (prod.rangoliSubcategory) {
      doc.rangoliSubcategory = String(prod.rangoliSubcategory);
    }
    if (prod.rentalUnit) {
      doc.rentalUnit = String(prod.rentalUnit);
    }
    if (prod.securityDeposit != null && !isNaN(Number(prod.securityDeposit))) {
      doc.securityDeposit = Number(prod.securityDeposit);
    }
    if (prod.rentalDuration) {
      doc.rentalDuration = String(prod.rentalDuration);
    }
    return doc;
  };

  // Synchronize & listen to products in real-time from Cloud Firestore with auto-seeding
  useEffect(() => {
    let isMounted = true;
    if (!isConfigured || !db) return;

    // 1. Initial Load & Auto-Seed from Cloud Firestore
    const initFirestoreProducts = async () => {
      try {
        const remoteRes = await firestoreGetCollection(COLLECTIONS.PRODUCTS);
        let remoteProducts = [];
        if (remoteRes.success && Array.isArray(remoteRes.data)) {
          remoteProducts = remoteRes.data;
        }

        const remoteMap = new Map(remoteProducts.map((p) => [p.id, p]));
        
        // Auto-seed any default products not yet in Firestore so Firestore is the permanent cloud source of truth
        const missingDefaults = DEFAULT_PRODUCTS.filter((dp) => !remoteMap.has(dp.id));
        if (missingDefaults.length > 0) {
          console.log(`[Firestore Auto-Seed] Syncing ${missingDefaults.length} products to Cloud Firestore...`);
          for (const item of missingDefaults) {
            try {
              const cleanDoc = sanitizeProductForFirestore(item);
              await firestoreSetDoc(COLLECTIONS.PRODUCTS, item.id, cleanDoc);
            } catch (seedErr) {
              console.warn(`[Firestore Auto-Seed] Error syncing ${item.id}:`, seedErr);
            }
          }
        }

        // Merge remote products with defaults
        const combined = [...remoteProducts];
        DEFAULT_PRODUCTS.forEach((dp) => {
          if (!remoteMap.has(dp.id)) {
            combined.push(dp);
          }
        });

        if (isMounted && combined.length > 0) {
          setProducts(combined);
          safeStorageSet("rc_replica_products", combined);
        }
      } catch (err) {
        console.warn("Initial Firestore products sync notice:", err);
      }
    };

    initFirestoreProducts();

    // 2. Real-time subscription to Cloud Firestore products
    const unsubscribe = subscribeToProducts((remoteProducts) => {
      if (Array.isArray(remoteProducts) && isMounted) {
        setProducts((prev) => {
          const remoteMap = new Map(remoteProducts.map((p) => [p.id, p]));
          const combined = [...remoteProducts];

          DEFAULT_PRODUCTS.forEach((dp) => {
            if (!remoteMap.has(dp.id)) {
              combined.push(dp);
            }
          });

          safeStorageSet("rc_replica_products", combined);
          return combined;
        });
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Sync Orders and Products with Cloud Firestore
  const syncAllWithFirestore = useCallback(async () => {
    if (!isConfigured || !db) {
      return { success: false, message: "Firebase is in standby mode. Data is saved locally." };
    }

    setIsSyncing(true);
    try {
      // 1. Sync Orders
      const remoteOrders = await firestoreGetCollection(COLLECTIONS.ORDERS);
      if (remoteOrders.success && Array.isArray(remoteOrders.data)) {
        const cleanOrders = remoteOrders.data.filter((o) => o.id !== "RC1244" && o.id !== "RC1245");
        setOrders(cleanOrders);
      }

      // 2. Sync Products
      const remoteProducts = await firestoreGetCollection(COLLECTIONS.PRODUCTS);
      if (remoteProducts.success && Array.isArray(remoteProducts.data) && remoteProducts.data.length > 0) {
        const remoteMap = new Map(remoteProducts.data.map((p) => [p.id, p]));
        const combined = [...remoteProducts.data];
        DEFAULT_PRODUCTS.forEach((dp) => {
          if (!remoteMap.has(dp.id)) {
            combined.push(dp);
          }
        });
        setProducts(combined);
        safeStorageSet("rc_replica_products", combined);
      }

      setIsSyncing(false);
      showToast("Data successfully synchronized with Cloud Firestore!");
      return { success: true };
    } catch (err) {
      setIsSyncing(false);
      console.warn("Firestore sync notice:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Product CRUD: Persistent Image Upload + Cloud Firestore + Local Cache
  const addProduct = async (p) => {
    const id = p.id || ("rc-prod-" + Date.now());

    // 1. Process image if provided as File, Blob, or raw upload
    let finalImageUrl = typeof p.image === "string" && p.image ? p.image : "/reference-assets/detail-mug.jpg";
    let finalImageData = p.imageData || (finalImageUrl.startsWith("data:") ? finalImageUrl : null);

    if (p.image && (typeof p.image !== "string" || p.image instanceof File || p.image instanceof Blob)) {
      try {
        const uploadResult = await persistProductImage(p.image, p.name);
        if (uploadResult && uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url;
          if (uploadResult.imageData) finalImageData = uploadResult.imageData;
        }
      } catch (imgErr) {
        console.warn("Product image upload notice:", imgErr);
      }
    }

    const item = {
      ...p,
      id,
      image: finalImageUrl,
      ...(finalImageData ? { imageData: finalImageData } : {}),
      gallery: Array.isArray(p.gallery) && p.gallery.length > 0
        ? p.gallery.filter((g) => typeof g === "string")
        : [finalImageUrl],
      createdAt: p.createdAt || new Date().toISOString()
    };

    // 2. Immediately update local state so product appears instantly in category without page refresh
    setProducts((prev) => [item, ...prev.filter((prod) => prod.id !== id)]);

    // 3. Save clean product document permanently in Cloud Firestore
    if (isConfigured && db) {
      try {
        const cleanDoc = sanitizeProductForFirestore(item);
        const fbRes = await firestoreSetDoc(COLLECTIONS.PRODUCTS, id, cleanDoc);
        if (!fbRes.success) {
          console.warn("Could not save product to Firestore:", fbRes.error);
        }
      } catch (err) {
        console.warn("Could not save product to Firestore:", err);
      }
    }

    // 4. Add to media library
    if (finalImageUrl) {
      try {
        addMediaItem({
          id: "m-" + id,
          name: `Product: ${item.name}`,
          url: finalImageUrl,
          category: "Products"
        });
      } catch (e) {
        console.warn("Media library sync:", e);
      }
    }

    showToast(`"${item.name}" added to ${item.category || "catalog"}!`);
    return item;
  };

  const updateProduct = async (id, fields) => {
    let updatedFields = { ...fields };

    // If image was changed to a new upload, persist image
    if (fields.image && (typeof fields.image !== "string" || fields.image.startsWith("data:"))) {
      try {
        const uploadResult = await persistProductImage(fields.image, fields.name || "product");
        if (uploadResult && uploadResult.success && uploadResult.url) {
          updatedFields.image = uploadResult.url;
          if (uploadResult.imageData) updatedFields.imageData = uploadResult.imageData;
        }
      } catch (imgErr) {
        console.warn("Product image update notice:", imgErr);
      }
    }

    // 1. Update local state immediately
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));

    // 2. Update in Cloud Firestore
    if (isConfigured && db) {
      try {
        const cleanDoc = sanitizeProductForFirestore({ id, ...updatedFields });
        await firestoreSetDoc(COLLECTIONS.PRODUCTS, id, cleanDoc, true);
      } catch (err) {
        console.warn("Could not update product in Firestore:", err);
      }
    }

    showToast("Product updated!");
  };

  const deleteProduct = async (id) => {
    // 1. Remove from local state immediately
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // 2. Delete from Cloud Firestore
    if (isConfigured && db) {
      try {
        await firestoreDeleteDoc(COLLECTIONS.PRODUCTS, id);
      } catch (err) {
        console.warn("Could not delete product from Firestore:", err);
      }
    }

    showToast("Product removed!");
  };

  // Cart actions
  const addToCart = (product, customization = {}, quantity = 1, clickEvent = null) => {
    const cartId = `cart-${Date.now()}`;
    const newItem = {
      cartId,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unitPrice: product.price,
      image: product.image,
      quantity,
      customization: {
        recipientName: customization.recipientName || "",
        customMessage: customization.customMessage || "",
        photoPreview: customization.photoPreview || null,
        photoFileName: customization.photoFileName || "",
        selectedColor: customization.selectedColor || ""
      }
    };
    setCart((prev) => [newItem, ...prev]);
    showToast(`"${product.name}" added to cart!`);

    // Add-to-cart flying image animation
    if (clickEvent && (clickEvent.clientX || clickEvent.currentTarget)) {
      const rect = clickEvent.currentTarget ? clickEvent.currentTarget.getBoundingClientRect() : null;
      const startX = clickEvent.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
      const startY = clickEvent.clientY || (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);

      const cartBtn = document.getElementById("nav-cart-btn");
      let destX = window.innerWidth - 60;
      let destY = 24;
      if (cartBtn) {
        const cartRect = cartBtn.getBoundingClientRect();
        destX = cartRect.left + cartRect.width / 2;
        destY = cartRect.top + cartRect.height / 2;
      }

      setFlyingCartItem({
        image: product.image || "/logo.png",
        startX,
        startY,
        destX,
        destY
      });

      setTimeout(() => {
        setFlyingCartItem(null);
        triggerCartBounce();
      }, 700);
    } else {
      triggerCartBounce();
    }
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    showToast("Item removed from cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser) {
      const key = getUserCartKey(currentUser);
      if (key) {
        try {
          localStorage.removeItem(key);
        } catch {}
      }
    }
    try {
      localStorage.removeItem("rc_replica_cart");
    } catch {}
  };

  // Place order
  const placeOrder = async (orderData) => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `RC${orderNumber}`;
    const now = new Date();
    const currentUid = currentUser?.id || currentUser?.uid || null;
    const currentEmail = (currentUser?.email || orderData.customer?.email || "").trim().toLowerCase();
    const currentPhone = currentUser?.phone || orderData.customer?.phone || "";

    const newOrder = {
      id: orderId,
      orderNumber,
      createdAt: now.toISOString(),
      formattedDate: now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      userId: currentUid,
      userEmail: currentEmail,
      customer: {
        ...orderData.customer,
        email: orderData.customer?.email || currentEmail,
        phone: orderData.customer?.phone || currentPhone
      },
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee || 100,
      discount: 0,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Processing"
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Also register or update customer record
    if (orderData.customer?.phone) {
      const existingUser = registeredUsers.find((u) => u.phone === orderData.customer.phone);
      if (!existingUser) {
        const newCust = {
          id: currentUid || ("usr-" + Date.now()),
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          email: currentEmail,
          city: orderData.customer.city || "",
          state: orderData.customer.state || "",
          createdAt: now.toISOString(),
          role: "customer"
        };
        setRegisteredUsers((prev) => [newCust, ...prev]);
      }
    }

    if (isConfigured && db) {
      try {
        await firestoreSetDoc(COLLECTIONS.ORDERS, orderId, newOrder);
      } catch (e) {
        console.warn("Firestore order place:", e);
      }
    }

    clearCart();
    return newOrder;
  };

  // Get orders filtered strictly for the authenticated customer
  const getUserOrders = useCallback((user = currentUser) => {
    if (!user) return [];
    const cleanUserEmail = (user.email || "").trim().toLowerCase();
    const userId = user.id || user.uid;
    const cleanUserPhone = (user.phone || "").replace(/\D/g, "");

    return orders.filter((order) => {
      // 1. Direct user identifier match
      const orderUserId = order.userId || order.customerId;
      if (userId && orderUserId && String(orderUserId) === String(userId)) {
        return true;
      }

      // 2. Exact email match (case-insensitive)
      const orderEmail = (order.userEmail || order.customer?.email || "").trim().toLowerCase();
      if (cleanUserEmail && orderEmail && orderEmail === cleanUserEmail) {
        return true;
      }

      // 3. Exact 10-digit phone match if phone is present and not blank
      const orderPhone = (order.customer?.phone || "").replace(/\D/g, "");
      if (cleanUserPhone.length >= 10 && orderPhone.length >= 10 && cleanUserPhone === orderPhone) {
        return true;
      }

      return false;
    });
  }, [orders, currentUser]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );

    if (isConfigured && db) {
      try {
        await firestoreSetDoc(COLLECTIONS.ORDERS, orderId, { orderStatus: newStatus });
      } catch (e) {
        console.warn("Firestore order status update:", e);
      }
    }

    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const updateOrderPaymentStatus = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );

    if (isConfigured && db) {
      try {
        await firestoreSetDoc(COLLECTIONS.ORDERS, orderId, { paymentStatus: status });
      } catch (e) {
        console.warn("Firestore payment status update:", e);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    if (isConfigured && db) {
      try {
        await firestoreDeleteDoc(COLLECTIONS.ORDERS, orderId);
      } catch (e) {
        console.warn("Firestore order delete:", e);
      }
    }

    showToast("Order deleted!");
  };

  // Enquiries
  // Enquiries (Stored locally in website data, NOT in Firestore)
  const submitEnquiry = async (data) => {
    const id = "ENQ-" + Date.now().toString().slice(-4);
    const newEnq = {
      id,
      ...data,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      status: "New"
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    showToast("Enquiry submitted successfully!");
    return newEnq;
  };

  const updateEnquiryStatus = async (id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const deleteEnquiry = async (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    showToast("Enquiry deleted!");
  };

  // Website Menu Pages Management (Stored locally, NOT in Firestore)
  const updatePageSettings = async (pageKey, newPageData) => {
    setPageSettings((prev) => {
      const updated = {
        ...prev,
        [pageKey]: {
          ...prev[pageKey],
          ...newPageData,
          lastUpdated: new Date().toISOString()
        }
      };
      return updated;
    });

    showToast(`Page "${pageSettings[pageKey]?.name || pageKey}" updated!`);
  };

  // Home Page Section Management (Stored locally, NOT in Firestore)
  const updateHomeSection = async (sectionKey, newSectionData) => {
    setHomeSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...newSectionData
      }
    }));

    showToast(`Section "${homeSections[sectionKey]?.name || sectionKey}" updated!`);
  };

  const toggleHomeSection = (sectionKey) => {
    setHomeSections((prev) => {
      const current = prev[sectionKey];
      if (!current) return prev;
      const isEnabled = current.enabled !== false;
      return {
        ...prev,
        [sectionKey]: {
          ...current,
          enabled: !isEnabled
        }
      };
    });
    showToast(`Section visibility toggled.`);
  };

  const reorderHomeSections = (newOrder) => {
    setHomeSectionOrder(newOrder);
    showToast("Home page section order updated!");
  };

  // Footer Content Management (Stored locally in rc_footer_settings)
  const updateFooterSettings = (newFooterData) => {
    setFooterSettings((prev) => ({
      ...prev,
      ...newFooterData,
      lastUpdated: new Date().toISOString()
    }));
    showToast("Footer settings updated successfully!");
  };

  // Media Library Management
  const addMediaItem = (item) => {
    const id = item.id || "media-" + Date.now();
    const newItem = {
      id,
      name: item.name || "Uploaded Image",
      url: item.url,
      category: item.category || "General",
      dimensions: item.dimensions || "Original",
      uploadedAt: new Date().toISOString()
    };
    setMediaLibrary((prev) => {
      const exists = prev.find((m) => m.url === item.url);
      if (exists) return prev;
      return [newItem, ...prev];
    });
    return newItem;
  };

  const deleteMediaItem = (id) => {
    setMediaLibrary((prev) => prev.filter((m) => m.id !== id));
    showToast("Image removed from media library.");
  };

  // User Management
  const updateRegisteredUser = (userId, fields) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...fields } : u))
    );
    showToast("User details updated!");
  };

  const deleteRegisteredUser = (userId) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast("User removed.");
  };

  // Brand Settings (Stored locally, NOT in Firestore)
  const updateSettings = async (newSet) => {
    setSettings((prev) => ({ ...prev, ...newSet }));
    showToast("Settings updated!");
  };

  // Admin Auth
  const adminLogin = (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (
      (cleanEmail === (settings.adminEmail || "").toLowerCase() ||
        cleanEmail === "admin@ruchicreation.com" ||
        cleanEmail === "ruchirandar16@gmail.com") &&
      (cleanPass === (settings.adminPassword || "admin123") || cleanPass === "admin123")
    ) {
      const user = { email: cleanEmail, name: "Admin", role: "admin" };
      setAdminUser(user);
      showToast("Logged in as Admin!");
      return { success: true };
    }
    return { success: false, message: "Invalid email or password." };
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem("rc_replica_admin");
    showToast("Signed out from Admin.", "info");
  };

  // Customer User Auth
  const registerUser = async ({ name, email, password, phone, city, state }) => {
    if (!name || !email || !password) {
      showToast("Please fill in all required fields.", "error");
      return { success: false, message: "Required fields missing." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : "";

    // Firebase Email/Password Authentication for User Registration
    try {
      const fbResult = await firebaseRegisterUser({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone
      });

      if (fbResult.isFirebase) {
        if (fbResult.success) {
          const userWithProfile = {
            ...fbResult.user,
            city: city || "",
            state: state || "",
            role: "customer"
          };
          setCurrentUser(userWithProfile);
          safeStorageSet("rc_current_user", userWithProfile);

          // Save profile locally for offline retention
          setRegisteredUsers((prev) => {
            const filtered = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
            return [...filtered, userWithProfile];
          });

          showToast(`Welcome to Ruchi Creation, ${cleanName}!`);
          return { success: true, user: userWithProfile };
        } else {
          return { success: false, message: fbResult.message };
        }
      }
    } catch (e) {
      console.warn("Firebase registration error:", e);
      return { success: false, message: e.message || "Registration failed. Please try again." };
    }

    // Fallback if Firebase service is unreachable
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: "An account with this email already exists. Please login." };
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city: city || "",
      state: state || "",
      role: "customer",
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    safeStorageSet("rc_current_user", newUser);
    showToast(`Welcome to Ruchi Creation, ${cleanName}!`);
    return { success: true, user: newUser };
  };

  const loginUser = async (email, password) => {
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return { success: false, message: "Missing credentials" };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if it's admin credentials
    if (
      (cleanEmail === settings.adminEmail?.toLowerCase() ||
        cleanEmail === "admin@ruchicreation.com" ||
        cleanEmail === "ruchirandar16@gmail.com") &&
      (password === (settings.adminPassword || "admin123") || password === "admin123")
    ) {
      const admin = { email: cleanEmail, name: "Admin", role: "admin" };
      setAdminUser(admin);
      setCurrentUser(admin);
      showToast("Logged in as Admin!");
      return { success: true, user: admin, isAdmin: true };
    }

    // 2. Firebase Email/Password Authentication
    try {
      const fbResult = await firebaseLoginUser(cleanEmail, password);
      if (fbResult.isFirebase) {
        if (fbResult.success) {
          const localMatch = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
          const fullUser = {
            ...fbResult.user,
            phone: localMatch?.phone || fbResult.user.phone || "",
            city: localMatch?.city || "",
            state: localMatch?.state || "",
            role: "customer"
          };
          setCurrentUser(fullUser);
          safeStorageSet("rc_current_user", fullUser);
          showToast(`Welcome back, ${fullUser.name}!`);
          return { success: true, user: fullUser };
        } else {
          return { success: false, message: fbResult.message };
        }
      }
    } catch (e) {
      console.warn("Firebase login error:", e);
      return { success: false, message: e.message || "Login failed. Please try again." };
    }

    // 3. Fallback if Firebase service is unreachable
    const localUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!localUser) {
      return { success: false, message: "No account found with this email. Please register first." };
    }

    if (localUser.password && localUser.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    const publicProfile = {
      id: localUser.id,
      name: localUser.name,
      email: localUser.email,
      phone: localUser.phone || "",
      city: localUser.city || "",
      state: localUser.state || "",
      createdAt: localUser.createdAt || new Date().toISOString(),
      role: localUser.role || "customer"
    };

    setCurrentUser(publicProfile);
    safeStorageSet("rc_current_user", publicProfile);
    showToast(`Welcome back, ${publicProfile.name}!`);
    return { success: true, user: publicProfile };
  };

  const logoutUser = () => {
    firebaseSignOutUser();
    setIsLoggingOut(true);
    setCurrentUser(null);
    setWishlist([]);
    setCart([]);
    setAdminUser(null);
    localStorage.removeItem("rc_user");
    localStorage.removeItem("rc_current_user");
    localStorage.removeItem("rc_wishlist");
    localStorage.removeItem("rc_replica_cart");
    try {
      sessionStorage.clear();
    } catch {}
    showToast("Signed out successfully.", "info");
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 600);
  };

  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return { success: false, message: "Not logged in" };

    const oldEmail = (currentUser.email || "").trim().toLowerCase();
    const newEmail = updatedFields.email ? updatedFields.email.trim().toLowerCase() : oldEmail;

    // If email is changing, verify it is not already taken by another user
    if (newEmail && newEmail !== oldEmail) {
      const emailInUse = registeredUsers.some(
        (u) =>
          ((u.id && currentUser.id && u.id !== currentUser.id) ||
            (!u.id && u.email && u.email.toLowerCase() !== oldEmail)) &&
          (u.email || "").trim().toLowerCase() === newEmail
      );
      if (emailInUse) {
        return { success: false, message: "This email address is already in use by another account." };
      }
    }

    const mergedUser = {
      ...currentUser,
      ...updatedFields,
      email: newEmail
    };

    setCurrentUser(mergedUser);
    safeStorageSet("rc_current_user", mergedUser);
    safeStorageSet("rc_user", mergedUser);

    setRegisteredUsers((prev) =>
      prev.map((u) => {
        const isMatch =
          (u.id && currentUser.id && u.id === currentUser.id) ||
          (u.email && oldEmail && u.email.toLowerCase() === oldEmail);
        if (isMatch) {
          return { ...u, ...updatedFields, email: newEmail };
        }
        return u;
      })
    );

    // If email changed, transfer wishlist and cart keys and update user orders
    if (newEmail !== oldEmail) {
      const oldWishlistKey = getUserWishlistKey(currentUser);
      const newWishlistKey = getUserWishlistKey(mergedUser);
      if (oldWishlistKey && newWishlistKey && oldWishlistKey !== newWishlistKey) {
        try {
          const w = localStorage.getItem(oldWishlistKey);
          if (w) localStorage.setItem(newWishlistKey, w);
        } catch {}
      }

      const oldCartKey = getUserCartKey(currentUser);
      const newCartKey = getUserCartKey(mergedUser);
      if (oldCartKey && newCartKey && oldCartKey !== newCartKey) {
        try {
          const c = localStorage.getItem(oldCartKey);
          if (c) localStorage.setItem(newCartKey, c);
        } catch {}
      }

      setOrders((prev) =>
        prev.map((order) => {
          const matchUser =
            (order.userId && currentUser.id && String(order.userId) === String(currentUser.id)) ||
            ((order.userEmail || "").toLowerCase() === oldEmail);
          if (matchUser) {
            return {
              ...order,
              userEmail: newEmail,
              customer: {
                ...order.customer,
                email: newEmail
              }
            };
          }
          return order;
        })
      );
    }

    showToast("Profile details updated successfully!");
    return { success: true, user: mergedUser };
  };

  // Wishlist actions
  const toggleWishlist = (productId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      showToast("Please sign in to save items to your wishlist.", "info");
      return false;
    }
    setAnimatingWishlistId(productId);
    setTimeout(() => setAnimatingWishlistId(null), 500);

    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast("Removed from Wishlist", "info");
      return false;
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast("Saved to Wishlist!");
      return true;
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast("Removed from Wishlist", "info");
  };

  return (
    <AppContext.Provider
      value={{
        // Storefront & Brand Settings
        settings,
        updateSettings,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        // Orders
        orders,
        getUserOrders,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,

        // Enquiries
        enquiries,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,

        // Registered Users
        registeredUsers,
        updateRegisteredUser,
        deleteRegisteredUser,

        // Website Menu Pages
        pageSettings,
        updatePageSettings,

        // Home Page Sections
        homeSections,
        homeSectionOrder,
        updateHomeSection,
        toggleHomeSection,
        reorderHomeSections,

        // Footer Settings
        footerSettings,
        updateFooterSettings,

        // Media Library
        mediaLibrary,
        addMediaItem,
        deleteMediaItem,

        // Firebase Synchronization
        syncAllWithFirestore,
        isSyncing,

        // Admin Auth
        adminUser,
        adminLogin,
        adminLogout,

        // Customer Auth
        currentUser,
        isLoggingOut,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,

        // UI Modals & Effects
        authModalOpen,
        setAuthModalOpen,
        showToast,
        flyingCartItem,
        cartBouncing,
        triggerCartBounce,
        animatingWishlistId
      }}
    >
      {children}
      {flyingCartItem && <FlyingCartOverlay item={flyingCartItem} />}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-xl bg-[#632736] text-white text-xs font-semibold animate-fade-in border border-white/20">
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

// Flying Cart Image Component
const FlyingCartOverlay = ({ item }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimating(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const dx = item.destX - item.startX;
  const dy = item.destY - item.startY;

  return (
    <div
      className="fixed z-[9999] pointer-events-none w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#632736] bg-white shadow-2xl p-1 transition-all duration-700 ease-in-out"
      style={{
        left: `${item.startX - 28}px`,
        top: `${item.startY - 28}px`,
        transform: `translate(${animating ? dx : 0}px, ${animating ? dy : 0}px) scale(${animating ? 0.2 : 1}) rotate(${animating ? -25 : 0}deg)`,
        opacity: animating ? 0.15 : 1
      }}
    >
      <img
        src={item.image}
        alt=""
        className="w-full h-full object-cover rounded-xl"
        onError={(e) => { e.target.src = "/logo.png"; }}
      />
    </div>
  );
};

export const useApp = () => useContext(AppContext) || {};
