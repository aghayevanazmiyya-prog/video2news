const btn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const topicEl = document.getElementById("topic");
const toneEl = document.getElementById("tone");

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
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Server xətası ❌";
    setOutput("analysis", "Serverə qoşulmaq mümkün olmadı.");
  }
});

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const targetId = btn.dataset.copy;
    const el = document.getElementById(targetId);

    const text = el.innerText.trim();
    if (!text || text === "Hələ nəticə yoxdur.") return;

    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = old;
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  });
});
