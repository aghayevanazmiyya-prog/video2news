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
const uploadBtn = document.getElementById("uploadBtn");
const clearFileBtn = document.getElementById("clearFileBtn");

const uploadStatusEl = document.getElementById("uploadStatus");
const uploadProgressFill = document.getElementById("uploadProgressFill");
const uploadProgressText = document.getElementById("uploadProgressText");
const jobIdBox = document.getElementById("jobIdBox");
const jobStageBox = document.getElementById("jobStageBox");
const assetUrlBox = document.getElementById("assetUrlBox");
const publicIdBox = document.getElementById("publicIdBox");

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

function setUploadStatus(text) {
  if (uploadStatusEl) uploadStatusEl.textContent = text;
}

function setProgress(percent) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  if (uploadProgressFill) uploadProgressFill.style.width = `${safe}%`;
  if (uploadProgressText) uploadProgressText.textContent = `${safe.toFixed(0)}%`;
}

function setJobInfo({ jobId = "—", stage = "idle", assetUrl = "—", publicId = "—" } = {}) {
  if (jobIdBox) jobIdBox.textContent = jobId;
  if (jobStageBox) jobStageBox.textContent = stage;
  if (assetUrlBox) assetUrlBox.textContent = assetUrl;
  if (publicIdBox) publicIdBox.textContent = publicId;
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

  historyList.innerHTML = history.map((item) => `
    <div class="history-item" data-id="${item.id}">
      <strong>${item.topic} • ${item.tone}</strong>
      <span>${(item.shortNews || "").slice(0, 120)}...</span>
      <span style="margin-top:6px;">${item.createdAt}</span>
    </div>
  `).join("");

  document.querySelectorAll(".history-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.id);
      const selected = history.find((x) => x.id === id);
      if (!selected) return;

      if (transcriptEl) transcriptEl.value = selected.transcript || "";
      setHeadlines(
        selected.headlines
          ? selected.headlines.split("\n").map((x) => x.trim()).filter(Boolean)
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

async function requestUploadSignature() {
  const res = await fetch("/api/upload-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Upload imzası alınmadı.");
  }

  return data;
}

function uploadToCloudinary(file, signatureData) {
  return new Promise((resolve, reject) => {
    const {
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
      resourceType
    } = signatureData;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType || "video"}/upload`
    );

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent);
        setUploadStatus(`Upload gedir... ${percent.toFixed(0)}%`);
      }
    });

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || "Cloudinary upload xətası"));
        }
      } catch (err) {
        reject(err);
      }
    };

    xhr.onerror = () => reject(new Error("Upload zamanı şəbəkə xətası"));
    xhr.send(formData);
  });
}

async function createJob(uploadResult) {
  const res = await fetch("/api/jobs/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type,
      originalFilename: uploadResult.original_filename,
      bytes: uploadResult.bytes,
      duration: uploadResult.duration,
      format: uploadResult.format
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Job yaradılmadı.");
  }

  return data;
}

async function handleUpload() {
  const file = mediaFileEl?.files?.[0];

  if (!file) {
    alert("Əvvəl fayl seç.");
    return;
  }

  const maxSizeMb = 500;
  if (file.size > maxSizeMb * 1024 * 1024) {
    alert(`Fayl çox böyükdür. Maksimum ${maxSizeMb} MB.`);
    return;
  }

  setProgress(0);
  setUploadStatus("Upload hazırlanır...");
  setJobInfo();

  try {
    const signatureData = await requestUploadSignature();
    const uploadResult = await uploadToCloudinary(file, signatureData);

    setProgress(100);
    setUploadStatus("Upload tamamlandı ✅");

    const job = await createJob(uploadResult);

    setJobInfo({
      jobId: job.jobId,
      stage: job.status,
      assetUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

    setStatus("Video upload + job hazırdır ✅");
  } catch (error) {
    console.error(error);
    setUploadStatus("Upload xətası ❌");
    setStatus("Upload xətası ❌");
    alert(error.message || "Upload zamanı xəta baş verdi.");
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

uploadBtn?.addEventListener("click", handleUpload);
btn?.addEventListener("click", analyzeTranscript);

clearFileBtn?.addEventListener("click", () => {
  if (mediaFileEl) mediaFileEl.value = "";
  setProgress(0);
  setUploadStatus("Fayl sıfırlandı.");
  setJobInfo();
});

clearBtn?.addEventListener("click", () => {
  if (transcriptEl) transcriptEl.value = "";
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
setProgress(0);
setJobInfo();
