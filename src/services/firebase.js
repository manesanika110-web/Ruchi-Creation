// Firebase Integration Service for Ruchi Creation
// Configured so that ONLY order data is stored in Firebase Firestore,
// and Firebase Email/Password Authentication is used for user registration and login.

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL
} from "firebase/storage";

// Default Production Firebase Config for Ruchi Creation
const DEFAULT_CONFIG = {
  apiKey: "AIzaSyCadvCxtaf-_sY13dcuqmXmjzLKE2cVI00",
  authDomain: "ruchi-creation.firebaseapp.com",
  projectId: "ruchi-creation",
  storageBucket: "ruchi-creation.firebasestorage.app",
  messagingSenderId: "177474988094",
  appId: "1:177474988094:web:d759d22e85e743a3edc96f"
};

// Get configuration from env, localStorage, or fallback to DEFAULT_CONFIG
export const getFirebaseConfig = () => {
  let storedConfig = null;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      storedConfig = localStorage.getItem("ruchi_firebase_config");
    } catch {}
  }
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      if (parsed.apiKey && parsed.projectId) return parsed;
    } catch (e) {
      console.warn("Failed to parse stored Firebase config:", e);
    }
  }

  const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : (typeof process !== "undefined" && process.env ? process.env : {});

  return {
    apiKey: env.VITE_FIREBASE_API_KEY || DEFAULT_CONFIG.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_CONFIG.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || DEFAULT_CONFIG.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_CONFIG.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_CONFIG.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || DEFAULT_CONFIG.appId
  };
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let isConfigured = false;

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getFirebaseConfig();

  const hasValidKeys = Boolean(
    config.apiKey &&
    config.apiKey.length > 10 &&
    config.projectId &&
    !config.apiKey.includes("YOUR_")
  );

  if (!hasValidKeys) {
    isConfigured = false;
    return { isConfigured: false, message: "Firebase credentials missing or invalid." };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    try {
      storage = getStorage(app);
    } catch (sErr) {
      console.warn("Firebase storage init notice:", sErr);
    }
    isConfigured = true;
    return { isConfigured: true, app, auth, db, storage };
  } catch (error) {
    console.error("Firebase initialization error:", error.message);
    isConfigured = false;
    return { isConfigured: false, error: error.message };
  }
};

// Initialize on load
initFirebase();

export { app, auth, db, storage, isConfigured };

// Firestore Collections for Ruchi Creation
export const COLLECTIONS = {
  ORDERS: "orders",
  PRODUCTS: "products"
};

/**
 * Register a user with Firebase Email/Password Authentication.
 * Does NOT store customer profile in Firestore (only orders in Firestore).
 */
export const firebaseRegisterUser = async ({ name, email, password, phone }) => {
  if (!isConfigured || !auth) {
    return { isFirebase: false, success: false, message: "Firebase Authentication is not active." };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Update display name in Firebase Auth user profile
    try {
      await updateProfile(user, { displayName: name.trim() });
    } catch (e) {
      console.warn("Could not update display name in Firebase Auth:", e);
    }

    return {
      success: true,
      isFirebase: true,
      user: {
        id: user.uid,
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Firebase registration error:", error);
    let message = "Registration failed: " + error.message;
    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered. Please log in.";
    } else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email address.";
    } else if (error.code === "auth/weak-password") {
      message = "Password should be at least 6 characters.";
    } else if (error.code === "auth/operation-not-allowed") {
      message = "Email/Password sign-in is not enabled in Firebase Console.";
    }
    return { success: false, isFirebase: true, message, code: error.code };
  }
};

/**
 * Login a user with Firebase Email/Password Authentication.
 * Does NOT read from Firestore customers collection (only orders in Firestore).
 */
export const firebaseLoginUser = async (email, password) => {
  if (!isConfigured || !auth) {
    return { isFirebase: false, success: false, message: "Firebase Authentication is not active." };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const customerData = {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || email.split("@")[0],
      email: user.email,
      phone: "",
      createdAt: user.metadata?.creationTime || new Date().toISOString()
    };

    return { success: true, isFirebase: true, user: customerData };
  } catch (error) {
    console.error("Firebase login error:", error);
    let message = "Login failed: " + error.message;
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      message = "Invalid email or password. Please try again.";
    } else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email address.";
    } else if (error.code === "auth/too-many-requests") {
      message = "Too many failed attempts. Please try again later.";
    }
    return { success: false, isFirebase: true, message, code: error.code };
  }
};

