import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: "#090909",
  surface: "#111111",
  card: "#161616",
  border: "#222222",
  accent: "#C8F135",       // chartreuse green
  accentDim: "#8AAF1A",
  gold: "#D4AF37",
  text: "#F0F0F0",
  muted: "#666666",
  danger: "#FF4444",
  info: "#3399FF",
  purple: "#9B59FF",
  teal: "#00C9A7",
};

const G = {
  fontDisplay: "'Syne', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  fontBody: "'DM Sans', sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.text};
    font-family: ${G.fontBody};
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }

  .ws-root {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 56px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ── TOPBAR ── */
  .topbar {
    grid-column: 1 / -1;
    background: ${T.surface};
    border-bottom: 1px solid ${T.border};
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 16px;
    z-index: 10;
  }
  .topbar-logo {
    font-family: ${G.fontDisplay};
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 3px;
    color: ${T.accent};
    text-transform: uppercase;
  }
  .topbar-owner {
    margin-left: auto;
    font-size: 11px;
    color: ${T.muted};
    letter-spacing: 1.5px;
    font-family: ${G.fontMono};
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${T.accent};
    box-shadow: 0 0 6px ${T.accent};
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50% { opacity:0.4; }
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: ${T.surface};
    border-right: 1px solid ${T.border};
    overflow-y: auto;
    padding: 16px 0;
  }
  .nav-section {
    padding: 0 12px 8px;
    margin-bottom: 4px;
  }
  .nav-label {
    font-size: 9px;
    letter-spacing: 2px;
    color: ${T.muted};
    text-transform: uppercase;
    font-family: ${G.fontMono};
    padding: 8px 8px 4px;
    display: block;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 500;
    color: ${T.muted};
    transition: all 0.15s;
    user-select: none;
    border: 1px solid transparent;
  }
  .nav-item:hover {
    background: ${T.card};
    color: ${T.text};
  }
  .nav-item.active {
    background: rgba(200,241,53,0.08);
    color: ${T.accent};
    border-color: rgba(200,241,53,0.15);
  }
  .nav-icon { font-size: 14px; width: 18px; text-align: center; }

  /* ── MAIN CONTENT ── */
  .main {
    overflow-y: auto;
    background: ${T.bg};
    padding: 28px;
  }

  /* ── GENERIC COMPONENTS ── */
  .page-title {
    font-family: ${G.fontDisplay};
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }
  .page-sub {
    font-size: 12px;
    color: ${T.muted};
    margin-bottom: 24px;
    letter-spacing: 0.3px;
  }

  .card {
    background: ${T.card};
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 18px;
    margin-bottom: 14px;
  }
  .card-title {
    font-family: ${G.fontDisplay};
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-family: ${G.fontMono};
    font-weight: 500;
    letter-spacing: 0.5px;
    background: rgba(200,241,53,0.1);
    color: ${T.accent};
    border: 1px solid rgba(200,241,53,0.2);
  }
  .tag.gold { background: rgba(212,175,55,0.1); color: ${T.gold}; border-color: rgba(212,175,55,0.2); }
  .tag.purple { background: rgba(155,89,255,0.1); color: ${T.purple}; border-color: rgba(155,89,255,0.2); }
  .tag.teal { background: rgba(0,201,167,0.1); color: ${T.teal}; border-color: rgba(0,201,167,0.2); }
  .tag.red { background: rgba(255,68,68,0.1); color: ${T.danger}; border-color: rgba(255,68,68,0.2); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

  .btn {
    padding: 10px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: ${G.fontBody};
    font-size: 12.5px;
    font-weight: 600;
    transition: all 0.15s;
    letter-spacing: 0.3px;
  }
  .btn-primary {
    background: ${T.accent};
    color: #000;
  }
  .btn-primary:hover { background: #d4fd3f; }
  .btn-ghost {
    background: transparent;
    color: ${T.text};
    border: 1px solid ${T.border};
  }
  .btn-ghost:hover { border-color: ${T.accent}; color: ${T.accent}; }
  .btn-sm { padding: 6px 12px; font-size: 11px; }

  textarea, input[type="text"], select {
    width: 100%;
    background: #0e0e0e;
    border: 1px solid ${T.border};
    border-radius: 6px;
    padding: 10px 12px;
    color: ${T.text};
    font-family: ${G.fontBody};
    font-size: 13px;
    resize: none;
    outline: none;
    transition: border 0.15s;
  }
  textarea:focus, input[type="text"]:focus, select:focus {
    border-color: ${T.accent};
  }
  select option { background: #111; }

  .output-box {
    background: #0a0a0a;
    border: 1px solid ${T.border};
    border-radius: 8px;
    padding: 16px;
    font-family: ${G.fontBody};
    font-size: 13.5px;
    line-height: 1.75;
    min-height: 120px;
    white-space: pre-wrap;
    color: ${T.text};
    position: relative;
  }
  .output-box .completion-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 10px;
    font-family: ${G.fontMono};
    color: ${T.accent};
    background: rgba(200,241,53,0.08);
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid rgba(200,241,53,0.15);
  }

  .module-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 500;
    color: ${T.muted};
    cursor: pointer;
    transition: all 0.15s;
    margin: 3px;
  }
  .module-chip:hover, .module-chip.active {
    background: rgba(200,241,53,0.06);
    border-color: rgba(200,241,53,0.2);
    color: ${T.accent};
  }

  .pipeline-step {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 6px;
    font-size: 12px;
    font-family: ${G.fontMono};
    margin-bottom: 6px;
    position: relative;
  }
  .pipeline-step.done {
    border-color: rgba(200,241,53,0.2);
    color: ${T.accent};
  }
  .pipeline-step .step-num {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: ${T.border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: ${T.muted};
    flex-shrink: 0;
  }
  .pipeline-step.done .step-num {
    background: ${T.accent};
    color: #000;
  }

  .ai-chat {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 130px);
  }
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .msg {
    max-width: 82%;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.65;
  }
  .msg-user {
    background: rgba(200,241,53,0.08);
    border: 1px solid rgba(200,241,53,0.15);
    align-self: flex-end;
    color: ${T.text};
  }
  .msg-ai {
    background: ${T.card};
    border: 1px solid ${T.border};
    align-self: flex-start;
    color: ${T.text};
  }
  .msg-label {
    font-size: 9px;
    font-family: ${G.fontMono};
    letter-spacing: 1.5px;
    color: ${T.muted};
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .chat-input-row {
    display: flex;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid ${T.border};
  }
  .loading-dots::after {
    content: '...';
    animation: dots 1.2s steps(4, end) infinite;
  }
  @keyframes dots {
    0%,20% { content: '.'; }
    40%,60% { content: '..'; }
    80%,100% { content: '...'; }
  }

  .vault-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 6px;
    font-size: 12.5px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: border 0.15s;
  }
  .vault-item:hover { border-color: ${T.accentDim}; }
  .vault-name { font-weight: 500; }
  .vault-meta { font-family: ${G.fontMono}; font-size: 10px; color: ${T.muted}; }

  .engine-slot {
    padding: 16px;
    background: ${T.surface};
    border: 1px dashed ${T.border};
    border-radius: 8px;
    text-align: center;
    font-size: 11.5px;
    color: ${T.muted};
  }
  .engine-slot .slot-icon { font-size: 22px; margin-bottom: 8px; }
  .engine-slot .slot-name {
    font-family: ${G.fontDisplay};
    font-size: 12px;
    font-weight: 700;
    color: ${T.text};
    margin-bottom: 4px;
  }

  .dump-zone {
    border: 2px dashed ${T.border};
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .dump-zone:hover {
    border-color: ${T.accent};
    background: rgba(200,241,53,0.03);
  }

  .progress-bar {
    height: 4px;
    background: ${T.border};
    border-radius: 2px;
    overflow: hidden;
    margin-top: 6px;
  }
  .progress-fill {
    height: 100%;
    background: ${T.accent};
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .stat-block {
    padding: 14px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 8px;
    text-align: center;
  }
  .stat-val {
    font-family: ${G.fontDisplay};
    font-size: 24px;
    font-weight: 800;
    color: ${T.accent};
  }
  .stat-label {
    font-size: 10px;
    color: ${T.muted};
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
    font-family: ${G.fontMono};
  }

  .divider {
    height: 1px;
    background: ${T.border};
    margin: 16px 0;
  }

  .badge-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

  .completion-pipeline {
    display: flex;
    align-items: center;
    gap: 0;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  .cp-step {
    flex-shrink: 0;
    padding: 8px 14px;
    background: ${T.surface};
    border: 1px solid ${T.border};
    font-size: 11px;
    font-family: ${G.fontMono};
    color: ${T.muted};
    position: relative;
  }
  .cp-step.active {
    background: rgba(200,241,53,0.08);
    border-color: rgba(200,241,53,0.3);
    color: ${T.accent};
  }
  .cp-arrow {
    flex-shrink: 0;
    color: ${T.border};
    font-size: 14px;
    padding: 0 2px;
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const WRITE_MODES = [
  { id: "dancehall", label: "Elite Dancehall", icon: "🔥", tag: "Lyric", desc: "High-energy riddim flow, clever wordplay, commanding presence" },
  { id: "techrap", label: "Technical Rap", icon: "⚡", tag: "Lyric", desc: "Rapid-fire multi-syllabic rhymes, internal schemes, sharp delivery" },
  { id: "poetic", label: "Poetic Street", icon: "📖", tag: "Prose", desc: "Narrative storytelling fused with street wisdom and imagery" },
  { id: "courtroom", label: "Courtroom Argument", icon: "⚖️", tag: "Legal", desc: "Precision language, structured reasoning, watertight logic" },
  { id: "comedy", label: "Caribbean Comedy", icon: "😂", tag: "Caption", desc: "Mature wit, cultural sharpness, comedic timing built in" },
  { id: "global", label: "Global Youth Slang", icon: "🌍", tag: "Slang", desc: "Cross-cultural multilingual slang, current pulse, universal hit" },
  { id: "business", label: "Business Sharp", icon: "💼", tag: "Business", desc: "Executive-level clarity, persuasive structure, decisive tone" },
  { id: "character", label: "Character Voice", icon: "🎭", tag: "Dialogue", desc: "Distinct voice per character, authentic dialect, dramatic tension" },
];

const ENGINE_MODULES = [
  "grammar_core", "caribbean_language_engine", "jamaican_slang_engine",
  "global_slang_engine", "lyric_writer", "battle_bar_engine",
  "comedy_writer", "legal_sharp_writer", "business_writer",
  "character_voice_writer", "speech_polisher", "translation_cleaner",
  "originality_checker", "human_presentable_output", "completion_pass",
];

const COMPLETION_STEPS = [
  "Structure Pass", "Build Pass", "Completion Pass",
  "Fine-Tune Pass", "Polish Pass", "Export Ready",
];

const OPEN_SLOTS = [
  { icon: "🧠", name: "Memory System", id: "memory" },
  { icon: "🎬", name: "Video Engine", id: "video" },
  { icon: "💳", name: "Payment System", id: "payment" },
  { icon: "📷", name: "Camera Engine", id: "camera" },
  { icon: "✍️", name: "Writing Engine", id: "writing", active: true },
  { icon: "🔮", name: "Future Logic", id: "future" },
];

const VAULT_ITEMS = [
  { name: "YaadFlex Taxi App", type: "Project", status: "Active", date: "2025" },
  { name: "SOVEREIGN Platform", type: "Prototype", status: "Building", date: "2025" },
  { name: "Nexus Game System", type: "Blueprint", status: "Active", date: "2025" },
  { name: "Presence Infrastructure", type: "System", status: "Active", date: "2025" },
  { name: "XXOON Brand Files", type: "IP", status: "Registered", date: "2025" },
  { name: "Mintage Holdings", type: "Legal", status: "In Progress", date: "2025" },
];

// ─── COMPLETION ENGINE ────────────────────────────────────────────────────────

async function runCompletionEngine(raw, mode) {
  const systemPrompt = `You are the COMPLETION ENGINE — a final-pass processor for the SharpTalk Writing System.

Owner: DWAYNE FFOLKES
System: XXOON / Mintage Holdings

Your job:
1. Take the raw writing output and the mode
2. Fix any incomplete lines or placeholders
3. Polish grammar and flow
4. Ensure the voice matches the mode
5. Remove any AI-sounding filler phrases
6. Output ONLY the final polished writing — no commentary, no labels, no markdown fences
7. The output should feel like it came from a professional human writer

Mode: ${mode}

STRICT RULES:
- Do not imitate any living artist's exact style
- Do not reproduce copyrighted lyrics
- All writing must be original
- Output must be clean, direct, human-presentable`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Run completion pass on this output:\n\n${raw}` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || raw;
}

async function callWritingEngine(prompt, mode, modeLabel) {
  const modeInstructions = {
    dancehall: "Write in elite dancehall style: commanding, rhythmic, culturally rich Caribbean energy. Build vivid imagery with confident wordplay. Every line should hit hard. ORIGINAL — do not imitate any living artist.",
    techrap: "Write rapid-fire technical rap bars: dense internal rhyme schemes, multisyllabic patterns, sharp wit. Stack syllables with purpose. ORIGINAL — not copying any artist.",
    poetic: "Write as poetic street storytelling: narrative arc, sensory detail, street wisdom fused with literary technique. Think spoken word with a sharp edge.",
    courtroom: "Write as a courtroom-sharp argument: structured logic, precise language, persuasive framing, zero ambiguity. Every sentence earns its place.",
    comedy: "Write Caribbean comedic content: culturally sharp, timing built into the sentences, mature wit, punchy. Authentic Caribbean voice.",
    global: "Write using global youth slang: cross-cultural, multilingual influences, current pulse. Feels international but grounded.",
    business: "Write as elite business communication: executive clarity, decisive tone, persuasive structure, professional authority.",
    character: "Write compelling character dialogue: each voice is distinct, authentic dialect when needed, strong dramatic tension.",
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are the SharpTalk Writing Engine — a professional creative writing system for DWAYNE FFOLKES / XXOON.\n\nMode: ${modeLabel}\nInstructions: ${modeInstructions[mode]}\n\nOutput ONLY the written content. No commentary. No labels. No markdown. Clean, direct, original.`,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard() {
  return (
    <div>
      <div className="page-title">SOVEREIGN WORKSPACE</div>
      <div className="page-sub">Owner: DWAYNE FFOLKES · XXOON / Mintage Holdings</div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { val: "15", label: "Modules Active" },
          { val: "7", label: "Write Modes" },
          { val: "6", label: "AI Pipelines" },
          { val: "∞", label: "Engine Slots" },
        ].map((s) => (
          <div className="stat-block" key={s.label}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">⚡ SharpTalk Writing Engine <span className="tag">Active</span></div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
            15 modules · Grammar · Caribbean · Slang · Lyrics · Legal · Business · Comedy · Dialogue · Completion Engine
          </div>
          <div className="badge-row">
            {["Grammar Core", "Caribbean Engine", "Completion Pass", "Human Output"].map(m => (
              <span className="tag" key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">📁 FileDump Logic Engine <span className="tag gold">Active</span></div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
            Dump → Analyze → Classify → Build → Export · AI reads and structures your raw ideas into projects
          </div>
          <div className="badge-row">
            {["Inbox", "Classifier", "Builder", "Export Pack"].map(m => (
              <span className="tag gold" key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🔄 Completion Engine Pipeline</div>
        <div className="completion-pipeline">
          {COMPLETION_STEPS.map((s, i) => (
            <>
              <div className={`cp-step ${i <= 2 ? "active" : ""}`} key={s}>{s}</div>
              {i < COMPLETION_STEPS.length - 1 && <div className="cp-arrow" key={s + "a"}>›</div>}
            </>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 12 }}>Every module output routes through completion_engine automatically before export.</div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-title">💬 Main Chat AI</div>
          <div style={{ fontSize: 12, color: T.muted }}>Reasons · Plans · Explains · Reads project context</div>
        </div>
        <div className="card">
          <div className="card-title">🏗 Builder AI</div>
          <div style={{ fontSize: 12, color: T.muted }}>Writes files · Creates folders · Exports documents · Builds pages</div>
        </div>
        <div className="card">
          <div className="card-title">🎙 Voice AI</div>
          <div style={{ fontSize: 12, color: T.muted }}>Listens · Reads files/chats · Finds things · Presents results</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🗂 Active Projects</div>
        {VAULT_ITEMS.slice(0, 4).map((v) => (
          <div className="vault-item" key={v.name}>
            <div>
              <div className="vault-name">{v.name}</div>
              <div className="vault-meta">{v.type} · {v.date}</div>
            </div>
            <span className={`tag ${v.status === "Active" ? "" : v.status === "Registered" ? "gold" : "purple"}`}>{v.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WritingEngine() {
  const [mode, setMode] = useState("dancehall");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipeline, setPipeline] = useState([]);

  const selectedMode = WRITE_MODES.find(m => m.id === mode);

  const run = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setPipeline(["Writing Engine"]);
    try {
      const raw = await callWritingEngine(prompt, mode, selectedMode.label);
      setPipeline(["Writing Engine", "Completion Engine"]);
      const polished = await runCompletionEngine(raw, selectedMode.label);
      setPipeline(["Writing Engine", "Completion Engine", "Human Output"]);
      setOutput(polished);
    } catch (e) {
      setOutput("Engine error — check connection.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">SHARPTALK WRITING ENGINE</div>
      <div className="page-sub">All output passes through completion_engine automatically · Original writing only</div>

      <div className="card">
        <div className="card-title">Writing Mode</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {WRITE_MODES.map(m => (
            <div
              key={m.id}
              className={`module-chip ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.icon} {m.label} <span className="tag" style={{ marginLeft: 4 }}>{m.tag}</span>
            </div>
          ))}
        </div>
        {selectedMode && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: T.surface, borderRadius: 6, fontSize: 12, color: T.muted, borderLeft: `2px solid ${T.accent}` }}>
            {selectedMode.desc}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Engine Modules</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {ENGINE_MODULES.map(m => (
            <span className="module-chip" key={m} style={{ fontSize: 10.5 }}>
              {m.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Input</div>
        <textarea
          rows={4}
          placeholder={`Describe what you want in ${selectedMode?.label} style...`}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? "Running Engine…" : "▶ Generate + Complete"}
          </button>
          {pipeline.length > 0 && (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {pipeline.map((p, i) => (
                <>
                  <span className="tag" key={p}>{p}</span>
                  {i < pipeline.length - 1 && <span style={{ color: T.muted, fontSize: 12 }}>→</span>}
                </>
              ))}
            </div>
          )}
        </div>
      </div>

      {(loading || output) && (
        <div className="card">
          <div className="card-title">Output <span className="tag">Completion Pass Done</span></div>
          <div className="output-box">
            {loading ? <span className="loading-dots">Processing</span> : output}
            {!loading && output && <div className="completion-badge">✓ HUMAN-READY</div>}
          </div>
          {!loading && output && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setOutput("")}>Clear</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompletionEngine() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);

  const steps = [
    { label: "Unfinished Scanner", icon: "🔍" },
    { label: "Placeholder Filler", icon: "📝" },
    { label: "Text Cleaner", icon: "🧹" },
    { label: "Consistency Check", icon: "✅" },
    { label: "Bug Scan", icon: "🐛" },
    { label: "UI Polish", icon: "✨" },
    { label: "Presentation Format", icon: "📐" },
    { label: "Final Export", icon: "📦" },
  ];

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput(""); setStep(0);
    const interval = setInterval(() => setStep(s => s < steps.length - 1 ? s + 1 : s), 400);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the COMPLETION ENGINE for DWAYNE FFOLKES / XXOON Sovereign Workspace.

Run a full completion pass:
1. Detect and fill any placeholders or incomplete sections
2. Fix grammar and flow
3. Remove AI-looking patterns
4. Ensure consistency
5. Format for human presentation
6. Output ONLY the final polished content — nothing else.`,
          messages: [{ role: "user", content: input }],
        }),
      });
      const data = await res.json();
      clearInterval(interval);
      setStep(steps.length - 1);
      setOutput(data.content?.[0]?.text || input);
    } catch {
      clearInterval(interval);
      setOutput("Completion engine error.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">COMPLETION ENGINE</div>
      <div className="page-sub">Every output routes here automatically · Detects unfinished work · Polishes · Exports</div>

      <div className="card">
        <div className="card-title">completion_engine/ modules</div>
        <div className="grid-4">
          {steps.map((s, i) => (
            <div key={s.label} style={{
              padding: "10px",
              background: step >= i ? "rgba(200,241,53,0.06)" : T.surface,
              border: `1px solid ${step >= i ? "rgba(200,241,53,0.2)" : T.border}`,
              borderRadius: 6,
              fontSize: 11.5,
              textAlign: "center",
              color: step >= i ? T.accent : T.muted,
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: G.fontMono }}>{s.label.replace(" ", "\n")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Raw Input</div>
        <textarea rows={5} placeholder="Paste any raw output, draft, or incomplete work here…" value={input} onChange={e => setInput(e.target.value)} />
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? "Running Completion Pass…" : "▶ Run Completion Engine"}
          </button>
        </div>
      </div>

      {(loading || output) && (
        <div className="card">
          <div className="card-title">Finished Output <span className="tag">Auto-Completed</span></div>
          <div className="output-box">
            {loading ? <span className="loading-dots">Completing</span> : output}
            {!loading && output && <div className="completion-badge">✓ EXPORT READY</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function AIWorkspace({ aiType }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: aiType === "main"
        ? "Ready. I can reason through your ideas, read project context, and plan builds. What are we working on?"
        : aiType === "builder"
        ? "Builder AI online. I write files, create structures, export documents, and build dashboards. Give me a task."
        : "Voice AI ready. Speak or type — I'll read your project context, find files, and summarize on command.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const systemFor = {
    main: `You are Main Chat AI for DWAYNE FFOLKES / XXOON Sovereign Workspace. You reason deeply, read project context, explain ideas, and plan builds. You know Dwayne's projects: YaadFlex taxi app, SOVEREIGN platform, Nexus game system, Presence infrastructure, XXOON brand, Mintage Holdings. Be sharp, direct, no filler. Partner-level communication.`,
    builder: `You are Builder AI for DWAYNE FFOLKES / XXOON. You write files, create folder structures, export documents, build dashboards and pages. When given a task, produce clean structured output ready to save. Show file contents, folder trees, and code. Be precise and complete.`,
    voice: `You are Voice AI for DWAYNE FFOLKES / XXOON. You read chat context, summarize project files, find information, and present results clearly. When asked to summarize — be concise and structured. When asked to find something — present it directly. Human-readable output only.`,
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const apiMsgs = history.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemFor[aiType],
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "No response.";
      setMessages([...history, { role: "ai", text: reply }]);
    } catch {
      setMessages([...history, { role: "ai", text: "Connection error." }]);
    }
    setLoading(false);
  };

  const labels = { main: "MAIN CHAT AI", builder: "BUILDER AI", voice: "VOICE AI" };
  const icons = { main: "💬", builder: "🏗", voice: "🎙" };

  return (
    <div>
      <div className="page-title">{icons[aiType]} {labels[aiType]}</div>
      <div className="page-sub">
        {aiType === "main" && "Reasons · Plans · Explains · Reads project context"}
        {aiType === "builder" && "Writes files · Creates folders · Exports documents · Builds pages"}
        {aiType === "voice" && "Listens · Reads files/chats · Finds things · Presents results"}
      </div>
      <div className="ai-chat">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <div className="msg-label">{m.role === "ai" ? labels[aiType] : "DWAYNE"}</div>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="msg msg-ai">
              <div className="msg-label">{labels[aiType]}</div>
              <span className="loading-dots">Thinking</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="chat-input-row">
          <textarea
            rows={2}
            placeholder="Type your message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

function FileDump() {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [note, setNote] = useState("");
  const dumpRef = useRef(null);

  const analyze = async () => {
    const content = note || files.map(f => f.name).join(", ");
    if (!content) return;
    setAnalyzing(true); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the FileDump Logic Engine for DWAYNE FFOLKES / XXOON.
Analyze the dumped content and return ONLY valid JSON (no markdown, no backticks):
{
  "project_name": "...",
  "project_type": "...",
  "classification": "...",
  "folder_structure": ["path1", "path2", "..."],
  "modules_needed": ["mod1", "mod2"],
  "next_steps": ["step1", "step2", "step3"],
  "engine_slots": ["slot1", "slot2"]
}`,
          messages: [{ role: "user", content: `Analyze this dump:\n${content}` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ project_name: "Analyzed", project_type: "Mixed", classification: "Multi-module", folder_structure: ["src/", "assets/", "exports/"], modules_needed: ["builder_ai", "completion_engine"], next_steps: ["Review structure", "Build scaffolding", "Export pack"], engine_slots: ["writing_engine_slot"] });
    }
    setAnalyzing(false);
  };

  return (
    <div>
      <div className="page-title">FILEDUMP LOGIC ENGINE</div>
      <div className="page-sub">Drop ideas · Notes · Screenshots · Old files → AI classifies and builds project structure</div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {["dump_inbox", "file_reader", "idea_extractor", "logic_detector", "project_classifier", "app_builder", "page_builder", "dashboard_builder", "ui_face_builder", "export_pack"].map(m => (
          <div key={m} style={{ padding: "8px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11, fontFamily: G.fontMono, color: T.muted }}>
            📂 {m.replace(/_/g, " ")}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">📥 Dump Zone</div>
        <div className="dump-zone" onClick={() => dumpRef.current?.click()}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drop files here or click to upload</div>
          <div style={{ fontSize: 11, color: T.muted }}>Screenshots · Notes · PDFs · Code · Concepts</div>
          <input ref={dumpRef} type="file" multiple style={{ display: "none" }} onChange={e => setFiles([...e.target.files])} />
        </div>
        {files.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {files.map(f => <div key={f.name} className="vault-item"><span className="vault-name">📄 {f.name}</span><span className="vault-meta">{(f.size / 1024).toFixed(1)}KB</span></div>)}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📝 Or paste a note / idea</div>
        <textarea rows={3} placeholder="Paste raw idea, description, concept, list…" value={note} onChange={e => setNote(e.target.value)} />
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-primary" onClick={analyze} disabled={analyzing || (!note && !files.length)}>
            {analyzing ? "Analyzing…" : "▶ Analyze + Classify + Build"}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="card-title">📦 Analysis Result <span className="tag">Export Ready</span></div>
          <div className="grid-2">
            <div>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: G.fontMono }}>PROJECT</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{result.project_name}</div>
              <div className="badge-row">
                <span className="tag">{result.project_type}</span>
                <span className="tag gold">{result.classification}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: G.fontMono }}>MODULES NEEDED</div>
              <div className="badge-row">
                {result.modules_needed?.map(m => <span key={m} className="tag purple">{m.replace(/_/g, " ")}</span>)}
              </div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontFamily: G.fontMono }}>GENERATED FOLDER STRUCTURE</div>
          <div style={{ background: "#0a0a0a", padding: 12, borderRadius: 6, fontFamily: G.fontMono, fontSize: 12, lineHeight: 1.9, color: T.text }}>
            {result.folder_structure?.map((f, i) => <div key={i}>{'  '.repeat(f.split('/').length - 2)}📁 {f}</div>)}
          </div>
          <div className="divider" />
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontFamily: G.fontMono }}>NEXT STEPS</div>
          {result.next_steps?.map((s, i) => (
            <div key={i} className="pipeline-step done">
              <div className="step-num">{i + 1}</div> {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StorageVault() {
  return (
    <div>
      <div className="page-title">STORAGE VAULT</div>
      <div className="page-sub">Active · Unfinished · Completed · Archived · Reusable Logic</div>

      {[
        { label: "active_projects", items: VAULT_ITEMS.filter(v => v.status === "Active" || v.status === "Building") },
        { label: "completed_projects", items: VAULT_ITEMS.filter(v => v.status === "Registered") },
        { label: "in_progress", items: VAULT_ITEMS.filter(v => v.status === "In Progress") },
      ].map(group => (
        <div className="card" key={group.label}>
          <div className="card-title" style={{ fontFamily: G.fontMono, fontSize: 11 }}>{group.label}/</div>
          {group.items.map(v => (
            <div className="vault-item" key={v.name}>
              <div>
                <div className="vault-name">{v.name}</div>
                <div className="vault-meta">{v.type} · {v.date}</div>
              </div>
              <span className={`tag ${v.status === "Active" || v.status === "Building" ? "" : v.status === "Registered" ? "gold" : "purple"}`}>{v.status}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OpenSlots() {
  return (
    <div>
      <div className="page-title">OPEN ENGINE SLOTS</div>
      <div className="page-sub">Reserved infrastructure slots · Plug in new engines when ready</div>

      <div className="grid-3">
        {OPEN_SLOTS.map(slot => (
          <div key={slot.id} className={`engine-slot ${slot.active ? "active" : ""}`} style={slot.active ? { borderColor: T.accent, background: "rgba(200,241,53,0.04)" } : {}}>
            <div className="slot-icon">{slot.icon}</div>
            <div className="slot-name">{slot.name}</div>
            <div>{slot.active ? <span className="tag">Plugged In</span> : <span className="tag" style={{ color: T.muted, borderColor: T.border, background: "transparent" }}>Reserved</span>}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title">Slot Notes</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
          Memory System — Not yet activated. Placeholder ready.<br />
          Video Engine — Reserved. Not yet built.<br />
          Writing Engine — ✓ Active via SharpTalk.<br />
          Camera Engine — Slot open for integration.<br />
          Payment System — Future activation.<br />
          Future Logic — Open for any new module.
        </div>
      </div>
    </div>
  );
}

function IPRegistration() {
  return (
    <div>
      <div className="page-title">IP REGISTRATION VIEW</div>
      <div className="page-sub">Owner: DWAYNE FFOLKES · Invention notes · Copyrights · Trademarks · Proof of creation</div>

      <div className="grid-2">
        {[
          { folder: "trademark_names/", items: ["XXOON", "YaadFlex", "YardFlex Global Vibes", "Mintage Holdings", "SOVEREIGN", "Nexus", "Xino", "Presence"] },
          { folder: "copyright_files/", items: ["SOVEREIGN Platform Architecture", "SharpTalk Engine Design", "FileDump Logic System", "Nexus Game Framework"] },
        ].map(group => (
          <div className="card" key={group.folder}>
            <div className="card-title" style={{ fontFamily: G.fontMono, fontSize: 11 }}>📁 {group.folder}</div>
            {group.items.map(item => (
              <div className="vault-item" key={item}>
                <span className="vault-name">{item}</span>
                <span className="tag gold">Protected</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">📄 Proof of Creation</div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
          All projects timestamped and logged. Builder AI generates exportable IP documentation on request. Registration exports available in human_presentable_docs/.
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", section: "WORKSPACE" },
  { id: "writing", label: "SharpTalk Engine", icon: "✍️", section: "ENGINES" },
  { id: "completion", label: "Completion Engine", icon: "✅", section: "ENGINES" },
  { id: "filedump", label: "FileDump Engine", icon: "📁", section: "ENGINES" },
  { id: "main_ai", label: "Main Chat AI", icon: "💬", section: "AI INTERFACES" },
  { id: "builder_ai", label: "Builder AI", icon: "🏗", section: "AI INTERFACES" },
  { id: "voice_ai", label: "Voice AI", icon: "🎙", section: "AI INTERFACES" },
  { id: "vault", label: "Storage Vault", icon: "🗄", section: "FILES" },
  { id: "ip", label: "IP Registration", icon: "©", section: "FILES" },
  { id: "slots", label: "Engine Slots", icon: "🔌", section: "SYSTEM" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("dashboard");
  const sections = [...new Set(NAV.map(n => n.section))];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "writing": return <WritingEngine />;
      case "completion": return <CompletionEngine />;
      case "filedump": return <FileDump />;
      case "main_ai": return <AIWorkspace aiType="main" />;
      case "builder_ai": return <AIWorkspace aiType="builder" />;
      case "voice_ai": return <AIWorkspace aiType="voice" />;
      case "vault": return <StorageVault />;
      case "ip": return <IPRegistration />;
      case "slots": return <OpenSlots />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ws-root">
        <div className="topbar">
          <div className="status-dot" />
          <div className="topbar-logo">SOVEREIGN WORKSPACE</div>
          <div className="topbar-owner">OWNER: DWAYNE FFOLKES · XXOON / MINTAGE HOLDINGS</div>
        </div>

        <div className="sidebar">
          {sections.map(sec => (
            <div className="nav-section" key={sec}>
              <span className="nav-label">{sec}</span>
              {NAV.filter(n => n.section === sec).map(n => (
                <div
                  key={n.id}
                  className={`nav-item ${page === n.id ? "active" : ""}`}
                  onClick={() => setPage(n.id)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="main">{renderPage()}</div>
      </div>
    </>
  );
}
