const btn = document.getElementById("analyzeBtn");

btn.addEventListener("click", async () => {
  const transcript = document.getElementById("transcript").value;

  if (!transcript || transcript.length < 30) {
    alert("Mətn çox qısadır");
    return;
  }

  document.getElementById("shortNews").innerText = "Yüklənir...";
  document.getElementById("telegramPost").innerText = "";
  document.getElementById("youtubeTitle").innerText = "";
  document.getElementById("analysis").innerText = "";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transcript,
        topic: "general",
        tone: "standard"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("analysis").innerText = data.error;
      return;
    }

    document.getElementById("shortNews").innerText = data.shortNews;
    document.getElementById("telegramPost").innerText = data.telegramPost;
    document.getElementById("youtubeTitle").innerText = data.youtubeTitle;
    document.getElementById("analysis").innerText = data.analysis;

  } catch (err) {
    document.getElementById("analysis").innerText = "Server xətası";
  }
});
