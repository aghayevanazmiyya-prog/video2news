const $ = (id) => document.getElementById(id);

const transcriptInput = $("transcriptInput");
const topicType = $("topicType");
const toneSelect = $("toneSelect");
const generateBtn = $("generateBtn");
const clearBtn = $("clearBtn");

const resultTitle = $("resultTitle");
const resultShort = $("resultShort");
const resultStudio = $("resultStudio");
const resultTelegram = $("resultTelegram");
const resultYouTubeTitle = $("resultYouTubeTitle");
const resultYouTubeDesc = $("resultYouTubeDesc");
const resultThumbnail = $("resultThumbnail");
const resultFactcheck = $("resultFactcheck");

const historyList = $("historyList");

const exportTitlesBtn = $("exportTitlesBtn");
const exportTelegramBtn = $("exportTelegramBtn");
const exportYouTubeBtn = $("exportYouTubeBtn");
const exportShortBtn = $("exportShortBtn");
const exportAllBtn = $("exportAllBtn");

const mediaFile = $("mediaFile");
const uploadBtn = $("uploadBtn");
const resetUploadBtn = $("resetUploadBtn");

const uploadStatusText = $("uploadStatusText");
const uploadProgressBar = $("uploadProgressBar");
const uploadPercent = $("uploadPercent");
const jobIdBox = $("jobIdBox");
const stageBox = $("stageBox");
const fileUrlBox = $("fileUrlBox");
const publicIdBox = $("publicIdBox");

let latestPack = null;

function setText(el, value) {
  if (!el) return;
  el.textContent = value || "Hələ nəticə yoxdur.";
}

function setHTML(el, value) {
  if (!el) return;
  el.innerHTML = value || "Hələ nəticə yoxdur.";
}

function copyText(text) {
  navigator.clipboard.writeText(text || "");
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = $(btn.dataset.copyTarget);
      copyText(target?.innerText || target?.textContent || "");
      btn.textContent = "Kopyalandı";
      setTimeout(() => (btn.textContent = "Copy"), 1200);
    });
  });
}

bindCopyButtons();

function cleanLines(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => String(x).trim()).filter(Boolean);
}

function renderTitles(titles) {
  if (!titles || !titles.length) return "Hələ nəticə yoxdur.";
  return titles.map((t) => `<div class="title-pill">${t}</div>`).join("");
}

function renderPack(pack) {
  latestPack = pack;

  setHTML(resultTitle, renderTitles(cleanLines(pack.headlines)));
  setText(resultShort, pack.short_news);
  setText(resultStudio, pack.studio_text);
  setText(resultTelegram, pack.telegram_post);
  setText(resultYouTubeTitle, pack.youtube_title);
  setText(resultYouTubeDesc, pack.youtube_description);
  setText(resultThumbnail, pack.thumbnail_text);
  setText(resultFactcheck, pack.factcheck_notes);

  saveHistory(pack);
}

function saveHistory(pack) {
  const old = JSON.parse(localStorage.getItem("video2news_history") || "[]");
  const item = {
    createdAt: new Date().toLocaleString(),
    topic: topicType.value,
    tone: toneSelect.value,
    headline: pack?.headlines?.[0] || "Adsız paket",
    pack,
  };
  old.unshift(item);
  localStorage.setItem("video2news_history", JSON.stringify(old.slice(0, 15)));
  renderHistory();
}

