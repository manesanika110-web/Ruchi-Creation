// Image Storage Service for Ruchi Creation
// Supports persistent uploads to local public/imgs directory, Cloudinary, and Firebase Storage

import { uploadImageToFirebaseStorage } from "./firebase";
import { compressImageFile } from "../utils/imageCompressor";

// Get Cloudinary config from env or localStorage
export const getCloudinaryConfig = () => {
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const localCloudName = typeof window !== "undefined" ? localStorage.getItem("rc_cloudinary_cloud_name") : null;
  const localUploadPreset = typeof window !== "undefined" ? localStorage.getItem("rc_cloudinary_upload_preset") : null;

  return {
    cloudName: (envCloudName || localCloudName || "").trim(),
    uploadPreset: (envUploadPreset || localUploadPreset || "").trim()
  };
};

// Set Cloudinary config in localStorage
export const setCloudinaryConfig = ({ cloudName, uploadPreset }) => {
  if (typeof window !== "undefined") {
    if (cloudName) localStorage.setItem("rc_cloudinary_cloud_name", cloudName.trim());
    if (uploadPreset) localStorage.setItem("rc_cloudinary_upload_preset", uploadPreset.trim());
  }
};

/**
 * Save image file or base64 directly to website public folder (public/imgs/)
 */
export const saveImageToPublicFolder = async (fileOrDataUrl, name = "gift_product") => {
  if (!fileOrDataUrl) return null;

  try {
    let base64Data = "";
    let originalName = name;

    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      originalName = fileOrDataUrl.name || name;
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrDataUrl);
      });
    } else if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      base64Data = fileOrDataUrl;
    } else {
      return null;
    }

    const res = await fetch("/api/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Data,
        fileName: originalName,
        name
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.url) {
        return {
          success: true,
          url: data.url,
          fileName: data.fileName,
          provider: "public_imgs"
        };
      }
    }
  } catch (err) {
    console.warn("Public folder save notice (/api/upload-image):", err);
  }
  return null;
};

/**
 * Upload an image (File, Blob, or base64 data URL) to Cloudinary
 */
export const uploadToCloudinary = async (fileOrDataUrl) => {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName) {
    return { success: false, message: "Cloudinary Cloud Name is not configured." };
  }

  try {
    const formData = new FormData();

    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      formData.append("file", fileOrDataUrl);
    } else if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      formData.append("file", fileOrDataUrl);
    } else {
      return { success: false, message: "Unsupported image format for Cloudinary." };
    }

    // Default or configured unsigned upload preset
    formData.append("upload_preset", uploadPreset || "ruchi_products");
    formData.append("folder", "ruchi_creation/products");

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        provider: "cloudinary"
      };
    } else {
      console.warn("Cloudinary upload response not OK:", data);
      return {
        success: false,
        message: data.error?.message || "Failed to upload to Cloudinary."
      };
    }
  } catch (error) {
    console.warn("Cloudinary upload exception:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Persist product image with high resilience:
 * 1. If already a persistent web URL or public asset path, retain it.
 * 2. Save directly into public/imgs/ folder (website folder).
 * 3. Try Cloudinary if configured.
 * 4. Try Firebase Storage.
 * 5. Fallback to lightweight compressed base64 if other storages are unavailable.
 */
export const persistProductImage = async (fileOrDataUrl, fallbackFileName = "product") => {
  if (!fileOrDataUrl) {
    return { success: true, url: "/reference-assets/detail-mug.jpg", provider: "default" };
  }

  // If already an HTTP(S) URL or local public asset path, retain it
  if (
    typeof fileOrDataUrl === "string" &&
    (fileOrDataUrl.startsWith("http://") ||
     fileOrDataUrl.startsWith("https://") ||
     fileOrDataUrl.startsWith("/imgs/") ||
     fileOrDataUrl.startsWith("/images/") ||
     fileOrDataUrl.startsWith("/reference-assets/") ||
     fileOrDataUrl.startsWith("/banners/") ||
     fileOrDataUrl.startsWith("/logo"))
  ) {
    return { success: true, url: fileOrDataUrl, provider: "existing" };
  }

  // Generate lightweight compressed base64 (~30-50KB) for resilient cloud storage
  let compressedBase64 = null;
  try {
    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      compressedBase64 = await compressImageFile(fileOrDataUrl, 700, 0.72);
    } else if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      compressedBase64 = fileOrDataUrl;
    }
  } catch (compErr) {
    console.warn("Base64 compression fallback notice:", compErr);
  }

  // 1. Try saving directly into public/imgs folder (Website public folder on disk)
  let localRes = null;
  try {
    localRes = await saveImageToPublicFolder(compressedBase64 || fileOrDataUrl, fallbackFileName);
  } catch (err) {
    console.warn("Local public/imgs save attempt notice:", err);
  }

  // 2. Try Cloudinary if cloudName is available
  const { cloudName } = getCloudinaryConfig();
  if (cloudName) {
    try {
      const cloudRes = await uploadToCloudinary(compressedBase64 || fileOrDataUrl);
      if (cloudRes.success && cloudRes.url) {
        return {
          success: true,
          url: cloudRes.url,
          imageData: compressedBase64,
          localPath: localRes?.url || null,
          provider: "cloudinary"
        };
      }
    } catch (e) {
      console.warn("Cloudinary attempt failed:", e);
    }
  }

  // 3. Try Firebase Storage with a strict 2.5-second timeout
  try {
    const fbRes = await Promise.race([
      uploadImageToFirebaseStorage(compressedBase64 || fileOrDataUrl, "products"),
      new Promise((resolve) => setTimeout(() => resolve({ success: false, timeout: true }), 2500))
    ]);
    if (fbRes.success && fbRes.url) {
      return {
        success: true,
        url: fbRes.url,
        imageData: compressedBase64,
        localPath: localRes?.url || null,
        provider: "firebase"
      };
    }
  } catch (e) {
    console.warn("Firebase Storage attempt failed:", e);
  }

  // 4. Return local public folder URL or compressed base64
  const finalUrl = localRes?.url || compressedBase64 || (typeof fileOrDataUrl === "string" ? fileOrDataUrl : "/reference-assets/detail-mug.jpg");

  return {
    success: true,
    url: finalUrl,
    imageData: compressedBase64,
    localPath: localRes?.url || null,
    provider: localRes?.url ? "public_imgs" : "compressed_base64"
  };
};
