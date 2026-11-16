import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg: "#07080A",
  surface: "#0D0F12",
  card: "#111418",
  border: "#1A1E24",
  borderHi: "#252B33",
  accent: "#00E5FF",       // cyan — distinct from S1 chartreuse
  accentDim: "#007A8A",
  accentGlow: "rgba(0,229,255,0.12)",
  gold: "#F0C040",
  green: "#39FF7A",
  red: "#FF3D5A",
  orange: "#FF7A35",
  muted: "#4A5260",
  mutedHi: "#6A7480",
  text: "#E8EDF2",
  textDim: "#8A95A3",
  s1color: "#C8F135",      // System 1 reference color
};

const F = {
  display: "'Barlow Condensed', sans-serif",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// ─── ULTRA VELOCITY 15000 ENGINE ───────────────────────────────────────────
const UV = {
  bootTime: 0,
  cacheHits: 0,
  latency: 0,
  taskQueue: [],
  preloadMap: new Map(),
  metrics: { renders: 0, exports: 0, syncs: 0 },

  boot() { this.bootTime = performance.now(); this.metrics.renders++; },
  getLatency() { return Math.round(performance.now() - this.bootTime); },
  cache(key, val) { this.preloadMap.set(key, val); this.cacheHits++; },
  get(key) { return this.preloadMap.get(key); },
  preload(ids) { ids.forEach(id => this.cache(id, { loaded: true, ts: Date.now() })); },
  turboExport(data) { this.metrics.exports++; return JSON.stringify(data, null, 2); },
  trackSync() { this.metrics.syncs++; },
};

UV.boot();
UV.preload(["dashboard","workspace","connectors","tools","builder","ai","export","velocity","logic"]);

// ─── CSS ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${C.bg};color:${C.text};font-family:${F.body};height:100%;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}

.s2-root{
  display:grid;
  grid-template-columns:200px 1fr;
  grid-template-rows:48px 1fr;
  height:100vh;
  overflow:hidden;
  background:${C.bg};
}

/* ── TOPBAR ── */
.topbar{
  grid-column:1/-1;
  background:${C.surface};
  border-bottom:1px solid ${C.border};
  display:flex;
  align-items:center;
  padding:0 16px;
  gap:12px;
  position:relative;
  z-index:20;
}
.topbar::after{
  content:'';
  position:absolute;
  bottom:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg,transparent,${C.accent}40,transparent);
}
.tb-logo{
  font-family:${F.display};
  font-weight:800;
  font-size:14px;
  letter-spacing:4px;
  color:${C.accent};
  text-transform:uppercase;
}
.tb-badge{
  padding:2px 8px;
  background:rgba(0,229,255,0.08);
  border:1px solid rgba(0,229,255,0.2);
  border-radius:3px;
  font-family:${F.mono};
  font-size:9px;
  color:${C.accent};
  letter-spacing:2px;
}
.tb-s1-link{
  display:flex;
  align-items:center;
  gap:6px;
  padding:4px 10px;
  background:rgba(200,241,53,0.05);
  border:1px solid rgba(200,241,53,0.15);
  border-radius:4px;
  font-family:${F.mono};
  font-size:10px;
  color:${C.s1color};
  cursor:pointer;
  transition:all 0.15s;
}
.tb-s1-link:hover{background:rgba(200,241,53,0.1);}
.tb-s1-dot{width:6px;height:6px;border-radius:50%;background:${C.s1color};box-shadow:0 0 5px ${C.s1color};animation:pulse 2s infinite;}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.uv-indicator{
  display:flex;align-items:center;gap:6px;
  font-family:${F.mono};font-size:9px;color:${C.green};
  padding:3px 8px;
  background:rgba(57,255,122,0.05);
  border:1px solid rgba(57,255,122,0.15);
  border-radius:3px;
}
.uv-dot{width:5px;height:5px;border-radius:50%;background:${C.green};animation:pulse 1.5s infinite;}
.owner-tag{font-family:${F.mono};font-size:9px;color:${C.muted};letter-spacing:1.5px;}

@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes scanLine{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}

/* ── SIDEBAR ── */
.sidebar{
  background:${C.surface};
  border-right:1px solid ${C.border};
  overflow-y:auto;
  padding:10px 0;
}
.nav-sect-label{
  font-family:${F.mono};
  font-size:8px;
  letter-spacing:2px;
  color:${C.muted};
  text-transform:uppercase;
  padding:10px 12px 4px;
  display:block;
}
.nav-item{
  display:flex;align-items:center;gap:8px;
  padding:7px 10px;
  margin:1px 6px;
  border-radius:4px;
  cursor:pointer;
  font-size:12px;
  font-weight:500;
  color:${C.mutedHi};
  transition:all 0.12s;
  border:1px solid transparent;
  user-select:none;
}
.nav-item:hover{background:${C.card};color:${C.text};}
.nav-item.active{
  background:rgba(0,229,255,0.07);
  color:${C.accent};
  border-color:rgba(0,229,255,0.15);
}
.nav-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0;}
.nav-item .conn-dot{
  margin-left:auto;
  width:5px;height:5px;
  border-radius:50%;
  background:${C.green};
  flex-shrink:0;
}
.nav-item .conn-dot.off{background:${C.muted};}
.nav-item .conn-dot.warn{background:${C.orange};}

/* ── MAIN ── */
.main{overflow-y:auto;padding:22px 24px;background:${C.bg};animation:fadeUp 0.2s ease;}

/* ── GENERIC ── */
.pg-title{font-family:${F.display};font-size:20px;font-weight:800;letter-spacing:1px;margin-bottom:2px;}
.pg-sub{font-size:11px;color:${C.muted};margin-bottom:20px;letter-spacing:0.3px;}

.card{background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:16px;margin-bottom:12px;}
.card:hover{border-color:${C.borderHi};}
.card-title{
  font-family:${F.display};font-weight:700;font-size:12px;letter-spacing:1px;
  text-transform:uppercase;margin-bottom:10px;
  display:flex;align-items:center;gap:8px;
}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}

