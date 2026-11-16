import { useState, useEffect, useRef } from "react";

// ─── LAYER IDENTITY ──────────────────────────────────────────────────────────
const L = {
  1: { color: "#C8B99A", label: "BYTE",  glow: "rgba(200,185,154,0.15)" },
  2: { color: "#4FC3F7", label: "DATA",  glow: "rgba(79,195,247,0.15)"  },
  3: { color: "#FFD54F", label: "LOGIC", glow: "rgba(255,213,79,0.15)"  },
  4: { color: "#EF5350", label: "BRAIN", glow: "rgba(239,83,80,0.15)"   },
  5: { color: "#66BB6A", label: "BOTS",  glow: "rgba(102,187,106,0.15)" },
  6: { color: "#CE93D8", label: "AI",    glow: "rgba(206,147,216,0.15)" },
  7: { color: "#FF7043", label: "APPS",  glow: "rgba(255,112,67,0.15)"  },
};

const LAYERS = [
  { id:1, num:"01", name:"BYTE LAYER",       rule:"Store only. Never transform.",          modules:["Raw Text","Raw Files","Raw Audio","Raw Images","Raw Video"],  systems:["FileDump Inbox","Voice Capture","Camera Scan"],           feeds:[2]   },
  { id:2, num:"02", name:"DATA BLOCK LAYER", rule:"Organize only. No decisions yet.",       modules:["Tags","Summaries","Indexes","Chunks","Metadata"],              systems:["FileDump Classifier","Memory Context","Search Index"],    feeds:[3]   },
  { id:3, num:"03", name:"LOGIC LAYER",      rule:"Rules only. If this → do that.",         modules:["Rules","Sorting","Naming","Duplicate Check","Priority Check"], systems:["SharpTalk Rules","Completion Engine","ECL Router"],       feeds:[4,5] },
  { id:4, num:"04", name:"BRAIN LAYER",      rule:"Route, remember, coordinate.",           modules:["Memory Core","Recall Core","Task Router","Project Map","Decision Core"], systems:["S1 Brain","S2 Connector","Logic Window"], feeds:[5,6] },
  { id:5, num:"05", name:"BOT LAYER",        rule:"Execute. Report. Never decide.",         modules:["File Bot","Naming Bot","Cleanup Bot","Search Bot","Build Bot"], systems:["Builder AI","FileDump Bots","Completion Bots"],           feeds:[7]   },
  { id:6, num:"06", name:"AI LAYER",         rule:"Only when reasoning or creation needed.",modules:["Deep Reasoning","Creative Builder","Code Assistant","Strategy","Risk Advisor"], systems:["SharpTalk Engine","VibeReach Copy","Chat AIs"], feeds:[5,7] },
  { id:7, num:"07", name:"FRONT LAYER",      rule:"Show only the face. Hide everything.",   modules:["Apps","Skins","Dashboards","Showroom","Public Lite"],           systems:["S1 Workspace","S2 Cockpit","VibeReach","YaadFlex"],       feeds:[]    },
];

const FLOWS = [
  { title:"File Sorting",   path:[1,2,3,5],       note:"Logic + File Bot" },
  { title:"Chat Digestion", path:[1,2,4,6],        note:"Brain + AI" },
  { title:"Ad Copy",        path:[3,4,6,5,7],      note:"Logic → Brain → AI → Bot → Skin" },
  { title:"Search",         path:[2,5,4],           note:"Index + Search Bot + Brain" },
  { title:"Full App Launch",path:[1,2,3,4,5,6,7],  note:"All 7 layers activated" },
];

