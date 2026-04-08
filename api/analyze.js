import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { transcript, topic = "general", tone = "standard" } = req.body;

    if (!transcript || transcript.trim().length < 30) {
      return res.status(400).json({
        error: "Transkript çox qısadır və ya boşdur."
      });
    }

    const prompt = `
Sən peşəkar Azərbaycan dilli TV və media newsroom AI assistentsən.

Mövzu tipi: ${topic}
Ton: ${tone}

Aşağıdakı transkript əsasında yalnız etibarlı JSON qaytar.

Transkript:
"""
${transcript}
"""

Yalnız bu JSON formatında cavab ver:
{
  "headlines": ["5 başlıq"],
  "shortNews": "Qısa xəbər mətni",
  "studioText": "TV aparıcı/studio mətni",
  "telegramPost": "Telegram üçün uyğun post",
  "youtubeTitle": "YouTube başlığı",
  "youtubeDescription": "YouTube təsviri",
  "thumbnailText": "Thumbnail üzərində istifadə üçün qısa mətn",
  "factCheck": "Yoxlanmalı məqamlar",
  "analysis": "Analitik qeyd və kontekst"
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Yalnız düzgün JSON qaytar."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content || "{}";
    const parsed = safeJsonParse(raw);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server xətası" });
  }
}
