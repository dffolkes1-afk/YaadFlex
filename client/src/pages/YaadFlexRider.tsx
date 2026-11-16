import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: MEMORY SYSTEM
//  When ready — plug your memory module in here.
//  This function receives the rider's session and returns stored preferences,
//  saved places, and past trip context.
//  Replace the return below with your memory engine call.
// ─────────────────────────────────────────────────────────────────────────────
async function MEMORY_SLOT(riderId) {
  // ── CONNECT YOUR MEMORY SYSTEM HERE ──
  // Example: return await MemoryCore.recall(riderId);
  return {
    name: "Dwayne",
    savedPlaces: [],
    lastDestination: null,
    preferences: { defaultService: 0 },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: AI ASSISTANT
//  When ready — plug your AI layer in here.
//  This receives the rider's message and returns a smart reply.
//  Replace the return below with your AI engine call.
// ─────────────────────────────────────────────────────────────────────────────
async function AI_SLOT(message, context) {
  // ── CONNECT YOUR AI ENGINE HERE ──
  // Example: return await RiderAI.respond(message, context);
  return {
    reply: "AI assistant coming soon. Your slot is ready.",
    suggestion: null,
    action: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: DISPATCH ENGINE
//  When ready — plug your live dispatch system here.
//  Receives trip request, returns matched driver.
// ─────────────────────────────────────────────────────────────────────────────
async function DISPATCH_SLOT(tripRequest) {
  // ── CONNECT YOUR DISPATCH ENGINE HERE ──
  // Example: return await DispatchRouter.request(tripRequest);
  return {
    driver: { name: "Marcus T.", vehicle: "Toyota Corolla", plate: "PBL 4821", rating: 4.97, eta: 4 },
    tripId: "YF-" + Date.now(),
    fare: 850,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: PAYMENT ENGINE
//  When ready — connect your payment layer here.
// ─────────────────────────────────────────────────────────────────────────────
async function PAYMENT_SLOT(amount, method) {
  // ── CONNECT YOUR PAYMENT SYSTEM HERE ──
  // Example: return await PaymentLayer.charge(amount, method);
  return { success: true, receipt: "RCP-" + Date.now() };
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root {
  --bg:    #0A0A0A;
  --s1:    #141414;
  --s2:    #1C1C1C;
  --line:  rgba(255,255,255,0.07);
  --white: #F5F5F5;
  --soft:  #606060;
  --dim:   #2E2E2E;
  --gold:  #C9A84C;
}

html,body {
  background: #060606;
  font-family: 'Inter', sans-serif;
  color: var(--white);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
}

/* ── Shell ── */
.shell {
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── Status bar ── */
.sbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px 0;
  font-size: 12px;
  font-weight: 500;
}

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px 16px;
  border-bottom: 1px solid var(--line);
}
.h-brand {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.h-brand span { color: var(--gold); }
.h-right { display: flex; align-items: center; gap: 10px; }
.h-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--s1);
  border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; cursor: pointer;
}

/* ── Scroll content ── */
.scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  padding-bottom: 90px;
}
.scroll::-webkit-scrollbar { display: none; }

/* ── Greeting ── */
.greeting {
  padding: 24px 22px 22px;
  border-bottom: 1px solid var(--line);
}
.g-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.8px;
  margin-bottom: 4px;
  line-height: 1.15;
}
.g-name em { color: var(--gold); font-style: normal; }
.g-sub { font-size: 13px; color: var(--soft); }

/* ── Map ── */
.map-wrap {
  margin: 20px 22px 0;
  height: 185px;
  border-radius: 14px;
  background: #111;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 28px 28px;
}
.map-roads {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 2px, transparent 2px);
  background-size: 84px 84px;
  background-position: 12px 12px;
}
.map-pin {
  width: 11px; height: 11px;
  background: var(--white);
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(255,255,255,0.08), 0 0 20px rgba(255,255,255,0.12);
  animation: breathe 2.5s ease-in-out infinite;
}
@keyframes breathe {
  0%,100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.06), 0 0 16px rgba(255,255,255,0.1); }
  50%      { box-shadow: 0 0 0 10px rgba(255,255,255,0.03), 0 0 28px rgba(255,255,255,0.18); }
}
.map-car {
  position: absolute;
  font-size: 17px;
  animation: drift 5s ease-in-out infinite;
}
@keyframes drift {
  0%   { transform: translate(-44px, 14px) rotate(-4deg); }
  50%  { transform: translate(24px, -12px) rotate(4deg); }
  100% { transform: translate(-44px, 14px) rotate(-4deg); }
}
.map-lbl {
  position: absolute;
  bottom: 11px; left: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255,255,255,0.25);
  letter-spacing: 1.5px;
}