/**
 * Subscribe to Firebase Auth state changes.
 */
export const subscribeToAuthChanges = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

/**
 * Send password reset email via Firebase Authentication.
 */
export const firebaseResetPassword = async (email) => {
  if (!isConfigured || !auth) {
    return { isFirebase: false, success: false, message: "Firebase is not active." };
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, isFirebase: true, message: "Password reset link sent to your email!" };
  } catch (error) {
    let message = "Could not send reset email.";
    if (error.code === "auth/user-not-found") {
      message = "No account found with this email.";
    }
    return { success: false, isFirebase: true, message };
  }
};

/**
 * Sign out from Firebase Authentication.
 */
export const firebaseSignOutUser = async () => {
  if (isConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }
};

// ── Firestore Helper Functions (Strictly for Orders) ──────────────────────────

/**
 * Fetch a document from Cloud Firestore orders collection.
 */
export const firestoreGetDoc = async (collName, docId) => {
  if (!isConfigured || !db) return { success: false, error: "Firebase Firestore not active" };
  try {
    const docRef = doc(db, collName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { success: true, data: snap.data(), id: snap.id };
    }
    return { success: false, error: "Document not found" };
  } catch (error) {
    console.warn(`Firestore getDoc error (${collName}/${docId}):`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Set or merge a document in Cloud Firestore (only for orders).
 */
export const firestoreSetDoc = async (collName, docId, data, merge = true) => {
  if (!isConfigured || !db) return { success: false, error: "Firebase Firestore not active" };
  try {
    const docRef = doc(db, collName, docId);
    await setDoc(docRef, data, { merge });
    return { success: true };
  } catch (error) {
    console.warn(`Firestore setDoc error (${collName}/${docId}):`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get all documents from a Cloud Firestore collection (used for orders).
 */
export const firestoreGetCollection = async (collName) => {
  if (!isConfigured || !db) return { success: false, error: "Firebase Firestore not active" };
  try {
    const colRef = collection(db, collName);
    const snap = await getDocs(colRef);
    const items = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
    return { success: true, data: items };
  } catch (error) {
    console.warn(`Firestore getCollection error (${collName}):`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a document from Cloud Firestore (used for orders).
 */
export const firestoreDeleteDoc = async (collName, docId) => {
  if (!isConfigured || !db) return { success: false, error: "Firebase Firestore not active" };
  try {
    const docRef = doc(db, collName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.warn(`Firestore deleteDoc error (${collName}/${docId}):`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Add a new document to a Cloud Firestore collection (used for orders).
 */
export const firestoreAddDoc = async (collName, data) => {
  if (!isConfigured || !db) return { success: false, error: "Firebase Firestore not active" };
  try {
    const colRef = collection(db, collName);
    const docRef = await addDoc(colRef, data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn(`Firestore addDoc error (${collName}):`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Real-time listener for products collection from Cloud Firestore.
 */
export const subscribeToProducts = (callback) => {
  if (!isConfigured || !db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        callback(items);
      },
      (error) => {
        console.warn("Firestore products realtime listener warning:", error.message);
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to products:", err);
    return () => {};
  }
};

/**
 * Upload an image file or base64 data URL to Firebase Storage.
 */
export const uploadImageToFirebaseStorage = async (fileOrDataUrl, folder = "products") => {
  if (!isConfigured || !storage) {
    return { success: false, message: "Firebase Storage not active" };
  }

  try {
    const timestamp = Date.now();
    const cleanId = Math.random().toString(36).substring(2, 8);

    if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      const match = fileOrDataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
      const ext = match ? match[1] : "jpg";
      const fileName = `${folder}/${timestamp}_${cleanId}.${ext}`;
      const imgRef = storageRef(storage, fileName);
      await uploadString(imgRef, fileOrDataUrl, "data_url");
      const downloadUrl = await getDownloadURL(imgRef);
      return { success: true, url: downloadUrl };
    } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      const originalName = fileOrDataUrl.name || "image.jpg";
      const ext = originalName.split(".").pop() || "jpg";
      const fileName = `${folder}/${timestamp}_${cleanId}.${ext}`;
      const imgRef = storageRef(storage, fileName);
      await uploadBytes(imgRef, fileOrDataUrl);
      const downloadUrl = await getDownloadURL(imgRef);
      return { success: true, url: downloadUrl };
    }

    return { success: false, message: "Invalid image format" };
  } catch (error) {
    console.warn("Firebase Storage upload error:", error);
    return { success: false, error: error.message };
  }
};

