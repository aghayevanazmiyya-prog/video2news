const btn = document.getElementById("analyzeBtn");
const status = document.getElementById("status");
const output = document.getElementById("output");
const transcriptEl = document.getElementById("transcript");
const topicEl = document.getElementById("topic");

btn.addEventListener("click", async () => {
  const transcript = transcriptEl.value.trim();
  const topic = topicEl.value;

  if (!transcript || transcript.length < 20) {
    alert("Zəhmət olmasa kifayət qədər uzun mətn və ya transkript daxil et.");
    return;
  }

  status.textContent = "AI analiz edir...";
  output.value = "";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ transcript, topic })
    });

    const data = await res.json();

    if (data.result) {
      status.textContent = "Hazırdır ✅";
      output.value = data.result;
    } else {
      status.textContent = "Xəta ❌";
      output.value = data.error || JSON.stringify(data);
    }
  } catch (err) {
    status.textContent = "Server xətası ❌";
    output.value = "Serverə qoşulmaq mümkün olmadı.";
    console.error(err);
  }
});