/* ── Where to block ── */
.where-wrap {
  margin: 12px 22px 0;
  background: var(--s1);
  border-radius: 12px;
  overflow: hidden;
}
.where-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 18px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--line);
}
.where-row:last-child { border-bottom: none; }
.where-row:hover { background: var(--s2); }
.w-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.w-label { font-size: 14px; font-weight: 500; flex: 1; }
.w-val { font-size: 13.5px; color: var(--soft); flex: 1; }
.w-arr { color: var(--dim); font-size: 20px; }

/* ── Service picker ── */
.svc-wrap {
  display: flex;
  gap: 8px;
  margin: 12px 22px 0;
}
.svc {
  flex: 1;
  padding: 14px 8px;
  background: var(--s1);
  border: 1px solid var(--line);
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.18s;
}
.svc.on {
  background: var(--white);
  border-color: var(--white);
}
.svc.on .svc-name,
.svc.on .svc-price { color: #000; }
.svc:hover:not(.on) { background: var(--s2); }
.svc-icon { font-size: 22px; margin-bottom: 6px; }
.svc-name { font-size: 12px; font-weight: 600; margin-bottom: 3px; }
.svc-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--soft);
}

/* ── Buttons ── */
.btn {
  display: block;
  width: calc(100% - 44px);
  margin: 12px 22px 0;
  padding: 17px;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  text-align: center;
}
.btn-white { background: var(--white); color: #000; }
.btn-white:hover { background: #E8E8E8; transform: translateY(-1px); }
.btn-ghost {
  background: transparent;
  color: var(--soft);
  border: 1px solid var(--dim);
  margin-top: 8px;
}
.btn-ghost:hover { border-color: var(--soft); color: var(--white); }

/* ── Active ride ── */
.ride-card {
  margin: 18px 22px 0;
  background: var(--s1);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
.rc-map {
  height: 125px;
  background: #0E0E0E;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.rc-body { padding: 16px 18px; }
.rc-driver {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.rc-av {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--s2);
  border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.rc-name { font-size: 14px; font-weight: 600; }
.rc-meta { font-size: 12px; color: var(--soft); margin-top: 2px; }
.rc-eta { margin-left: auto; text-align: right; flex-shrink: 0; }
.rc-eta-n { font-size: 32px; font-weight: 700; line-height: 1; }
.rc-eta-l {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--soft);
  letter-spacing: 1.5px;
}
.rc-actions { display: flex; gap: 8px; }
.rc-act {
  flex: 1;
  padding: 11px 8px;
  background: var(--s2);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--white);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s;
}
.rc-act:hover { background: #252525; }

/* ── Recents ── */
.section-lbl {
  padding: 20px 22px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2.5px;
  color: var(--soft);
  text-transform: uppercase;
}
.list-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: background 0.15s;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: rgba(255,255,255,0.02); }
.lr-ic {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--s1);
  border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; flex-shrink: 0;
}
.lr-ic.r { border-radius: 50%; }
.lr-title { font-size: 13.5px; font-weight: 500; }
.lr-sub { font-size: 12px; color: var(--soft); margin-top: 2px; }
.lr-right { margin-left: auto; text-align: right; flex-shrink: 0; }
.lr-val { font-size: 14px; font-weight: 600; }
.lr-tag { font-size: 11px; color: var(--soft); margin-top: 2px; }
.lr-arr { margin-left: auto; color: var(--dim); font-size: 20px; }

/* ── Pages ── */
.page-head {
  padding: 26px 22px 20px;
  border-bottom: 1px solid var(--line);
}
.page-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 4px;
}
.page-sub { font-size: 13px; color: var(--soft); }

/* ── Wallet ── */
.wallet-top {
  padding: 36px 22px 28px;
  text-align: center;
  border-bottom: 1px solid var(--line);
}
.wt-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2.5px;
  color: var(--soft);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.wt-amt {
  font-size: 54px;
  font-weight: 700;
  letter-spacing: -2px;
  margin-bottom: 6px;
}
.wt-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--dim);
  letter-spacing: 1.5px;
}

/* ── Profile ── */
.prof-top {
  padding: 30px 22px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--line);
}
.prof-av {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: var(--s2);
  border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
}
.prof-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 3px;
}
.prof-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--soft);
  letter-spacing: 2px;
}