const SYSTEMS = [
  { name:"S1 Sovereign Workspace",  tag:"Full Private Stack",    layers:[1,2,3,4,5,6,7], status:"active" },
  { name:"S2 Workspace Connector",  tag:"Rapid Cockpit",         layers:[3,4,5,7],        status:"active" },
  { name:"SharpTalk Engine",         tag:"Writing Intelligence",  layers:[3,6,7],          status:"active" },
  { name:"FileDump Engine",          tag:"Raw to Structure",      layers:[1,2,3,4,5],      status:"active" },
  { name:"VibeReach Ad Engine",      tag:"Phase 2 Advertising",   layers:[4,5,6,7],        status:"active" },
  { name:"Completion Engine",        tag:"Auto Polish + Export",  layers:[3,5,6],          status:"active" },
  { name:"YaadFlex App",             tag:"Taxi · Kingston, JA",   layers:[4,5,7],          status:"active" },
  { name:"SOVEREIGN Platform",       tag:"Autonomous AI System",  layers:[1,2,3,4,5,6,7], status:"building"},
];

const CONNECTIONS = [
  { from:"01 BYTE",  to:"02 DATA",  tool:"FileDump Classifier · Auto-tagger",         when:"Always"              },
  { from:"02 DATA",  to:"03 LOGIC", tool:"Logic receives organized, indexed blocks",   when:"Always"              },
  { from:"03 LOGIC", to:"04 BRAIN", tool:"Brain receives prioritized + sorted task",   when:"When routing needed" },
  { from:"03 LOGIC", to:"05 BOTS",  tool:"Bot receives rule-defined execution task",   when:"Simple execution"    },
  { from:"04 BRAIN", to:"05 BOTS",  tool:"Brain assigns task to correct Bot",          when:"Routine tasks"       },
  { from:"04 BRAIN", to:"06 AI",    tool:"Brain escalates to AI when stuck",           when:"Complex / creative"  },
  { from:"05 BOTS",  to:"07 FRONT", tool:"Bot delivers finished output to App / Skin", when:"Task complete"       },
  { from:"06 AI",    to:"05 BOTS",  tool:"AI output handed to Bot for formatting",     when:"Post-AI cleanup"     },
  { from:"06 AI",    to:"07 FRONT", tool:"AI output displayed directly in skin",       when:"Direct output"       },
];

const DECISION = [
  { q:"Is the task rule-based and predictable?",   yes:"→ Use LOGIC (03)",  color:L[3].color },
  { q:"Does it need memory or routing?",            yes:"→ Use BRAIN (04)",  color:L[4].color },
  { q:"Is it a repetitive execution task?",         yes:"→ Use BOTS (05)",   color:L[5].color },
  { q:"Does it need reasoning or creation?",        yes:"→ Use AI (06)",     color:L[6].color },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #05050A;
  --text: #D8D8E8;
  --dim: #505068;
  --border: rgba(255,255,255,0.06);
  --accent: #C8F135;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Ambient background orbs ── */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.18;
}
.orb-1 { width: 500px; height: 500px; background: #C8F135; top: -200px; left: -200px; animation: drift1 18s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: #CE93D8; bottom: -150px; right: -150px; animation: drift2 22s ease-in-out infinite; }
.orb-3 { width: 300px; height: 300px; background: #4FC3F7; top: 40%; left: 60%; animation: drift3 15s ease-in-out infinite; }

@keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
@keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
@keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }

/* ── Layout ── */
.app { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }

/* ── Topbar ── */
.topbar {
  position: sticky; top: 0; z-index: 200;
  padding: 14px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(5,5,10,0.7);
  border-bottom: 1px solid var(--border);
}
.tb-logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 4px;
  color: var(--accent);
  text-transform: uppercase;
}
.tb-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tb-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--dim);
  text-transform: uppercase;
}
.layer-dots { display: flex; gap: 5px; align-items: center; }
.layer-dot-top { width: 6px; height: 6px; border-radius: 50%; opacity: 0.7; }

/* ── Nav ── */
.nav {
  position: sticky; top: 49px; z-index: 190;
  display: flex; overflow-x: auto; gap: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(5,5,10,0.6);
  border-bottom: 1px solid var(--border);
  scrollbar-width: none;
}
.nav::-webkit-scrollbar { display: none; }
.nav-item {
  flex-shrink: 0;
  padding: 11px 18px;
  font-family: 'Syne', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--dim);
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}
.nav-item:hover { color: var(--text); }
.nav-item.active { color: var(--accent); border-bottom-color: var(--accent); }

