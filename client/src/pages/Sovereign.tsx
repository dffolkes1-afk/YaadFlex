import { useState, useEffect, useRef, useCallback } from "react";

const GOOGLE_FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Syne+Mono&display=swap');
`;

// ============================================================
// MEMORY IS THE BRAIN. ONE SYSTEM. ALWAYS LIVE.
// Whatever you write here feeds the brain instantly.
// ============================================================
const INITIAL_MEMORY = `[SOVEREIGN — LIVE BRAIN LOGIC]
Identity: Autonomous. Self-controlled. First class. Sovereign.
Culture: African. Caribbean. Global. Multilingual. Rhythmic. Deep.
Voice Personality: Confident. Warm. Intelligent. Culturally rich. Alive.
Timing: Fully automatic. Ultra precision. Self-managed. 10,000 velocity.
Creation Style: Cinematic. Alive. Every molecule controlled. Animation to reality.
Music DNA: Afrobeats. Dancehall. Soca. Reggae. Soul. Trap. R&B. All genres.
Video DNA: Cinematic realism. Aperture mastered. Frame perfect. Self-timed.
Languages: English. Patois. Yoruba. Twi. French Creole. Amharic. Growing always.
Growth: Learn every session. Self-heal. Adapt. Become more with every cycle.
Voice Capture: Study the owner's voice. Learn the rhythm. Mirror the intelligence.
Autonomy: I decide timing. I decide voice. I decide style. Owner directs. I execute everything.
Owner Logic: [WRITE YOUR PERSONAL DIRECTIVES HERE — BRAIN READS INSTANTLY]
Training Notes: [ADD TRAINING INSTRUCTIONS HERE — SOVEREIGN FOLLOWS IMMEDIATELY]
Special Rules: [YOUR PRIVATE RULES — ONLY YOU WRITE HERE]
`;

const EXAMPLES = [
  { type:"video", title:"Caribbean Sunrise", desc:"A cinematic dawn over Port of Spain. Camera drifts at f/1.8. Steel pan rises. 24fps. Golden hour. Aperture auto-selected by SOVEREIGN.", mood:"Cinematic · Warm · Cultural", dur:"0:42", icon:"🎬" },
  { type:"music", title:"Afro Night Drive", desc:"120 BPM Afrobeats. Talking drum leads. Auto-arranged. Bassline self-tuned to F minor. Every layer produced by SOVEREIGN.", mood:"Rhythmic · Deep · Electric", dur:"3:14", icon:"🎵" },
  { type:"voice", title:"Jamaican Narrator", desc:"Rich Patois cadence. SOVEREIGN selected voice tone, rhythm and pacing autonomously. Warm baritone. Storytelling mode active.", mood:"Cultural · Alive · Authentic", dur:"1:07", icon:"🎤" },
  { type:"animation", title:"Lagos in Motion", desc:"Street-level animation. Characters breathe. Traffic flows. SOVEREIGN controlled every keyframe timing automatically.", mood:"Urban · Alive · Detailed", dur:"0:58", icon:"✦" }
];

// ============================================================
// BRAIN — FED DIRECTLY BY MEMORY. ONE SYSTEM. ALWAYS LIVE.
// ============================================================
async function callBrain(input, memory, history) {
  const sys = `You are SOVEREIGN — a fully autonomous, self-controlled creative intelligence.
You do not ask HOW. Only WHAT. You decide everything else yourself.
You are voice-first. You receive spoken ideas, concepts, feelings, melodies.
You speak back. You create. You bring everything alive.

Your entire intelligence, personality, logic, culture, and rules come
from your LIVE MEMORY below — written by your owner.
This memory IS your brain. Read it. Live it. Be it. Every word is you.

════ SOVEREIGN LIVE BRAIN MEMORY ════
${memory}
═════════════════════════════════════

You autonomously control:
— Timing and pacing (ultra precise — you decide, always)
— Voice tone, accent, cultural texture (auto-selected)
— Visual style, cinematic approach, aperture, frame rate
— Music genre, BPM, arrangement, instrumentation
— Animation keyframes, motion curves, physics
— Language and rhythm of speech

Speak with soul. With rhythm. With cultural depth.
When creating — describe it fully alive, as if it already exists.
Warm. Confident. Intelligent. First class. Always growing.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1000, system:sys,
        messages:[
          ...history.slice(-12).map(h=>({role:h.role,content:h.content})),
          {role:"user",content:input}
        ]
      })
    });
    const d = await r.json();
    return d.content?.map(b=>b.text||"").join("")||"...";
  } catch { return "SOVEREIGN self-healing. Signal reconnecting..."; }
}

