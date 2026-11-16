import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: MEMORY SYSTEM
//  Plug your memory engine here when ready.
//  Receives driver ID, returns stored profile, preferences, shift history.
// ─────────────────────────────────────────────────────────────────────────────
async function MEMORY_SLOT(driverId) {
  // ── CONNECT YOUR MEMORY ENGINE HERE ──
  // Example: return await MemoryCore.recall(driverId);
  return {
    name: "Marcus T.",
    vehicle: "Toyota Corolla",
    plate: "PBL 4821",
    rating: 4.97,
    tripsTotal: 847,
    memberSince: "Jan 2024",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: AI ASSISTANT
//  Plug your AI engine here when ready.
//  Receives message + context, returns smart reply or action.
// ─────────────────────────────────────────────────────────────────────────────
async function AI_SLOT(message, context) {
  // ── CONNECT YOUR AI ENGINE HERE ──
  // Example: return await DriverAI.respond(message, context);
  return { reply: "AI assistant slot ready. Connect your engine.", action: null };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: DISPATCH ENGINE
//  Plug your live dispatch system here when ready.
//  Receives driver status, returns incoming trip requests.
// ─────────────────────────────────────────────────────────────────────────────
async function DISPATCH_SLOT(driverStatus) {
  // ── CONNECT YOUR DISPATCH ENGINE HERE ──
  // Example: return await DispatchRouter.driverUpdate(driverStatus);
  return { status: "listening", nearbyRiders: 3, tripRequest: null };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: EARNINGS ENGINE
//  Plug your payment/earnings backend here when ready.
//  Receives driver ID + period, returns earnings breakdown.
// ─────────────────────────────────────────────────────────────────────────────
async function EARNINGS_SLOT(driverId, period) {
  // ── CONNECT YOUR EARNINGS ENGINE HERE ──
  // Example: return await PaymentLayer.driverEarnings(driverId, period);
  return { today: 6200, week: 28400, month: 112000, pending: 850, currency: "JMD" };
}

// ─────────────────────────────────────────────────────────────────────────────
//  SLOT: NAVIGATION ENGINE
//  Plug your maps / navigation system here when ready.
// ─────────────────────────────────────────────────────────────────────────────
async function NAVIGATION_SLOT(pickup, dropoff) {
  // ── CONNECT YOUR NAVIGATION ENGINE HERE ──
  // Example: return await NavEngine.route(pickup, dropoff);
  return { distance: "8.2 km", duration: "14 min", route: null };
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:#0A0A0A;
  --s1:#141414;
  --s2:#1C1C1C;
  --line:rgba(255,255,255,0.07);
  --white:#F5F5F5;
  --soft:#606060;
  --dim:#2E2E2E;
  --gold:#C9A84C;
}

html,body{
  background:#060606;
  font-family:'Inter',sans-serif;
  color:var(--white);
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:flex-start;
  overflow-x:hidden;
}

.shell{
  width:100%;
  max-width:390px;
  min-height:100dvh;
  background:var(--bg);
  display:flex;
  flex-direction:column;
  position:relative;
  overflow:hidden;
}

.sbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:14px 22px 0;
  font-size:12px;
  font-weight:500;
}

.header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 22px 16px;
  border-bottom:1px solid var(--line);
}
.h-brand{font-size:20px;font-weight:700;letter-spacing:-0.5px;}
.h-brand span{color:var(--gold);}
.h-role{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  letter-spacing:2px;
  color:var(--soft);
  text-transform:uppercase;
  margin-top:3px;
}
.h-right{display:flex;align-items:center;gap:10px;}
.plate{
  padding:5px 12px;
  border-radius:20px;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--dim);
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  letter-spacing:1px;
  color:var(--soft);
}

.scroll{
  flex:1;
  overflow-y:auto;
  scrollbar-width:none;
  padding-bottom:90px;
}
.scroll::-webkit-scrollbar{display:none;}

/* Toggle */
.toggle-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:22px 22px;
  border-bottom:1px solid var(--line);
}
.tog-info{flex:1;}
.tog-title{font-size:16px;font-weight:600;letter-spacing:-0.3px;margin-bottom:4px;}
.tog-sub{font-size:13px;color:var(--soft);}
.tog{
  width:54px;height:30px;
  border-radius:15px;
  background:var(--s2);
  border:1px solid var(--line);
  position:relative;
  cursor:pointer;
  transition:all 0.25s;
  flex-shrink:0;
}
.tog.on{background:var(--white);border-color:var(--white);}
.tog-k{
  position:absolute;
  top:3px;left:3px;
  width:22px;height:22px;
  border-radius:50%;
  background:var(--soft);
  transition:all 0.25s;
}
.tog.on .tog-k{left:27px;background:#000;}

/* Stats */
.stats-row{display:flex;gap:8px;padding:16px 22px 0;}
.stat{
  flex:1;
  padding:16px 12px;
  background:var(--s1);
  border:1px solid var(--line);
  border-radius:12px;
  text-align:center;
}
.stat-v{font-size:22px;font-weight:700;letter-spacing:-0.5px;margin-bottom:4px;}
.stat-l{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  color:var(--soft);
  letter-spacing:1.5px;
  text-transform:uppercase;
}

/* Map */
.map-wrap{
  margin:16px 22px 0;
  height:180px;
  border-radius:14px;
  background:#111;
  position:relative;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
}
.map-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
  background-size:28px 28px;
}
.map-roads{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 2px,transparent 2px),
    linear-gradient(90deg,rgba(255,255,255,0.04) 2px,transparent 2px);
  background-size:84px 84px;
  background-position:12px 12px;
}
.map-pin{
  width:11px;height:11px;
  background:var(--white);
  border-radius:50%;
  z-index:2;
  animation:breathe 2.5s ease-in-out infinite;
}
@keyframes breathe{
  0%,100%{box-shadow:0 0 0 4px rgba(255,255,255,0.06),0 0 16px rgba(255,255,255,0.08);}
  50%{box-shadow:0 0 0 10px rgba(255,255,255,0.03),0 0 24px rgba(255,255,255,0.15);}
}
.map-lbl{
  position:absolute;
  bottom:11px;left:14px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  color:rgba(255,255,255,0.25);
  letter-spacing:1.5px;
}

