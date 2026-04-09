function createJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const {
      publicId,
      secureUrl,
      resourceType,
      originalFilename,
      bytes,
      duration,
      format
    } = req.body || {};

    if (!publicId || !secureUrl) {
      return res.status(400).json({
        error: "Upload metadata natamamdır."
      });
    }

    const jobId = createJobId();

    return res.status(200).json({
      ok: true,
      jobId,
      status: "uploaded",
      asset: {
        publicId,
        secureUrl,
        resourceType: resourceType || "video",
        originalFilename: originalFilename || "",
        bytes: bytes || 0,
        duration: duration || 0,
        format: format || ""
      }
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    return res.status(500).json({
      error: "Job yaradılmadı."
    });
  }
}