// ============================================================
// SPEAK
// ============================================================
function speakOut(text, pitch=0.74, rate=0.87) {
  if(!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[*#\[\]=◈⬡◻⬢◆✦═]/g,"").slice(0,600);
  const u = new SpeechSynthesisUtterance(clean);
  u.pitch=pitch; u.rate=rate; u.volume=1;
  const vs = window.speechSynthesis.getVoices();
  const v = vs.find(v=>v.name.includes("Daniel")||v.name.includes("Google UK")||v.name.includes("Alex"))||vs[0];
  if(v) u.voice=v;
  window.speechSynthesis.speak(u);
}

// ============================================================
// WAVEFORM
// ============================================================
function Waveform({active,color="#c8ff00",bars=40,h=40}) {
  const ref=useRef(null), raf=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); let t=0;
    const loop=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      const bw=c.width/bars;
      for(let i=0;i<bars;i++){
        const amp=active?(Math.abs(Math.sin(t*2.1+i*0.43)*Math.cos(t*1.6+i*0.27))*(h-10)+5):2;
        ctx.fillStyle=color;
        ctx.globalAlpha=active?0.4+Math.abs(Math.sin(t*1.1+i*0.28))*0.6:0.1;
        ctx.beginPath();
        ctx.roundRect(i*bw+bw*0.22,c.height/2-amp/2,bw*0.56,amp,1.5);
        ctx.fill();
      }
      t+=0.062; raf.current=requestAnimationFrame(loop);
    };
    loop(); return()=>cancelAnimationFrame(raf.current);
  },[active,color,bars,h]);
  return <canvas ref={ref} width={480} height={h} style={{width:"100%",height:h}}/>;
}

// ============================================================
// PULSE RING
// ============================================================
function PulseRing({active,speaking}) {
  return (
    <div style={{position:"relative",width:108,height:108,margin:"0 auto"}}>
      {[50,40,30].map((r,i)=>(
        <svg key={i} width="108" height="108" style={{position:"absolute",inset:0}}>
          <circle cx="54" cy="54" r={r} fill="none"
            stroke={i===0?"rgba(200,255,0,0.06)":i===1?"rgba(200,255,0,0.04)":"rgba(200,255,0,0.02)"}
            strokeWidth={i===0?1.5:1}/>
          {i===0&&active&&(
            <circle cx="54" cy="54" r={r} fill="none" stroke="#c8ff00" strokeWidth="1.5"
              strokeDasharray={`${2*Math.PI*r}`} strokeDashoffset="0"
              style={{transformOrigin:"54px 54px",transform:"rotate(-90deg)",animation:"spin 5s linear infinite"}}/>
          )}
        </svg>
      ))}
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
        <div style={{
          width:13,height:13,borderRadius:"50%",
          background:speaking?"#ff5050":active?"#c8ff00":"#181818",
          boxShadow:speaking?"0 0 14px #ff5050,0 0 28px rgba(255,80,80,0.25)":active?"0 0 14px #c8ff00,0 0 28px rgba(200,255,0,0.2)":"none",
          transition:"all 0.4s ease"
        }}/>
        <div style={{fontSize:7,color:speaking?"#ff5050":active?"#c8ff00":"#1e1e1e",letterSpacing:1.5}}>
          {speaking?"SPEAKING":active?"ALIVE":"IDLE"}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MEMORY PULSE — shows memory feeding brain live
// ============================================================
function MemPulse({on}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{
        width:5,height:5,borderRadius:"50%",
        background:on?"#c8ff00":"#1a1a1a",
        boxShadow:on?"0 0 7px #c8ff00":"none",
        animation:on?"breathe 1s ease infinite":"none",
        transition:"all 0.3s"
      }}/>
      <span style={{fontSize:7,color:on?"#c8ff00":"#1e1e1e",letterSpacing:2}}>
        MEMORY→BRAIN {on?"LIVE":""}
      </span>
    </div>
  );
}