/* ── Page container ── */
.page { padding: 28px 20px 60px; max-width: 680px; width: 100%; margin: 0 auto; }

/* ── Typography ── */
.page-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(26px, 5vw, 38px);
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin-bottom: 6px;
}
.page-sub { font-size: 13px; color: var(--dim); margin-bottom: 32px; letter-spacing: 0.2px; }
.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--dim);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.section-gap { margin-top: 36px; }

/* ── Floating elements (NO BOXES) ── */
.float-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.float-row:last-child { border-bottom: none; }

/* ── Layer strip ── */
.layer-strip {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}
.layer-strip:hover { padding-left: 8px; }
.ls-header { display: flex; align-items: center; gap: 12px; }
.ls-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  width: 28px;
  flex-shrink: 0;
}
.ls-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; flex: 1; }
.ls-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 1.5px;
  padding: 3px 8px;
  border-radius: 20px;
  flex-shrink: 0;
}
.ls-rule { font-size: 12px; color: var(--dim); margin-top: 5px; padding-left: 40px; font-style: italic; }
.ls-expand { padding-left: 40px; margin-top: 12px; animation: slideDown 0.2s ease; }
.ls-sect { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 7px; margin-top: 12px; }

/* ── Pills / tags ── */
.pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
.pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.5);
  transition: all 0.15s;
}
.pill:hover { border-color: rgba(255,255,255,0.18); color: var(--text); }

/* ── Stack viz ── */
.stack-line {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  transition: padding-left 0.15s;
}
.stack-line:hover { padding-left: 6px; }
.stack-line:last-child { border-bottom: none; }
.sl-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; width: 26px; flex-shrink: 0; }
.sl-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; flex: 1; }
.sl-rule { font-size: 11px; color: var(--dim); font-style: italic; text-align: right; }