/* ── AI slot card (visible, dormant) ── */
.ai-slot {
  margin: 20px 22px 0;
  padding: 16px 18px;
  border: 1px dashed var(--dim);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: default;
}
.ai-slot-ic {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--s1);
  border: 1px solid var(--dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.ai-slot-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
  color: var(--soft);
}
.ai-slot-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 1px;
}

/* ── Sheet ── */
.sh-ov {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  z-index: 190;
}
.sheet {
  position: fixed; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; max-width: 390px;
  background: #111;
  border-top: 1px solid var(--line);
  border-radius: 20px 20px 0 0;
  padding: 12px 22px 100px;
  z-index: 200;
  animation: shUp 0.28s cubic-bezier(0.16,1,0.3,1);
}
@keyframes shUp {
  from { transform: translateX(-50%) translateY(100%); }
  to   { transform: translateX(-50%) translateY(0); }
}
.sh-handle {
  width: 32px; height: 3px;
  background: var(--dim);
  border-radius: 2px;
  margin: 0 auto 22px;
}
.sh-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  margin-bottom: 16px;
}
.sh-input {
  width: 100%;
  background: var(--s2);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 14px 16px;
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  margin-bottom: 10px;
  transition: border 0.15s;
}
.sh-input::placeholder { color: var(--soft); }
.sh-input:focus { border-color: rgba(255,255,255,0.18); }
.sh-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}
.sh-row:hover { opacity: 0.75; }
.sh-icon { font-size: 19px; width: 22px; text-align: center; }
.sh-name { font-size: 13.5px; font-weight: 500; flex: 1; }
.sh-eta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--soft);
}

/* ── Bottom nav ── */
.bnav {
  position: fixed; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; max-width: 390px;
  background: rgba(10,10,10,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--line);
  display: flex;
  padding: 10px 0 22px;
  z-index: 100;
}
.bn {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  cursor: pointer; padding: 4px 0;
}
.bn-i { font-size: 20px; line-height: 1; }
.bn-l {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.15s;
}

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
.fade { animation: fadeUp 0.2s ease both; }

/* ── Bar ── */
.bar { height: 2px; background: var(--s2); border-radius: 1px; margin-top: 8px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 1px; background: var(--white); transition: width 0.8s ease; }

