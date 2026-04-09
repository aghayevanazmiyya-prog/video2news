import { createCloudinarySignature, getCloudinaryConfig } from "../lib/cloudinary.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { folder, apiKey, cloudName } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      folder,
      resource_type: "video",
      timestamp
    };

    const signature = createCloudinarySignature(paramsToSign);

    return res.status(200).json({
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
      resourceType: "video"
    });
  } catch (error) {
    console.error("UPLOAD SIGNATURE ERROR:", error);
    return res.status(500).json({
      error: "Upload imzası yaradılmadı."
    });
  }
}
