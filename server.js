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

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { transcript, topic = "general" } = req.body;

    if (!transcript || transcript.trim().length < 20) {
      return res.status(400).json({
        error: "Transcript çox qısadır və ya boşdur."
      });
    }

    const prompt = `
Sən peşəkar newsroom AI assistentsən.
Aşağıdakı video transkriptini analiz et və nəticəni AZƏRBAYCAN dilində qaytar.

Mövzu: ${topic}

Transkript:
${transcript}

Aşağıdakı formatda cavab ver:

1. Başlıq variantları (5 ədəd)
2. Qısa xəbər mətni
3. SEO başlıq
4. Thumbnail mətni
5. Telegram post
6. YouTube description
7. Fact-check qeydləri
8. Breaking xəbər versiyası
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sən peşəkar TV və media redaksiya AI assistentsən."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content || "Nəticə alınmadı.";

    res.json({ result });
  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({
      error: "Server xətası baş verdi."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});