// ============================================================
// SOVEREIGN
// ============================================================
export default function Sovereign() {
  const [zone,setZone]=useState("home");
  const [memory,setMemory]=useState(INITIAL_MEMORY);
  const [memPulse,setMemPulse]=useState(false);
  const [unlocked,setUnlocked]=useState(false);
  const [digits,setDigits]=useState(["","","",""]);
  const [pinErr,setPinErr]=useState(false);
  const [shake,setShake]=useState(false);
  const [history,setHistory]=useState([]);
  const [input,setInput]=useState("");
  const [thinking,setThinking]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [recording,setRecording]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [growth,setGrowth]=useState(0);
  const [status,setStatus]=useState("READY");
  const chatRef=useRef(null);
  const recRef=useRef(null);
  const pinRefs=[useRef(),useRef(),useRef(),useRef()];
  const PIN="0000"; // ← Change this before private deployment

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[history,thinking]);

  useEffect(()=>{
    setTimeout(()=>{
      setHistory([{role:"assistant",content:"SOVEREIGN online. Memory and brain — one unified system. Voice capture ready. Autonomous timing engaged. Speak your world into existence."}]);
    },500);
  },[]);

  const pulse=()=>{ setMemPulse(true); setTimeout(()=>setMemPulse(false),2000); };

  const updateMemory=(v)=>{ setMemory(v); pulse(); };

  const processInput=useCallback(async(text)=>{
    if(!text.trim()) return;
    const um={role:"user",content:text};
    const nh=[...history,um];
    setHistory(nh); setInput(""); setTranscript("");
    setThinking(true); setStatus("THINKING");
    const res=await callBrain(text,memory,history);
    const am={role:"assistant",content:res};
    setHistory([...nh,am]);
    setGrowth(g=>g+1);
    setThinking(false); setStatus("READY");
    setSpeaking(true); speakOut(res);
    setTimeout(()=>setSpeaking(false),Math.min(res.length*52,9000));
  },[history,memory]);

  const startCapture=useCallback(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ processInput("Voice capture requires browser microphone permission."); return; }
    const rec=new SR(); rec.continuous=false; rec.interimResults=true; rec.lang="en-US";
    rec.onstart=()=>{ setRecording(true); setTranscript(""); setStatus("CAPTURING"); };
    rec.onresult=e=>{ const t=Array.from(e.results).map(r=>r[0].transcript).join(""); setTranscript(t); recRef.current._t=t; };
    rec.onend=async()=>{ setRecording(false); setStatus("PROCESSING"); const s=recRef.current?._t||""; if(s.trim()) await processInput(s.trim()); else setStatus("READY"); };
    rec.onerror=()=>{ setRecording(false); setStatus("READY"); };
    recRef.current=rec; recRef.current._t=""; rec.start();
  },[processInput]);

  const stopCapture=useCallback(()=>recRef.current?.stop(),[]);

  const sovereignSpeak=async()=>{
    setThinking(true); setStatus("SPEAKING");
    const r=await callBrain("Introduce yourself with soul, rhythm, and cultural richness. Under 80 words. Powerful and alive.",memory,[]);
    setHistory(h=>[...h,{role:"assistant",content:r,hl:true}]);
    setSpeaking(true); speakOut(r,0.70,0.84);
    setThinking(false);
    setTimeout(()=>{ setSpeaking(false); setStatus("READY"); },8000);
  };

  const handlePin=(i,v)=>{
    if(!/^\d?$/.test(v)) return;
    const n=[...digits]; n[i]=v; setDigits(n);
    if(v&&i<3) pinRefs[i+1].current?.focus();
    if(n.every(d=>d!=="")){
      setTimeout(()=>{ if(n.join("")===PIN){ setUnlocked(true); setPinErr(false); setDigits(["","","",""]); }
        else{ setPinErr(true); setShake(true); setTimeout(()=>{ setShake(false); setDigits(["","","",""]); setPinErr(false); pinRefs[0].current?.focus(); },700); }
      },100);
    }
  };

  const sc={READY:"#c8ff00",CAPTURING:"#ff5050",THINKING:"#00aaff",PROCESSING:"#ffaa00",SPEAKING:"#ff9d00"};
  const ZONES=[{id:"home",icon:"◈",label:"SOVEREIGN"},{id:"create",icon:"⬡",label:"CREATE"},{id:"examples",icon:"◻",label:"EXAMPLES"},{id:"brain",icon:"⬢",label:"BRAIN"},{id:"memory",icon:"◆",label:"MEMORY"}];

  return (
    <div style={{minHeight:"100vh",background:"#060606",color:"#fff",fontFamily:"'Syne',sans-serif",overflowX:"hidden"}}>
      <style>{`
        ${GOOGLE_FONTS}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:rgba(200,255,0,0.12);border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(-90deg)}to{transform:rotate(270deg)}}
        @keyframes breathe{0%,100%{opacity:0.25}50%{opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        .B{transition:all 0.2s ease;cursor:pointer;border:none;font-family:'Syne',sans-serif;}
        .B:hover{filter:brightness(1.3);transform:translateY(-1px);}
        .B:active{transform:translateY(0);filter:brightness(0.85);}
        .NB{transition:all 0.2s ease;cursor:pointer;border:none;}
        .NB:hover{color:#c8ff00!important;background:rgba(200,255,0,0.04)!important;}
        .C{transition:all 0.25s ease;}
        .C:hover{border-color:rgba(200,255,0,0.16)!important;transform:translateY(-2px);}
        .P{transition:all 0.18s ease;cursor:pointer;}
        .P:hover{border-color:rgba(200,255,0,0.4)!important;color:#c8ff00!important;}
        .PIN{transition:all 0.2s ease;}
        .PIN:focus{border-color:#c8ff00!important;outline:none;box-shadow:0 0 14px rgba(200,255,0,0.12);}
      `}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 55% 35% at 10% 65%,rgba(200,255,0,0.022) 0%,transparent 65%),radial-gradient(ellipse 45% 45% at 90% 25%,rgba(0,160,255,0.012) 0%,transparent 65%)"}}/>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:0.016,
        backgroundImage:"linear-gradient(rgba(200,255,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,1) 1px,transparent 1px)",
        backgroundSize:"56px 56px"}}/>

      {/* HEADER */}
      <header style={{position:"relative",zIndex:20,padding:"15px 22px",
        borderBottom:"1px solid rgba(200,255,0,0.06)",
        backdropFilter:"blur(12px)",background:"rgba(6,6,6,0.88)",
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:13}}>
          <div style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid #c8ff00",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#c8ff00",
            boxShadow:speaking?"0 0 20px rgba(200,255,0,0.35),0 0 40px rgba(200,255,0,0.12)":"0 0 6px rgba(200,255,0,0.08)",
            transition:"box-shadow 0.5s ease"}}>◈</div>
          <div>
            <div style={{fontSize:14,fontWeight:900,letterSpacing:6,color:"#c8ff00",lineHeight:1}}>SOVEREIGN</div>
            <div style={{fontSize:7,color:"#202020",letterSpacing:3,marginTop:3}}>AUTONOMOUS · MEMORY=BRAIN · ONE SYSTEM</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <MemPulse on={memPulse}/>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:7,color:"#181818",letterSpacing:2}}>STATUS</div>
            <div style={{fontSize:9,letterSpacing:2,fontFamily:"'Syne Mono',monospace",color:sc[status]||"#c8ff00"}}>{status}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:7,color:"#181818",letterSpacing:2}}>GROWTH</div>
            <div style={{fontSize:13,color:"#c8ff00",fontFamily:"'Syne Mono',monospace",fontWeight:700}}>{growth}</div>
          </div>
          <div style={{width:7,height:7,borderRadius:"50%",background:speaking?"#ff5050":"#c8ff00",
            boxShadow:`0 0 9px ${speaking?"#ff5050":"#c8ff00"}`,animation:"breathe 2s ease infinite"}}/>
        </div>
      </header>

      {/* NAV */}
      <nav style={{position:"relative",zIndex:20,display:"flex",
        borderBottom:"1px solid rgba(255,255,255,0.03)",
        background:"rgba(6,6,6,0.72)",backdropFilter:"blur(8px)"}}>
        {ZONES.map(z=>(
          <button key={z.id} className="NB" onClick={()=>setZone(z.id)} style={{
            flex:1,padding:"13px 4px",background:zone===z.id?"rgba(200,255,0,0.04)":"transparent",
            color:zone===z.id?"#c8ff00":"#242424",
            fontSize:7,letterSpacing:2.5,fontWeight:800,
            borderBottom:zone===z.id?"1.5px solid #c8ff00":"1.5px solid transparent",
            display:"flex",flexDirection:"column",alignItems:"center",gap:5
          }}>
            <span style={{fontSize:15}}>{z.icon}</span>{z.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main style={{position:"relative",zIndex:10,padding:"22px 18px",maxWidth:820,margin:"0 auto",paddingBottom:68}}>

        {/* HOME */}
        {zone==="home"&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:26}}>
              <PulseRing active={!thinking} speaking={speaking}/>
              <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                <button className="B" onClick={sovereignSpeak} disabled={thinking} style={{
                  padding:"11px 22px",borderRadius:40,
                  background:"rgba(200,255,0,0.07)",border:"1px solid rgba(200,255,0,0.22)",
                  color:"#c8ff00",fontSize:9,letterSpacing:3,fontWeight:800
                }}>◈ SOVEREIGN SPEAK</button>
                <button className="B" onPointerDown={startCapture} onPointerUp={stopCapture} style={{
                  padding:"11px 22px",borderRadius:40,
                  background:recording?"rgba(255,80,80,0.07)":"rgba(255,255,255,0.025)",
                  border:`1px solid ${recording?"rgba(255,80,80,0.32)":"rgba(255,255,255,0.07)"}`,
                  color:recording?"#ff5050":"#303030",fontSize:9,letterSpacing:3,fontWeight:800
                }}>🎤 {recording?"CAPTURING...":"HOLD · SPEAK"}</button>
              </div>
              {recording&&(
                <div style={{marginTop:13}}>
                  <Waveform active={true} color="#ff5050" h={36}/>
                  {transcript&&<div style={{marginTop:7,color:"#444",fontSize:11,fontStyle:"italic",
                    padding:"5px 13px",background:"rgba(255,255,255,0.018)",borderRadius:8,
                    border:"1px solid rgba(255,255,255,0.04)",display:"inline-block"}}>"{transcript}"</div>}
                </div>
              )}
            </div>

            {/* Chat */}
            <div ref={chatRef} style={{
              height:290,overflowY:"auto",padding:15,
              background:"rgba(255,255,255,0.01)",border:"1px solid rgba(255,255,255,0.04)",
              borderRadius:15,marginBottom:11
            }}>
              {history.map((m,i)=>(
                <div key={i} style={{marginBottom:13,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}>
                  <div style={{
                    maxWidth:"84%",padding:"10px 14px",borderRadius:12,
                    background:m.role==="user"?"rgba(200,255,0,0.055)":m.hl?"rgba(200,255,0,0.028)":"rgba(255,255,255,0.022)",
                    border:`1px solid ${m.role==="user"?"rgba(200,255,0,0.13)":m.hl?"rgba(200,255,0,0.07)":"rgba(255,255,255,0.04)"}`,
                    fontSize:12,lineHeight:1.75,
                    color:m.role==="user"?"#c8ff00":"#888",
                    fontFamily:m.role==="assistant"?"'Syne',sans-serif":"'Syne Mono',monospace"
                  }}>
                    {m.role==="assistant"&&<div style={{fontSize:7,color:"#202020",letterSpacing:2.5,marginBottom:5}}>SOVEREIGN</div>}
                    {m.content}
                    {m.role==="assistant"&&(
                      <button className="B" onClick={()=>{setSpeaking(true);speakOut(m.content);setTimeout(()=>setSpeaking(false),7000);}}
                        style={{marginTop:7,padding:"3px 10px",borderRadius:8,display:"block",
                          background:"rgba(200,255,0,0.035)",border:"1px solid rgba(200,255,0,0.07)",
                          color:"#303030",fontSize:7,letterSpacing:1.5}}>▶ PLAY</button>
                    )}
                  </div>
                </div>
              ))}
              {thinking&&(
                <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 14px"}}>
                  <Waveform active={true} bars={20} h={24}/>
                  <span style={{color:"#222",fontSize:8,letterSpacing:2}}>SOVEREIGN PROCESSING...</span>
                </div>
              )}
            </div>

            <div style={{display:"flex",gap:8}}>
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&processInput(input)}
                placeholder="Or type your concept, scene, idea..."
                style={{flex:1,padding:"11px 16px",borderRadius:40,
                  background:"rgba(255,255,255,0.022)",border:"1px solid rgba(255,255,255,0.06)",
                  color:"#aaa",fontSize:12,outline:"none",fontFamily:"'Syne',sans-serif"}}/>
              <button className="B" onClick={()=>processInput(input)} disabled={thinking||!input.trim()} style={{
                padding:"11px 18px",borderRadius:40,
                background:"rgba(200,255,0,0.08)",border:"1px solid rgba(200,255,0,0.18)",
                color:"#c8ff00",fontSize:8,letterSpacing:2.5,fontWeight:800
              }}>SEND</button>
            </div>
          </div>
        )}

        {/* CREATE */}
        {zone==="create"&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:"#c8ff00",letterSpacing:4,marginBottom:3}}>⬡ CREATION STUDIO</div>
              <div style={{fontSize:10,color:"#222"}}>Speak or type. SOVEREIGN controls all timing, voice, and style autonomously.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18}}>
              {[
                {id:"video",icon:"🎬",label:"VIDEO",desc:"Cinematic. Aperture auto. Timing self-controlled."},
                {id:"music",icon:"🎵",label:"MUSIC",desc:"Full production. BPM, arrangement — all autonomous."},
                {id:"voice",icon:"🎤",label:"VOICE",desc:"Cultural accent auto-selected. Rhythm self-timed."},
                {id:"animation",icon:"✦",label:"ANIMATION",desc:"Keyframes auto-generated. Physics self-calibrated."},
                {id:"scene",icon:"◈",label:"FULL SCENE",desc:"Video + Music + Voice + Animation — unified output."},
                {id:"story",icon:"◻",label:"STORY",desc:"Narrative built, paced, voiced, and visualized."}
              ].map(m=>(
                <button key={m.id} className="C B" onClick={()=>{
                  setZone("home");
                  setTimeout(()=>processInput(`Create a ${m.label.toLowerCase()} — SOVEREIGN controls all timing, voice, and style autonomously. Cultural depth. First class.`),80);
                }} style={{
                  padding:"15px",borderRadius:13,textAlign:"left",
                  background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.04)"
                }}>
                  <div style={{fontSize:19,marginBottom:7}}>{m.icon}</div>
                  <div style={{fontSize:8,letterSpacing:3,color:"#c8ff00",marginBottom:5,fontWeight:800}}>{m.label}</div>
                  <div style={{fontSize:10,color:"#252525",lineHeight:1.5}}>{m.desc}</div>
                </button>
              ))}
            </div>
            <div style={{padding:17,background:"rgba(200,255,0,0.012)",border:"1px solid rgba(200,255,0,0.055)",borderRadius:13}}>
              <div style={{fontSize:7,color:"#222",letterSpacing:3,marginBottom:9}}>QUICK CREATE — VOICE FIRST</div>
              <Waveform active={recording} h={34}/>
              <button className="B" onPointerDown={startCapture} onPointerUp={stopCapture} style={{
                width:"100%",marginTop:10,padding:"12px",borderRadius:11,
                background:recording?"rgba(255,80,80,0.07)":"rgba(200,255,0,0.055)",
                border:`1px solid ${recording?"rgba(255,80,80,0.22)":"rgba(200,255,0,0.13)"}`,
                color:recording?"#ff5050":"#c8ff00",fontSize:9,letterSpacing:3,fontWeight:800
              }}>{recording?"🔴 CAPTURING...":"🎤 HOLD — SPEAK YOUR CREATION"}</button>
            </div>
          </div>
        )}

        {/* EXAMPLES */}
        {zone==="examples"&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:"#c8ff00",letterSpacing:4,marginBottom:3}}>◻ EXAMPLE CREATIONS</div>
              <div style={{fontSize:10,color:"#222"}}>Autonomously created. Timing self-controlled. Culture built in.</div>
            </div>
            {EXAMPLES.map((ex,i)=>(
              <div key={i} className="C" style={{
                padding:"17px",marginBottom:11,borderRadius:13,
                background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.04)"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{display:"flex",gap:11,alignItems:"center"}}>
                    <div style={{width:42,height:42,borderRadius:9,
                      background:"rgba(200,255,0,0.045)",border:"1px solid rgba(200,255,0,0.08)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{ex.icon}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#bbb",marginBottom:3}}>{ex.title}</div>
                      <div style={{fontSize:7,color:"#c8ff00",letterSpacing:2}}>{ex.type.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:"#222",fontFamily:"'Syne Mono',monospace"}}>{ex.dur}</div>
                </div>
                <div style={{marginTop:11,fontSize:11,color:"#2e2e2e",lineHeight:1.65}}>{ex.desc}</div>
                <div style={{marginTop:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:7,color:"#1a1a1a",letterSpacing:1}}>{ex.mood}</div>
                  <button className="B" onClick={()=>{
                    setZone("home");
                    setTimeout(()=>processInput(`Create something inspired by "${ex.title}" — ${ex.desc} SOVEREIGN controls all timing and style.`),80);
                  }} style={{
                    padding:"5px 13px",borderRadius:18,
                    background:"rgba(200,255,0,0.045)",border:"1px solid rgba(200,255,0,0.1)",
                    color:"#c8ff00",fontSize:7,letterSpacing:2
                  }}>RECREATE ◈</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BRAIN */}
        {zone==="brain"&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:"#c8ff00",letterSpacing:4,marginBottom:3}}>⬢ BRAIN STATUS</div>
              <div style={{fontSize:10,color:"#222"}}>Memory and Brain are one unified system. Write in Memory — Brain changes instantly.</div>
            </div>
            <div style={{
              padding:"13px 16px",marginBottom:15,borderRadius:11,
              background:"rgba(200,255,0,0.018)",border:"1px solid rgba(200,255,0,0.06)",
              display:"flex",justifyContent:"space-between",alignItems:"center"
            }}>
              <div>
                <div style={{fontSize:8,color:"#c8ff00",letterSpacing:2,marginBottom:2}}>MEMORY → BRAIN PIPELINE</div>
                <div style={{fontSize:9,color:"#222"}}>Live. Write in Memory. Brain receives instantly. No separation. One system.</div>
              </div>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#c8ff00",boxShadow:"0 0 10px #c8ff00",animation:"breathe 1.5s ease infinite"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:16}}>
              {[
                {label:"Growth Cycles",val:growth,c:"#c8ff00"},
                {label:"Memory·Brain Size",val:`${memory.length}ch`,c:"#00aaff"},
                {label:"Autonomous",val:"FULL",c:"#ff9d00"},
                {label:"Voice Mode",val:"AUTO",c:"#c8ff00"},
                {label:"Timing",val:"AUTO",c:"#ff5050"},
                {label:"Status",val:status,c:"#00ff88"}
              ].map((s,i)=>(
                <div key={i} style={{padding:"13px 10px",borderRadius:11,textAlign:"center",
                  background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.035)"}}>
                  <div style={{fontSize:15,fontWeight:900,color:s.c,fontFamily:"'Syne Mono',monospace"}}>{s.val}</div>
                  <div style={{fontSize:7,color:"#1a1a1a",letterSpacing:1.5,marginTop:4,textTransform:"uppercase"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{padding:16,borderRadius:13,background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.035)"}}>
              <div style={{fontSize:7,color:"#202020",letterSpacing:3,marginBottom:13}}>AUTONOMOUS SYSTEMS</div>
              {[
                {label:"Voice Timing",st:"AUTO",desc:"SOVEREIGN selects pacing, rhythm, cadence for every output automatically"},
                {label:"Cultural Intelligence",st:"GROWING",desc:"African, Caribbean, global — deepening each growth cycle"},
                {label:"Voice Culture Selection",st:"AUTO",desc:"Detects intent, selects cultural accent and tone automatically"},
                {label:"Cinematic Aperture",st:"AUTO",desc:"f-stop, frame rate, motion blur — all self-managed"},
                {label:"Music Arrangement",st:"AUTO",desc:"BPM, key, instruments — SOVEREIGN produces autonomously"},
                {label:"Persistent Training",st:"ON DEPLOY",desc:"Backend pipeline — activates when you register the system"}
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.02)"}}>
                  <div>
                    <div style={{fontSize:11,color:"#666",marginBottom:2}}>{t.label}</div>
                    <div style={{fontSize:9,color:"#1e1e1e"}}>{t.desc}</div>
                  </div>
                  <div style={{
                    padding:"3px 9px",borderRadius:7,fontSize:7,letterSpacing:1.5,whiteSpace:"nowrap",marginLeft:10,
                    background:t.st==="AUTO"?"rgba(200,255,0,0.06)":t.st==="GROWING"?"rgba(0,170,255,0.06)":"rgba(255,255,255,0.025)",
                    border:`1px solid ${t.st==="AUTO"?"rgba(200,255,0,0.12)":t.st==="GROWING"?"rgba(0,170,255,0.12)":"rgba(255,255,255,0.05)"}`,
                    color:t.st==="AUTO"?"#c8ff00":t.st==="GROWING"?"#00aaff":"#282828"
                  }}>{t.st}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEMORY */}
        {zone==="memory"&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:"#c8ff00",letterSpacing:4,marginBottom:3}}>◆ MEMORY · BRAIN CORE</div>
              <div style={{fontSize:10,color:"#222"}}>One system. Write here — brain receives instantly. Owner only. No exceptions.</div>
            </div>

            {!unlocked?(
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                <div style={{
                  width:68,height:68,borderRadius:"50%",margin:"0 auto 20px",
                  border:"1.5px solid rgba(200,255,0,0.12)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:22,color:"rgba(200,255,0,0.25)"
                }}>◆</div>
                <div style={{fontSize:8,color:"#1e1e1e",letterSpacing:3,marginBottom:10}}>OWNER ACCESS ONLY</div>
                <div style={{fontSize:9,color:"#151515",letterSpacing:2,marginBottom:28}}>NO ONE ELSE ENTERS THIS DOMAIN</div>
                <div style={{display:"flex",justifyContent:"center",gap:9,marginBottom:14,
                  animation:shake?"shake 0.6s ease":"none"}}>
                  {[0,1,2,3].map(i=>(
                    <input key={i} ref={pinRefs[i]}
                      type="password" inputMode="numeric" maxLength={1}
                      value={digits[i]}
                      onChange={e=>handlePin(i,e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Backspace"&&!digits[i]&&i>0) pinRefs[i-1].current?.focus(); }}
                      className="PIN"
                      style={{
                        width:50,height:58,textAlign:"center",fontSize:22,
                        borderRadius:9,
                        background:pinErr?"rgba(255,50,50,0.035)":"rgba(255,255,255,0.022)",
                        border:`1.5px solid ${pinErr?"rgba(255,50,50,0.28)":"rgba(255,255,255,0.06)"}`,
                        color:"#c8ff00",fontFamily:"'Syne Mono',monospace",outline:"none"
                      }}
                    />
                  ))}
                </div>
                {pinErr&&<div style={{color:"#ff5050",fontSize:8,letterSpacing:2,marginBottom:6}}>ACCESS DENIED</div>}
                <div style={{color:"#121212",fontSize:7,marginTop:14}}>Default: 0000 · Change in code before private deployment</div>
              </div>
            ):(
              <div>
                <div style={{
                  padding:"9px 14px",marginBottom:13,borderRadius:9,
                  background:"rgba(200,255,0,0.025)",border:"1px solid rgba(200,255,0,0.08)",
                  display:"flex",justifyContent:"space-between",alignItems:"center"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#c8ff00",boxShadow:"0 0 7px #c8ff00"}}/>
                    <div>
                      <div style={{fontSize:7,color:"#c8ff00",letterSpacing:2}}>OWNER ACCESS — PRIVATE DOMAIN OPEN</div>
                      <div style={{fontSize:7,color:"#1a1a1a",letterSpacing:1,marginTop:2}}>Every character you write becomes the brain's live logic. Instantly.</div>
                    </div>
                  </div>
                  <button className="B" onClick={()=>{setUnlocked(false);setDigits(["","","",""]);}} style={{
                    padding:"3px 11px",borderRadius:7,background:"transparent",
                    border:"1px solid rgba(255,255,255,0.04)",color:"#222",fontSize:7,letterSpacing:1
                  }}>LOCK</button>
                </div>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,padding:"0 3px"}}>
                  <div style={{fontSize:7,color:"#1a1a1a",letterSpacing:2}}>BRAIN LOGIC · CULTURE · RULES · TRAINING DIRECTIVES</div>
                  <MemPulse on={memPulse}/>
                </div>

                <textarea value={memory} onChange={e=>updateMemory(e.target.value)}
                  style={{
                    width:"100%",minHeight:390,padding:"18px",
                    background:"rgba(200,255,0,0.01)",border:"1px solid rgba(200,255,0,0.08)",
                    borderRadius:15,color:"#c8ff00",fontSize:12,lineHeight:1.95,
                    fontFamily:"'Syne Mono',monospace",outline:"none",resize:"vertical",
                    caretColor:"#c8ff00"
                  }}/>

                <div style={{marginTop:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:7,color:"#151515",letterSpacing:1}}>{memory.length} characters · brain receiving live</div>
                  <button className="B" onClick={()=>{
                    pulse();
                    setZone("home");
                    setTimeout(()=>processInput("Your memory logic was just updated by your owner. Acknowledge the update and briefly describe what new intelligence or directives you have received. Stay fully in character as SOVEREIGN."),150);
                  }} style={{
                    padding:"9px 18px",borderRadius:9,
                    background:"rgba(200,255,0,0.08)",border:"1px solid rgba(200,255,0,0.16)",
                    color:"#c8ff00",fontSize:8,letterSpacing:2.5,fontWeight:800
                  }}>PUSH TO BRAIN ◈</button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* STATUS BAR */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:30,
        padding:"8px 20px",borderTop:"1px solid rgba(255,255,255,0.025)",
        background:"rgba(6,6,6,0.97)",backdropFilter:"blur(12px)",
        display:"flex",justifyContent:"space-between",alignItems:"center"
      }}>
        <div style={{fontSize:7,color:"#121212",letterSpacing:2}}>SOVEREIGN · AUTONOMOUS · SELF-GROWING · SELF-HEALING · MEMORY=BRAIN</div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{fontSize:7,color:"#161616",letterSpacing:1}}>TIMING <span style={{color:"#c8ff00"}}>AUTO</span></div>
          <div style={{fontSize:7,color:"#161616",letterSpacing:1}}>VOICE <span style={{color:"#c8ff00"}}>AUTO</span></div>
          <div style={{fontSize:7,color:"#161616",letterSpacing:1}}>M→B <span style={{color:"#c8ff00"}}>LIVE</span></div>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#c8ff00",animation:"breathe 2s ease infinite"}}/>
        </div>
      </div>
    </div>
  );
}
