import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 1024 * 1024 * 1024, // 1GB
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({ error: "Form parse xətası" });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: "Fayl tapılmadı" });
      }

      const uploadedFile = Array.isArray(file) ? file[0] : file;
      const filePath = uploadedFile.filepath;

      const result = await cloudinary.uploader.upload_large(filePath, {
        resource_type: "video",
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "video2news",
        chunk_size: 6000000,
      });

      fs.unlink(filePath, () => {});

      return res.status(200).json({
        success: true,
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: result.duration,
        bytes: result.bytes,
        format: result.format,
      });
    } catch (e) {
      console.error("UPLOAD ERROR:", e);
      return res.status(500).json({
        error: e.message || "Upload alınmadı",
      });
    }
  });
}