function renderHistory() {
  const items = JSON.parse(localStorage.getItem("video2news_history") || "[]");

  if (!items.length) {
    historyList.innerHTML = `<div class="history-empty">Hələ history yoxdur.</div>`;
    return;
  }

  historyList.innerHTML = items
    .map(
      (item, idx) => `
      <div class="history-card" data-history-index="${idx}">
        <div class="history-title">${item.headline}</div>
        <div class="history-meta">${item.topic} • ${item.tone}</div>
        <div class="history-date">${item.createdAt}</div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".history-card").forEach((card) => {
    card.addEventListener("click", () => {
      const items = JSON.parse(localStorage.getItem("video2news_history") || "[]");
      const index = Number(card.dataset.historyIndex);
      const item = items[index];
      if (item?.pack) renderPack(item.pack);
    });
  });
}

renderHistory();

generateBtn?.addEventListener("click", async () => {
  const text = transcriptInput.value.trim();

  if (!text) {
    alert("Zəhmət olmasa mətn və ya transkript daxil et.");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Hazırlanır...";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: text,
        topicType: topicType.value,
        tone: toneSelect.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      alert(data?.error || "Server xətası baş verdi.");
      return;
    }

    renderPack(data);
  } catch (err) {
    console.error(err);
    alert("Şəbəkə xətası baş verdi.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Newsroom paketi yarat";
  }
});

clearBtn?.addEventListener("click", () => {
  transcriptInput.value = "";
  latestPack = null;

  setHTML(resultTitle, "Hələ nəticə yoxdur.");
  setText(resultShort, "Hələ nəticə yoxdur.");
  setText(resultStudio, "Hələ nəticə yoxdur.");
  setText(resultTelegram, "Hələ nəticə yoxdur.");
  setText(resultYouTubeTitle, "Hələ nəticə yoxdur.");
  setText(resultYouTubeDesc, "Hələ nəticə yoxdur.");
  setText(resultThumbnail, "Hələ nəticə yoxdur.");
  setText(resultFactcheck, "Hələ nəticə yoxdur.");
});

function exportText(content, filename = "video2news.txt") {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

exportTitlesBtn?.addEventListener("click", () => {
  if (!latestPack) return alert("Export üçün əvvəlcə paket yarat.");
  exportText((latestPack.headlines || []).join("\n"), "basliqlar.txt");
});

exportTelegramBtn?.addEventListener("click", () => {
  if (!latestPack) return alert("Export üçün əvvəlcə paket yarat.");
  exportText(latestPack.telegram_post || "", "telegram_post.txt");
});

exportYouTubeBtn?.addEventListener("click", () => {
  if (!latestPack) return alert("Export üçün əvvəlcə paket yarat.");
  exportText(
    `Başlıq:\n${latestPack.youtube_title || ""}\n\nTəsvir:\n${latestPack.youtube_description || ""}`,
    "youtube.txt"
  );
});

exportShortBtn?.addEventListener("click", () => {
  if (!latestPack) return alert("Export üçün əvvəlcə paket yarat.");
  exportText(latestPack.short_news || "", "qisa_xeber.txt");
});

exportAllBtn?.addEventListener("click", () => {
  if (!latestPack) return alert("Export üçün əvvəlcə paket yarat.");

  const content = `
=== BAŞLIQLAR ===
${(latestPack.headlines || []).join("\n")}

=== QISA XƏBƏR ===
${latestPack.short_news || ""}

=== TV STUDIO TEXT ===
${latestPack.studio_text || ""}

=== TELEGRAM POST ===
${latestPack.telegram_post || ""}

=== YOUTUBE BAŞLIQ ===
${latestPack.youtube_title || ""}

=== YOUTUBE TƏSVİR ===
${latestPack.youtube_description || ""}

=== THUMBNAIL TEXT ===
${latestPack.thumbnail_text || ""}

=== FACT-CHECK QEYDLƏRİ ===
${latestPack.factcheck_notes || ""}
  `.trim();

  exportText(content, "video2news_full_export.txt");
});

function resetUploadUI() {
  uploadStatusText.textContent = "Hələ upload yoxdur.";
  uploadProgressBar.style.width = "0%";
  uploadPercent.textContent = "0%";
  jobIdBox.textContent = "—";
  stageBox.textContent = "idle";
  fileUrlBox.textContent = "—";
  publicIdBox.textContent = "—";
}

resetUploadUI();

resetUploadBtn?.addEventListener("click", () => {
  mediaFile.value = "";
  resetUploadUI();
});

uploadBtn?.addEventListener("click", async () => {
  const file = mediaFile.files?.[0];

  if (!file) {
    alert("Zəhmət olmasa video və ya audio fayl seç.");
    return;
  }

  uploadStatusText.textContent = "Upload hazırlanır...";
  uploadProgressBar.style.width = "5%";
  uploadPercent.textContent = "5%";

  try {
    // 1) Upload signature al
    const signRes = await fetch("/api/upload-signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        resource_type: "video",
      }),
    });

    const signData = await signRes.json();

    if (!signRes.ok || !signData?.signature) {
      console.error("SIGN ERROR:", signData);
      alert(signData?.error || "Upload imzası yaradılmadı.");
      resetUploadUI();
      return;
    }

    // 2) Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder || "video2news_uploads");

    uploadStatusText.textContent = "Upload gedir...";

    const cloudName = signData.cloudName;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        uploadProgressBar.style.width = percent + "%";
        uploadPercent.textContent = percent + "%";
      }
    };

    xhr.onload = async function () {
      try {
        if (xhr.status < 200 || xhr.status >= 300) {
          console.error("CLOUDINARY RAW ERROR:", xhr.responseText);
          uploadStatusText.textContent = "Upload xətası ❌";
          alert("Cloudinary upload uğursuz oldu.");
          return;
        }

        const uploaded = JSON.parse(xhr.responseText || "{}");

        if (!uploaded?.secure_url || !uploaded?.public_id) {
          console.error("UPLOAD RESPONSE INVALID:", uploaded);
          uploadStatusText.textContent = "Upload xətası ❌";
          alert("Upload cavabı natamam gəldi.");
          return;
        }

        uploadStatusText.textContent = "Upload tamamlandı ✅";
        uploadProgressBar.style.width = "100%";
        uploadPercent.textContent = "100%";
        fileUrlBox.textContent = uploaded.secure_url;
        publicIdBox.textContent = uploaded.public_id;
        stageBox.textContent = "uploaded";

        // 3) Job yarat
        const jobRes = await fetch("/api/jobs/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileUrl: uploaded.secure_url,
            publicId: uploaded.public_id,
            originalName: file.name,
            bytes: uploaded.bytes || file.size,
            duration: uploaded.duration || null,
            format: uploaded.format || null,
            resourceType: "video",
          }),
        });

        const jobData = await jobRes.json();

        if (!jobRes.ok) {
          console.error("JOB ERROR:", jobData);
          alert(jobData?.error || "Job yaradılmadı.");
          stageBox.textContent = "job-error";
          return;
        }

        jobIdBox.textContent = jobData.jobId || "—";
        stageBox.textContent = jobData.stage || "queued";

        if (jobData.transcript) {
          transcriptInput.value = jobData.transcript;
        }

        if (jobData.pack) {
          renderPack(jobData.pack);
        }
      } catch (err) {
        console.error("UPLOAD PARSE/POST ERROR:", err);
        uploadStatusText.textContent = "Upload xətası ❌";
        alert("Upload zamanı emal xətası baş verdi.");
      }
    };

    xhr.onerror = function () {
      console.error("XHR NETWORK ERROR");
      uploadStatusText.textContent = "Upload xətası ❌";
      alert("Upload zamanı şəbəkə xətası");
    };

    xhr.send(formData);
  } catch (err) {
    console.error("GENERAL UPLOAD ERROR:", err);
    uploadStatusText.textContent = "Upload xətası ❌";
    alert("Upload zamanı şəbəkə xətası");
  }
});
