const btn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const topicEl = document.getElementById("topic");
const toneEl = document.getElementById("tone");
const clearBtn = document.getElementById("clearBtn");
const copyAllBtn = document.getElementById("copyAllBtn");
const exportTxtBtn = document.getElementById("exportTxtBtn");
const exportHeadlinesBtn = document.getElementById("exportHeadlinesBtn");
const exportTelegramBtn = document.getElementById("exportTelegramBtn");
const exportYoutubeBtn = document.getElementById("exportYoutubeBtn");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const historyList = document.getElementById("historyList");

const mediaFileEl = document.getElementById("mediaFile");
const transcribeBtn = document.getElementById("transcribeBtn");
const clearFileBtn = document.getElementById("clearFileBtn");

const ids = [
  "headlines",
  "shortNews",
  "studioText",
  "telegramPost",
  "youtubeTitle",
  "youtubeDescription",
  "thumbnailText",
  "factCheck",
  "riskBlock",
  "knownUnknowns",
  "analysis"
];

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function resetOutputs() {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = "Hələ nəticə yoxdur.";
    el.classList.add("empty");
  });
}

function setOutput(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text || "Nəticə yoxdur.";
  el.classList.remove("empty");
}

function setHeadlines(items) {
  const el = document.getElementById("headlines");
  if (!el) return;

  if (!Array.isArray(items) || !items.length) {
    el.textContent = "Nəticə yoxdur.";
    el.classList.remove("empty");
    return;
  }

  el.innerHTML = `
    <div class="headlines-list">
      ${items.map((item) => `<div class="headline-item">${item}</div>`).join("")}
    </div>
  `;
  el.classList.remove("empty");
}

function getPlainText(id) {
  const el = document.getElementById(id);
  return el ? (el.innerText || "").trim() : "";
}

