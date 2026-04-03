const btn = document.getElementById("analyzeBtn");
const status = document.getElementById("status");
const output = document.getElementById("output");

btn.addEventListener("click", async () => {
  const fileInput = document.getElementById("videoFile");
  const topic = document.getElementById("topic").value;

  if (!fileInput.files.length) {
    alert("Video seçilməyib");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("video", file);
  formData.append("topic", topic);

  status.textContent = "Yüklənir...";
  output.value = "";

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.result) {
      status.textContent = "Hazırdır ✅";
      output.value = data.result;
    } else {
      status.textContent = "Xəta ❌";
      output.value = JSON.stringify(data);
    }

  } catch (err) {
    status.textContent = "Server xətası ❌";
    console.error(err);
  }
});
