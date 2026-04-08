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

function buildStyleGuide(topic, tone) {
  const topicGuide = {
    general: "ümumi xəbər dili, aydın və informativ üslub",
    military: "hərbi-siyasi və təhlükəsizlik yönümlü, daha ciddi və dəqiq üslub",
    politics: "siyasi kontekstli, balanslı və analitik üslub",
    economy: "iqtisadi izah güclü, rəqəm və nəticə mərkəzli üslub",
    tech: "texnoloji yenilik və praktik nəticə mərkəzli üslub"
  };

  const toneGuide = {
    standard: "standart peşəkar newsroom tonu",
    formal: "daha rəsmi və institusional ton",
    sharp: "daha sərt, analitik və vurğulu ton",
    tv: "aparıcı dilinə yaxın, axıcı və efirə uyğun ton",
    warlab: "hərbi-siyasi analitik mərkəz tonu; risk, nəticə, qeyri-müəyyənlik və ssenari təhlili ön planda"
  };

  return {
    topicText: topicGuide[topic] || topicGuide.general,
    toneText: toneGuide[tone] || toneGuide.standard
  };
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

    const { topicText, toneText } = buildStyleGuide(topic, tone);

    const prompt = `
Sən peşəkar Azərbaycan dilli media redaktoru, TV newsroom prodüseri və analitik assistentsən.

Yazı qaydaları:
- Dil: yalnız Azərbaycan dili
- Üslub: ${topicText}
- Ton: ${toneText}
- Mətnlər təkrarsız, canlı və peşəkar olsun
- Başlıqlar bir-birinə bənzəməsin
- Fakt olmayan şeyi fakt kimi təqdim etmə
- Qeyri-müəyyən məqamları ayrıca qeyd et
- Lazım gəldikdə "iddia olunur", "bildirilir", "təsdiqlənməyib" kimi ayırıcı ifadələrdən istifadə et

Transkript:
"""
${transcript}
"""

Yalnız bu JSON formatında cavab ver:
{
  "headlines": ["5 fərqli başlıq"],
  "shortNews": "120-180 sözlük qısa xəbər mətni",
  "studioText": "TV aparıcısı üçün 120-170 sözlük efir mətni",
  "telegramPost": "Telegram üçün dinamik, paylaşım uyğun mətn",
  "youtubeTitle": "YouTube üçün cəlbedici başlıq",
  "youtubeDescription": "YouTube təsviri, 2-4 abzas",
  "thumbnailText": "Thumbnail üçün 3-6 sözlük qısa mətn",
  "factCheck": "Yoxlanmalı məqamlar və qeyri-müəyyən detallar",
  "analysis": "Kontekst, nəticə və mümkün təsirlər üzrə analitik qeyd",
  "riskBlock": "Əgər mövzu risk daşıyırsa, əsas risklər və mümkün nəticələr",
  "knownUnknowns": "Nə məlumdur, nə məlum deyil, nə təsdiqlənməyib"
}

Əlavə qaydalar:
- headlines: 5 ədəd, biri daha rəsmi, biri daha sərt, biri daha kliklənən ola bilər
- shortNews: düz xəbər dili ilə
- studioText: aparıcı oxuya bilsin, axıcı olsun
- telegramPost: daha enerjili və paylaşım yönümlü olsun
- youtubeTitle: çox uzun olmasın
- thumbnailText: çox qısa olsun
- factCheck: maddəvari yox, aydın redaksiya qeydi kimi yaz
- analysis: yalnız ümumi sözlər yox, real məna çıxarsın
- riskBlock: xüsusən military, politics, warlab tonlarında güclü olsun
- knownUnknowns: "Məlum olanlar / Qeyri-müəyyən qalanlar / Təsdiqlənməyənlər" məntiqi ilə yaz

JSON-dan başqa heç nə yazma.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sən peşəkar Azərbaycan dilli newsroom və analitik assistentsən. Yalnız keyfiyyətli JSON qaytar."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    });

    const raw = response.choices?.[0]?.message?.content || "{}";
    const parsed = safeJsonParse(raw);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: "Server xətası baş verdi."
    });
  }
}
