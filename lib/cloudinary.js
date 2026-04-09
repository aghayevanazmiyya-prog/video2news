import crypto from "crypto";

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "video2news";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env dəyişənləri tapılmadı.");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder
  };
}

export function createCloudinarySignature(paramsToSign) {
  const { apiSecret } = getCloudinaryConfig();

  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(sorted + apiSecret)
    .digest("hex");
}