function collectAllOutput() {
  return [
    "=== BAŞLIQ VARİANTLARI ===",
    getPlainText("headlines"),
    "",
    "=== QISA XƏBƏR ===",
    getPlainText("shortNews"),
    "",
    "=== TV STUDIO TEXT ===",
    getPlainText("studioText"),
    "",
    "=== TELEGRAM POST ===",
    getPlainText("telegramPost"),
    "",
    "=== YOUTUBE BAŞLIQ ===",
    getPlainText("youtubeTitle"),
    "",
    "=== YOUTUBE TƏSVİR ===",
    getPlainText("youtubeDescription"),
    "",
    "=== THUMBNAIL TEXT ===",
    getPlainText("thumbnailText"),
    "",
    "=== FACT-CHECK QEYDLƏRİ ===",
    getPlainText("factCheck"),
    "",
    "=== RİSK / NƏTİCƏ ===",
    getPlainText("riskBlock"),
    "",
    "=== MƏLUM OLANLAR / QEYRİ-MÜƏYYƏNLİK ===",
    getPlainText("knownUnknowns"),
    "",
    "=== ANALİTİK QEYD ===",
    getPlainText("analysis")
  ].join("\n");
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function saveHistory() {
  const transcript = transcriptEl?.value?.trim() || "";
  const shortNews = getPlainText("shortNews");

  if (!transcript || !shortNews || shortNews === "Hələ nəticə yoxdur.") return;

  const item = {
    id: Date.now(),
    topic: topicEl?.options?.[topicEl.selectedIndex]?.text || "",
    tone: toneEl?.options?.[toneEl.selectedIndex]?.text || "",
    transcript: transcript.slice(0, 6000),
    headlines: getPlainText("headlines"),
    shortNews,
    studioText: getPlainText("studioText"),
    telegramPost: getPlainText("telegramPost"),
    youtubeTitle: getPlainText("youtubeTitle"),
    youtubeDescription: getPlainText("youtubeDescription"),
    thumbnailText: getPlainText("thumbnailText"),
    factCheck: getPlainText("factCheck"),
    riskBlock: getPlainText("riskBlock"),
    knownUnknowns: getPlainText("knownUnknowns"),
    analysis: getPlainText("analysis"),
    createdAt: new Date().toLocaleString("az-AZ")
  };

  const history = JSON.parse(localStorage.getItem("v2n_history") || "[]");
  history.unshift(item);
  localStorage.setItem("v2n_history", JSON.stringify(history.slice(0, 12)));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;

  const history = JSON.parse(localStorage.getItem("v2n_history") || "[]");

  if (!history.length) {
    historyList.innerHTML = `<div class="empty-note">Hələ history yoxdur.</div>`;
    return;
  }

  historyList.innerHTML = history
    .map(
      (item) => `
      <div class="history-item" data-id="${item.id}">
        <strong>${item.topic} • ${item.tone}</strong>
        <span>${(item.shortNews || "").slice(0, 120)}...</span>
        <span style="margin-top:6px;">${item.createdAt}</span>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".history-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.id);
      const selected = history.find((x) => x.id === id);
      if (!selected) return;

      if (transcriptEl) transcriptEl.value = selected.transcript || "";

      setHeadlines(
        selected.headlines
          ? selected.headlines
              .split("\n")
              .map((x) => x.trim())
              .filter(Boolean)
          : []
      );

      setOutput("shortNews", selected.shortNews);
      setOutput("studioText", selected.studioText);
      setOutput("telegramPost", selected.telegramPost);
      setOutput("youtubeTitle", selected.youtubeTitle);
      setOutput("youtubeDescription", selected.youtubeDescription);
      setOutput("thumbnailText", selected.thumbnailText);
      setOutput("factCheck", selected.factCheck);
      setOutput("riskBlock", selected.riskBlock);
      setOutput("knownUnknowns", selected.knownUnknowns);
      setOutput("analysis", selected.analysis);

      setStatus("History yükləndi ✅");
    });
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function transcribeSelectedFile() {
  const file = mediaFileEl?.files?.[0];

  if (!file) {
    alert("Əvvəl audio və ya video faylı seç.");
    return;
  }

  const maxMb = 4;
  if (file.size > maxMb * 1024 * 1024) {
    alert("Bu versiyada 4 MB-dan kiçik qısa fayl seç.");
    return;
  }

  setStatus("Transkript hazırlanır...");

  try {
    const base64Data = await fileToBase64(file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        base64Data
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("Transkript xətası ❌");
      alert(data.error || "Transkript alınmadı.");
      return;
    }

    if (transcriptEl) transcriptEl.value = data.text || "";
    setStatus("Transkript hazırdır ✅");
  } catch (err) {
    console.error(err);
    setStatus("Transkript xətası ❌");
    alert("Transkripsiya zamanı problem baş verdi.");
  }
}

async function analyzeTranscript() {
  const transcript = transcriptEl?.value?.trim() || "";
  const topic = topicEl?.value || "general";
  const tone = toneEl?.value || "standard";

  if (!transcript || transcript.length < 30) {
    alert("Zəhmət olmasa kifayət qədər uzun transkript və ya mətn daxil et.");
    return;
  }

  setStatus("AI paket hazırlayır...");
  resetOutputs();

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ transcript, topic, tone })
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("Xəta ❌");
      setOutput("analysis", data.error || "Server xətası baş verdi.");
      return;
    }

    setHeadlines(data.headlines);
    setOutput("shortNews", data.shortNews);
    setOutput("studioText", data.studioText);
    setOutput("telegramPost", data.telegramPost);
    setOutput("youtubeTitle", data.youtubeTitle);
    setOutput("youtubeDescription", data.youtubeDescription);
    setOutput("thumbnailText", data.thumbnailText);
    setOutput("factCheck", data.factCheck);
    setOutput("riskBlock", data.riskBlock);
    setOutput("knownUnknowns", data.knownUnknowns);
    setOutput("analysis", data.analysis);

    setStatus("Hazırdır ✅");
    saveHistory();
  } catch (err) {
    console.error(err);
    setStatus("Server xətası ❌");
    setOutput("analysis", "Serverə qoşulmaq mümkün olmadı.");
  }
}

btn?.addEventListener("click", analyzeTranscript);
transcribeBtn?.addEventListener("click", transcribeSelectedFile);

clearFileBtn?.addEventListener("click", () => {
  if (mediaFileEl) mediaFileEl.value = "";
  setStatus("Fayl sıfırlandı.");
});

clearBtn?.addEventListener("click", () => {
  if (transcriptEl) transcriptEl.value = "";
  if (mediaFileEl) mediaFileEl.value = "";
  resetOutputs();
  setStatus("Təmizləndi.");
});

document.querySelectorAll(".tool-btn").forEach((btnEl) => {
  btnEl.addEventListener("click", async () => {
    const targetId = btnEl.dataset.copy;
    if (!targetId) return;

    const el = document.getElementById(targetId);
    if (!el) return;

    const text = el.innerText.trim();
    if (!text || text === "Hələ nəticə yoxdur.") return;

    try {
      await navigator.clipboard.writeText(text);
      const old = btnEl.textContent;
      btnEl.textContent = "Copied";
      setTimeout(() => {
        btnEl.textContent = old;
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  });
});

copyAllBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(collectAllOutput());
    setStatus("Hamısı copy edildi ✅");
  } catch (e) {
    console.error(e);
  }
});

exportTxtBtn?.addEventListener("click", () => {
  downloadText("video2news-pack.txt", collectAllOutput());
});

exportHeadlinesBtn?.addEventListener("click", () => {
  downloadText("headlines.txt", getPlainText("headlines"));
});

exportTelegramBtn?.addEventListener("click", () => {
  downloadText("telegram-post.txt", getPlainText("telegramPost"));
});

exportYoutubeBtn?.addEventListener("click", () => {
  const content = `Başlıq:\n${getPlainText("youtubeTitle")}\n\nTəsvir:\n${getPlainText("youtubeDescription")}`;
  downloadText("youtube-pack.txt", content);
});

copySummaryBtn?.addEventListener("click", async () => {
  const text = getPlainText("shortNews");
  if (!text || text === "Hələ nəticə yoxdur.") return;

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Qısa xəbər copy edildi ✅");
  } catch (e) {
    console.error(e);
  }
});

renderHistory();
