const btn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const topicEl = document.getElementById("topic");
const toneEl = document.getElementById("tone");
const textFileEl = document.getElementById("textFile");
const dropzone = document.getElementById("dropzone");
const clearBtn = document.getElementById("clearBtn");
const copyAllBtn = document.getElementById("copyAllBtn");
const exportTxtBtn = document.getElementById("exportTxtBtn");
const exportHeadlinesBtn = document.getElementById("exportHeadlinesBtn");
const exportTelegramBtn = document.getElementById("exportTelegramBtn");
const exportYoutubeBtn = document.getElementById("exportYoutubeBtn");
const historyList = document.getElementById("historyList");

const ids = [
  "headlines",
  "shortNews",
  "studioText",
  "telegramPost",
  "youtubeTitle",
  "youtubeDescription",
  "thumbnailText",
  "factCheck",
  "analysis"
];

function resetOutputs() {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    el.textContent = "Hələ nəticə yoxdur.";
    el.classList.add("empty");
  });
}

function setOutput(id, text) {
  const el = document.getElementById(id);
  el.textContent = text || "Nəticə yoxdur.";
  el.classList.remove("empty");
}

function setHeadlines(items) {
  const el = document.getElementById("headlines");
  if (!Array.isArray(items) || !items.length) {
    el.textContent = "Nəticə yoxdur.";
    el.classList.remove("empty");
    return;
  }

  el.innerHTML = `<div class="headlines-list">
    ${items.map(item => `<div class="headline-item">${item}</div>`).join("")}
  </div>`;
  el.classList.remove("empty");
}

function getPlainText(id) {
  const el = document.getElementById(id);
  return (el.innerText || "").trim();
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
  const transcript = transcriptEl.value.trim();
  const shortNews = getPlainText("shortNews");
  if (!transcript || !shortNews || shortNews === "Hələ nəticə yoxdur.") return;

  const item = {
    id: Date.now(),
    topic: topicEl.options[topicEl.selectedIndex].text,
    tone: toneEl.options[toneEl.selectedIndex].text,
    transcript: transcript.slice(0, 6000),
    shortNews,
    studioText: getPlainText("studioText"),
    telegramPost: getPlainText("telegramPost"),
    youtubeTitle: getPlainText("youtubeTitle"),
    youtubeDescription: getPlainText("youtubeDescription"),
    thumbnailText: getPlainText("thumbnailText"),
    factCheck: getPlainText("factCheck"),
    analysis: getPlainText("analysis"),
    headlines: getPlainText("headlines"),
    createdAt: new Date().toLocaleString("az-AZ")
  };

  const history = JSON.parse(localStorage.getItem("v2n_history") || "[]");
  history.unshift(item);
  localStorage.setItem("v2n_history", JSON.stringify(history.slice(0, 12)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("v2n_history") || "[]");
  if (!history.length) {
    historyList.innerHTML = `<div class="empty-note">Hələ history yoxdur.</div>`;
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-id="${item.id}">
      <strong>${item.topic} • ${item.tone}</strong>
      <span>${item.shortNews.slice(0, 120)}...</span>
      <span style="margin-top:6px;">${item.createdAt}</span>
    </div>
  `).join("");

  document.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.id);
      const selected = history.find(x => x.id === id);
      if (!selected) return;

      transcriptEl.value = selected.transcript;
      setOutput("shortNews", selected.shortNews);
      setOutput("studioText", selected.studioText);
      setOutput("telegramPost", selected.telegramPost);
      setOutput("youtubeTitle", selected.youtubeTitle);
      setOutput("youtubeDescription", selected.youtubeDescription);
      setOutput("thumbnailText", selected.thumbnailText);
      setOutput("factCheck", selected.factCheck);
      setOutput("analysis", selected.analysis);

      const headlinesEl = document.getElementById("headlines");
      headlinesEl.textContent = selected.headlines;
      headlinesEl.classList.remove("empty");

      statusEl.textContent = "History yükləndi ✅";
    });
  });
}

async function readTextFile(file) {
  const text = await file.text();
  transcriptEl.value = text;
  statusEl.textContent = "Mətn faylı yükləndi ✅";
}

textFileEl.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  await readTextFile(file);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", async (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    await readTextFile(file);
  } else {
    statusEl.textContent = "Hazırda yalnız .txt faylı dəstəklənir.";
  }
});

btn.addEventListener("click", async () => {
  const transcript = transcriptEl.value.trim();
  const topic = topicEl.value;
  const tone = toneEl.value;

  if (!transcript || transcript.length < 30) {
    alert("Zəhmət olmasa kifayət qədər uzun transkript və ya mətn daxil et.");
    return;
  }

  statusEl.textContent = "AI paket hazırlayır...";
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
      statusEl.textContent = "Xəta ❌";
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
    setOutput("analysis", data.analysis);

    statusEl.textContent = "Hazırdır ✅";
    saveHistory();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Server xətası ❌";
    setOutput("analysis", "Serverə qoşulmaq mümkün olmadı.");
  }
});

document.querySelectorAll(".tool-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const targetId = btn.dataset.copy;
    if (!targetId) return;

    const text = document.getElementById(targetId).innerText.trim();
    if (!text || text === "Hələ nəticə yoxdur.") return;

    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = old, 1200);
    } catch (e) {
      console.error(e);
    }
  });
});

clearBtn.addEventListener("click", () => {
  transcriptEl.value = "";
  textFileEl.value = "";
  resetOutputs();
  statusEl.textContent = "Təmizləndi.";
});

copyAllBtn.addEventListener("click", async () => {
  const all = collectAllOutput();
  try {
    await navigator.clipboard.writeText(all);
    statusEl.textContent = "Hamısı copy edildi ✅";
  } catch (e) {
    console.error(e);
  }
});

exportTxtBtn.addEventListener("click", () => {
  downloadText("video2news-pack.txt", collectAllOutput());
});

exportHeadlinesBtn.addEventListener("click", () => {
  downloadText("headlines.txt", getPlainText("headlines"));
});

exportTelegramBtn.addEventListener("click", () => {
  downloadText("telegram-post.txt", getPlainText("telegramPost"));
});

exportYoutubeBtn.addEventListener("click", () => {
  const content = `Başlıq:\n${getPlainText("youtubeTitle")}\n\nTəsvir:\n${getPlainText("youtubeDescription")}`;
  downloadText("youtube-pack.txt", content);
});

renderHistory();
