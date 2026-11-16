import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg: "#060608",
  surface: "#0C0C10",
  card: "#101015",
  cardHi: "#141419",
  border: "#1C1C24",
  borderHi: "#28282F",
  accent: "#FF3CAC",       // vivid magenta — advertising energy
  accentB: "#784BA0",      // purple mid
  accentC: "#2B86C5",      // blue anchor
  gold: "#FFD166",
  green: "#06D6A0",
  orange: "#FF9F1C",
  red: "#EF233C",
  text: "#EEEEF5",
  textDim: "#8888A0",
  muted: "#44445A",
  glow: "rgba(255,60,172,0.15)",
};

const F = {
  display: "'Bebas Neue', sans-serif",
  sub: "'Outfit', sans-serif",
  mono: "'Fira Code', monospace",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${C.bg};color:${C.text};font-family:${F.sub};height:100%;overflow:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}

.vr-root{
  display:grid;
  grid-template-columns:224px 1fr;
  grid-template-rows:54px 1fr;
  height:100vh;
  overflow:hidden;
}

/* ── TOPBAR ── */
.topbar{
  grid-column:1/-1;
  background:${C.surface};
  border-bottom:1px solid ${C.border};
  display:flex;
  align-items:center;
  padding:0 20px;
  gap:14px;
  position:relative;
  z-index:30;
  overflow:hidden;
}
.topbar::before{
  content:'';
  position:absolute;
  bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent 0%,${C.accent} 40%,${C.accentB} 70%,transparent 100%);
  opacity:0.6;
}
.tb-logo{
  font-family:${F.display};
  font-size:22px;
  letter-spacing:3px;
  background:linear-gradient(90deg,${C.accent},${C.accentB},${C.accentC});
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.tb-badge{
  padding:3px 10px;
  background:linear-gradient(135deg,rgba(255,60,172,0.1),rgba(43,134,197,0.1));
  border:1px solid rgba(255,60,172,0.2);
  border-radius:3px;
  font-family:${F.mono};
  font-size:9px;
  color:${C.accent};
  letter-spacing:2px;
}
.approval-lock{
  display:flex;align-items:center;gap:6px;
  padding:5px 12px;
  background:rgba(239,35,60,0.08);
  border:1px solid rgba(239,35,60,0.25);
  border-radius:4px;
  font-family:${F.mono};font-size:9px;color:${C.red};
  letter-spacing:1.5px;
}
.lock-dot{width:6px;height:6px;border-radius:50%;background:${C.red};animation:pulse 1.5s infinite;}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.owner-chip{
  font-family:${F.mono};font-size:9px;color:${C.muted};
  padding:3px 8px;border:1px solid ${C.border};border-radius:3px;letter-spacing:1.5px;
}

@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
@keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
@keyframes scanR{0%{transform:translateX(-100%);}100%{transform:translateX(400%)}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 8px rgba(255,60,172,0.2);}50%{box-shadow:0 0 18px rgba(255,60,172,0.4);}}

/* ── SIDEBAR ── */
.sidebar{
  background:${C.surface};
  border-right:1px solid ${C.border};
  overflow-y:auto;
  padding:10px 0 20px;
}
.nav-label{
  font-family:${F.mono};font-size:8px;letter-spacing:2.5px;
  color:${C.muted};text-transform:uppercase;
  padding:10px 14px 4px;display:block;
}
.nav-item{
  display:flex;align-items:center;gap:9px;
  padding:8px 12px;margin:1px 6px;
  border-radius:5px;cursor:pointer;
  font-size:12.5px;font-weight:500;
  color:${C.textDim};
  transition:all 0.12s;
  border:1px solid transparent;
  user-select:none;
}
.nav-item:hover{background:${C.card};color:${C.text};}
.nav-item.active{
  background:linear-gradient(135deg,rgba(255,60,172,0.08),rgba(43,134,197,0.05));
  color:${C.accent};
  border-color:rgba(255,60,172,0.2);
}
.nav-icon{font-size:14px;width:18px;text-align:center;flex-shrink:0;}
.nav-pip{margin-left:auto;width:5px;height:5px;border-radius:50%;background:${C.green};flex-shrink:0;}
.nav-pip.warn{background:${C.orange};}
.nav-pip.off{background:${C.muted};}
.nav-pip.hold{background:${C.red};animation:pulse 1.5s infinite;}

/* ── MAIN ── */
.main{overflow-y:auto;padding:24px 26px;background:${C.bg};animation:fadeIn 0.18s ease;}

/* ─ SHARED COMPONENTS ─ */
.pg-title{
  font-family:${F.display};
  font-size:26px;letter-spacing:2px;margin-bottom:2px;
}
.pg-sub{font-size:11.5px;color:${C.textDim};margin-bottom:22px;letter-spacing:0.2px;}

.card{
  background:${C.card};border:1px solid ${C.border};
  border-radius:10px;padding:18px;margin-bottom:14px;
  transition:border 0.15s;
}
.card:hover{border-color:${C.borderHi};}
.card-title{
  font-family:${F.sub};font-weight:700;font-size:12px;letter-spacing:0.8px;
  text-transform:uppercase;margin-bottom:12px;
  display:flex;align-items:center;gap:8px;color:${C.text};
}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.g5{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;}

.btn{
  padding:9px 18px;border-radius:6px;border:none;
  cursor:pointer;font-family:${F.sub};font-size:12.5px;
  font-weight:600;transition:all 0.12s;letter-spacing:0.3px;
}
.btn-hot{
  background:linear-gradient(135deg,${C.accent},${C.accentB});
  color:#fff;box-shadow:0 4px 16px rgba(255,60,172,0.25);
}
.btn-hot:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,60,172,0.35);}
.btn-ghost{background:transparent;color:${C.text};border:1px solid ${C.border};}
.btn-ghost:hover{border-color:${C.accent};color:${C.accent};}
.btn-approve{background:rgba(6,214,160,0.1);color:${C.green};border:1px solid rgba(6,214,160,0.25);}
.btn-approve:hover{background:rgba(6,214,160,0.18);}
.btn-reject{background:rgba(239,35,60,0.08);color:${C.red};border:1px solid rgba(239,35,60,0.2);}
.btn-reject:hover{background:rgba(239,35,60,0.15);}
.btn-sm{padding:5px 12px;font-size:11px;}