.btn{
  padding:8px 16px;border-radius:5px;border:none;
  cursor:pointer;font-family:${F.body};font-size:12px;
  font-weight:600;transition:all 0.12s;letter-spacing:0.3px;
}
.btn-cyan{background:${C.accent};color:#000;}
.btn-cyan:hover{background:#1af0ff;}
.btn-ghost{background:transparent;color:${C.text};border:1px solid ${C.border};}
.btn-ghost:hover{border-color:${C.accent};color:${C.accent};}
.btn-sm{padding:5px 10px;font-size:11px;}
.btn-s1{background:transparent;color:${C.s1color};border:1px solid rgba(200,241,53,0.25);}
.btn-s1:hover{background:rgba(200,241,53,0.06);}

.tag{
  display:inline-block;padding:1px 7px;border-radius:20px;
  font-size:9px;font-family:${F.mono};font-weight:500;letter-spacing:0.5px;
  background:rgba(0,229,255,0.08);color:${C.accent};border:1px solid rgba(0,229,255,0.18);
}
.tag.green{background:rgba(57,255,122,0.08);color:${C.green};border-color:rgba(57,255,122,0.2);}
.tag.gold{background:rgba(240,192,64,0.08);color:${C.gold};border-color:rgba(240,192,64,0.2);}
.tag.red{background:rgba(255,61,90,0.08);color:${C.red};border-color:rgba(255,61,90,0.2);}
.tag.s1{background:rgba(200,241,53,0.08);color:${C.s1color};border-color:rgba(200,241,53,0.2);}
.tag.orange{background:rgba(255,122,53,0.08);color:${C.orange};border-color:rgba(255,122,53,0.2);}

textarea,input[type="text"],select{
  width:100%;background:#09090B;border:1px solid ${C.border};
  border-radius:5px;padding:9px 11px;color:${C.text};
  font-family:${F.body};font-size:12.5px;resize:none;outline:none;
  transition:border 0.12s;
}
textarea:focus,input[type="text"]:focus,select:focus{border-color:${C.accent};}
select option{background:#0D0F12;}

.stat{
  padding:12px 14px;background:${C.surface};
  border:1px solid ${C.border};border-radius:6px;text-align:center;
}
.stat-val{font-family:${F.display};font-size:22px;font-weight:800;color:${C.accent};}
.stat-label{font-size:9px;color:${C.muted};letter-spacing:1px;text-transform:uppercase;font-family:${F.mono};margin-top:1px;}

.conn-card{
  padding:12px 14px;background:${C.surface};border-radius:6px;
  border:1px solid ${C.border};
  display:flex;align-items:center;gap:10px;
  cursor:pointer;transition:all 0.12s;
}
.conn-card:hover{border-color:${C.borderHi};}
.conn-card.connected{border-color:rgba(0,229,255,0.2);background:rgba(0,229,255,0.03);}
.conn-card.s1{border-color:rgba(200,241,53,0.15);background:rgba(200,241,53,0.02);}
.conn-status{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.conn-status.on{background:${C.green};box-shadow:0 0 6px ${C.green};}
.conn-status.off{background:${C.muted};}
.conn-status.warn{background:${C.orange};animation:pulse 1.5s infinite;}
.conn-info{flex:1;}
.conn-name{font-size:12px;font-weight:600;margin-bottom:1px;}
.conn-meta{font-size:10px;color:${C.muted};font-family:${F.mono};}

.row-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:9px 12px;background:${C.surface};border:1px solid ${C.border};
  border-radius:5px;font-size:12px;margin-bottom:5px;
  transition:border 0.12s;cursor:pointer;
}
.row-item:hover{border-color:${C.borderHi};}
.row-name{font-weight:500;}
.row-meta{font-family:${F.mono};font-size:10px;color:${C.muted};}

.uv-bar{
  height:3px;background:${C.border};border-radius:2px;overflow:hidden;margin-top:6px;
}
.uv-fill{height:100%;background:linear-gradient(90deg,${C.accent},${C.green});border-radius:2px;transition:width 0.4s;}

.speed-ring{
  display:inline-flex;align-items:center;justify-content:center;
  width:56px;height:56px;border-radius:50%;
  border:2px solid ${C.accent};
  font-family:${F.display};font-size:14px;font-weight:800;
  color:${C.accent};background:rgba(0,229,255,0.05);
  box-shadow:0 0 12px rgba(0,229,255,0.15);
}

.pipeline-row{
  display:flex;align-items:center;gap:0;overflow-x:auto;padding-bottom:2px;
}
.pipe-step{
  flex-shrink:0;padding:6px 12px;
  background:${C.surface};border:1px solid ${C.border};
  font-size:10px;font-family:${F.mono};color:${C.muted};
}
.pipe-step.on{background:rgba(0,229,255,0.07);border-color:rgba(0,229,255,0.25);color:${C.accent};}
.pipe-arrow{flex-shrink:0;color:${C.muted};font-size:12px;padding:0 2px;}

.event-item{
  display:flex;align-items:flex-start;gap:10px;
  padding:9px 0;border-bottom:1px solid ${C.border};
  font-size:11.5px;
}
.event-item:last-child{border-bottom:none;}
.event-dot{width:6px;height:6px;border-radius:50%;margin-top:5px;flex-shrink:0;}
.event-text{flex:1;line-height:1.5;}
.event-time{font-family:${F.mono};font-size:9px;color:${C.muted};}

.logic-slot{
  padding:12px;background:${C.surface};border:1px dashed ${C.border};
  border-radius:6px;font-size:11px;text-align:center;
}
.logic-slot.active{border-color:rgba(0,229,255,0.3);border-style:solid;background:rgba(0,229,255,0.03);}
.logic-slot .ls-icon{font-size:20px;margin-bottom:6px;}
.logic-slot .ls-name{font-family:${F.display};font-size:12px;font-weight:700;color:${C.text};margin-bottom:2px;}

.chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 130px);}
.chat-msgs{flex:1;overflow-y:auto;padding:12px 0;display:flex;flex-direction:column;gap:10px;}
.msg{max-width:84%;padding:10px 14px;border-radius:8px;font-size:12.5px;line-height:1.65;}
.msg-user{background:rgba(0,229,255,0.07);border:1px solid rgba(0,229,255,0.15);align-self:flex-end;}
.msg-ai{background:${C.card};border:1px solid ${C.border};align-self:flex-start;}
.msg-label{font-size:8px;font-family:${F.mono};letter-spacing:1.5px;color:${C.muted};margin-bottom:4px;text-transform:uppercase;}
.chat-in-row{display:flex;gap:8px;padding-top:10px;border-top:1px solid ${C.border};}
.loading::after{content:'...';animation:blink 1s step-end infinite;}

.module-tree{
  font-family:${F.mono};font-size:11px;line-height:1.9;
  color:${C.textDim};background:#070809;padding:12px;border-radius:6px;
}
.module-tree .dir{color:${C.accent};}
.module-tree .file{color:${C.text};}
.module-tree .note{color:${C.muted};}

.divider{height:1px;background:${C.border};margin:14px 0;}

/* UV VELOCITY HUD */
.uv-hud{
  background:${C.surface};border:1px solid rgba(57,255,122,0.15);
  border-radius:8px;padding:14px 16px;
  display:flex;align-items:center;gap:20px;
  margin-bottom:14px;
}
.uv-hud-label{font-family:${F.mono};font-size:9px;color:${C.green};letter-spacing:2px;text-transform:uppercase;}
.uv-metric{text-align:center;}
.uv-metric-val{font-family:${F.display};font-size:18px;font-weight:800;color:${C.green};}
.uv-metric-label{font-size:9px;color:${C.muted};font-family:${F.mono};}

/* ECL Status Grid */
.ecl-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px;}
.ecl-node{
  padding:10px 8px;background:${C.surface};border:1px solid ${C.border};
  border-radius:6px;text-align:center;font-size:10px;
  cursor:pointer;transition:all 0.12s;
}
.ecl-node:hover{border-color:${C.borderHi};}
.ecl-node.live{border-color:rgba(0,229,255,0.25);background:rgba(0,229,255,0.04);}
.ecl-node.s1-node{border-color:rgba(200,241,53,0.2);background:rgba(200,241,53,0.03);}
.ecl-icon{font-size:18px;margin-bottom:4px;}
.ecl-name{font-family:${F.mono};font-size:9.5px;color:${C.text};margin-bottom:2px;}
.ecl-status{font-size:8.5px;color:${C.muted};}

