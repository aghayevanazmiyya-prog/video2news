import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "video2news-v2" });
});

app.post("/api/analyze", async (req, res) => {
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

Qaydalar:
- Hər şey Azərbaycan dilində olsun
- Başlıqlar bir-birindən fərqli olsun
- Qısa xəbər informativ olsun
- Studio text aparıcı dilinə yaxın olsun
- Thumbnail text çox qısa olsun
- JSON-dan başqa heç nə yazma
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sən peşəkar Azərbaycan dilli newsroom assistentsən. Yalnız düzgün JSON qaytar."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const raw = response.choices?.[0]?.message?.content || "{}";
    const parsed = safeJsonParse(raw);

    res.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({
      error: "Server xətası baş verdi."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