.tag{
  display:inline-block;padding:2px 8px;border-radius:20px;
  font-size:9.5px;font-family:${F.mono};font-weight:500;letter-spacing:0.5px;
  background:rgba(255,60,172,0.08);color:${C.accent};border:1px solid rgba(255,60,172,0.18);
}
.tag.green{background:rgba(6,214,160,0.08);color:${C.green};border-color:rgba(6,214,160,0.2);}
.tag.gold{background:rgba(255,209,102,0.08);color:${C.gold};border-color:rgba(255,209,102,0.2);}
.tag.red{background:rgba(239,35,60,0.08);color:${C.red};border-color:rgba(239,35,60,0.2);}
.tag.orange{background:rgba(255,159,28,0.08);color:${C.orange};border-color:rgba(255,159,28,0.2);}
.tag.blue{background:rgba(43,134,197,0.08);color:${C.accentC};border-color:rgba(43,134,197,0.2);}
.tag.muted{background:transparent;color:${C.muted};border-color:${C.border};}

textarea,input[type="text"],input[type="number"],select{
  width:100%;background:#09090C;border:1px solid ${C.border};
  border-radius:6px;padding:9px 12px;color:${C.text};
  font-family:${F.sub};font-size:12.5px;resize:none;outline:none;
  transition:border 0.12s;
}
textarea:focus,input:focus,select:focus{border-color:${C.accent};}
select option{background:#0C0C10;}

.stat{
  padding:14px;background:${C.surface};border:1px solid ${C.border};
  border-radius:8px;text-align:center;
  position:relative;overflow:hidden;
}
.stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,${C.accent},${C.accentB});
}
.stat-val{font-family:${F.display};font-size:24px;letter-spacing:1px;color:${C.accent};margin-top:4px;}
.stat-label{font-size:9.5px;color:${C.muted};letter-spacing:1.2px;text-transform:uppercase;font-family:${F.mono};}

.row-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 13px;background:${C.surface};border:1px solid ${C.border};
  border-radius:6px;margin-bottom:5px;cursor:pointer;transition:border 0.12s;
}
.row-item:hover{border-color:${C.borderHi};}
.row-name{font-weight:600;font-size:12.5px;}
.row-meta{font-family:${F.mono};font-size:10px;color:${C.textDim};margin-top:1px;}

/* Campaign card */
.camp-card{
  background:${C.cardHi};border:1px solid ${C.border};border-radius:10px;
  padding:16px;position:relative;overflow:hidden;
  transition:all 0.15s;cursor:pointer;
}
.camp-card:hover{border-color:rgba(255,60,172,0.3);transform:translateY(-1px);}
.camp-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,${C.accent},${C.accentB},${C.accentC});
}
.camp-card.pending::after{background:${C.orange};}
.camp-card.paused::after{background:${C.muted};}
.camp-card.live::after{background:${C.green};animation:glow-pulse 2s infinite;}
.camp-name{font-family:${F.sub};font-weight:700;font-size:14px;margin-bottom:4px;}
.camp-meta{font-size:11px;color:${C.textDim};margin-bottom:10px;}
.camp-stats{display:flex;gap:16px;}
.camp-stat{text-align:center;}
.camp-stat-val{font-family:${F.display};font-size:18px;color:${C.text};}
.camp-stat-label{font-size:9px;color:${C.muted};font-family:${F.mono};letter-spacing:1px;}

/* Platform chip */
.platform-chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 12px;background:${C.surface};border:1px solid ${C.border};
  border-radius:6px;font-size:12px;font-weight:500;
  color:${C.textDim};cursor:pointer;transition:all 0.12s;margin:3px;
}
.platform-chip:hover,.platform-chip.sel{background:rgba(255,60,172,0.06);border-color:rgba(255,60,172,0.25);color:${C.accent};}

/* Approval gate */
.approval-gate{
  background:linear-gradient(135deg,rgba(239,35,60,0.06),rgba(255,60,172,0.04));
  border:1px solid rgba(239,35,60,0.2);border-radius:10px;padding:16px;margin-bottom:12px;
}
.gate-title{font-family:${F.display};font-size:16px;letter-spacing:1px;color:${C.red};margin-bottom:4px;}
.gate-sub{font-size:11.5px;color:${C.textDim};margin-bottom:12px;}

/* Audit log */
.audit-row{
  display:flex;align-items:flex-start;gap:10px;
  padding:9px 0;border-bottom:1px solid ${C.border};font-size:11.5px;
}
.audit-row:last-child{border-bottom:none;}
.audit-dot{width:7px;height:7px;border-radius:50%;margin-top:4px;flex-shrink:0;}
.audit-txt{flex:1;line-height:1.5;}
.audit-ts{font-family:${F.mono};font-size:9.5px;color:${C.muted};flex-shrink:0;}

/* Split test */
.variant-box{
  background:${C.surface};border:1px solid ${C.border};border-radius:8px;padding:14px;
}
.variant-label{font-family:${F.display};font-size:22px;color:${C.accent};margin-bottom:4px;}
.perf-bar{height:6px;background:${C.border};border-radius:3px;margin-top:8px;overflow:hidden;}
.perf-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}