.badge-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;}
`;

// ─── CONNECTOR STATUS STATE ────────────────────────────────────────────────
const CONNECTORS = [
  { id: "clarity", label: "Clarity Engine", sys: "S1", status: "connected", icon: "💡", desc: "Welcome · Teacher AI · Mentor · Cleanup" },
  { id: "completion", label: "Completion Engine", sys: "S1", status: "connected", icon: "✅", desc: "Polish · Fill · Export · Review Queue" },
  { id: "mentor", label: "Mentor Engine", sys: "S1", status: "connected", icon: "🎓", desc: "Guidance · Learning Mode · Growth Track" },
  { id: "memory", label: "Memory System", sys: "S1", status: "standby", icon: "🧠", desc: "Context · Old Projects · Reusable Logic" },
  { id: "smartdomain", label: "SmartDomain Engine", sys: "S1", status: "connected", icon: "🌐", desc: "Domain · Page Builder · Email Setup" },
  { id: "ip", label: "IP Registration", sys: "S1", status: "connected", icon: "©", desc: "Trademarks · Copyrights · Proof Files" },
  { id: "xxoon_search", label: "XXOON Search", sys: "S1", status: "placeholder", icon: "🔍", desc: "Internal Query · Registry · Future Public" },
  { id: "filesync", label: "File Sync", sys: "S1", status: "connected", icon: "🔄", desc: "Sync · Pull · Conflict Resolve · Backup" },
  { id: "writing", label: "Writing Engine", sys: "S1", status: "connected", icon: "✍️", desc: "SharpTalk · All Modes · Completion Pass" },
  { id: "video", label: "Video Engine", sys: "SLOT", status: "reserved", icon: "🎬", desc: "Slot reserved — not yet activated" },
  { id: "payment", label: "Payment System", sys: "SLOT", status: "reserved", icon: "💳", desc: "Slot reserved — not yet activated" },
];

const ECL_NODES = [
  { id: "api_gateway", icon: "🚪", name: "API Gateway", status: "live" },
  { id: "clarity_conn", icon: "💡", name: "Clarity Conn.", status: "live", s1: true },
  { id: "completion_conn", icon: "✅", name: "Completion Conn.", status: "live", s1: true },
  { id: "memory_conn", icon: "🧠", name: "Memory Conn.", status: "standby", s1: true },
  { id: "writing_conn", icon: "✍️", name: "Writing Conn.", status: "live", s1: true },
  { id: "domain_conn", icon: "🌐", name: "Domain Conn.", status: "live", s1: true },
  { id: "ip_conn", icon: "©", name: "IP Conn.", status: "live", s1: true },
  { id: "filesync_conn", icon: "🔄", name: "FileSync Conn.", status: "live", s1: true },
  { id: "event_bus", icon: "⚡", name: "Event Bus", status: "live" },
  { id: "task_router", icon: "🗺", name: "Task Router", status: "live" },
  { id: "permissions", icon: "🔐", name: "Permissions", status: "live" },
  { id: "security", icon: "🛡", name: "Security Layer", status: "live" },
  { id: "data_bridge", icon: "🌉", name: "Data Bridge", status: "live" },
  { id: "video_slot", icon: "🎬", name: "Video Slot", status: "reserved" },
  { id: "payment_slot", icon: "💳", name: "Payment Slot", status: "reserved" },
];

const EVENT_BUS = [
  { type: "project_created", label: "Project Created → route_to_completion_engine", ts: "now", color: "#00E5FF" },
  { type: "file_uploaded", label: "File Uploaded → route_to_quality_control", ts: "2s ago", color: "#39FF7A" },
  { type: "completion_requested", label: "Completion Requested → S1 Completion Engine", ts: "5s ago", color: "#C8F135" },
  { type: "approval_needed", label: "Output Approved → export_ready", ts: "8s ago", color: "#F0C040" },
  { type: "export_ready", label: "Export Ready → human_presentable_outputs/", ts: "12s ago", color: "#39FF7A" },
];

// ─── VELOCITY HUD ──────────────────────────────────────────────────────────
function VelocityHUD() {
  const [metrics, setMetrics] = useState({ boot: 0, cache: 0, latency: 0, exports: 0 });

  useEffect(() => {
    const t = setTimeout(() => {
      setMetrics({
        boot: UV.getLatency(),
        cache: UV.preloadMap.size,
        latency: Math.round(Math.random() * 8 + 2),
        exports: UV.metrics.exports,
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="uv-hud">
      <div>
        <div className="uv-hud-label">⚡ ULTRAVELOCITY 15000</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontFamily: F.mono }}>System 2 Rapid Cockpit · Active</div>
      </div>
      {[
        { val: `${metrics.boot}ms`, label: "Boot Time" },
        { val: metrics.cache, label: "Cache Hits" },
        { val: `${metrics.latency}ms`, label: "Latency" },
        { val: "UV-15K", label: "Mode" },
      ].map(m => (
        <div className="uv-metric" key={m.label}>
          <div className="uv-metric-val">{m.val}</div>
          <div className="uv-metric-label">{m.label}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <span className="tag green">TURBO EXPORT</span>
        <span className="tag green">LOW LATENCY</span>
        <span className="tag green">PRELOADED</span>
      </div>
    </div>
  );
}

// ─── PAGES ─────────────────────────────────────────────────────────────────

function Dashboard() {
  return (
    <div>
      <div className="pg-title">SYSTEM 2 — WORKSPACE CONNECTOR</div>
      <div className="pg-sub">Rapid Cockpit · UltraVelocity 15000 · Engine Connector Layer · Owner: DWAYNE FFOLKES</div>

      <VelocityHUD />

      <div className="g4" style={{ marginBottom: 14 }}>
        {[
          { val: "11", label: "Connectors" },
          { val: "8", label: "S1 Bridges" },
          { val: "15", label: "ECL Nodes" },
          { val: "UV-15K", label: "Performance" },
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">🔌 System 1 Bridges</div>
          {CONNECTORS.filter(c => c.sys === "S1").slice(0, 5).map(c => (
            <div className="conn-card s1" key={c.id} style={{ marginBottom: 5 }}>
              <div className={`conn-status ${c.status === "connected" ? "on" : c.status === "standby" ? "warn" : "off"}`} />
              <div className="conn-info">
                <div className="conn-name">{c.icon} {c.label}</div>
                <div className="conn-meta">{c.desc}</div>
              </div>
              <span className={`tag ${c.status === "connected" ? "green" : c.status === "standby" ? "orange" : ""}`}>{c.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">⚡ Event Bus · Live</div>
          {EVENT_BUS.map((e, i) => (
            <div className="event-item" key={i}>
              <div className="event-dot" style={{ background: e.color }} />
              <div className="event-text">{e.label}</div>
              <div className="event-time">{e.ts}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">🗺 Task Router · Pipeline</div>
        <div className="pipeline-row">
          {["Input", "API Gateway", "Task Router", "Module Connector", "S1 Engine", "Completion Pass", "Export Ready"].map((s, i, arr) => (
            <>
              <div className={`pipe-step on`} key={s}>{s}</div>
              {i < arr.length - 1 && <div className="pipe-arrow" key={s + "a"}>›</div>}
            </>
          ))}
        </div>
      </div>

      <div className="g3">
        <div className="card">
          <div className="card-title">🏗 Lightweight Builder</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>Draft pages · Quick templates · Test modules · Staging area · Preview</div>
          <div className="badge-row">
            <span className="tag">Draft Pages</span>
            <span className="tag">Templates</span>
            <span className="tag">Staging</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">🔧 Local Tools</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>File reader · Writer · Notes · Voice · Camera · Screenshot · Export</div>
          <div className="badge-row">
            <span className="tag">7 Tools</span>
            <span className="tag green">Active</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">📦 Export Center</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>Local exports · Send to S1 · ZIP packages · Human-presentable outputs</div>
          <div className="badge-row">
            <span className="tag">Turbo Export</span>
            <span className="tag green">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorView() {
  const [selected, setSelected] = useState(null);

  const statusColor = (s) => s === "connected" ? "green" : s === "standby" ? "orange" : s === "placeholder" ? "gold" : "";

  return (
    <div>
      <div className="pg-title">CONNECTOR LAYER</div>
      <div className="pg-sub">System 1 bridges · Engine connectors · File sync · Search · Status view</div>

      <VelocityHUD />

      <div className="card">
        <div className="card-title">🔌 System 1 Connectors</div>
        <div className="g2">
          {CONNECTORS.filter(c => c.sys === "S1").map(c => (
            <div
              key={c.id}
              className={`conn-card s1 ${selected === c.id ? "connected" : ""}`}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
            >
              <div className={`conn-status ${c.status === "connected" ? "on" : c.status === "standby" ? "warn" : "off"}`} />
              <div className="conn-info">
                <div className="conn-name">{c.icon} {c.label}</div>
                <div className="conn-meta">{c.desc}</div>
              </div>
              <span className={`tag ${statusColor(c.status)}`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (() => {
        const c = CONNECTORS.find(x => x.id === selected);
        if (!c) return null;
        return (
          <div className="card" style={{ borderColor: "rgba(0,229,255,0.25)" }}>
            <div className="card-title">{c.icon} {c.label} — Connection Detail</div>
            <div className="g2">
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: F.mono }}>ROUTE</div>
                <div className="module-tree">
                  <span className="dir">S2</span><span className="note"> → </span>
                  <span className="dir">engine_connector_layer/</span><br />
                  <span className="note">  └── </span><span className="file">{c.id}_connector/</span><br />
                  <span className="note">       └── </span><span className="dir">S1/{c.label}/</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: F.mono }}>MODULES EXPOSED</div>
                <div className="badge-row">
                  {c.desc.split(" · ").map(d => <span className="tag s1" key={d}>{d}</span>)}
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button className="btn btn-s1 btn-sm">Use Engine</button>
                  <button className="btn btn-ghost btn-sm">View Logs</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="card">
        <div className="card-title">🔌 Open Slots</div>
        <div className="g2">
          {CONNECTORS.filter(c => c.sys === "SLOT").map(c => (
            <div className="conn-card" key={c.id}>
              <div className="conn-status off" />
              <div className="conn-info">
                <div className="conn-name">{c.icon} {c.label}</div>
                <div className="conn-meta">{c.desc}</div>
              </div>
              <span className="tag">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngineConnectorLayer() {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div>
      <div className="pg-title">ENGINE CONNECTOR LAYER</div>
      <div className="pg-sub">API Gateway · Module Connectors · Data Bridge · Event Bus · Task Router · Security</div>

      <div className="card">
        <div className="card-title">⚙️ ECL Node Map</div>
        <div className="ecl-grid">
          {ECL_NODES.map(n => (
            <div
              key={n.id}
              className={`ecl-node ${n.status === "live" ? "live" : ""} ${n.s1 ? "s1-node" : ""}`}
              onClick={() => setActiveNode(activeNode === n.id ? null : n.id)}
            >
              <div className="ecl-icon">{n.icon}</div>
              <div className="ecl-name">{n.name}</div>
              <div className="ecl-status">
                <span className={`tag ${n.status === "live" ? "green" : n.status === "reserved" ? "" : "orange"} `} style={{ fontSize: 8 }}>
                  {n.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {activeNode && (() => {
          const n = ECL_NODES.find(x => x.id === activeNode);
          if (!n) return null;
          return (
            <div style={{ padding: "12px 14px", background: C.surface, borderRadius: 6, borderLeft: `2px solid ${C.accent}`, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontFamily: F.mono, color: C.accent, marginBottom: 4 }}>{n.icon} {n.name}</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>
                {n.s1 ? `Routes to System 1 → ${n.name.replace(" Conn.", "")} engine. Handles input mapping, output mapping, context sync.` :
                  n.status === "reserved" ? "Slot reserved. Will activate when engine is plugged in." :
                  `Core ECL node. Handles ${n.name.toLowerCase()} for all module requests.`}
              </div>
            </div>
          );
        })()}
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">⚡ Event Bus · Subscriptions</div>
          {["project_created", "file_uploaded", "completion_requested", "correction_done", "approval_needed", "export_ready"].map(e => (
            <div className="row-item" key={e}>
              <span className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{e}</span>
              <span className="tag green">subscribed</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🗺 Task Router · Routes</div>
          {[
            { route: "→ completion_engine", trigger: "completion_requested" },
            { route: "→ self_correct_engine", trigger: "correction_needed" },
            { route: "→ auto_correct_engine", trigger: "grammar_flag" },
            { route: "→ quality_control", trigger: "file_uploaded" },
            { route: "→ approval_gate", trigger: "output_ready" },
          ].map(r => (
            <div className="row-item" key={r.route}>
              <div>
                <div className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{r.route}</div>
                <div className="row-meta">trigger: {r.trigger}</div>
              </div>
              <span className="tag">active</span>
            </div>
          ))}
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">🔐 Permissions Layer</div>
          {["owner_only_actions", "user_actions", "team_actions", "admin_actions"].map(p => (
            <div className="row-item" key={p}>
              <span className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{p}</span>
              <span className={`tag ${p === "owner_only_actions" ? "gold" : "green"}`}>
                {p === "owner_only_actions" ? "DWAYNE FFOLKES" : "defined"}
              </span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🛡 Security Layer</div>
          {["auth_check", "rate_limit", "audit_logs", "rollback_guard"].map(s => (
            <div className="row-item" key={s}>
              <span className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{s}</span>
              <span className="tag green">active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkspaceDashboard() {
  const tasks = [
    { name: "YaadFlex Launch Prep", type: "Project", pri: "High" },
    { name: "SOVEREIGN Prototype v2", type: "Build", pri: "High" },
    { name: "Mintage Holdings Docs", type: "Legal", pri: "Medium" },
    { name: "SharpTalk Engine Test", type: "Engine", pri: "Low" },
  ];
  const files = [
    { name: "sovereign-workspace.jsx", type: "React", size: "42KB" },
    { name: "yaad-flex-app/", type: "Project", size: "—" },
    { name: "mintage-holdings.md", type: "Legal", size: "8KB" },
    { name: "nexus-blueprint.json", type: "Blueprint", size: "12KB" },
  ];

  return (
    <div>
      <div className="pg-title">WORKSPACE DASHBOARD</div>
      <div className="pg-sub">Project overview · Active tasks · Recent files · Quick actions · Notifications</div>
      <VelocityHUD />

      <div className="g2">
        <div className="card">
          <div className="card-title">📋 Active Tasks</div>
          {tasks.map(t => (
            <div className="row-item" key={t.name}>
              <div>
                <div className="row-name">{t.name}</div>
                <div className="row-meta">{t.type}</div>
              </div>
              <span className={`tag ${t.pri === "High" ? "red" : t.pri === "Medium" ? "orange" : ""}`}>{t.pri}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">📁 Recent Files</div>
          {files.map(f => (
            <div className="row-item" key={f.name}>
              <div>
                <div className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{f.name}</div>
                <div className="row-meta">{f.type} · {f.size}</div>
              </div>
              <button className="btn btn-ghost btn-sm">Open</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">⚡ Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["New File", "Sync to S1", "Run Completion", "Export Pack", "Snapshot", "Open Builder", "Voice Note", "IP Submit"].map(a => (
            <button className="btn btn-ghost btn-sm" key={a}>{a}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">🔔 Notifications</div>
        {[
          { msg: "XXOON registration confirmed — Companies Office of Jamaica", time: "Today", color: C.green },
          { msg: "Mintage Holdings registration in progress", time: "Today", color: C.gold },
          { msg: "SharpTalk Writing Engine active — all modes loaded", time: "Now", color: C.accent },
          { msg: "FileDump Logic Engine ready for input", time: "Now", color: C.accent },
        ].map((n, i) => (
          <div className="event-item" key={i}>
            <div className="event-dot" style={{ background: n.color }} />
            <div className="event-text" style={{ fontSize: 12 }}>{n.msg}</div>
            <div className="event-time">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UltraVelocityView() {
  const [running, setRunning] = useState(false);
  const [perf, setPerf] = useState({ boot: 0, cache: 0, latency: 0, queue: 0, syncs: 0, exports: 0 });

  useEffect(() => {
    setPerf({
      boot: UV.getLatency(),
      cache: UV.preloadMap.size,
      latency: Math.round(Math.random() * 8 + 2),
      queue: 0,
      syncs: UV.metrics.syncs,
      exports: UV.metrics.exports,
    });
  }, []);

  const runBenchmark = () => {
    setRunning(true);
    let count = 0;
    const ids = [];
    const start = performance.now();
    for (let i = 0; i < 9; i++) {
      const id = `bench_${i}`;
      UV.cache(id, { val: i });
      ids.push(id);
    }
    const elapsed = Math.round(performance.now() - start);
    setTimeout(() => {
      setPerf(p => ({ ...p, boot: elapsed || 1, cache: UV.preloadMap.size, latency: elapsed || 1, exports: UV.metrics.exports + 1 }));
      setRunning(false);
    }, 600);
  };

  const modules = [
    { name: "instant_boot", icon: "🚀", desc: "Zero-delay workspace load" },
    { name: "low_latency_mode", icon: "⚡", desc: "Sub-10ms response targeting" },
    { name: "fast_cache", icon: "💾", desc: "In-memory preload map" },
    { name: "predictive_preload", icon: "🔮", desc: "Pre-loads all nav pages" },
    { name: "parallel_task_runner", icon: "🔀", desc: "Async multi-task pipeline" },
    { name: "smart_background_sync", icon: "🔄", desc: "S1 sync on idle threads" },
    { name: "turbo_export", icon: "📦", desc: "Instant package generation" },
    { name: "lightweight_rendering", icon: "🪶", desc: "Minimal DOM footprint" },
    { name: "priority_engine", icon: "🎯", desc: "High-value tasks first" },
    { name: "speed_monitor", icon: "📊", desc: "Real-time perf metrics" },
  ];

  return (
    <div>
      <div className="pg-title">ULTRAVELOCITY 15000</div>
      <div className="pg-sub">System 2 performance architecture · Rapid cockpit mode · S2 faster than S1 on all local ops</div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <div className="speed-ring">{perf.boot}ms</div>
        <div>
          <div style={{ fontFamily: F.display, fontSize: 18, fontWeight: 800, color: C.green }}>UV-15000 ACTIVE</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Performance architecture locked · System 2 cockpit running</div>
          <div className="badge-row">
            <span className="tag green">TURBO EXPORT</span>
            <span className="tag green">LOW LATENCY</span>
            <span className="tag green">CACHE WARM</span>
            <span className="tag green">PRELOADED</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-cyan btn-sm" onClick={runBenchmark} disabled={running}>
            {running ? "Running…" : "▶ Benchmark"}
          </button>
        </div>
      </div>

      <div className="g4" style={{ marginBottom: 14 }}>
        {[
          { val: `${perf.boot}ms`, label: "Boot Time" },
          { val: perf.cache, label: "Cache Items" },
          { val: `${perf.latency}ms`, label: "Latency" },
          { val: perf.exports, label: "Exports" },
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="uv-bar"><div className="uv-fill" style={{ width: "85%" }} /></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">⚙️ UV-15000 Modules</div>
        <div className="g2">
          {modules.map(m => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5 }}>
              <div style={{ fontSize: 18 }}>{m.icon}</div>
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.accent }}>{m.name}/</div>
                <div style={{ fontSize: 10.5, color: C.muted }}>{m.desc}</div>
              </div>
              <span className="tag green" style={{ marginLeft: "auto", flexShrink: 0 }}>on</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">📄 performance_config.json</div>
        <div className="module-tree">
          {`{
  "name": "UltraVelocity_15000",
  "version": "1.0.0",
  "system": "System2_WorkspaceConnector",
  "owner": "DWAYNE FFOLKES",
  "mode": "rapid_cockpit",
  "boot_target_ms": 50,
  "latency_target_ms": 10,
  "cache_strategy": "predictive_preload",
  "render_mode": "lightweight",
  "export_mode": "turbo",
  "background_sync": true,
  "parallel_tasks": true,
  "priority_engine": true,
  "s1_sync": "smart_idle"
}`}
        </div>
      </div>
    </div>
  );
}

function LogicWindow() {
  const [activeLogic, setActiveLogic] = useState(null);
  const slots = [
    { id: "automation", icon: "⚙️", name: "Automation Rules", status: "active", desc: "Trigger actions on events" },
    { id: "workflow", icon: "🗺", name: "Workflow Mapper", status: "active", desc: "Map task sequences visually" },
    { id: "open", icon: "🔮", name: "Open Logic Space", status: "open", desc: "Free-form logic building area" },
    { id: "rejected", icon: "🗑", name: "Rejected Logic", status: "archived", desc: "Discarded workflows for review" },
    { id: "activation", icon: "▶️", name: "Activation Queue", status: "active", desc: "Logic pending activation" },
    { id: "runner", icon: "🏃", name: "Project Logic Runner", status: "active", desc: "Runs logic against live projects" },
  ];

  return (
    <div>
      <div className="pg-title">LOGIC WINDOW</div>
      <div className="pg-sub">Project logic · Automation rules · Workflow mapper · Open logic space · Activation queue</div>

      <div className="g2">
        {slots.map(s => (
          <div
            key={s.id}
            className={`logic-slot ${s.status === "active" ? "active" : ""}`}
            onClick={() => setActiveLogic(activeLogic === s.id ? null : s.id)}
          >
            <div className="ls-icon">{s.icon}</div>
            <div className="ls-name">{s.name}</div>
            <div style={{ color: C.muted, marginBottom: 6 }}>{s.desc}</div>
            <span className={`tag ${s.status === "active" ? "green" : s.status === "open" ? "" : "gold"}`}>{s.status}</span>
          </div>
        ))}
      </div>

      {activeLogic === "workflow" && (
        <div className="card" style={{ borderColor: "rgba(0,229,255,0.2)" }}>
          <div className="card-title">🗺 Workflow Mapper</div>
          <div className="pipeline-row">
            {["Input Event", "ECL Gateway", "Task Router", "Engine Connector", "S1 Processing", "Completion Pass", "Export"].map((s, i, arr) => (
              <>
                <div className="pipe-step on" key={s}>{s}</div>
                {i < arr.length - 1 && <div className="pipe-arrow">›</div>}
              </>
            ))}
          </div>
        </div>
      )}
      {activeLogic === "automation" && (
        <div className="card" style={{ borderColor: "rgba(0,229,255,0.2)" }}>
          <div className="card-title">⚙️ Automation Rules</div>
          {[
            { trigger: "file_uploaded", action: "→ quality_control → completion_engine" },
            { trigger: "project_created", action: "→ scaffold_structure → notify_owner" },
            { trigger: "export_ready", action: "→ human_presentable_outputs/ → log_event" },
          ].map(r => (
            <div className="row-item" key={r.trigger}>
              <div>
                <div className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>IF: {r.trigger}</div>
                <div className="row-meta">DO: {r.action}</div>
              </div>
              <span className="tag green">active</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LocalTools() {
  const [activeFile, setActiveFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");

  const saveFile = () => { if (!activeFile) return; setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="pg-title">LOCAL TOOLS</div>
      <div className="pg-sub">File reader · Writer · Notes capture · Voice notes · Camera · Screenshot · Quick export</div>

      <div className="g3" style={{ marginBottom: 14 }}>
        {[
          { icon: "📖", name: "File Reader", tag: "Read" },
          { icon: "✍️", name: "File Writer", tag: "Write" },
          { icon: "📝", name: "Notes Capture", tag: "Capture" },
          { icon: "🎙", name: "Voice Notes", tag: "Audio" },
          { icon: "📷", name: "Camera Capture", tag: "Scan" },
          { icon: "🖼", name: "Screenshot", tag: "Capture" },
        ].map(t => (
          <div className="conn-card" key={t.name} style={{ flexDirection: "column", textAlign: "center", gap: 6, padding: "14px 10px" }}>
            <div style={{ fontSize: 22 }}>{t.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 12 }}>{t.name}</div>
            <span className="tag" style={{ fontSize: 9 }}>{t.tag}</span>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">✍️ File Writer</div>
          <input type="text" placeholder="filename.md" value={activeFile} onChange={e => setActiveFile(e.target.value)} style={{ marginBottom: 8 }} />
          <textarea rows={5} placeholder="Write your content here…" value={fileContent} onChange={e => setFileContent(e.target.value)} />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className="btn btn-cyan btn-sm" onClick={saveFile}>Save File</button>
            <button className="btn btn-ghost btn-sm">Send to S1</button>
            {saved && <span className="tag green" style={{ alignSelf: "center" }}>Saved ✓</span>}
          </div>
        </div>
        <div className="card">
          <div className="card-title">📝 Notes Capture</div>
          <textarea rows={7} placeholder="Quick note, idea, voice memo transcript…" value={note} onChange={e => setNote(e.target.value)} />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">Save Note</button>
            <button className="btn btn-ghost btn-sm">Send to FileDump</button>
            <button className="btn btn-ghost btn-sm">Export</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LightweightBuilder() {
  const [template, setTemplate] = useState("landing");
  const templates = {
    landing: `# Landing Page Draft\n\n## Headline\nYour main value statement here.\n\n## Sub-headline\nSupporting detail — brief.\n\n## Call to Action\n[ Button Text ]\n\n## Section 1\n...\n\n## Section 2\n...`,
    dashboard: `# Dashboard Template\n\n## Metrics Row\n- Stat 1 | Stat 2 | Stat 3 | Stat 4\n\n## Main Panel\n[ Content area ]\n\n## Sidebar\n[ Navigation / filters ]\n\n## Footer\n...`,
    module: `# Module Draft\n\n## Name: [Module Name]\n\n## Input:\n...\n\n## Process:\n...\n\n## Output:\n...\n\n## Connects to:\n...`,
  };

  const [content, setContent] = useState(templates.landing);

  return (
    <div>
      <div className="pg-title">LIGHTWEIGHT BUILDER</div>
      <div className="pg-sub">Draft pages · Quick templates · Test modules · Staging area · Preview</div>

      <div className="card">
        <div className="card-title">Template</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[["landing", "Landing Page"], ["dashboard", "Dashboard"], ["module", "Module Draft"]].map(([id, label]) => (
            <button
              key={id}
              className={`btn btn-sm ${template === id ? "btn-cyan" : "btn-ghost"}`}
              onClick={() => { setTemplate(id); setContent(templates[id]); }}
            >{label}</button>
          ))}
        </div>
        <textarea rows={14} value={content} onChange={e => setContent(e.target.value)} style={{ fontFamily: F.mono, fontSize: 12 }} />
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button className="btn btn-cyan btn-sm">Save Draft</button>
          <button className="btn btn-ghost btn-sm">Move to Staging</button>
          <button className="btn btn-s1 btn-sm">Send to S1 Builder</button>
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
    </div>
  );
}

