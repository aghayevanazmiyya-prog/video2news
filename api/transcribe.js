import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { fileName, mimeType, base64Data } = req.body || {};

    if (!fileName || !base64Data) {
      return res.status(400).json({ error: "Fayl məlumatı tapılmadı." });
    }

    const bytes = Buffer.from(base64Data, "base64");
    const file = new File([bytes], fileName, {
      type: mimeType || "application/octet-stream",
    });

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "az"
    });

    return res.status(200).json({
      text: transcription.text || ""
    });
  } catch (error) {
    console.error("TRANSCRIBE ERROR:", error);
    return res.status(500).json({
      error: "Transkripsiya zamanı server xətası baş verdi."
    });
  }
}