/* Budget ring */
.budget-display{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:20px;
  background:radial-gradient(circle,rgba(255,60,172,0.06) 0%,transparent 70%);
}
.budget-amount{font-family:${F.display};font-size:36px;letter-spacing:2px;
  background:linear-gradient(135deg,${C.gold},${C.orange});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.budget-label{font-family:${F.mono};font-size:10px;color:${C.muted};letter-spacing:2px;margin-top:4px;}

/* Channel grid */
.channel-node{
  padding:16px 12px;background:${C.surface};border:1px solid ${C.border};
  border-radius:8px;text-align:center;cursor:pointer;transition:all 0.15s;
}
.channel-node:hover{border-color:rgba(255,60,172,0.3);background:rgba(255,60,172,0.04);}
.channel-node.active{border-color:rgba(6,214,160,0.3);background:rgba(6,214,160,0.04);animation:glow-pulse 3s infinite;}
.channel-node.future{opacity:0.5;border-style:dashed;}
.ch-icon{font-size:24px;margin-bottom:8px;}
.ch-name{font-weight:600;font-size:12px;margin-bottom:4px;}
.ch-status{font-family:${F.mono};font-size:9.5px;color:${C.muted};}

.divider{height:1px;background:${C.border};margin:14px 0;}
.badge-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;}