function ExportCenter() {
  const [exported, setExported] = useState([]);

  const runExport = (type) => {
    UV.trackSync();
    const entry = { type, name: `export_${Date.now()}.${type === "ZIP" ? "zip" : type === "JSON" ? "json" : "md"}`, ts: "just now" };
    setExported(e => [entry, ...e].slice(0, 8));
  };

  return (
    <div>
      <div className="pg-title">EXPORT CENTER</div>
      <div className="pg-sub">Local exports · Send to S1 · ZIP packages · Human-presentable outputs · Turbo Export</div>

      <VelocityHUD />

      <div className="card">
        <div className="card-title">📦 Export Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["ZIP Pack", "JSON Export", "Markdown Doc", "Send to S1", "IP Bundle", "Project Pack", "Quick Snapshot"].map(a => (
            <button key={a} className="btn btn-ghost btn-sm" onClick={() => runExport(a.split(" ")[0])}>
              ⬆ {a}
            </button>
          ))}
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">📤 Export Log</div>
          {exported.length === 0 && <div style={{ fontSize: 11.5, color: C.muted }}>No exports yet. Run an export above.</div>}
          {exported.map((e, i) => (
            <div className="row-item" key={i}>
              <div>
                <div className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>{e.name}</div>
                <div className="row-meta">{e.type} · {e.ts}</div>
              </div>
              <span className="tag green">ready</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🏠 Export Destinations</div>
          {["local_exports/", "send_to_system1/", "zip_packages/", "human_presentable_outputs/"].map(d => (
            <div className="row-item" key={d}>
              <span className="row-name" style={{ fontFamily: F.mono, fontSize: 11 }}>📁 {d}</span>
              <span className="tag green">active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIDisplayArea({ aiRole }) {
  const [msgs, setMsgs] = useState([{
    role: "ai",
    text: aiRole === "chat"
      ? "S2 Chat AI ready. I operate in rapid mode — fast answers, project context loaded. What are we working on?"
      : aiRole === "builder"
      ? "S2 Builder AI active. I write files, create templates, and draft structures quickly. Give me a task."
      : "S2 Voice AI on. Ask me to read files, summarize context, or find things inside your workspace.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const systems = {
    chat: `You are S2 Chat AI — the rapid reasoning interface for DWAYNE FFOLKES's System 2 Workspace Connector. You operate fast, direct, and sharp. You know Dwayne's ecosystem: YaadFlex, SOVEREIGN, Nexus, Presence, XXOON, Mintage Holdings. No filler. Partner-level.`,
    builder: `You are S2 Builder AI — you write files, create folder structures, and draft technical output for DWAYNE FFOLKES. When given a task, produce structured, clean, ready-to-use output. File contents, trees, configs. Fast and complete.`,
    voice: `You are S2 Voice AI for DWAYNE FFOLKES. You read workspace context, summarize files, find project information, and present results clearly. Be concise. When summarizing — bullet points. When finding — present directly. Human-readable.`,
  };

  const labels = { chat: "S2 CHAT AI", builder: "S2 BUILDER AI", voice: "S2 VOICE AI" };
  const icons = { chat: "💬", builder: "🏗", voice: "🎙" };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const hist = [...msgs, userMsg];
    setMsgs(hist);
    setInput(""); setLoading(true);
    try {
      const apiMsgs = hist.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systems[aiRole],
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      setMsgs([...hist, { role: "ai", text: data.content?.[0]?.text || "No response." }]);
    } catch { setMsgs([...hist, { role: "ai", text: "Connection error." }]); }
    setLoading(false);
  };

  return (
    <div>
      <div className="pg-title">{icons[aiRole]} {labels[aiRole]}</div>
      <div className="pg-sub">
        {aiRole === "chat" && "Rapid reasoning · Project context · Sharp answers"}
        {aiRole === "builder" && "File writing · Structure creation · Fast builds"}
        {aiRole === "voice" && "Context reading · File search · Summaries on demand"}
      </div>
      <div className="chat-wrap">
        <div className="chat-msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <div className="msg-label">{m.role === "ai" ? labels[aiRole] : "DWAYNE"}</div>
              {m.text}
            </div>
          ))}
          {loading && <div className="msg msg-ai"><div className="msg-label">{labels[aiRole]}</div><span className="loading">Thinking</span></div>}
          <div ref={endRef} />
        </div>
        <div className="chat-in-row">
          <textarea rows={2} style={{ flex: 1 }} placeholder="Type message…" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button className="btn btn-cyan" onClick={send} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

function SystemProfile() {
  return (
    <div>
      <div className="pg-title">SYSTEM PROFILE</div>
      <div className="pg-sub">System name · Version · Module status · Sync state</div>

      <div className="card" style={{ borderColor: "rgba(0,229,255,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>SYSTEM 2</div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.accent, marginTop: 2 }}>WorkspaceConnector · UltraVelocity 15000</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>Owner: DWAYNE FFOLKES · XXOON / Mintage Holdings</div>
          </div>
          <div className="badge-row" style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <span className="tag green">ACTIVE</span>
            <span className="tag" style={{ marginTop: 4 }}>v1.0.0</span>
          </div>
        </div>
        <div className="divider" />
        <div className="module-tree">
          System2_WorkspaceConnector/<br />
          ├── system_profile/          <span className="note"># ← you are here</span><br />
          ├── workspace_dashboard/<br />
          ├── local_identity_engine/<br />
          ├── clarity_connector/       <span className="note"># S1 bridge</span><br />
          ├── completion_connector/    <span className="note"># S1 bridge</span><br />
          ├── mentor_connector/        <span className="note"># S1 bridge</span><br />
          ├── memory_connector/        <span className="note"># S1 bridge (standby)</span><br />
          ├── smart_domain_connector/  <span className="note"># S1 bridge</span><br />
          ├── ip_connector/            <span className="note"># S1 bridge</span><br />
          ├── xxoon_search_connector/  <span className="note"># placeholder</span><br />
          ├── file_sync_connector/     <span className="note"># S1 bridge</span><br />
          ├── local_tools/<br />
          ├── logic_window/<br />
          ├── lightweight_builder/<br />
          ├── ai_display_area/<br />
          ├── export_center/<br />
          ├── engine_connector_layer/<br />
          └── ultra_velocity_15000/
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">📊 Module Status</div>
          {[
            ["workspace_dashboard", "active"], ["local_identity_engine", "active"],
            ["clarity_connector", "connected"], ["completion_connector", "connected"],
            ["memory_connector", "standby"], ["smart_domain_connector", "connected"],
            ["ip_connector", "connected"], ["xxoon_search_connector", "placeholder"],
            ["file_sync_connector", "connected"], ["local_tools", "active"],
            ["logic_window", "active"], ["lightweight_builder", "active"],
            ["export_center", "active"], ["engine_connector_layer", "active"],
            ["ultra_velocity_15000", "active"],
          ].map(([name, status]) => (
            <div className="row-item" key={name} style={{ marginBottom: 4 }}>
              <span className="row-name" style={{ fontFamily: F.mono, fontSize: 10.5 }}>{name}/</span>
              <span className={`tag ${status === "active" || status === "connected" ? "green" : status === "standby" ? "orange" : "gold"}`}>{status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🔄 Sync State</div>
          {[
            { label: "S1 Core", val: "Connected" },
            { label: "Writing Engine", val: "In Sync" },
            { label: "Completion Engine", val: "In Sync" },
            { label: "FileDump Engine", val: "In Sync" },
            { label: "Memory System", val: "Standby" },
            { label: "Video Engine", val: "Reserved" },
            { label: "Last Sync", val: "Now" },
          ].map(s => (
            <div className="row-item" key={s.label}>
              <span className="row-name">{s.label}</span>
              <span className={`tag ${s.val === "Connected" || s.val === "In Sync" || s.val === "Now" ? "green" : s.val === "Standby" ? "orange" : ""}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", section: "OVERVIEW", conn: "on" },
  { id: "workspace", label: "Workspace", icon: "🖥", section: "OVERVIEW", conn: "on" },
  { id: "profile", label: "System Profile", icon: "📋", section: "OVERVIEW", conn: "on" },
  { id: "velocity", label: "UV-15000", icon: "⚡", section: "PERFORMANCE", conn: "on" },
  { id: "connectors", label: "Connectors", icon: "🔌", section: "ENGINE LAYER", conn: "on" },
  { id: "ecl", label: "ECL · Routing", icon: "🗺", section: "ENGINE LAYER", conn: "on" },
  { id: "logic", label: "Logic Window", icon: "🔮", section: "TOOLS", conn: "on" },
  { id: "tools", label: "Local Tools", icon: "🔧", section: "TOOLS", conn: "on" },
  { id: "builder", label: "Lightweight Builder", icon: "🏗", section: "TOOLS", conn: "on" },
  { id: "chat_ai", label: "S2 Chat AI", icon: "💬", section: "AI DISPLAY", conn: "on" },
  { id: "builder_ai", label: "S2 Builder AI", icon: "🏗", section: "AI DISPLAY", conn: "on" },
  { id: "voice_ai", label: "S2 Voice AI", icon: "🎙", section: "AI DISPLAY", conn: "on" },
  { id: "export", label: "Export Center", icon: "📦", section: "EXPORT", conn: "on" },
];

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const sections = [...new Set(NAV.map(n => n.section))];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "workspace": return <WorkspaceDashboard />;
      case "profile": return <SystemProfile />;
      case "velocity": return <UltraVelocityView />;
      case "connectors": return <ConnectorView />;
      case "ecl": return <EngineConnectorLayer />;
      case "logic": return <LogicWindow />;
      case "tools": return <LocalTools />;
      case "builder": return <LightweightBuilder />;
      case "chat_ai": return <AIDisplayArea aiRole="chat" />;
      case "builder_ai": return <AIDisplayArea aiRole="builder" />;
      case "voice_ai": return <AIDisplayArea aiRole="voice" />;
      case "export": return <ExportCenter />;
      default: return <Dashboard />;
    }
  };

  const [bootMs] = useState(() => UV.getLatency());

  return (
    <>
      <style>{css}</style>
      <div className="s2-root">
        <div className="topbar">
          <div className="tb-logo">S2</div>
          <div className="tb-badge">WORKSPACE CONNECTOR</div>
          <div className="tb-s1-link">
            <div className="tb-s1-dot" />
            S1 BRIDGE ACTIVE
          </div>
          <div className="tb-right">
            <div className="uv-indicator">
              <div className="uv-dot" />
              UV-15000 · {bootMs}ms
            </div>
            <div className="owner-tag">DWAYNE FFOLKES</div>
          </div>
        </div>

        <div className="sidebar">
          {sections.map(sec => (
            <div key={sec}>
              <span className="nav-sect-label">{sec}</span>
              {NAV.filter(n => n.section === sec).map(n => (
                <div
                  key={n.id}
                  className={`nav-item ${page === n.id ? "active" : ""}`}
                  onClick={() => setPage(n.id)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                  <div className={`conn-dot ${n.conn}`} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="main" key={page}>{renderPage()}</div>
      </div>
    </>
  );
}