/* ── Principle rows ── */
.principle-line {
  display: flex; align-items: baseline; gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.principle-line:last-child { border-bottom: none; }
.pl-key { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; min-width: 96px; flex-shrink: 0; }
.pl-val { font-size: 13px; color: var(--dim); }

/* ── Flow nodes ── */
.flow-row { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin: 10px 0; }
.flow-node {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 50%;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700;
  border: 1.5px solid; transition: transform 0.15s;
}
.flow-node:hover { transform: scale(1.1); }
.flow-arr { color: var(--dim); font-size: 14px; }

/* ── Flow selector ── */
.flow-sel { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.flow-chip {
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500;
  border: 1px solid var(--border); color: var(--dim); cursor: pointer;
  transition: all 0.15s; background: transparent;
  font-family: 'DM Sans', sans-serif;
}
.flow-chip.on { border-color: var(--accent); color: var(--accent); background: rgba(200,241,53,0.06); }

/* ── System map ── */
.sys-strip {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: padding-left 0.15s;
}
.sys-strip:hover { padding-left: 6px; }
.sys-strip:last-child { border-bottom: none; }
.sys-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
.sys-tag { font-size: 11.5px; color: var(--dim); margin-bottom: 8px; margin-top: 2px; }
.dot-row { display: flex; gap: 4px; flex-wrap: wrap; }
.ldot {
  width: 28px; height: 28px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
  border: 1.5px solid; transition: transform 0.15s;
}
.ldot:hover { transform: scale(1.12); }

/* ── Connections ── */
.conn-line {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.conn-line:last-child { border-bottom: none; }
.conn-from-to { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.conn-from { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; }
.conn-arr { color: var(--dim); }
.conn-to { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; }
.conn-tool { font-size: 12px; color: var(--dim); }
.conn-when { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--dim); margin-top: 2px; }

/* ── Decision tree ── */
.decision-step {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.decision-step:last-child { border-bottom: none; }
.ds-num {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  color: var(--dim); margin-top: 1px;
}
.ds-q { font-size: 13px; flex: 1; }
.ds-yes { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; margin-top: 3px; }

/* ── Private vs Public ── */
.pvp-row { display: flex; gap: 20px; }
.pvp-col { flex: 1; padding-top: 8px; }
.pvp-head { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
.pvp-sub { font-size: 12px; color: var(--dim); line-height: 1.7; margin-bottom: 10px; }

/* ── Big stat ── */
.big-stat { text-align: center; padding: 24px 0 8px; }
.big-val { font-family: 'Syne', sans-serif; font-size: clamp(48px, 10vw, 72px); font-weight: 800; line-height: 1; }
.big-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--dim); margin-top: 6px; text-transform: uppercase; }

/* ── Chat ── */
.chat-messages { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.bubble {
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.7;
  max-width: 90%;
}
.bubble-ai { background: rgba(255,255,255,0.03); border: 1px solid var(--border); align-self: flex-start; }
.bubble-user { background: rgba(200,241,53,0.06); border: 1px solid rgba(200,241,53,0.15); align-self: flex-end; }
.bubble-label { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 2px; color: var(--dim); margin-bottom: 5px; text-transform: uppercase; }
.chat-in { display: flex; gap: 8px; }
.chat-in textarea {
  flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: 8px; padding: 10px 13px; color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 13px; resize: none; outline: none;
  transition: border-color 0.15s;
}
.chat-in textarea:focus { border-color: rgba(200,241,53,0.4); }

/* ── Text input ── */
.txt-in {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: 8px; padding: 10px 13px; color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
  transition: border-color 0.15s; margin-bottom: 10px;
}
.txt-in:focus { border-color: rgba(200,241,53,0.4); }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 9px 18px; border-radius: 6px; border: none; cursor: pointer;
  font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; transition: all 0.15s;
  white-space: nowrap;
}
.btn-accent { background: var(--accent); color: #000; }
.btn-accent:hover { background: #d4ff38; transform: translateY(-1px); }
.btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: rgba(255,255,255,0.2); }
.btn-sm { padding: 6px 14px; font-size: 10.5px; }

/* ── Divider ── */
.divider { height: 1px; background: var(--border); margin: 20px 0; }

/* ── Accent line ── */
.accent-line { width: 32px; height: 2px; background: var(--accent); margin-bottom: 12px; border-radius: 1px; }

/* ── Animations ── */
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.fade-up { animation: fadeUp 0.25s ease both; }
.fade-in { animation: fadeIn 0.2s ease both; }

/* ── Loading ── */
.loading::after { content:'...'; animation: dots 1s step-end infinite; }
@keyframes dots { 0%,20%{content:'.'} 40%,60%{content:'..'} 80%{content:'...'} }

/* ── Gradient text ── */
.grad-text {
  background: linear-gradient(135deg, var(--accent) 0%, #CE93D8 60%, #4FC3F7 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* ── Trace result ── */
.trace-result { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); animation: fadeUp 0.2s ease; }
.trace-verdict {
  margin-top: 10px; padding: 10px 14px; border-radius: 6px;
  font-size: 12.5px; border-left: 2px solid;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .page { padding: 20px 16px 50px; }
  .topbar { padding: 11px 14px; }
  .nav-item { padding: 10px 14px; font-size: 10.5px; }
  .pvp-row { flex-direction: column; gap: 14px; }
  .sl-rule { display: none; }
}
`;

// ─── AI CALLS ────────────────────────────────────────────────────────────────
async function askFoundry(messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:900,
      system:`You are Foundry AI for DWAYNE FFOLKES / XXOON. You know the 7-layer architecture:
01 BYTE — raw storage | 02 DATA — tags, summaries, indexes | 03 LOGIC — rules only, no reasoning
04 BRAIN — memory, routing, coordination | 05 BOTS — repeat execution only | 06 AI — reasoning/creation only when needed | 07 FRONT — polished apps/skins/dashboards

Core rule: Logic when rules work. Brain when routing/memory needed. Bots for repeat work. AI only for reasoning/creation.
Systems: S1 (all 7 layers), S2 Cockpit (3-4-5-7), SharpTalk (3-6-7), FileDump (1-2-3-4-5), VibeReach (4-5-6-7), YaadFlex (4-5-7), SOVEREIGN (all 7), Completion Engine (3-5-6).
Owner: DWAYNE FFOLKES / XXOON / Mintage Holdings. Be sharp and direct. No filler.`,
      messages,
    }),
  });
  const d = await r.json();
  return d.content?.[0]?.text || "Error.";
}

async function traceTask(task) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:500,
      system:`XXOON Flow Tracer. Return ONLY valid JSON, no markdown:
{"layers":[integers 1-7],"tools":"short comma list","ai_needed":true/false,"reason":"one sentence"}`,
      messages:[{role:"user",content:task}],
    }),
  });
  const d = await r.json();
  try { return JSON.parse(d.content?.[0]?.text?.replace(/```json|```/g,"").trim()); }
  catch { return {layers:[1,2,3,5],tools:"Logic, Bots",ai_needed:false,reason:"Standard task — rules and bots are enough."}; }
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Overview() {
  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title"><span className="grad-text">XXOON</span><br />Concept Foundry</div>
      <div className="page-sub">Master architecture · 7 layers · Owner: DWAYNE FFOLKES</div>

      {/* Big stat row */}
      <div style={{ display:"flex", gap:0, borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", margin:"0 0 32px" }}>
        {[{val:"7",label:"Layers"},{val:"8",label:"Systems"},{val:"01→07",label:"Flow"}].map((s,i)=>(
          <div key={s.label} style={{ flex:1, padding:"20px 0", textAlign:"center", borderRight: i<2?"1px solid var(--border)":"none" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color: i===0?L[6].color:i===1?L[5].color:L[3].color }}>{s.val}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"var(--dim)", letterSpacing:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Core Principle</div>
      {[
        {key:"Use Logic",val:"when rules are enough"},
        {key:"Use Brain",val:"when memory or routing is needed"},
        {key:"Use Bots", val:"when repeat tasks are needed"},
        {key:"Use AI",   val:"only when reasoning or creation is needed"},
      ].map(r=>(
        <div className="principle-line" key={r.key}>
          <div className="pl-key" style={{color:"var(--accent)"}}>{r.key}</div>
          <div className="pl-val">{r.val}</div>
        </div>
      ))}

      <div className="section-gap" />
      <div className="section-label">Architecture Stack</div>
      {[...LAYERS].reverse().map(l=>(
        <div className="stack-line" key={l.id}>
          <div className="sl-num" style={{color:L[l.id].color}}>{l.num}</div>
          <div className="sl-name" style={{color:L[l.id].color}}>{l.name}</div>
          <div className="sl-rule">{l.rule}</div>
        </div>
      ))}

      <div className="section-gap" />
      <div className="section-label">Private vs Public</div>
      <div className="pvp-row">
        <div className="pvp-col">
          <div className="pvp-head" style={{color:"var(--accent)"}}>🔒 Private System</div>
          <div className="pvp-sub">Full brain + full memory + complete foundry. All 7 layers. Owner access only.</div>
          <div className="pill-row">
            {LAYERS.map(l=><span key={l.id} className="pill" style={{borderColor:L[l.id].color+"40",color:L[l.id].color}}>{l.num} {L[l.id].label}</span>)}
          </div>
        </div>
        <div className="pvp-col">
          <div className="pvp-head">🌍 Public System</div>
          <div className="pvp-sub">Lighter skins + selected tools. Only Layer 07 face shown. Layers 01–05 hidden from view.</div>
          <div className="pill-row">
            {[6,7].map(id=><span key={id} className="pill" style={{borderColor:L[id].color+"40",color:L[id].color}}>{LAYERS[id-1].num} {L[id].label}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title">7 Layers</div>
      <div className="page-sub">The complete architecture from byte to app. Tap any layer.</div>
      {LAYERS.map(l=>{
        const lc = L[l.id];
        const isOpen = open===l.id;
        return (
          <div key={l.id} className="layer-strip" onClick={()=>setOpen(isOpen?null:l.id)}>
            <div className="ls-header">
              <div className="ls-num" style={{color:lc.color}}>{l.num}</div>
              <div className="ls-name" style={{color:isOpen?lc.color:"var(--text)"}}>{l.name}</div>
              <div className="ls-badge" style={{background:lc.glow,color:lc.color,border:`1px solid ${lc.color}30`}}>{lc.label}</div>
              <div style={{color:"var(--dim)",fontSize:18,marginLeft:6}}>{isOpen?"−":"+"}</div>
            </div>
            <div className="ls-rule">{l.rule}</div>
            {isOpen && (
              <div className="ls-expand">
                <div className="ls-sect">Modules</div>
                <div className="pill-row">
                  {l.modules.map(m=><span key={m} className="pill" style={{borderColor:lc.color+"25",color:"rgba(255,255,255,0.65)"}}>{m}</span>)}
                </div>
                <div className="ls-sect">Powers These Systems</div>
                <div className="pill-row">
                  {l.systems.map(s=><span key={s} className="pill" style={{borderColor:lc.color+"40",color:lc.color}}>{s}</span>)}
                </div>
                {l.feeds.length>0&&<>
                  <div className="ls-sect">Feeds Into</div>
                  <div className="pill-row">
                    {l.feeds.map(fid=>{
                      const fl=LAYERS.find(x=>x.id===fid);
                      return <span key={fid} className="pill" style={{borderColor:L[fid].color+"40",color:L[fid].color}}>{fl.num} {fl.name}</span>;
                    })}
                  </div>
                </>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlowPage() {
  const [active, setActive] = useState(FLOWS[0]);
  const [task, setTask] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const trace = async () => {
    if (!task.trim()) return;
    setLoading(true); setResult(null);
    const r = await traceTask(task);
    setResult(r); setLoading(false);
  };

  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title">Flow Tracer</div>
      <div className="page-sub">See which layers activate for any task.</div>

      <div className="section-label">Example Flows</div>
      <div className="flow-sel">
        {FLOWS.map(f=>(
          <div key={f.title} className={`flow-chip ${active.title===f.title?"on":""}`}
            onClick={()=>{setActive(f);setResult(null);}}>
            {f.title}
          </div>
        ))}
      </div>
      <div className="flow-row">
        {active.path.map((id,i)=>{
          const lc=L[id]; const l=LAYERS.find(x=>x.id===id);
          return <>
            <div key={id} className="flow-node" style={{background:lc.glow,borderColor:lc.color+"60",color:lc.color}} title={l.name}>{l.num}</div>
            {i<active.path.length-1&&<div className="flow-arr" key={id+"a"}>→</div>}
          </>;
        })}
      </div>
      <div style={{fontSize:12,color:"var(--dim)",marginBottom:8}}>{active.note}</div>
      <div className="pill-row">
        {active.path.map(id=>{
          const l=LAYERS.find(x=>x.id===id); const lc=L[id];
          return <span key={id} className="pill" style={{borderColor:lc.color+"30",color:lc.color}}>{l.num} {l.name}</span>;
        })}
      </div>

      <div className="section-gap" />
      <div className="section-label">Trace Any Task</div>
      <input className="txt-in" placeholder="Describe a task e.g. user books a YaadFlex ride…"
        value={task} onChange={e=>setTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&trace()} />
      <button className="btn btn-accent btn-sm" onClick={trace} disabled={loading||!task.trim()}>
        {loading?"Tracing…":"▶ Trace"}
      </button>

      {result&&(
        <div className="trace-result">
          <div className="flow-row">
            {result.layers?.map((id,i)=>{
              const lc=L[id]||{color:"#888",glow:"rgba(128,128,128,0.1)"};
              const l=LAYERS.find(x=>x.id===id);
              return <>
                <div key={id} className="flow-node" style={{background:lc.glow,borderColor:lc.color+"60",color:lc.color}}>{l?.num||id}</div>
                {i<result.layers.length-1&&<div className="flow-arr" key={"a"+i}>→</div>}
              </>;
            })}
          </div>
          <div style={{fontSize:12,color:"var(--dim)",margin:"6px 0"}}>Tools: {result.tools}</div>
          <div className="trace-verdict" style={{borderColor:result.ai_needed?L[6].color:L[5].color,background:result.ai_needed?L[6].glow:L[5].glow}}>
            <strong>AI {result.ai_needed?"required":"not required"}</strong> — {result.reason}
          </div>
        </div>
      )}
    </div>
  );
}

function SystemsPage() {
  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title">Systems</div>
      <div className="page-sub">Every system mapped to its architecture layers.</div>
      {SYSTEMS.map(s=>(
        <div className="sys-strip" key={s.name}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div>
              <div className="sys-name">{s.name}</div>
              <div className="sys-tag">{s.tag}</div>
            </div>
            <span className="pill" style={{borderColor:s.status==="active"?L[5].color+"40":L[3].color+"40",color:s.status==="active"?L[5].color:L[3].color,flexShrink:0}}>
              {s.status}
            </span>
          </div>
          <div className="dot-row">
            {LAYERS.map(l=>{
              const active=s.layers.includes(l.id);
              const lc=L[l.id];
              return (
                <div key={l.id} className="ldot" title={l.name}
                  style={{background:active?lc.glow:"transparent",borderColor:active?lc.color+"50":"var(--border)",color:active?lc.color:"var(--dim)",opacity:active?1:0.3}}>
                  {l.num}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="section-gap" />
      <div className="section-label">Layer Key</div>
      <div className="pill-row">
        {LAYERS.map(l=><span key={l.id} className="pill" style={{borderColor:L[l.id].color+"40",color:L[l.id].color}}>{l.num} {L[l.id].label}</span>)}
      </div>
    </div>
  );
}

function ConnectionsPage() {
  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title">Connections</div>
      <div className="page-sub">How data flows between layers. Every connection has a rule.</div>

      <div className="section-label">Layer-to-Layer Flow</div>
      {CONNECTIONS.map((c,i)=>{
        const fromId = parseInt(c.from[0]);
        const toId   = parseInt(c.to[0]);
        const fromC  = L[fromId]?.color||"#888";
        const toC    = L[toId]?.color||"#888";
        return (
          <div className="conn-line" key={i}>
            <div className="conn-from-to">
              <span className="conn-from" style={{color:fromC}}>{c.from}</span>
              <span className="conn-arr">→</span>
              <span className="conn-to" style={{color:toC}}>{c.to}</span>
            </div>
            <div className="conn-tool">{c.tool}</div>
            <div className="conn-when">when: {c.when}</div>
          </div>
        );
      })}

      <div className="section-gap" />
      <div className="section-label">Decision Tree</div>
      {DECISION.map((d,i)=>(
        <div className="decision-step" key={i}>
          <div className="ds-num">{i+1}</div>
          <div>
            <div className="ds-q">{d.q}</div>
            <div className="ds-yes" style={{color:d.color}}>Yes {d.yes}</div>
          </div>
        </div>
      ))}

      <div className="section-gap" />
      <div className="section-label">Full Stack Flow Example</div>
      <div style={{fontSize:12,color:"var(--dim)",marginBottom:10}}>User opens YaadFlex and books a ride:</div>
      <div className="flow-row" style={{marginBottom:8}}>
        {[7,4,5,7].map((id,i,arr)=>{
          const lc=L[id]; const l=LAYERS.find(x=>x.id===id);
          return <>
            <div key={i} className="flow-node" style={{background:lc.glow,borderColor:lc.color+"60",color:lc.color}}>{l.num}</div>
            {i<arr.length-1&&<div className="flow-arr" key={"fa"+i}>→</div>}
          </>;
        })}
      </div>
      {[
        "User taps app — FRONT layer receives input",
        "BRAIN layer routes the booking request",
        "BOT layer executes — finds driver, confirms trip",
        "FRONT layer displays result back to user",
      ].map((step,i)=>(
        <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--dim)",paddingTop:3,width:16,flexShrink:0}}>{i+1}</div>
          <div style={{fontSize:12.5,color:"var(--dim)"}}>{step}</div>
        </div>
      ))}
    </div>
  );
}

const GREETING = {role:"ai", text:"Foundry AI online. Ask me where any idea fits in the 7-layer stack, which layers a system uses, or whether a task needs AI or just Logic.", display:true};

function FoundryAIPage() {
  const [msgs, setMsgs] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send = async () => {
    if (!input.trim()||loading) return;
    const um = {role:"user", text:input};
    const hist = [...msgs, um];
    setMsgs(hist); setInput(""); setLoading(true);
    // Only send real conversation turns — skip display-only greeting
    const apiMsgs = hist
      .filter(m => !m.display)
      .map(m => ({role: m.role==="ai" ? "assistant" : "user", content: m.text}));
    const reply = await askFoundry(apiMsgs).catch(()=>"Error.");
    setMsgs([...hist, {role:"ai", text:reply}]);
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <div className="accent-line" />
      <div className="page-title">Foundry AI</div>
      <div className="page-sub">Architecture intelligence. Maps any idea to the 7-layer stack.</div>
      <div className="chat-messages">
        {msgs.map((m,i)=>(
          <div key={i} className={`bubble bubble-${m.role}`}>
            <div className="bubble-label">{m.role==="ai"?"FOUNDRY AI":"DWAYNE"}</div>
            {m.text}
          </div>
        ))}
        {loading&&<div className="bubble bubble-ai"><div className="bubble-label">FOUNDRY AI</div><span className="loading">Thinking</span></div>}
        <div ref={endRef}/>
      </div>
      <div className="chat-in">
        <textarea rows={2} placeholder="Where does this idea fit? Which layers? AI needed or not?"
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
        <button className="btn btn-accent" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

// ─── NAV + APP ────────────────────────────────────────────────────────────────
const TABS = [
  {id:"overview",  label:"Overview"},
  {id:"layers",    label:"7 Layers"},
  {id:"flow",      label:"Flow"},
  {id:"systems",   label:"Systems"},
  {id:"connect",   label:"Connections"},
  {id:"foundry",   label:"Foundry AI"},
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const pages = {overview:<Overview/>,layers:<LayersPage/>,flow:<FlowPage/>,systems:<SystemsPage/>,connect:<ConnectionsPage/>,foundry:<FoundryAIPage/>};

  return (
    <>
      <style>{css}</style>
      {/* Ambient orbs */}
      <div className="orb orb-1"/>
      <div className="orb orb-2"/>
      <div className="orb orb-3"/>

      <div className="app">
        <div className="topbar">
          <div className="tb-logo">XXOON · Foundry</div>
          <div className="tb-right">
            <div className="layer-dots">
              {LAYERS.map(l=><div key={l.id} className="layer-dot-top" style={{background:L[l.id].color}} title={l.name}/>)}
            </div>
            <div className="tb-tag">DWAYNE FFOLKES</div>
          </div>
        </div>

        <div className="nav">
          {TABS.map(t=>(
            <div key={t.id} className={`nav-item ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
            </div>
          ))}
        </div>

        <div className="page" key={tab}>
          {pages[tab]}
        </div>
      </div>
    </>
  );
}
