import { useEffect } from 'react';
import { Link } from 'wouter';

export default function ProfessionalLanding() {
  useEffect(() => {
    // Set the year in footer
    const yearElement = document.getElementById("y");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  return (
    <div style={{
      background: '#0a0c10',
      color: '#eaf2f8',
      fontFamily: 'Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial',
      minHeight: '100vh'
    }}>
      <style>{`
        :root{
          --bg:#0a0c10; --card:#10141a; --muted:#9fb0c0; --text:#eaf2f8;
          --brand:#10d07a; --brand-2:#07a86e; --ring:rgba(16,208,122,.35)
        }
        *{box-sizing:border-box}
        body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial}
        a{color:inherit;text-decoration:none}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:18px 0;position:sticky;top:0;background:linear-gradient(180deg,#0a0c10,rgba(10,12,16,.8));backdrop-filter:saturate(1.1) blur(8px);z-index:20;border-bottom:1px solid rgba(255,255,255,.04)}
        .brand{display:flex;gap:10px;align-items:center}
        .logo{width:34px;height:34px;border-radius:10px;background:
          radial-gradient(60% 60% at 30% 30%, #19ffa1 0%, transparent 60%),
          radial-gradient(60% 60% at 70% 70%, #0ecf76 0%, transparent 60%),
          linear-gradient(145deg,#0b5 0%, #083 60%, #062 100%);
          box-shadow:0 0 0 2px rgba(255,255,255,.06), 0 10px 30px rgba(16,208,122,.25)}
        .brand h1{font-size:18px;letter-spacing:.4px;margin:0}
        .nav a.btn{padding:10px 14px;border-radius:10px;background:#121821;border:1px solid rgba(255,255,255,.08)}
        .btn-primary{background:linear-gradient(180deg,var(--brand),var(--brand-2));color:#08140f;border:none}
        .btn-primary:hover{filter:brightness(1.05)}
        .hero{position:relative;overflow:hidden}
        .hero::before{
          content:"";position:absolute;inset:-20%;background:
            radial-gradient(60% 35% at 20% 10%, rgba(16,208,122,.25), transparent 60%),
            radial-gradient(70% 40% at 80% 0%, rgba(16,150,208,.18), transparent 60%),
            radial-gradient(80% 50% at 50% 100%, rgba(0,200,255,.1), transparent 65%);
          filter:blur(40px);z-index:0}
        .hero-inner{display:grid;grid-template-columns:1.15fr 1fr;gap:28px;align-items:center;padding:64px 0;position:relative;z-index:1}
        @media (max-width:980px){.hero-inner{grid-template-columns:1fr;padding:36px 0}}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);
          background:#0f151d;border:1px solid rgba(255,255,255,.06);padding:6px 10px;border-radius:999px}
        .title{font-size:44px;line-height:1.05;margin:14px 0 12px}
        @media (max-width:980px){.title{font-size:36px}}
        .sub{color:#cbd6df;line-height:1.6;margin:0 0 18px}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}
        .card{background:linear-gradient(180deg,#0c1117,#0b1118);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:18px}
        .globe{aspect-ratio:1/1;border-radius:16px;background:
          radial-gradient(100% 60% at 50% 0%, rgba(255,255,255,.05), transparent),
          conic-gradient(from 0deg, rgba(16,208,122,.15), rgba(16,150,208,.15), rgba(16,208,122,.15));
          position:relative;border:1px solid rgba(255,255,255,.06)}
        .orb{position:absolute;width:10px;height:10px;border-radius:50%;background:var(--brand);box-shadow:0 0 18px var(--ring)}
        .orb.one{top:18%;left:18%}.orb.two{top:42%;right:16%}.orb.three{bottom:20%;left:36%}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
        @media (max-width:980px){.grid{grid-template-columns:1fr}}
        .feature{padding:16px;border-radius:14px;background:#0e131a;border:1px solid rgba(255,255,255,.06)}
        .feature h3{margin:0 0 6px;font-size:16px}
        .feature p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);margin:28px 0}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        @media (max-width:980px){.stats{grid-template-columns:repeat(2,1fr)}}
        .stat{background:#0d141b;border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:16px;text-align:center}
        .stat b{font-size:22px}
        .footer{padding:30px 0;color:#aab8c4;font-size:14px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
        .note{font-size:12px;color:#90a2b3}
        .btn{padding:10px 14px;border-radius:10px;background:#121821;border:1px solid rgba(255,255,255,.08);cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}
      `}</style>

      <nav className="nav container">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <h1>YaadFlex Global Vybz</h1>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <a className="btn" href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="link-telegram">Telegram</a>
          <Link href="/links">
            <a className="btn btn-primary" data-testid="button-enter-app">Enter App</a>
          </Link>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">Caribbean-born • Global reach</span>
            <h2 className="title">One App. One World.<br/>Delivery, Jobs, Rides & More.</h2>
            <p className="sub">
              Launching delivery-first to get riders earning now — then expanding into the full
              YaadFlex super-app: rides, services, marketplace, payments, and instant AI translation.
            </p>
            <div className="cta-row">
              <Link href="/links">
                <a className="btn btn-primary" data-testid="button-open-beta">Open App Beta</a>
              </Link>
              <a className="btn" href="mailto:info@yaadflex.com" data-testid="button-partner">Partner with Us</a>
            </div>
            <div className="cta-row" style={{marginTop:'12px'}}>
              <a className="btn btn-primary" href="/signup" data-testid="button-notify-me">Notify Me</a>
              <a className="btn" href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="button-join-telegram">Join Telegram</a>
              <a className="btn" href="https://wa.me/1876XXXXXXX" target="_blank" rel="noopener" data-testid="button-whatsapp">WhatsApp Us</a>
            </div>
            <p className="note" style={{marginTop:'14px'}}>Pilot features with major JA partners. Phased rollout by city.</p>
          </div>

          <div className="card">
            <div className="globe">
              <span className="orb one"></span><span className="orb two"></span><span className="orb three"></span>
            </div>
            <div className="grid">
              <div className="feature">
                <h3>Delivery First</h3>
                <p>Onboard e-riders fast. Simple requests, tips, and weekly payouts.</p>
              </div>
              <div className="feature">
                <h3>Jobs & Gigs</h3>
                <p>Hire trusted talent for home services, hotels, logistics and more.</p>
              </div>
              <div className="feature">
                <h3>AI Translator</h3>
                <p>Chat in your language. They see it in theirs — voice or text.</p>
              </div>
              <div className="feature">
                <h3>Accessible by Design</h3>
                <p>Voice-first flows for blind & low-vision users. Clean text modes.</p>
              </div>
              <div className="feature">
                <h3>Secure Payments</h3>
                <p>Escrow & payouts. Bank partners + PayPal/WiPay pilots.</p>
              </div>
              <div className="feature">
                <h3>Fuel Rewards</h3>
                <p>Points or cashback at partner stations for riders & drivers.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="divider"></div>

        <section className="stats">
          <div className="stat"><b>85%</b><div className="note">Up to worker take-home</div></div>
          <div className="stat"><b>10+ cities</b><div className="note">Pilot expansion plan</div></div>
          <div className="stat"><b>24/7</b><div className="note">Support as we scale</div></div>
          <div className="stat"><b>∞</b><div className="note">Translator languages</div></div>
        </section>

        <div className="divider"></div>

        <section className="card" style={{display:'grid',gap:'14px',alignItems:'center',gridTemplateColumns:'1.2fr 1fr'}}>
          <div>
            <h3 style={{margin:'0 0 6px'}}>Be first in line</h3>
            <p className="sub" style={{margin:'0 0 12px'}}>
              Get early access invites, rider onboarding, and partner perks.
            </p>
            <form action="/signup" method="post" style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <input name="email" type="email" placeholder="you@example.com" required
                     style={{flex:'1',minWidth:'240px',background:'#0c1117',border:'1px solid rgba(255,255,255,.08)',color:'#fff',borderRadius:'12px',padding:'12px 14px',outline:'2px solid transparent',outlineOffset:'2px'}}
                     data-testid="input-email" />
              <button className="btn btn-primary" type="submit" data-testid="button-notify">Notify Me</button>
            </form>
          </div>
          <div className="feature">
            <h3>Partner spotlight</h3>
            <p className="note">Restaurants, stores, hotels & fleets — talk to us about pilots and city launches.</p>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <div>© <span id="y"></span> YaadFlex Global Vybz</div>
        <div style={{display:'flex',gap:'14px'}}>
          <a href="https://instagram.com/yaadflex" target="_blank" rel="noopener" data-testid="link-instagram">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>📷</span> Instagram
          </a>
          <a href="https://facebook.com/yaadflex" target="_blank" rel="noopener" data-testid="link-facebook">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>📘</span> Facebook
          </a>
          <a href="https://tiktok.com/@yaadflex" target="_blank" rel="noopener" data-testid="link-tiktok">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>🎵</span> TikTok
          </a>
          <a href="https://twitter.com/yaadflex" target="_blank" rel="noopener" data-testid="link-twitter">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>🐦</span> Twitter
          </a>
          <a href="https://youtube.com/@yaadflex" target="_blank" rel="noopener" data-testid="link-youtube">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>📺</span> YouTube
          </a>
          <a href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="link-telegram-footer">
            <span style={{width:'20px',height:'20px',verticalAlign:'middle',display:'inline-block',marginRight:'4px'}}>✈️</span> Telegram
          </a>
        </div>
      </footer>
    </div>
  );
}