export default function SocialHub() {
  return (
    <div style={{
      background: '#0a0c10',
      minHeight: '100vh',
      color: '#eaf2f8',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(180deg,#0c1117,#0b1118)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '20px',
            background: 'linear-gradient(180deg, #10d07a, #07a86e)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            YaadFlex Social Hub
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{
              color: '#cbd6df',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '8px'
            }} data-testid="link-home">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          
          {/* Instagram Section */}
          <div style={{
            background: 'linear-gradient(180deg,#0c1117,#0b1118)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px' }}>📷</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Instagram</h2>
            </div>
            <p style={{ margin: '0 0 16px', color: '#9fb0c0', fontSize: '14px' }}>
              Follow @yardflexglobalvybz for latest updates, driver stories, and Caribbean business culture.
            </p>
            <a 
              href="https://instagram.com/yardflexglobalvybz" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(45deg, #f09433, #dc2743)',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              data-testid="button-instagram"
            >
              Follow on Instagram
            </a>
          </div>

          {/* X (Twitter) Section */}
          <div style={{
            background: 'linear-gradient(180deg,#0c1117,#0b1118)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#000000',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>𝕏</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>X (Twitter)</h2>
            </div>
            <p style={{ margin: '0 0 16px', color: '#9fb0c0', fontSize: '14px' }}>
              Join the conversation @yardflexapp for real-time updates, community discussions, and industry news.
            </p>
            <a 
              href="https://x.com/yardflexapp" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#000000',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid rgba(255,255,255,.1)'
              }}
              data-testid="button-twitter"
            >
              Follow on X
            </a>
          </div>

          {/* Telegram Section */}
          <div style={{
            background: 'linear-gradient(180deg,#0c1117,#0b1118)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#229ED9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px' }}>✈️</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Telegram Community</h2>
            </div>
            <p style={{ margin: '0 0 16px', color: '#9fb0c0', fontSize: '14px' }}>
              Connect directly with drivers, customers, and team members. Get instant support and updates.
            </p>
            <a 
              href="https://t.me/yaadflex" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#229ED9',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              data-testid="button-telegram"
            >
              Join Telegram
            </a>
          </div>

          {/* WhatsApp Section */}
          <div style={{
            background: 'linear-gradient(180deg,#0c1117,#0b1118)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#25D366',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px' }}>💬</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>WhatsApp Business</h2>
            </div>
            <p style={{ margin: '0 0 16px', color: '#9fb0c0', fontSize: '14px' }}>
              Direct business communication for partnerships, driver support, and customer service.
            </p>
            <a 
              href="https://wa.me/1876XXXXXXX" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              data-testid="button-whatsapp"
            >
              Message on WhatsApp
            </a>
          </div>

          {/* Community Guidelines */}
          <div style={{
            background: 'linear-gradient(180deg,#0c1117,#0b1118)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: '16px',
            padding: '24px',
            gridColumn: '1 / -1'
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Community Guidelines</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              color: '#9fb0c0',
              fontSize: '14px'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#10d07a', fontSize: '14px' }}>📱 Stay Professional</h3>
                <p style={{ margin: 0 }}>Keep conversations business-focused and respectful across all platforms.</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#10d07a', fontSize: '14px' }}>🤝 Support Each Other</h3>
                <p style={{ margin: 0 }}>Help fellow drivers and service providers grow their earnings.</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#10d07a', fontSize: '14px' }}>🇯🇲 Caribbean Pride</h3>
                <p style={{ margin: 0 }}>Celebrate our culture while building global connections.</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#10d07a', fontSize: '14px' }}>💡 Share Knowledge</h3>
                <p style={{ margin: 0 }}>Post tips, success stories, and business insights to help everyone succeed.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}