/* ── Responsive ── */
@media (min-width: 420px) {
  .shell {
    border-radius: 40px;
    border: 1px solid rgba(255,255,255,0.07);
    min-height: auto;
    height: 860px;
    max-height: 880px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.95);
    margin: 24px auto;
    overflow: hidden;
  }
  .bnav { border-radius: 0 0 40px 40px; }
  html,body { align-items: center; padding: 20px; }
}
`;

// ── Static data (replace with live data when backend connects) ────────────────
const QUICK_DEST = [
  { icon:"🏢", name:"New Kingston",          dist:"8.2 km",  eta:"14 min" },
  { icon:"✈️", name:"Norman Manley Airport", dist:"18.4 km", eta:"28 min" },
  { icon:"🏪", name:"Sovereign Centre",      dist:"4.1 km",  eta:"9 min"  },
  { icon:"🏖", name:"Portmore",              dist:"22 km",   eta:"35 min" },
];

const SERVICES = [
  { icon:"🚗", name:"Standard", price:"~$500"   },
  { icon:"🏎", name:"Premium",  price:"~$900"   },
  { icon:"🚐", name:"XL",       price:"~$1,200" },
];

const TRIP_HISTORY = [
  { to:"New Kingston",          by:"Marcus T.",  price:"$850",   when:"Today"      },
  { to:"Norman Manley Airport", by:"Devon R.",   price:"$2,100", when:"Yesterday"  },
  { to:"Sovereign Centre",      by:"Andre M.",   price:"$600",   when:"Monday"     },
  { to:"Half Way Tree",         by:"Ryan C.",    price:"$500",   when:"Sunday"     },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => {
      const n = new Date();
      setT(n.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:false }));
    };
    f();
    const id = setInterval(f, 10000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useMem() {
  const [mem, setMem] = useState({ name:"...", preferences:{ defaultService:0 } });
  useEffect(() => {
    MEMORY_SLOT("rider_001").then(setMem).catch(() => {});
  }, []);
  return mem;
}

// ── Components ────────────────────────────────────────────────────────────────
function StatusBar({ time }) {
  return (
    <div className="sbar">
      <span style={{ fontWeight:600 }}>{time}</span>
      <span style={{ fontSize:12, opacity:0.4 }}>▲▲▲ WiFi ●●●●</span>
    </div>
  );
}

function AISlot({ page }) {
  // ── This is where your AI assistant will appear when plugged in ──
  // Currently dormant — slot is visible and ready.
  return (
    <div className="ai-slot">
      <div className="ai-slot-ic">🤖</div>
      <div>
        <div className="ai-slot-label">AI Assistant</div>
        <div className="ai-slot-sub">SLOT READY · CONNECT AI ENGINE</div>
      </div>
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function Home({ mem, onNavProfile }) {
  const [svc,     setSvc]     = useState(mem.preferences?.defaultService || 0);
  const [showDest,setShowDest]= useState(false);
  const [showSvc, setShowSvc] = useState(false);
  const [booked,  setBooked]  = useState(false);
  const [loading, setLoading] = useState(false);

  const requestRide = async () => {
    setLoading(true);
    const result = await DISPATCH_SLOT({
      service: SERVICES[svc].name,
      riderId: "rider_001",
    });
    setLoading(false);
    setBooked(result);
    setShowSvc(false);
  };

  return (
    <div className="fade">
      {showDest && <div className="sh-ov" onClick={() => setShowDest(false)} />}
      {showDest && (
        <div className="sheet">
          <div className="sh-handle" />
          <div className="sh-title">Where to?</div>
          <input className="sh-input" placeholder="Search a destination…" autoFocus />
          <input className="sh-input" placeholder="Pickup · Current location" defaultValue="Kingston, Jamaica" />
          {QUICK_DEST.map(q => (
            <div className="sh-row" key={q.name}
              onClick={() => { setShowDest(false); setShowSvc(true); }}>
              <div className="sh-icon">{q.icon}</div>
              <div className="sh-name">{q.name}</div>
              <div className="sh-eta">{q.eta}</div>
            </div>
          ))}
        </div>
      )}

      {/* Greeting */}
      <div className="greeting">
        <div className="g-name">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},<br />
          <em>{mem.name || "..."}</em>
        </div>
        <div className="g-sub">Where are you headed?</div>
      </div>

      {/* Active ride */}
      {booked ? (
        <div className="ride-card">
          <div className="rc-map">
            <div className="map-grid" />
            <div className="map-roads" />
            <div className="map-car">🚗</div>
            <div className="map-pin" style={{ position:"absolute" }} />
            <div className="map-lbl">LIVE</div>
          </div>
          <div className="rc-body">
            <div className="rc-driver">
              <div className="rc-av">👤</div>
              <div>
                <div className="rc-name">{booked.driver?.name}</div>
                <div className="rc-meta">{booked.driver?.vehicle} · {booked.driver?.plate} · ★ {booked.driver?.rating}</div>
              </div>
              <div className="rc-eta">
                <div className="rc-eta-n">{booked.driver?.eta}</div>
                <div className="rc-eta-l">MIN</div>
              </div>
            </div>
            <div className="rc-actions">
              <div className="rc-act">📞 Call</div>
              <div className="rc-act">💬 Message</div>
              <div className="rc-act" onClick={() => setBooked(false)}>✕ Cancel</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Map */}
          <div className="map-wrap">
            <div className="map-grid" />
            <div className="map-roads" />
            <div className="map-pin" />
            <div className="map-lbl">KINGSTON, JA</div>
          </div>

          {/* Where to */}
          <div className="where-wrap">
            <div className="where-row" onClick={() => setShowDest(true)}>
              <div className="w-dot" style={{ background:"var(--white)" }} />
              <div className="w-label">Where to?</div>
              <div className="w-arr">›</div>
            </div>
            <div className="where-row">
              <div className="w-dot" style={{ background:"var(--dim)" }} />
              <div className="w-val">Current location · Kingston</div>
            </div>
          </div>

          {/* Service picker — only appears after destination chosen */}
          {showSvc && (
            <>
              <div className="svc-wrap">
                {SERVICES.map((s, i) => (
                  <div key={s.name}
                    className={`svc ${svc === i ? "on" : ""}`}
                    onClick={() => setSvc(i)}>
                    <div className="svc-icon">{s.icon}</div>
                    <div className="svc-name">{s.name}</div>
                    <div className="svc-price">{s.price} JMD</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-white" onClick={requestRide} disabled={loading}>
                {loading ? "Connecting…" : `Request ${SERVICES[svc].name}`}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowSvc(false)}>
                Cancel
              </button>
            </>
          )}
        </>
      )}

      {/* AI Slot — dormant until engine connected */}
      <AISlot page="home" />

      {/* Recent destinations */}
      <div className="section-lbl">Recent</div>
      {QUICK_DEST.map(q => (
        <div className="list-row" key={q.name}
          onClick={() => setShowSvc(true)}>
          <div className="lr-ic">{q.icon}</div>
          <div>
            <div className="lr-title">{q.name}</div>
            <div className="lr-sub">{q.dist}</div>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--soft)" }}>
            {q.eta}
          </div>
        </div>
      ))}
    </div>
  );
}

function Trips() {
  return (
    <div className="fade">
      <div className="page-head">
        <div className="page-title">Your Trips</div>
        <div className="page-sub">Full ride history</div>
      </div>

      {/* AI Slot */}
      <AISlot page="trips" />
      <div style={{ height:8 }} />

      {TRIP_HISTORY.map((t, i) => (
        <div className="list-row" key={i}>
          <div className="lr-ic r">🚗</div>
          <div>
            <div className="lr-title">{t.to}</div>
            <div className="lr-sub">{t.by}</div>
          </div>
          <div className="lr-right">
            <div className="lr-val">{t.price}</div>
            <div className="lr-tag">{t.when}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Wallet() {
  const handleTopUp = async () => {
    // ── PAYMENT_SLOT connects here ──
    const result = await PAYMENT_SLOT(0, "wallet");
    console.log("Payment slot:", result);
  };

  return (
    <div className="fade">
      <div className="wallet-top">
        <div className="wt-lbl">Balance</div>
        <div className="wt-amt">$4,200</div>
        <div className="wt-sub">JMD</div>
      </div>
      {[
        ["➕","Top Up","Add JMD funds"],
        ["➡️","Send","Transfer to contact"],
        ["📋","Transactions","All history"],
        ["🎁","Referrals","Earn $200 per invite"],
      ].map(([ic,lb,sub]) => (
        <div className="list-row" key={lb} onClick={lb === "Top Up" ? handleTopUp : undefined}>
          <div className="lr-ic">{ic}</div>
          <div>
            <div className="lr-title">{lb}</div>
            <div className="lr-sub">{sub}</div>
          </div>
          <div className="lr-arr">›</div>
        </div>
      ))}
    </div>
  );
}

function Profile({ mem }) {
  return (
    <div className="fade">
      <div className="prof-top">
        <div className="prof-av">👤</div>
        <div>
          <div className="prof-name">{mem.name || "Rider"}</div>
          <div className="prof-tag">RIDER · KINGSTON JA</div>
        </div>
      </div>

      {/* Memory slot — shows as a section when connected */}
      <div style={{
        margin:"16px 22px 0",
        padding:"14px 16px",
        border:"1px dashed var(--dim)",
        borderRadius:12,
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div style={{
          width:34,height:34,borderRadius:"50%",
          background:"var(--s1)",border:"1px solid var(--dim)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:15,flexShrink:0,
        }}>🧠</div>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--soft)"}}>Memory System</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"var(--dim)",letterSpacing:1}}>
            SLOT READY · CONNECT MEMORY ENGINE
          </div>
        </div>
      </div>
      <div style={{ height:10 }} />

      {[
        ["👤","Account"],
        ["📍","Saved Places"],
        ["💳","Payment Methods"],
        ["🎁","Referrals"],
        ["🔔","Notifications"],
        ["⚙️","Settings"],
        ["❓","Help"],
      ].map(([ic,lb]) => (
        <div className="list-row" key={lb}>
          <div className="lr-ic">{ic}</div>
          <div className="lr-title">{lb}</div>
          <div className="lr-arr">›</div>
        </div>
      ))}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const time = useTime();
  const mem  = useMem();
  const [tab, setTab] = useState("home");

  const pages = {
    home:    <Home mem={mem} />,
    trips:   <Trips />,
    wallet:  <Wallet />,
    profile: <Profile mem={mem} />,
  };

  const nav = [
    { id:"home",    icon:"🏠", label:"Home"    },
    { id:"trips",   icon:"🚗", label:"Trips"   },
    { id:"wallet",  icon:"💳", label:"Wallet"  },
    { id:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <StatusBar time={time} />

        {/* Header */}
        <div className="header">
          <div className="h-brand">Yaad<span>Flex</span></div>
          <div className="h-right">
            <div className="h-avatar" onClick={() => setTab("profile")}>👤</div>
          </div>
        </div>

        {/* Page content */}
        <div className="scroll" key={tab}>
          {pages[tab]}
        </div>

        {/* Bottom nav */}
        <div className="bnav">
          {nav.map(n => (
            <div key={n.id} className="bn" onClick={() => setTab(n.id)}>
              <div className="bn-i">{n.icon}</div>
              <div className="bn-l" style={{ color: tab===n.id ? "var(--white)" : "var(--soft)" }}>
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