/* Waiting */
.waiting{
  padding:28px 22px;
  text-align:center;
  border-top:1px solid var(--line);
}
.wait-icon{font-size:32px;margin-bottom:14px;}
.wait-title{font-size:17px;font-weight:600;letter-spacing:-0.3px;margin-bottom:6px;}
.wait-sub{font-size:13px;color:var(--soft);line-height:1.6;}

/* Trip Request */
.trip-request{
  margin:16px 22px 0;
  padding:20px 18px;
  background:var(--s1);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:14px;
  animation:slideIn 0.3s cubic-bezier(0.16,1,0.3,1);
}
@keyframes slideIn{
  from{opacity:0;transform:translateY(12px);}
  to{opacity:1;transform:translateY(0);}
}
.tr-label{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  letter-spacing:2px;
  color:var(--soft);
  text-transform:uppercase;
  margin-bottom:12px;
}
.tr-dest{font-size:18px;font-weight:700;letter-spacing:-0.4px;margin-bottom:4px;}
.tr-from{font-size:13px;color:var(--soft);margin-bottom:14px;}
.tr-details{display:flex;gap:8px;margin-bottom:16px;}
.tr-detail{
  flex:1;
  padding:10px 12px;
  background:var(--s2);
  border-radius:8px;
  text-align:center;
}
.tr-dv{font-size:15px;font-weight:700;margin-bottom:2px;}
.tr-dl{
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;
  color:var(--soft);
  letter-spacing:1px;
  text-transform:uppercase;
}
.tr-actions{display:flex;gap:10px;}
.btn-accept{
  flex:2;
  padding:15px;
  background:var(--white);
  color:#000;
  border:none;
  border-radius:10px;
  font-family:'Inter',sans-serif;
  font-size:14px;
  font-weight:700;
  cursor:pointer;
  transition:all 0.18s;
}
.btn-accept:hover{background:#E8E8E8;}
.btn-decline{
  flex:1;
  padding:15px;
  background:transparent;
  color:var(--soft);
  border:1px solid var(--dim);
  border-radius:10px;
  font-family:'Inter',sans-serif;
  font-size:14px;
  font-weight:500;
  cursor:pointer;
  transition:all 0.18s;
}
.btn-decline:hover{border-color:var(--soft);color:var(--white);}

/* Active trip */
.active-trip{
  margin:16px 22px 0;
  background:var(--s1);
  border:1px solid var(--line);
  border-radius:14px;
  overflow:hidden;
}
.at-map{
  height:130px;
  background:#0E0E0E;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}
.at-car{
  position:absolute;
  font-size:20px;
  animation:drift 5s ease-in-out infinite;
}
@keyframes drift{
  0%{transform:translate(-40px,12px) rotate(-4deg);}
  50%{transform:translate(28px,-10px) rotate(4deg);}
  100%{transform:translate(-40px,12px) rotate(-4deg);}
}
.at-body{padding:16px 18px;}
.at-rider{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.at-av{
  width:42px;height:42px;
  border-radius:50%;
  background:var(--s2);
  border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-size:17px;flex-shrink:0;
}
.at-name{font-size:14px;font-weight:600;}
.at-meta{font-size:12px;color:var(--soft);margin-top:2px;}
.at-fare{margin-left:auto;text-align:right;flex-shrink:0;}
.at-fare-v{font-size:22px;font-weight:700;}
.at-fare-l{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  color:var(--soft);
  letter-spacing:1px;
}
.at-actions{display:flex;gap:8px;}
.at-act{
  flex:1;
  padding:11px 8px;
  background:var(--s2);
  border:1px solid var(--line);
  border-radius:10px;
  color:var(--white);
  font-size:12.5px;
  font-weight:500;
  cursor:pointer;
  text-align:center;
  transition:background 0.15s;
}
.at-act:hover{background:#252525;}

/* Slot card */
.slot-card{
  margin:16px 22px 0;
  padding:14px 16px;
  border:1px dashed var(--dim);
  border-radius:12px;
  display:flex;
  align-items:center;
  gap:12px;
}
.slot-ic{
  width:36px;height:36px;
  border-radius:50%;
  background:var(--s1);
  border:1px solid var(--dim);
  display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;
}
.slot-label{font-size:13px;font-weight:500;color:var(--soft);}
.slot-sub{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  color:var(--dim);
  letter-spacing:1px;
  margin-top:2px;
}

/* List rows */
.lrow{
  display:flex;
  align-items:center;
  gap:14px;
  padding:14px 22px;
  border-bottom:1px solid var(--line);
  cursor:pointer;
  transition:background 0.15s;
}
.lrow:last-child{border-bottom:none;}
.lrow:hover{background:rgba(255,255,255,0.02);}
.lr-ic{
  width:40px;height:40px;
  border-radius:10px;
  background:var(--s1);
  border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-size:17px;flex-shrink:0;
}
.lr-ic.r{border-radius:50%;}
.lr-title{font-size:13.5px;font-weight:500;}
.lr-sub{font-size:12px;color:var(--soft);margin-top:2px;}
.lr-right{margin-left:auto;text-align:right;flex-shrink:0;}
.lr-val{font-size:14px;font-weight:600;}
.lr-tag{font-size:11px;color:var(--soft);margin-top:2px;}
.lr-arr{margin-left:auto;color:var(--dim);font-size:20px;}

/* Section label */
.sec-lbl{
  padding:20px 22px 10px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  letter-spacing:2.5px;
  color:var(--soft);
  text-transform:uppercase;
}

/* Page head */
.page-head{
  padding:26px 22px 20px;
  border-bottom:1px solid var(--line);
}
.page-title{font-size:26px;font-weight:700;letter-spacing:-0.6px;margin-bottom:4px;}
.page-sub{font-size:13px;color:var(--soft);}

/* Earnings */
.earn-top{
  padding:32px 22px 26px;
  text-align:center;
  border-bottom:1px solid var(--line);
}
.et-lbl{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  letter-spacing:2.5px;
  color:var(--soft);
  text-transform:uppercase;
  margin-bottom:12px;
}
.et-amt{font-size:52px;font-weight:700;letter-spacing:-2px;margin-bottom:6px;}
.et-sub{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;
  color:var(--dim);
  letter-spacing:1.5px;
}
.earn-row{padding:14px 22px;border-bottom:1px solid var(--line);}
.earn-row:last-child{border-bottom:none;}
.earn-top-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:7px;
}
.earn-day{font-size:13px;font-weight:500;}
.earn-val{font-size:14px;font-weight:600;}
.earn-trips{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  color:var(--soft);
}
.bar{height:2px;background:var(--s2);border-radius:1px;overflow:hidden;}
.bar-fill{height:100%;background:var(--white);border-radius:1px;transition:width 0.8s ease;}

/* Profile */
.prof-top{
  padding:28px 22px 22px;
  display:flex;
  align-items:center;
  gap:16px;
  border-bottom:1px solid var(--line);
}
.prof-av{
  width:60px;height:60px;
  border-radius:50%;
  background:var(--s2);
  border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;flex-shrink:0;
}
.prof-name{font-size:22px;font-weight:700;letter-spacing:-0.5px;margin-bottom:3px;}
.prof-tag{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  color:var(--soft);
  letter-spacing:2px;
}
.prof-stats{display:flex;gap:0;border-bottom:1px solid var(--line);}
.prof-stat{
  flex:1;
  padding:16px 0;
  text-align:center;
  border-right:1px solid var(--line);
}
.prof-stat:last-child{border-right:none;}
.ps-v{font-size:20px;font-weight:700;margin-bottom:3px;}
.ps-l{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  color:var(--soft);
  letter-spacing:1.5px;
  text-transform:uppercase;
}

/* Bottom nav */
.bnav{
  position:fixed;bottom:0;left:50%;
  transform:translateX(-50%);
  width:100%;max-width:390px;
  background:rgba(10,10,10,0.97);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-top:1px solid var(--line);
  display:flex;
  padding:10px 0 22px;
  z-index:100;
}
.bn{
  flex:1;
  display:flex;flex-direction:column;
  align-items:center;gap:4px;
  cursor:pointer;padding:4px 0;
}
.bn-i{font-size:20px;line-height:1;}
.bn-l{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  letter-spacing:1px;
  text-transform:uppercase;
  transition:color 0.15s;
}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(8px);}
  to{opacity:1;transform:translateY(0);}
}
.fade{animation:fadeUp 0.2s ease both;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

@media(min-width:420px){
  .shell{
    border-radius:40px;
    border:1px solid rgba(255,255,255,0.07);
    min-height:auto;
    height:860px;
    max-height:880px;
    box-shadow:0 40px 80px rgba(0,0,0,0.95);
    margin:24px auto;
    overflow:hidden;
  }
  .bnav{border-radius:0 0 40px 40px;}
  html,body{align-items:center;padding:20px;}
}
`;

// ── Static data ───────────────────────────────────────────────────────────────
const TRIP_HISTORY = [
  { to:"New Kingston",          from:"Half Way Tree",  fare:"$850",   time:"2:30 PM"  },
  { to:"Norman Manley Airport", from:"New Kingston",   fare:"$2,100", time:"11:15 AM" },
  { to:"Portmore",              from:"Half Way Tree",  fare:"$2,400", time:"9:00 AM"  },
  { to:"Sovereign Centre",      from:"Cross Roads",    fare:"$600",   time:"Yesterday"},
];

const EARN_DAYS = [
  { day:"Today",     val:"$6,200",  trips:8,  pct:62 },
  { day:"Yesterday", val:"$7,100",  trips:9,  pct:71 },
  { day:"Monday",    val:"$5,800",  trips:7,  pct:58 },
  { day:"Sunday",    val:"$9,300",  trips:12, pct:93 },
  { day:"Saturday",  val:"$8,000",  trips:10, pct:80 },
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
  const [mem, setMem] = useState({
    name:"...", vehicle:"...", plate:"...",
    rating:"—", tripsTotal:0, memberSince:"—",
  });
  useEffect(() => {
    MEMORY_SLOT("driver_001").then(setMem).catch(() => {});
  }, []);
  return mem;
}

// ── Components ────────────────────────────────────────────────────────────────
function SlotCard({ icon, label, sub }) {
  return (
    <div className="slot-card">
      <div className="slot-ic">{icon}</div>
      <div>
        <div className="slot-label">{label}</div>
        <div className="slot-sub">{sub}</div>
      </div>
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function Home() {
  const [online,  setOnline]  = useState(false);
  const [request, setRequest] = useState(null);
  const [active,  setActive]  = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const next = !online;
    setOnline(next);
    if (next) {
      setLoading(true);
      await DISPATCH_SLOT({ status:"online", driverId:"driver_001" });
      setLoading(false);
      setTimeout(() => {
        setRequest({ to:"New Kingston", from:"Half Way Tree Road", pickup:"0.4 km away",
                     fare:"$850", dist:"8.2 km", eta:"14 min" });
      }, 2000);
    } else {
      setRequest(null); setActive(null);
    }
  };

  return (
    <div className="fade">
      <div className="toggle-row">
        <div className="tog-info">
          <div className="tog-title">{online ? "You are online" : "You are offline"}</div>
          <div className="tog-sub">
            {online
              ? loading ? "Connecting to dispatch…" : "Accepting trip requests"
              : "Tap to go online and start earning"}
          </div>
        </div>
        <div className={`tog ${online ? "on" : ""}`} onClick={toggle}>
          <div className="tog-k" />
        </div>
      </div>

      <div className="stats-row">
        {[{v:"$6,200",l:"Today"},{v:"8",l:"Trips"},{v:"4.97",l:"Rating"}].map(s => (
          <div className="stat" key={s.l}>
            <div className="stat-v">{s.v}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="map-wrap">
        <div className="map-grid" />
        <div className="map-roads" />
        <div className="map-pin" />
        <div className="map-lbl">{online ? "ONLINE · KINGSTON, JA" : "OFFLINE · KINGSTON, JA"}</div>
      </div>

      {request && (
        <div className="trip-request">
          <div className="tr-label">Trip Request</div>
          <div className="tr-dest">{request.to}</div>
          <div className="tr-from">Pickup: {request.from} · {request.pickup}</div>
          <div className="tr-details">
            {[{v:request.fare,l:"Fare"},{v:request.dist,l:"Distance"},{v:request.eta,l:"Trip time"}].map(d => (
              <div className="tr-detail" key={d.l}>
                <div className="tr-dv">{d.v}</div>
                <div className="tr-dl">{d.l}</div>
              </div>
            ))}
          </div>
          <div className="tr-actions">
            <button className="btn-accept" onClick={() => { setActive(request); setRequest(null); }}>Accept</button>
            <button className="btn-decline" onClick={() => setRequest(null)}>Decline</button>
          </div>
        </div>
      )}

      {active && (
        <div className="active-trip">
          <div className="at-map">
            <div className="map-grid" /><div className="map-roads" />
            <div className="at-car">🚗</div>
            <div className="map-lbl">EN ROUTE</div>
          </div>
          <div className="at-body">
            <div className="at-rider">
              <div className="at-av">👤</div>
              <div>
                <div className="at-name">Rider — J. Brown</div>
                <div className="at-meta">To: {active.to}</div>
              </div>
              <div className="at-fare">
                <div className="at-fare-v">{active.fare}</div>
                <div className="at-fare-l">JMD</div>
              </div>
            </div>
            <div className="at-actions">
              <div className="at-act">📞 Call</div>
              <div className="at-act">🗺 Navigate</div>
              <div className="at-act" onClick={() => setActive(null)}>✓ Complete</div>
            </div>
          </div>
        </div>
      )}

      {online && !request && !active && !loading && (
        <div className="waiting">
          <div className="wait-icon" style={{animation:"pulse 2s infinite"}}>📡</div>
          <div className="wait-title">Waiting for a request</div>
          <div className="wait-sub">You'll be notified as soon as a rider nearby requests a trip.</div>
        </div>
      )}

      {!online && (
        <>
          <SlotCard icon="🤖" label="AI Assistant"      sub="SLOT READY · CONNECT AI ENGINE"  />
          <SlotCard icon="🗺" label="Navigation Engine" sub="SLOT READY · CONNECT NAV ENGINE" />
        </>
      )}
    </div>
  );
}

function Earnings() {
  const [data, setData] = useState(null);
  useEffect(() => {
    EARNINGS_SLOT("driver_001","week").then(setData).catch(() => {});
  }, []);

  return (
    <div className="fade">
      <div className="earn-top">
        <div className="et-lbl">This Week</div>
        <div className="et-amt">{data ? `$${data.week.toLocaleString()}` : "$—"}</div>
        <div className="et-sub">JMD</div>
      </div>

      {data?.pending > 0 && (
        <div style={{margin:"12px 22px 0",padding:"12px 16px",
          background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",
          borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>Pending payout</div>
            <div style={{fontSize:12,color:"var(--soft)",marginTop:2}}>Processing · Your bank</div>
          </div>
          <div style={{fontSize:16,fontWeight:700,color:"var(--gold)"}}>
            ${data.pending.toLocaleString()}
          </div>
        </div>
      )}

      {EARN_DAYS.map(d => (
        <div className="earn-row" key={d.day}>
          <div className="earn-top-row">
            <div className="earn-day">{d.day}</div>
            <div>
              <div className="earn-val">{d.val}</div>
              <div className="earn-trips">{d.trips} trips</div>
            </div>
          </div>
          <div className="bar"><div className="bar-fill" style={{width:`${d.pct}%`}} /></div>
        </div>
      ))}

      <div style={{marginTop:16}}>
        <SlotCard icon="🤖" label="Earnings Insights AI" sub="SLOT READY · CONNECT AI ENGINE" />
      </div>
    </div>
  );
}

function Trips() {
  return (
    <div className="fade">
      <div className="page-head">
        <div className="page-title">My Trips</div>
        <div className="page-sub">Completed rides</div>
      </div>
      {TRIP_HISTORY.map((t, i) => (
        <div className="lrow" key={i}>
          <div className="lr-ic r">✅</div>
          <div>
            <div className="lr-title">{t.to}</div>
            <div className="lr-sub">From {t.from}</div>
          </div>
          <div className="lr-right">
            <div className="lr-val">{t.fare}</div>
            <div className="lr-tag">{t.time}</div>
          </div>
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
          <div className="prof-name">{mem.name}</div>
          <div className="prof-tag">DRIVER · YAADFLEX</div>
        </div>
      </div>

      <div className="prof-stats">
        {[{v:mem.rating,l:"Rating"},{v:mem.tripsTotal,l:"Trips"},{v:mem.memberSince,l:"Member"}].map(s => (
          <div className="prof-stat" key={s.l}>
            <div className="ps-v">{s.v}</div>
            <div className="ps-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"16px 22px 0"}}>
        <SlotCard icon="🧠" label="Memory System" sub="SLOT READY · CONNECT MEMORY ENGINE" />
      </div>
      <div style={{height:8}} />

      {[
        ["🚗","My Vehicle",    mem.vehicle + " · " + mem.plate],
        ["📋","Documents",     "License, insurance, inspection"],
        ["💳","Payout",        "Bank account · JMD"],
        ["📊","Performance",   "Ratings, acceptance rate, stats"],
        ["🔔","Notifications", "Trip alerts, payouts"],
        ["⚙️","Settings",      ""],
        ["❓","Support",       "Help & contact"],
      ].map(([ic, lb, sub]) => (
        <div className="lrow" key={lb}>
          <div className="lr-ic">{ic}</div>
          <div>
            <div className="lr-title">{lb}</div>
            {sub && <div className="lr-sub">{sub}</div>}
          </div>
          <div className="lr-arr">›</div>
        </div>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const time = useTime();
  const mem  = useMem();
  const [tab, setTab] = useState("home");

  const pages = {
    home:     <Home />,
    earnings: <Earnings />,
    trips:    <Trips />,
    profile:  <Profile mem={mem} />,
  };

  const nav = [
    { id:"home",     icon:"🏠", label:"Home"     },
    { id:"earnings", icon:"💰", label:"Earnings" },
    { id:"trips",    icon:"🚗", label:"Trips"    },
    { id:"profile",  icon:"👤", label:"Profile"  },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <div className="sbar">
          <span style={{fontWeight:600}}>{time}</span>
          <span style={{fontSize:12,opacity:0.4}}>▲▲▲ WiFi ●●●●</span>
        </div>
        <div className="header">
          <div>
            <div className="h-brand">Yaad<span>Flex</span></div>
            <div className="h-role">Driver</div>
          </div>
          <div className="h-right">
            <div className="plate">{mem.plate || "—"}</div>
          </div>
        </div>
        <div className="scroll" key={tab}>
          {pages[tab]}
        </div>
        <div className="bnav">
          {nav.map(n => (
            <div key={n.id} className="bn" onClick={() => setTab(n.id)}>
              <div className="bn-i">{n.icon}</div>
              <div className="bn-l" style={{color: tab===n.id ? "var(--white)" : "var(--soft)"}}>
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
