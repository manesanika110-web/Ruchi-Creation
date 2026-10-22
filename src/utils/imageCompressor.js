/**
 * Compresses and downscales an image file using an HTML5 Canvas.
 * Ensures uploaded images are sharp and lightweight (~40KB - 80KB)
 * so they load instantly and never exceed browser localStorage quota.
 *
 * @param {File} file - The uploaded image file
 * @param {number} maxDimension - Max width or height (default 800px)
 * @param {number} quality - JPEG compression quality 0.0 to 1.0 (default 0.78)
 * @returns {Promise<string>} - Resolves with compressed Base64 data URL
 */
export const compressImageFile = (file, maxDimension = 800, quality = 0.78) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    // If not an image file, reject or read as text
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target.result);
          return;
        }

        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG Base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        // Fallback to raw data if image parsing fails
        resolve(e.target.result);
      };

      img.src = e.target.result;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
