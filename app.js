<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Video2News</title>
  <style>
    :root {
      --bg: #07111f;
      --bg-2: #0a1730;
      --panel: rgba(12, 25, 49, 0.92);
      --panel-2: rgba(15, 31, 60, 0.95);
      --border: rgba(120, 156, 255, 0.16);
      --text: #f4f7ff;
      --muted: #9fb0d1;
      --accent: #ff4d57;
      --accent-2: #ff6a74;
      --success: #22c55e;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      --radius: 20px;
      --radius-sm: 14px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(255, 77, 87, 0.18), transparent 22%),
        radial-gradient(circle at top right, rgba(0, 112, 255, 0.16), transparent 26%),
        linear-gradient(120deg, var(--bg), var(--bg-2));
      min-height: 100vh;
      padding: 24px;
    }

    .app {
      max-width: 1320px;
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 24px;
    }

    .brand h1 {
      margin: 0;
      font-size: 40px;
      line-height: 1;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.02em;
    }

    .brand p {
      margin: 12px 0 0;
      max-width: 760px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.55;
    }

    .status-wrap {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 999px;
      background: rgba(12, 25, 49, 0.78);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 14px;
      white-space: nowrap;
      box-shadow: var(--shadow);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--success);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.6);
    }

    .layout {
      display: grid;
      grid-template-columns: 360px 1fr 260px;
      gap: 18px;
      align-items: start;
    }

    .panel {
      background: linear-gradient(180deg, rgba(10, 23, 48, 0.98), rgba(8, 17, 33, 0.98));
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .panel-head {
      padding: 18px 18px 10px;
      border-bottom: 1px solid rgba(120, 156, 255, 0.08);
    }

    .panel-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }

    .panel-sub {
      margin-top: 8px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.55;
    }

    .panel-body {
      padding: 18px;
    }

    .dropzone {
      border: 1px dashed rgba(159, 176, 209, 0.28);
      border-radius: 16px;
      padding: 16px;
      background: rgba(12, 25, 49, 0.58);
      margin-bottom: 14px;
    }

    .dropzone strong {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
    }

    .dropzone span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.55;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    textarea,
    select,
    input[type="file"] {
      width: 100%;
      border-radius: 14px;
      border: 1px solid #334155;
      background: var(--panel-2);
      color: var(--text);
      padding: 13px 14px;
      font-size: 14px;
      outline: none;
      transition: 0.2s ease;
      margin-bottom: 14px;
    }

    textarea:focus,
    select:focus,
    input[type="file"]:focus {
      border-color: rgba(255, 106, 116, 0.55);
      box-shadow: 0 0 0 4px rgba(255, 77, 87, 0.12);
    }

    textarea {
      min-height: 190px;
      resize: vertical;
      line-height: 1.6;
    }

    .btn {
      width: 100%;
      border: none;
      border-radius: 14px;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.12s ease, opacity 0.2s ease, box-shadow 0.2s ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #fff;
      box-shadow: 0 12px 24px rgba(255, 77, 87, 0.22);
    }

    .btn-secondary {
      background: rgba(13, 26, 50, 0.96);
      color: var(--text);
      border: 1px solid rgba(159, 176, 209, 0.18);
    }

    .btn-row {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      margin-bottom: 14px;
    }

    .btn-row .btn {
      flex: 1;
    }

    .mini-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }

    .mini-card {
      padding: 12px;
      border-radius: 14px;
      background: rgba(13, 26, 50, 0.96);
      border: 1px solid rgba(159, 176, 209, 0.08);
    }

    .mini-card .label {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .mini-card .value {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
    }

    .panel-note {
      margin-top: 14px;
      font-size: 12px;
      line-height: 1.55;
      color: var(--muted);
    }

    .output-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .output-card {
      border: 1px solid rgba(159, 176, 209, 0.1);
      background: rgba(13, 26, 50, 0.96);
      border-radius: 18px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .output-card.tall {
      min-height: 240px;
    }

    .output-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(159, 176, 209, 0.08);
      gap: 10px;
    }

    .output-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
    }

    .tool-btn {
      border: 1px solid rgba(159, 176, 209, 0.18);
      background: rgba(8, 17, 33, 0.9);
      color: var(--text);
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .output-content {
      padding: 16px;
      color: var(--text);
      font-size: 14px;
      line-height: 1.72;
      white-space: pre-wrap;
      flex: 1;
      overflow: auto;
    }

    .empty {
      color: #7183a8;
    }

    .headlines-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .headline-item {
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(7, 17, 31, 0.72);
      border: 1px solid rgba(159, 176, 209, 0.08);
      line-height: 1.55;
    }

    .side-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .side-card {
      background: linear-gradient(180deg, rgba(10, 23, 48, 0.98), rgba(8, 17, 33, 0.98));
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .side-card h3 {
      margin: 0;
      padding: 16px 16px 12px;
      font-size: 15px;
      border-bottom: 1px solid rgba(159, 176, 209, 0.08);
    }

    .side-body {
      padding: 14px 16px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }

    .history-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(13, 26, 50, 0.9);
      border: 1px solid rgba(159, 176, 209, 0.08);
      cursor: pointer;
      margin-bottom: 10px;
      transition: 0.2s ease;
    }

    .history-item:hover {
      border-color: rgba(255, 106, 116, 0.35);
      transform: translateY(-1px);
    }

    .history-item strong {
      color: var(--text);
      font-size: 13px;
    }

    .history-item span {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
    }

    .export-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .empty-note {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }

    @media (max-width: 1200px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .output-grid {
        grid-template-columns: 1fr;
      }

      .topbar {
        flex-direction: column;
      }

      .status-wrap {
        justify-content: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="topbar">
      <div class="brand">
        <h1>Video2News</h1>
        <p>
          Transkripti daxil et, AI onu strukturlaşdırılmış newsroom paketinə çevirsin.
          Başlıqlar, qısa xəbər, studio text, Telegram, YouTube və analitik blok bir paneldə.
        </p>
      </div>

      <div class="status-wrap">
        <div class="status-pill">
          <span class="status-dot"></span>
          <span id="status">AI online</span>
        </div>
        <div class="status-pill">Model: gpt-4o-mini</div>
      </div>
    </div>

    <div class="layout">
      <!-- LEFT -->
      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">Input paneli</h2>
          <div class="panel-sub">
            Mətn və ya transkript daxil et. Qısa audio/video faylı da yükləyib transkript çıxara bilərsən.
          </div>
        </div>

        <div class="panel-body">
          <div class="dropzone">
            <strong>Drag & drop zona</strong>
            <span>
              Qısa audio/video və ya mətn faylı burada istifadə oluna bilər.
              Bu mərhələdə qısa media upload + transkript dəstəyi aktivdir.
            </span>
          </div>

          <label for="mediaFile">Audio / video faylı</label>
          <input
            id="mediaFile"
            type="file"
            accept="audio/*,video/mp4,video/webm,video/quicktime"
          />

          <div class="btn-row" style="margin-bottom: 14px;">
            <button class="btn btn-secondary" id="transcribeBtn">Faylı transkript et</button>
            <button class="btn btn-secondary" id="clearFileBtn">Faylı sıfırla</button>
          </div>

          <label for="transcript">Transkript / mətn</label>
          <textarea
            id="transcript"
            placeholder="Buraya transkripti və ya mətni daxil et..."
          ></textarea>

          <label for="topic">Mövzu tipi</label>
          <select id="topic">
            <option value="general">Ümumi xəbər</option>
            <option value="war">Hərbi-siyasi</option>
            <option value="geopolitics">Geosiyasi analiz</option>
            <option value="urgent">Təcili xəbər</option>
            <option value="tv">TV xəbər paketi</option>
          </select>

          <label for="tone">Ton</label>
          <select id="tone">
            <option value="standard">Standart newsroom</option>
            <option value="hard">Sərt analitik</option>
            <option value="formal">Rəsmi</option>
            <option value="sharp">Kəskin media tonu</option>
          </select>

          <button class="btn btn-primary" id="analyzeBtn">Paket yarat</button>

          <div class="btn-row">
            <button class="btn btn-secondary" id="clearBtn">Təmizlə</button>
            <button class="btn btn-secondary" id="copyAllBtn">Hamısını copy et</button>
          </div>

          <div class="mini-grid">
            <div class="mini-card">
              <div class="label">Status</div>
              <div class="value">Hazırdır ✅</div>
            </div>
            <div class="mini-card">
              <div class="label">Format</div>
              <div class="value">Newsroom Pack V6</div>
            </div>
          </div>

          <div class="panel-note">
            Qeyd: bu mərhələdə ən stabil iş axını mətn/transkript üzərindən qurulub.
            Qısa audio/video üçün transkript funksiyası əlavə edilib.
          </div>
        </div>
      </div>

      <!-- CENTER -->
      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">Newsroom output</h2>
          <div class="panel-sub">
            Nəticələr burada blok-blok formalaşacaq. Hər blok ayrıca copy/export edilə bilər.
          </div>
        </div>

        <div class="panel-body">
          <div class="output-grid">
            <div class="output-card tall">
              <div class="output-head">
                <h3 class="output-title">Başlıq variantları</h3>
                <button class="tool-btn" data-copy="headlines">Copy</button>
              </div>
              <div class="output-content empty" id="headlines">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card tall">
              <div class="output-head">
                <h3 class="output-title">Qısa xəbər</h3>
                <button class="tool-btn" data-copy="shortNews">Copy</button>
              </div>
              <div class="output-content empty" id="shortNews">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">TV studio text</h3>
                <button class="tool-btn" data-copy="studioText">Copy</button>
              </div>
              <div class="output-content empty" id="studioText">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">Telegram post</h3>
                <button class="tool-btn" data-copy="telegramPost">Copy</button>
              </div>
              <div class="output-content empty" id="telegramPost">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">YouTube başlıq</h3>
                <button class="tool-btn" data-copy="youtubeTitle">Copy</button>
              </div>
              <div class="output-content empty" id="youtubeTitle">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">YouTube təsvir</h3>
                <button class="tool-btn" data-copy="youtubeDescription">Copy</button>
              </div>
              <div class="output-content empty" id="youtubeDescription">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">Thumbnail text</h3>
                <button class="tool-btn" data-copy="thumbnailText">Copy</button>
              </div>
              <div class="output-content empty" id="thumbnailText">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">Fact-check qeydləri</h3>
                <button class="tool-btn" data-copy="factCheck">Copy</button>
              </div>
              <div class="output-content empty" id="factCheck">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">Risk / nəticə</h3>
                <button class="tool-btn" data-copy="riskBlock">Copy</button>
              </div>
              <div class="output-content empty" id="riskBlock">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card">
              <div class="output-head">
                <h3 class="output-title">Məlum olanlar / qeyri-müəyyənlik</h3>
                <button class="tool-btn" data-copy="knownUnknowns">Copy</button>
              </div>
              <div class="output-content empty" id="knownUnknowns">Hələ nəticə yoxdur.</div>
            </div>

            <div class="output-card" style="grid-column: 1 / -1; min-height: 260px;">
              <div class="output-head">
                <h3 class="output-title">Analitik qeyd</h3>
                <button class="tool-btn" data-copy="analysis">Copy</button>
              </div>
              <div class="output-content empty" id="analysis">Hələ nəticə yoxdur.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="side-stack">
        <div class="side-card">
          <h3>History</h3>
          <div class="side-body" id="historyList">
            <div class="empty-note">Hələ history yoxdur.</div>
          </div>
        </div>

        <div class="side-card">
          <h3>Export</h3>
          <div class="side-body">
            <div class="export-buttons">
              <button class="btn btn-secondary" id="exportHeadlinesBtn">Başlıqlar</button>
              <button class="btn btn-secondary" id="exportTelegramBtn">Telegram</button>
              <button class="btn btn-secondary" id="exportYoutubeBtn">YouTube</button>
              <button class="btn btn-secondary" id="copySummaryBtn">Qısa xəbər</button>
            </div>

            <div class="btn-row" style="margin-top: 14px;">
              <button class="btn btn-primary" id="exportTxtBtn">Tam TXT export</button>
            </div>
          </div>
        </div>

        <div class="side-card">
          <h3>Qeyd</h3>
          <div class="side-body">
            Bu versiyada artıq:
            <br><br>
            • mətn/transkript analizi  
            <br>
            • qısa audio transkript  
            <br>
            • qısa video transkript  
            <br>
            • analitik bloklar  
            <br>
            • export/history  
            <br><br>
            aktivdir.
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="/app.js"></script>
</body>
</html>