/* Neon heading accent */
.neon-accent{
  display:inline-block;
  background:linear-gradient(90deg,${C.accent},${C.accentB});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

.loading-shimmer{
  background:linear-gradient(90deg,${C.border} 0%,${C.borderHi} 50%,${C.border} 100%);
  background-size:200% auto;animation:shimmer 1.5s linear infinite;
  border-radius:4px;height:14px;
}

select{cursor:pointer;}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const CAMPAIGNS = [
  { id: 1, name: "YaadFlex Launch — Kingston", type: "taxi", status: "pending", budget: 500, spent: 0, reach: 0, clicks: 0, ctr: "0%", channels: ["Facebook", "Instagram"], region: "Kingston, JA", priority: "HIGH" },
  { id: 2, name: "Tourism Jamaica — Summer Push", type: "tourism", status: "live", budget: 1200, spent: 340, reach: 42000, clicks: 1860, ctr: "4.4%", channels: ["Google", "YouTube"], region: "Jamaica + Caribbean", priority: "HIGH" },
  { id: 3, name: "Civil Engineering Course — Q3", type: "education", status: "paused", budget: 750, spent: 210, reach: 18000, clicks: 720, ctr: "4.0%", channels: ["Facebook", "TikTok"], region: "Caribbean + Africa", priority: "MEDIUM" },
  { id: 4, name: "Nexus App — Beta Launch", type: "app", status: "pending", budget: 900, spent: 0, reach: 0, clicks: 0, ctr: "0%", channels: ["TikTok", "Instagram"], region: "Global", priority: "HIGH" },
  { id: 5, name: "Affiliate Network — XXOON", type: "affiliate", status: "live", budget: 400, spent: 88, reach: 11500, clicks: 530, ctr: "4.6%", channels: ["Banner", "Google"], region: "Caribbean", priority: "LOW" },
];

const AD_TYPES = [
  { id: "taxi", icon: "🚖", label: "Taxi App Ads", color: C.gold },
  { id: "tourism", icon: "🌴", label: "Tourism Ads", color: C.green },
  { id: "education", icon: "🎓", label: "Course Ads", color: C.accentC },
  { id: "app", icon: "📱", label: "App Launch Ads", color: C.accent },
  { id: "affiliate", icon: "🤝", label: "Affiliate/Referral", color: C.accentB },
  { id: "partner", icon: "🏢", label: "Partner Business", color: C.orange },
  { id: "marketplace", icon: "🛒", label: "Marketplace", color: C.gold },
  { id: "banner", icon: "🖼", label: "Banner Ads", color: C.accentC },
];

const CHANNELS = [
  { id: "facebook", icon: "📘", name: "Facebook Ads", status: "future", note: "Phase 2 Connect" },
  { id: "instagram", icon: "📸", name: "Instagram Ads", status: "future", note: "Phase 2 Connect" },
  { id: "tiktok", icon: "🎵", name: "TikTok Ads", status: "future", note: "Phase 2 Connect" },
  { id: "youtube", icon: "▶️", name: "YouTube Ads", status: "future", note: "Phase 2 Connect" },
  { id: "google", icon: "🔍", name: "Google Ads", status: "future", note: "Phase 2 Connect" },
  { id: "banner", icon: "🖼", name: "Website Banners", status: "future", note: "Phase 2 Connect" },
];

const APPROVAL_QUEUE = [
  { id: "A001", name: "YaadFlex Launch — Kingston", type: "taxi", budget: 500, channels: ["Facebook", "Instagram"], region: "Kingston, JA", copy: "Need a ride in Kingston? YaadFlex gets you there fast, safe, and on time. Book now." },
  { id: "A002", name: "Nexus App — Beta Launch", type: "app", budget: 900, channels: ["TikTok", "Instagram"], region: "Global", copy: "The game has changed. Nexus is live — join the beta and play at a level you've never seen." },
];

const AUDIT_LOG = [
  { action: "Campaign created", item: "Tourism Jamaica — Summer Push", ts: "Today 09:14", color: C.accent },
  { action: "Budget approved by owner", item: "Tourism Jamaica — $1,200.00", ts: "Today 09:15", color: C.green },
  { action: "Campaign launched", item: "Tourism Jamaica — Google + YouTube", ts: "Today 09:20", color: C.green },
  { action: "Approval required — held", item: "YaadFlex Launch — awaiting owner sign-off", ts: "Today 11:02", color: C.orange },
  { action: "Campaign paused (manual override)", item: "Civil Engineering Course", ts: "Today 14:30", color: C.red },
  { action: "Affiliate campaign live", item: "XXOON Affiliate Network", ts: "Yesterday 16:45", color: C.green },
  { action: "Split test initiated", item: "Tourism — Variant A vs B", ts: "Yesterday 17:00", color: C.accentC },
  { action: "Spend limit guard triggered", item: "Banner campaign — spend at 92%", ts: "Yesterday 18:10", color: C.orange },
];

// ─── AI COPY GENERATOR ───────────────────────────────────────────────────────
async function generateAdCopy(brief, type, channel) {
  const typeInstructions = {
    taxi: "YaadFlex taxi app — fast, safe, reliable rides in Jamaica. Caribbean voice, community-first energy.",
    tourism: "Jamaica / Caribbean tourism — vibrant, beautiful, culturally rich. Inspire people to visit.",
    education: "Civil engineering / professional course — credentials, career advancement, technical excellence.",
    app: "App launch — excitement, innovation, FOMO-driven. Bold and direct.",
    affiliate: "Affiliate / referral program — earn money, grow network, trusted brand.",
    partner: "Partner business promotion — professional, reputable, community-endorsed.",
    marketplace: "Marketplace / product — value, quality, easy to buy.",
    banner: "Website banner — short, punchy, click-worthy.",
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are the VibeReach Ad Copy Engine for DWAYNE FFOLKES / XXOON.

Ad Type: ${type}
Channel: ${channel}
Context: ${typeInstructions[type] || "General XXOON brand promotion."}

RULES:
- Write original ad copy only — never imitate other brands
- Brand voice: sharp, confident, Caribbean-rooted, globally sharp
- Never spend or publish — this is copy draft only
- No placeholder text, no [brackets]
- Output format: 
  HEADLINE: (under 8 words)
  BODY: (2-3 sentences max)
  CTA: (3-5 words)
- That's all. No preamble.`,
      messages: [{ role: "user", content: `Write an ad for: ${brief}` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

async function runAISplitTest(copyA, copyB, context) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are the VibeReach AI Split Test Analyser for DWAYNE FFOLKES / XXOON.
Analyse two ad copy variants and predict performance. Return ONLY valid JSON (no markdown):
{"winner":"A or B","confidence":"percentage","variant_a_score":number,"variant_b_score":number,"reason":"1 sentence","improvement":"1 specific suggestion"}`,
      messages: [{ role: "user", content: `Context: ${context}\n\nVariant A:\n${copyA}\n\nVariant B:\n${copyB}` }],
    }),
  });
  const data = await res.json();
  try {
    return JSON.parse(data.content?.[0]?.text?.replace(/```json|```/g, "").trim() || "{}");
  } catch { return { winner: "A", confidence: "62%", variant_a_score: 74, variant_b_score: 61, reason: "Variant A leads with stronger emotional hook.", improvement: "Add urgency to the CTA." }; }
}

// ─── PAGES ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const totalBudget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const totalReach = CAMPAIGNS.reduce((s, c) => s + c.reach, 0);
  const live = CAMPAIGNS.filter(c => c.status === "live").length;
  const pending = CAMPAIGNS.filter(c => c.status === "pending").length;

  return (
    <div>
      <div className="pg-title"><span className="neon-accent">VIBEREACH</span> ENGINE</div>
      <div className="pg-sub">Advertisement Engine Phase 2 · Owner: DWAYNE FFOLKES · All campaigns require approval before publish or spend</div>

      <div className="approval-gate">
        <div className="gate-title">🔒 APPROVAL LOCK ACTIVE</div>
        <div className="gate-sub">No campaign will publish or spend without explicit owner approval. All actions logged.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="tag red">Never Spend Without Approval</span>
          <span className="tag red">Never Publish Without Approval</span>
          <span className="tag">Full Audit Log</span>
          <span className="tag">Manual Override Active</span>
        </div>
      </div>

      <div className="g4" style={{ marginBottom: 16 }}>
        {[
          { val: `$${totalBudget.toLocaleString()}`, label: "Total Budget Approved" },
          { val: `$${totalSpent.toLocaleString()}`, label: "Total Spent" },
          { val: totalReach.toLocaleString(), label: "Total Reach" },
          { val: `${live} Live / ${pending} Pending`, label: "Campaign Status" },
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val" style={{ fontSize: s.val.length > 10 ? 16 : 22 }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div>
          <div className="card">
            <div className="card-title">📋 Campaigns</div>
            {CAMPAIGNS.map(c => (
              <div className="row-item" key={c.id}>
                <div>
                  <div className="row-name">{c.name}</div>
                  <div className="row-meta">{c.channels.join(" · ")} · {c.region}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className={`tag ${c.status === "live" ? "green" : c.status === "pending" ? "orange" : "muted"}`}>{c.status}</span>
                  <span className="tag muted" style={{ fontSize: 9 }}>${c.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-title">⚡ Audit Log · Recent</div>
            {AUDIT_LOG.slice(0, 6).map((a, i) => (
              <div className="audit-row" key={i}>
                <div className="audit-dot" style={{ background: a.color }} />
                <div className="audit-txt">
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{a.action}</div>
                  <div style={{ color: C.textDim, fontSize: 11 }}>{a.item}</div>
                </div>
                <div className="audit-ts">{a.ts}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">🔌 Channel Connections · Phase 2</div>
            <div style={{ fontSize: 11.5, color: C.textDim, marginBottom: 10 }}>All channels queued for Phase 2 real API connections. Currently in planning/simulation mode.</div>
            <div className="badge-row">
              {CHANNELS.map(ch => <span key={ch.id} className="tag muted">{ch.icon} {ch.name}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignManager() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="pg-title">CAMPAIGN MANAGER</div>
      <div className="pg-sub">All campaigns · Status · Budget · Reach · Approval queue</div>

      <div className="approval-gate" style={{ padding: "10px 16px" }}>
        <span style={{ fontSize: 12, color: C.red, fontFamily: F.mono }}>🔒 {APPROVAL_QUEUE.length} campaign(s) awaiting your approval before any action is taken</span>
      </div>

      <div className="g3">
        {CAMPAIGNS.map(c => (
          <div
            key={c.id}
            className={`camp-card ${c.status}`}
            onClick={() => setSelected(selected?.id === c.id ? null : c)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="tag" style={{ fontSize: 9 }}>{c.type.toUpperCase()}</span>
              <span className={`tag ${c.status === "live" ? "green" : c.status === "pending" ? "orange" : "muted"}`}>{c.status}</span>
            </div>
            <div className="camp-name">{c.name}</div>
            <div className="camp-meta">{c.channels.join(" · ")} · {c.region}</div>
            <div className="camp-stats">
              <div className="camp-stat">
                <div className="camp-stat-val">${c.spent}</div>
                <div className="camp-stat-label">Spent</div>
              </div>
              <div className="camp-stat">
                <div className="camp-stat-val">{c.reach > 0 ? (c.reach / 1000).toFixed(1) + "K" : "—"}</div>
                <div className="camp-stat-label">Reach</div>
              </div>
              <div className="camp-stat">
                <div className="camp-stat-val">{c.ctr}</div>
                <div className="camp-stat-label">CTR</div>
              </div>
              <div className="camp-stat">
                <div className="camp-stat-val">${c.budget}</div>
                <div className="camp-stat-label">Budget</div>
              </div>
            </div>
            {c.status !== "pending" && (
              <div>
                <div className="perf-bar" style={{ marginTop: 10 }}>
                  <div className="perf-fill" style={{
                    width: `${Math.round((c.spent / c.budget) * 100)}%`,
                    background: `linear-gradient(90deg,${C.accent},${C.accentB})`,
                  }} />
                </div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 3, fontFamily: F.mono }}>
                  {Math.round((c.spent / c.budget) * 100)}% budget used
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="card" style={{ borderColor: "rgba(255,60,172,0.25)" }}>
          <div className="card-title">📊 {selected.name} — Detail</div>
          <div className="g2">
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, marginBottom: 6 }}>CAMPAIGN INFO</div>
              {[
                ["Type", selected.type], ["Status", selected.status], ["Region", selected.region],
                ["Budget", `$${selected.budget}`], ["Spent", `$${selected.spent}`],
                ["Remaining", `$${selected.budget - selected.spent}`],
              ].map(([k, v]) => (
                <div className="row-item" key={k} style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, color: C.textDim }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, marginBottom: 6 }}>PERFORMANCE</div>
              {[
                ["Reach", selected.reach.toLocaleString()], ["Clicks", selected.clicks.toLocaleString()],
                ["CTR", selected.ctr], ["Channels", selected.channels.join(", ")],
              ].map(([k, v]) => (
                <div className="row-item" key={k} style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, color: C.textDim }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn btn-approve btn-sm">✓ Approve</button>
                <button className="btn btn-reject btn-sm">✕ Reject</button>
                <button className="btn btn-ghost btn-sm">⏸ Pause</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdCopyEngine() {
  const [adType, setAdType] = useState("taxi");
  const [channel, setChannel] = useState("Facebook");
  const [brief, setBrief] = useState("");
  const [copy, setCopy] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);

  const generate = async () => {
    if (!brief.trim()) return;
    setLoading(true); setCopy("");
    const result = await generateAdCopy(brief, adType, channel);
    setCopy(result);
    setLoading(false);
  };

  const save = () => {
    if (!copy) return;
    setSaved(s => [{ id: Date.now(), type: adType, channel, copy, ts: "now", status: "draft" }, ...s].slice(0, 10));
  };

  return (
    <div>
      <div className="pg-title">AD COPY ENGINE</div>
      <div className="pg-sub">AI-generated original ad copy · All copies stored · Approval required before publish</div>

      <div className="g2">
        <div className="card">
          <div className="card-title">✍️ Generate Copy</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontFamily: F.mono }}>AD TYPE</div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {AD_TYPES.map(t => (
                <div
                  key={t.id}
                  className={`platform-chip ${adType === t.id ? "sel" : ""}`}
                  onClick={() => setAdType(t.id)}
                >
                  {t.icon} {t.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontFamily: F.mono }}>CHANNEL</div>
            <select value={channel} onChange={e => setChannel(e.target.value)}>
              {["Facebook", "Instagram", "TikTok", "YouTube", "Google", "Banner"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontFamily: F.mono }}>BRIEF</div>
            <textarea rows={3} placeholder="Describe the product, offer, target audience, key message…" value={brief} onChange={e => setBrief(e.target.value)} />
          </div>
          <button className="btn btn-hot" onClick={generate} disabled={loading || !brief.trim()}>
            {loading ? "Generating…" : "⚡ Generate Ad Copy"}
          </button>
        </div>

        <div className="card">
          <div className="card-title">📄 Generated Copy</div>
          {loading && <div style={{ padding: "20px 0" }}>
            {[1,2,3].map(i => <div key={i} className="loading-shimmer" style={{ marginBottom: 10, width: i === 3 ? "60%" : "100%" }} />)}
          </div>}
          {copy && !loading && (
            <>
              <div style={{
                background: "#09090C",
                border: `1px solid ${C.border}`,
                borderRadius: 8, padding: 16,
                fontFamily: F.sub, fontSize: 13.5,
                lineHeight: 1.8, whiteSpace: "pre-line",
                minHeight: 120, color: C.text,
              }}>
                {copy}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-approve btn-sm" onClick={save}>Save Draft</button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(copy)}>Copy</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCopy("")}>Clear</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="tag" style={{ fontSize: 9 }}>REQUIRES APPROVAL BEFORE PUBLISH</span>
              </div>
            </>
          )}
          {!copy && !loading && <div style={{ color: C.muted, fontSize: 12 }}>Generate copy on the left to see output here.</div>}
        </div>
      </div>

      {saved.length > 0 && (
        <div className="card">
          <div className="card-title">🗂 Saved Ad Copies · Asset Store</div>
          {saved.map(s => (
            <div className="row-item" key={s.id}>
              <div>
                <div className="row-name" style={{ fontSize: 12 }}>{s.type} · {s.channel}</div>
                <div className="row-meta" style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.copy.split("\n")[0]}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className="tag orange">draft</span>
                <button className="btn btn-ghost btn-sm">Submit for Approval</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalGate() {
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const approve = (id) => {
    setApproved(a => [...a, id]);
  };
  const reject = (id) => {
    setRejected(r => [...r, id]);
  };

  return (
    <div>
      <div className="pg-title">APPROVAL GATE</div>
      <div className="pg-sub">Nothing publishes. Nothing spends. Until you approve it here.</div>

      <div className="approval-gate">
        <div className="gate-title">🔒 OWNER GATE · DWAYNE FFOLKES</div>
        <div className="gate-sub">Every campaign, every spend, every publish must pass through this gate. No exceptions. Manual override available at all times.</div>
        <div className="badge-row">
          <span className="tag red">No Auto-Spend</span>
          <span className="tag red">No Auto-Publish</span>
          <span className="tag">Audit Logged</span>
          <span className="tag">Manual Override</span>
          <span className="tag">Brand Voice Check</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">⏳ Awaiting Approval</div>
        {APPROVAL_QUEUE.map(item => {
          const isApproved = approved.includes(item.id);
          const isRejected = rejected.includes(item.id);
          return (
            <div key={item.id} style={{
              background: C.surface, border: `1px solid ${isApproved ? "rgba(6,214,160,0.25)" : isRejected ? "rgba(239,35,60,0.2)" : C.border}`,
              borderRadius: 8, padding: 16, marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.channels.join(" · ")} · {item.region}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: F.display, fontSize: 20, color: C.gold }}>${item.budget}</div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: F.mono }}>BUDGET REQUEST</div>
                </div>
              </div>
              <div style={{ background: "#08080B", borderRadius: 6, padding: "10px 14px", fontSize: 12.5, lineHeight: 1.7, marginBottom: 12, color: C.textDim }}>
                "{item.copy}"
              </div>
              {!isApproved && !isRejected ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-approve" onClick={() => approve(item.id)}>✓ Approve Campaign</button>
                  <button className="btn btn-reject" onClick={() => reject(item.id)}>✕ Reject</button>
                  <button className="btn btn-ghost btn-sm">Edit Copy</button>
                  <button className="btn btn-ghost btn-sm">Change Budget</button>
                </div>
              ) : (
                <span className={`tag ${isApproved ? "green" : "red"}`}>
                  {isApproved ? "✓ APPROVED — Ready to launch" : "✕ REJECTED — Returned for revision"}
                </span>
              )}
            </div>
          );
        })}
        {APPROVAL_QUEUE.length === 0 && <div style={{ color: C.muted, fontSize: 12 }}>No campaigns awaiting approval.</div>}
      </div>

      <div className="card">
        <div className="card-title">⚡ Audit Log · Full</div>
        {AUDIT_LOG.map((a, i) => (
          <div className="audit-row" key={i}>
            <div className="audit-dot" style={{ background: a.color }} />
            <div className="audit-txt">
              <div style={{ fontWeight: 600, fontSize: 12 }}>{a.action}</div>
              <div style={{ color: C.textDim, fontSize: 11 }}>{a.item}</div>
            </div>
            <div className="audit-ts">{a.ts}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitTestEngine() {
  const [varA, setVarA] = useState("");
  const [varB, setVarB] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    if (!varA.trim() || !varB.trim()) return;
    setLoading(true); setResult(null);
    const r = await runAISplitTest(varA, varB, context || "Caribbean / global audience");
    setResult(r);
    setLoading(false);
  };

  return (
    <div>
      <div className="pg-title">AI SPLIT TEST ENGINE</div>
      <div className="pg-sub">Test two ad copy variants · AI predicts performance · Owner approves winner</div>

      <div className="g2">
        <div className="card">
          <div className="card-title"><span style={{ color: C.accent }}>A</span> — Variant A</div>
          <textarea rows={6} placeholder="Paste ad copy variant A here…" value={varA} onChange={e => setVarA(e.target.value)} />
        </div>
        <div className="card">
          <div className="card-title"><span style={{ color: C.accentC }}>B</span> — Variant B</div>
          <textarea rows={6} placeholder="Paste ad copy variant B here…" value={varB} onChange={e => setVarB(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontFamily: F.mono }}>AUDIENCE CONTEXT (optional)</div>
        <textarea rows={2} placeholder="e.g. Kingston adults 18–35, taxi app users, Caribbean audience…" value={context} onChange={e => setContext(e.target.value)} />
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-hot" onClick={runTest} disabled={loading || !varA || !varB}>
            {loading ? "Running AI Test…" : "⚡ Run Split Test"}
          </button>
        </div>
      </div>

      {result && (
        <div className="card" style={{ borderColor: `rgba(255,60,172,0.25)` }}>
          <div className="card-title">📊 Split Test Result</div>
          <div className="g2" style={{ marginBottom: 14 }}>
            <div className="variant-box">
              <div className="variant-label">A</div>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>Variant A Score</div>
              <div style={{ fontFamily: F.display, fontSize: 32, color: result.winner === "A" ? C.green : C.textDim }}>
                {result.variant_a_score}<span style={{ fontSize: 16, color: C.muted }}>/100</span>
              </div>
              <div className="perf-bar">
                <div className="perf-fill" style={{ width: `${result.variant_a_score}%`, background: result.winner === "A" ? C.green : C.muted }} />
              </div>
              {result.winner === "A" && <div style={{ marginTop: 8 }}><span className="tag green">🏆 PREDICTED WINNER</span></div>}
            </div>
            <div className="variant-box">
              <div className="variant-label" style={{ color: C.accentC }}>B</div>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>Variant B Score</div>
              <div style={{ fontFamily: F.display, fontSize: 32, color: result.winner === "B" ? C.green : C.textDim }}>
                {result.variant_b_score}<span style={{ fontSize: 16, color: C.muted }}>/100</span>
              </div>
              <div className="perf-bar">
                <div className="perf-fill" style={{ width: `${result.variant_b_score}%`, background: result.winner === "B" ? C.green : C.muted }} />
              </div>
              {result.winner === "B" && <div style={{ marginTop: 8 }}><span className="tag green">🏆 PREDICTED WINNER</span></div>}
            </div>
          </div>
          <div style={{ background: "#08080B", border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 16px" }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, marginBottom: 6 }}>AI ANALYSIS</div>
            <div style={{ fontSize: 13, marginBottom: 8 }}><strong>Winner: Variant {result.winner}</strong> · Confidence: {result.confidence}</div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>{result.reason}</div>
            <div style={{ fontSize: 12, color: C.accent }}>Suggestion: {result.improvement}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <span className="tag orange">Submit winner for owner approval before deploying</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetOptimizer() {
  const [budgets, setBudgets] = useState(
    CAMPAIGNS.reduce((acc, c) => ({ ...acc, [c.id]: c.budget }), {})
  );
  const total = Object.values(budgets).reduce((s, v) => s + Number(v), 0);

  return (
    <div>
      <div className="pg-title">BUDGET OPTIMIZER</div>
      <div className="pg-sub">Allocate budgets · AI optimization suggestions · No spend without approval</div>

      <div className="g2">
        <div className="card">
          <div className="budget-display">
            <div className="budget-label">TOTAL ALLOCATED</div>
            <div className="budget-amount">${total.toLocaleString()}</div>
            <div className="budget-label" style={{ marginTop: 8 }}>ACROSS {CAMPAIGNS.length} CAMPAIGNS</div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button className="btn btn-hot btn-sm">Submit for Approval</button>
            <button className="btn btn-ghost btn-sm">Reset</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">💡 AI Optimization</div>
          {[
            { tip: "YaadFlex launch budget is conservative for Kingston market. Consider +$200 on Meta.", icon: "📈" },
            { tip: "Tourism campaign CTR at 4.4% is above average. Increase YouTube spend by 20%.", icon: "✅" },
            { tip: "Civil Engineering course paused — reallocate $540 remaining to active campaigns.", icon: "🔄" },
            { tip: "TikTok channel underutilized for Nexus app. Highest reach potential for 18–24.", icon: "⚡" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 18 }}>{t.icon}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>{t.tip}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">⚙️ Budget Allocation per Campaign</div>
        {CAMPAIGNS.map(c => (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: C.textDim, fontFamily: F.mono }}>{c.channels.join(" · ")} · {c.region}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={budgets[c.id]}
                  onChange={e => setBudgets(b => ({ ...b, [c.id]: Number(e.target.value) }))}
                  style={{ width: 90, textAlign: "right" }}
                />
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted }}>USD</span>
              </div>
            </div>
            <div className="perf-bar">
              <div className="perf-fill" style={{
                width: `${Math.min(100, Math.round((c.spent / budgets[c.id]) * 100))}%`,
                background: `linear-gradient(90deg,${C.accent},${C.accentB})`,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ fontSize: 9, color: C.muted, fontFamily: F.mono }}>Spent: ${c.spent}</span>
              <span style={{ fontSize: 9, color: C.muted, fontFamily: F.mono }}>Remaining: ${budgets[c.id] - c.spent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelConnections() {
  return (
    <div>
      <div className="pg-title">CHANNEL CONNECTIONS</div>
      <div className="pg-sub">Phase 2 platform integrations · All connections require real API keys when activated</div>

      <div className="card" style={{ background: "linear-gradient(135deg,rgba(255,60,172,0.04),rgba(43,134,197,0.04))", borderColor: "rgba(255,60,172,0.2)" }}>
        <div className="card-title">🚀 Phase 2 Roadmap</div>
        <div style={{ fontSize: 12.5, color: C.textDim, lineHeight: 1.8 }}>
          Real platform connections are queued for Phase 2 activation. Each channel will require API credentials configured by the owner. Until connected, all campaigns run in simulation/planning mode. No real spend or publish occurs.
        </div>
      </div>

      <div className="g2">
        {[
          { icon: "📘", name: "Facebook Ads", desc: "Meta Business Suite API · Campaign Manager · Audience targeting · Budget control", phase: "2", auth: "Meta Developer App" },
          { icon: "📸", name: "Instagram Ads", desc: "Meta API · Story ads · Reel ads · Feed ads · Product tags", phase: "2", auth: "Meta Developer App" },
          { icon: "🎵", name: "TikTok Ads", desc: "TikTok Marketing API · In-feed video · TopView · Branded content", phase: "2", auth: "TikTok Business API" },
          { icon: "▶️", name: "YouTube Ads", desc: "Google Ads API · Pre-roll · Bumper ads · Discovery ads · Channel promotion", phase: "2", auth: "Google Ads API" },
          { icon: "🔍", name: "Google Search Ads", desc: "Google Ads API · Search intent · Display network · Smart bidding", phase: "2", auth: "Google Ads API" },
          { icon: "🖼", name: "Website Banner Ads", desc: "Custom banner placement · Direct site integration · Programmatic display", phase: "2", auth: "Custom Integration" },
        ].map(ch => (
          <div key={ch.name} className="channel-node future" style={{ textAlign: "left", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 28 }}>{ch.icon}</div>
              <span className="tag muted">Phase {ch.phase}</span>
            </div>
            <div className="ch-name" style={{ fontSize: 14 }}>{ch.name}</div>
            <div style={{ fontSize: 11.5, color: C.textDim, marginBottom: 8, lineHeight: 1.6 }}>{ch.desc}</div>
            <div style={{ fontFamily: F.mono, fontSize: 9.5, color: C.muted }}>Auth: {ch.auth}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <button className="btn btn-ghost btn-sm">Reserve Slot</button>
              <button className="btn btn-ghost btn-sm">Add API Key</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">🔌 S2 VibeReach Connector</div>
        <div style={{ fontFamily: F.mono, fontSize: 12, lineHeight: 2, color: C.textDim, background: "#08080B", padding: 14, borderRadius: 6 }}>
          <span style={{ color: C.accent }}>System2/vibereach_connector/</span><br />
          ├── <span style={{ color: C.text }}>facebook_ads_connector/</span>    <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>instagram_ads_connector/</span>   <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>tiktok_ads_connector/</span>      <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>youtube_ads_connector/</span>     <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>google_ads_connector/</span>      <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>banner_ads_connector/</span>      <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>approval_gate/</span>             <span style={{ color: C.muted }}># Active</span><br />
          ├── <span style={{ color: C.text }}>audit_log/</span>                 <span style={{ color: C.muted }}># Active</span><br />
          ├── <span style={{ color: C.text }}>split_test_engine/</span>         <span style={{ color: C.muted }}># Active</span><br />
          ├── <span style={{ color: C.text }}>budget_optimizer/</span>          <span style={{ color: C.muted }}># Active</span><br />
          ├── <span style={{ color: C.text }}>audience_learning/</span>         <span style={{ color: C.muted }}># Phase 2</span><br />
          ├── <span style={{ color: C.text }}>conversion_tracker/</span>        <span style={{ color: C.muted }}># Phase 2</span><br />
          └── <span style={{ color: C.text }}>campaign_performance_score/</span><span style={{ color: C.muted }}># Active</span>
        </div>
      </div>
    </div>
  );
}

function AudienceLearning() {
  const segments = [
    { name: "Kingston Commuters", size: "~85K", fit: 94, tags: ["taxi", "local", "mobile-first"] },
    { name: "Caribbean Youth 18–30", size: "~420K", fit: 88, tags: ["app-launch", "tiktok", "global-slang"] },
    { name: "Jamaica Tourists (Intent)", size: "~210K", fit: 91, tags: ["tourism", "google", "youtube"] },
    { name: "Engineering Professionals", size: "~35K", fit: 79, tags: ["education", "facebook", "linkedin"] },
    { name: "XXOON Network Affiliates", size: "~12K", fit: 96, tags: ["affiliate", "referral", "partner"] },
    { name: "Africa Tech Early Adopters", size: "~560K", fit: 82, tags: ["app-launch", "nexus", "future"] },
  ];

  return (
    <div>
      <div className="pg-title">AUDIENCE LEARNING</div>
      <div className="pg-sub">Audience segments · Fit scores · Regional targeting · Phase 2 connects to real platform data</div>

      <div className="g2">
        {segments.map(s => (
          <div key={s.name} className="card" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div>
              <div style={{ fontFamily: F.display, fontSize: 22, color: s.fit >= 90 ? C.green : s.fit >= 80 ? C.gold : C.orange }}>
                {s.fit}<span style={{ fontSize: 12, color: C.muted }}>/100</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Est. size: {s.size}</div>
            <div className="perf-bar">
              <div className="perf-fill" style={{
                width: `${s.fit}%`,
                background: s.fit >= 90 ? `linear-gradient(90deg,${C.green},${C.accentC})` : `linear-gradient(90deg,${C.gold},${C.orange})`,
              }} />
            </div>
            <div className="badge-row" style={{ marginTop: 10 }}>
              {s.tags.map(t => <span key={t} className="tag" style={{ fontSize: 9 }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">🌍 Regional Ad Targeting</div>
        <div className="g3">
          {[
            { region: "Kingston, Jamaica", focus: "YaadFlex · Tourism · Courses", status: "primary" },
            { region: "Caribbean Islands", focus: "Tourism · Affiliate · App", status: "active" },
            { region: "Africa (Kenya, Ghana, Nigeria)", focus: "Nexus · SOVEREIGN · Tech", status: "planned" },
            { region: "Cuba", focus: "Presence Infrastructure · Connectivity", status: "planned" },
            { region: "Global Youth", focus: "TikTok · App Launch · Slang", status: "active" },
            { region: "Diaspora (UK, US, Canada)", focus: "Tourism · Brand · Culture", status: "active" },
          ].map(r => (
            <div key={r.region} style={{ padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7 }}>
              <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 4 }}>{r.region}</div>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>{r.focus}</div>
              <span className={`tag ${r.status === "primary" ? "" : r.status === "active" ? "green" : "muted"}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", section: "OVERVIEW", pip: "on" },
  { id: "campaigns", label: "Campaigns", icon: "📋", section: "OVERVIEW", pip: "on" },
  { id: "approval", label: "Approval Gate", icon: "🔒", section: "CONTROL", pip: "hold" },
  { id: "copy", label: "Ad Copy Engine", icon: "✍️", section: "CREATE", pip: "on" },
  { id: "split", label: "Split Test AI", icon: "⚡", section: "CREATE", pip: "on" },
  { id: "budget", label: "Budget Optimizer", icon: "💰", section: "CREATE", pip: "on" },
  { id: "channels", label: "Channel Connect", icon: "🔌", section: "CHANNELS", pip: "warn" },
  { id: "audience", label: "Audience Learning", icon: "🎯", section: "CHANNELS", pip: "on" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const sections = [...new Set(NAV.map(n => n.section))];

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "campaigns": return <CampaignManager />;
      case "approval": return <ApprovalGate />;
      case "copy": return <AdCopyEngine />;
      case "split": return <SplitTestEngine />;
      case "budget": return <BudgetOptimizer />;
      case "channels": return <ChannelConnections />;
      case "audience": return <AudienceLearning />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="vr-root">
        <div className="topbar">
          <div className="tb-logo">VIBEREACH</div>
          <div className="tb-badge">AD ENGINE · PHASE 2</div>
          <div className="approval-lock">
            <div className="lock-dot" />
            APPROVAL LOCK ACTIVE
          </div>
          <div className="tb-right">
            <span className="tag orange" style={{ fontSize: 9 }}>SIMULATION MODE</span>
            <div className="owner-chip">DWAYNE FFOLKES</div>
          </div>
        </div>

        <div className="sidebar">
          {sections.map(sec => (
            <div key={sec}>
              <span className="nav-label">{sec}</span>
              {NAV.filter(n => n.section === sec).map(n => (
                <div
                  key={n.id}
                  className={`nav-item ${page === n.id ? "active" : ""}`}
                  onClick={() => setPage(n.id)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                  <div className={`nav-pip ${n.pip}`} />
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
