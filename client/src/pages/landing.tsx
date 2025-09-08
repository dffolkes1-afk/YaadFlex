import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CountryThemeSelector } from "@/components/CountryThemeSelector";
import { Link } from "wouter";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Country Theme Selector */}
      <CountryThemeSelector />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl text-primary shield-glow" data-testid="logo-shield">
                🛡️
              </div>
              <span className="text-2xl font-bold text-foreground" data-testid="brand-name">YardFlex</span>
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium" data-testid="security-badge">SECURE</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('security')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-security"
              >
                Security
              </button>
              <button 
                onClick={() => scrollToSection('global')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-global"
              >
                Global
              </button>
              <button 
                onClick={() => scrollToSection('compliance')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-compliance"
              >
                Compliance
              </button>
              <Link 
                href="/emblem"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-emblem"
              >
                World Emblem
              </Link>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors security-pulse"
              data-testid="button-get-protected"
            >
              Get Protected
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden fortress-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
        </div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-accent" data-testid="hero-security-tag">
                  <span className="text-lg">🔒</span>
                  <span className="text-sm font-semibold tracking-wide">WORLD'S MOST SECURE PLATFORM</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight" data-testid="hero-title">
                  <span className="text-foreground">Impenetrable</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Global Finance</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="hero-description">
                  The only financial platform with self-defending technology, international law enforcement integration, and beast mode security that defeats any threat.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLogin}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 security-pulse"
                  data-testid="button-beast-mode"
                >
                  <span className="mr-2">🛡️</span>
                  Activate Beast Mode
                </Button>
                <Button 
                  variant="outline"
                  className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
                  data-testid="button-demo"
                >
                  <span className="mr-2">▶️</span>
                  Watch Defense Demo
                </Button>
              </div>

              {/* Security Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center" data-testid="stat-uptime">
                  <div className="text-2xl font-bold text-primary">99.99%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center" data-testid="stat-breaches">
                  <div className="text-2xl font-bold text-accent">0</div>
                  <div className="text-sm text-muted-foreground">Breaches</div>
                </div>
                <div className="text-center" data-testid="stat-countries">
                  <div className="text-2xl font-bold text-chart-3">195</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-card/50 backdrop-blur-sm border border-border security-pulse" data-testid="hero-security-card">
                <CardContent className="p-8">
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-2 text-chart-3">
                      <div className="w-3 h-3 bg-chart-3 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold" data-testid="defense-status">ACTIVE DEFENSE</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-6">
                    <div className="text-8xl text-primary shield-glow" data-testid="shield-icon">🛡️</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground" data-testid="fortress-title">Fortress Protocol Active</h3>
                      <p className="text-muted-foreground" data-testid="fortress-description">Multi-layer defense system monitoring global threats</p>
                    </div>
                    
                    {/* Defense layers */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg" data-testid="defense-maze">
                        <span className="text-sm">Maze Defense System</span>
                        <span className="text-chart-3 text-sm"><span className="mr-1">✅</span> Active</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg" data-testid="defense-ai">
                        <span className="text-sm">Self-Defending AI</span>
                        <span className="text-chart-3 text-sm"><span className="mr-1">✅</span> Engaged</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg" data-testid="defense-interpol">
                        <span className="text-sm">Interpol Integration</span>
                        <span className="text-chart-3 text-sm"><span className="mr-1">✅</span> Connected</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-4" data-testid="features-title">
              Ultimate Financial Arsenal
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="features-description">
              Military-grade features that make YardFlex the world's most secure and powerful financial platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Global Money Transfer */}
            <Card className="bg-card border border-border hover:border-primary/50 transition-all transform hover:scale-105" data-testid="feature-global-transfer">
              <CardContent className="p-8">
                <div className="text-primary text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Global Money Transfer</h3>
                <p className="text-muted-foreground mb-6">Send money to any phone number worldwide instantly with military-grade encryption.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>195 countries supported
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Instant transfers
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Zero breach guarantee
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash-to-Digital Conversion */}
            <Card className="bg-card border border-border hover:border-primary/50 transition-all transform hover:scale-105" data-testid="feature-cash-digital">
              <CardContent className="p-8">
                <div className="text-accent text-4xl mb-4">🪙</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Cash-to-Digital Fortress</h3>
                <p className="text-muted-foreground mb-6">Convert physical cash to secure digital money through our impenetrable banking network.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Bank deposit integration
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Real-time conversion
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Fortress-level security
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Partner Integration */}
            <Card className="bg-card border border-border hover:border-primary/50 transition-all transform hover:scale-105" data-testid="feature-business-network">
              <CardContent className="p-8">
                <div className="text-chart-2 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Business Defense Network</h3>
                <p className="text-muted-foreground mb-6">Connect with any business globally through our secure partner ecosystem.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Global business network
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Secure transactions
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Partner verification
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Self-Defending Technology */}
            <Card className="bg-card border border-primary/30 hover:border-primary/70 transition-all transform hover:scale-105 security-pulse" data-testid="feature-self-defending">
              <CardContent className="p-8">
                <div className="text-destructive text-4xl mb-4">🦠</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Self-Defending AI</h3>
                <p className="text-muted-foreground mb-6">Revolutionary technology that fights back against hackers with counter-attack protocols.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Active threat hunting
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Counter-attack systems
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Automated defense
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maze Defense System */}
            <Card className="bg-card border border-border hover:border-primary/50 transition-all transform hover:scale-105" data-testid="feature-maze-defense">
              <CardContent className="p-8">
                <div className="text-chart-4 text-4xl mb-4">🌀</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Maze Defense Protocol</h3>
                <p className="text-muted-foreground mb-6">Attackers get lost in our security maze while we track and eliminate threats.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Confuse attackers
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Track threats
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Eliminate risks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beast Mode Security */}
            <Card className="bg-card border border-accent/30 hover:border-accent/70 transition-all transform hover:scale-105" data-testid="feature-beast-mode">
              <CardContent className="p-8">
                <div className="text-accent text-4xl mb-4">🐲</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Beast Mode Protection</h3>
                <p className="text-muted-foreground mb-6">Ultimate security mode that defeats any threat with overwhelming defensive power.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Unbreakable encryption
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Threat elimination
                  </div>
                  <div className="flex items-center text-chart-3">
                    <span className="mr-2">✅</span>Zero vulnerabilities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* International Security Section */}
      <section id="security" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-accent" data-testid="security-badge-tag">
                  <span className="text-lg">🎖️</span>
                  <span className="text-sm font-semibold tracking-wide">INTERNATIONAL LAW ENFORCEMENT</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground" data-testid="security-title">
                  Global Security Alliance
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed" data-testid="security-description">
                  Direct integration with Interpol, FBI, and international security agencies for ultimate protection and compliance.
                </p>
              </div>

              {/* Security Certifications */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center" data-testid="cert-iso">
                  <CardContent className="p-6">
                    <div className="text-3xl text-primary mb-3">🏆</div>
                    <div className="text-lg font-bold text-foreground">ISO 27001</div>
                    <div className="text-sm text-muted-foreground">Certified</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="cert-soc">
                  <CardContent className="p-6">
                    <div className="text-3xl text-chart-3 mb-3">🛡️</div>
                    <div className="text-lg font-bold text-foreground">SOC 2 Type II</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="cert-pci">
                  <CardContent className="p-6">
                    <div className="text-3xl text-accent mb-3">⚖️</div>
                    <div className="text-lg font-bold text-foreground">PCI DSS</div>
                    <div className="text-sm text-muted-foreground">Level 1</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="cert-gdpr">
                  <CardContent className="p-6">
                    <div className="text-3xl text-chart-4 mb-3">🌍</div>
                    <div className="text-lg font-bold text-foreground">GDPR</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-card/30 backdrop-blur-sm border border-border" data-testid="security-partnerships">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="partnerships-title">Active Security Partnerships</h3>
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl h-48 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🌐</div>
                        <div className="text-lg font-bold text-foreground">Global Network</div>
                      </div>
                    </div>
                  </div>

                  {/* Law enforcement connections */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg" data-testid="partner-interpol">
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">🌎</span>
                        <span className="font-semibold text-foreground">Interpol</span>
                      </div>
                      <span className="text-chart-3 text-sm">
                        <span className="mr-1">🔗</span>Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg" data-testid="partner-fbi">
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">🇺🇸</span>
                        <span className="font-semibold text-foreground">FBI</span>
                      </div>
                      <span className="text-chart-3 text-sm">
                        <span className="mr-1">🔗</span>Integrated
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg" data-testid="partner-europol">
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">🇪🇺</span>
                        <span className="font-semibold text-foreground">Europol</span>
                      </div>
                      <span className="text-chart-3 text-sm">
                        <span className="mr-1">🔗</span>Partnered
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg" data-testid="partner-agencies">
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">🛡️</span>
                        <span className="font-semibold text-foreground">National Agencies</span>
                      </div>
                      <span className="text-chart-3 text-sm">
                        <span className="mr-1">🔗</span>195+ Connected
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section id="global" className="py-20 bg-muted/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-4" data-testid="global-title">
              Fortress-Level Global Coverage
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="global-description">
              Impenetrable security across every continent with local compliance and international protection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center" data-testid="global-stat-countries">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-primary mb-4">195</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Countries Protected</h3>
                <p className="text-muted-foreground">Complete global coverage with local security compliance</p>
              </CardContent>
            </Card>
            <Card className="text-center" data-testid="global-stat-monitoring">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-accent mb-4">24/7</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Security Monitoring</h3>
                <p className="text-muted-foreground">Round-the-clock threat detection and elimination</p>
              </CardContent>
            </Card>
            <Card className="text-center" data-testid="global-stat-breaches">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-chart-3 mb-4">0</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Security Breaches</h3>
                <p className="text-muted-foreground">Perfect security record since launch</p>
              </CardContent>
            </Card>
          </div>

          {/* Global map visualization */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border" data-testid="global-defense-network">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="network-title">Real-Time Global Defense Network</h3>
                <p className="text-muted-foreground" data-testid="network-description">Live monitoring of security systems worldwide</p>
              </div>
              
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl text-white shield-glow">🌍</div>
                    <div className="text-2xl font-bold text-white">Global Fortress Active</div>
                    <div className="text-white/80">Protecting financial transactions worldwide</div>
                  </div>
                </div>
              </div>

              {/* Regional security status */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl text-center" data-testid="region-americas">
                  <div className="text-lg font-bold text-foreground">Americas</div>
                  <div className="text-chart-3 text-sm mt-1">
                    <span className="mr-1">🛡️</span>Secured
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-center" data-testid="region-europe">
                  <div className="text-lg font-bold text-foreground">Europe</div>
                  <div className="text-chart-3 text-sm mt-1">
                    <span className="mr-1">🛡️</span>Protected
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-center" data-testid="region-asia">
                  <div className="text-lg font-bold text-foreground">Asia-Pacific</div>
                  <div className="text-chart-3 text-sm mt-1">
                    <span className="mr-1">🛡️</span>Fortified
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-center" data-testid="region-africa">
                  <div className="text-lg font-bold text-foreground">Africa & ME</div>
                  <div className="text-chart-3 text-sm mt-1">
                    <span className="mr-1">🛡️</span>Defended
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Identity Verification Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Card className="bg-card/30 backdrop-blur-sm border border-border" data-testid="identity-verification">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl h-64 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔐</div>
                      <div className="text-lg font-bold text-foreground">Identity Shield</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground" data-testid="identity-title">Multi-Layer Identity Shield</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg" data-testid="verification-biometric">
                        <span className="text-sm font-medium">Biometric Scan</span>
                        <span className="text-chart-3 text-xs">
                          <span className="mr-1">👆</span>Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg" data-testid="verification-document">
                        <span className="text-sm font-medium">Document Analysis</span>
                        <span className="text-chart-3 text-xs">
                          <span className="mr-1">🆔</span>Authenticated
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg" data-testid="verification-behavioral">
                        <span className="text-sm font-medium">Behavioral Pattern</span>
                        <span className="text-chart-3 text-xs">
                          <span className="mr-1">🧠</span>Learning
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg" data-testid="verification-database">
                        <span className="text-sm font-medium">Global Database</span>
                        <span className="text-chart-3 text-xs">
                          <span className="mr-1">🗄️</span>Cross-referenced
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-accent" data-testid="identity-badge">
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-semibold tracking-wide">ADVANCED IDENTITY VERIFICATION</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground" data-testid="identity-main-title">
                  Impenetrable Identity Protection
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed" data-testid="identity-main-description">
                  Multiple security codes, biometric verification, and AI-powered identity analysis ensure only you can access your fortress.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4" data-testid="feature-biometric">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="text-primary">👁️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Biometric Fortress</h4>
                    <p className="text-muted-foreground">Fingerprint, facial recognition, and voice analysis create an unbreachable identity barrier.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="feature-multi-code">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <span className="text-accent">🗝️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Multi-Code Security</h4>
                    <p className="text-muted-foreground">Dynamic security codes, hardware tokens, and encrypted passwords work together.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="feature-ai-behavioral">
                  <div className="flex-shrink-0 w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center">
                    <span className="text-chart-3">🧠</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">AI Behavioral Analysis</h4>
                    <p className="text-muted-foreground">Machine learning tracks your patterns to detect and prevent unauthorized access attempts.</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all transform hover:scale-105"
                data-testid="button-secure-identity"
              >
                <span className="mr-2">🛡️</span>
                Secure My Identity
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="compliance" className="py-20 fortress-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black text-foreground" data-testid="cta-title">
                Join the Financial Fortress
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="cta-description">
                Experience the world's most secure financial platform with impenetrable protection and global reach.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={handleLogin}
                className="bg-primary text-primary-foreground px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 security-pulse"
                data-testid="button-activate-beast-mode"
              >
                <span className="mr-2">🚀</span>
                Activate Beast Mode Now
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-accent text-accent px-10 py-5 rounded-xl font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-all"
                data-testid="button-security-demo"
              >
                <span className="mr-2">🛡️</span>
                View Security Demo
              </Button>
            </div>

            {/* Final security assurance */}
            <Card className="bg-card/30 backdrop-blur-sm border border-border mt-12" data-testid="final-assurance">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div data-testid="assurance-zero-breaches">
                    <div className="text-3xl text-chart-3 mb-3">✅</div>
                    <div className="font-bold text-foreground">Zero Breaches</div>
                    <div className="text-sm text-muted-foreground">Perfect security record</div>
                  </div>
                  <div data-testid="assurance-global-coverage">
                    <div className="text-3xl text-primary mb-3">🌍</div>
                    <div className="font-bold text-foreground">Global Coverage</div>
                    <div className="text-sm text-muted-foreground">195 countries protected</div>
                  </div>
                  <div data-testid="assurance-military-grade">
                    <div className="text-3xl text-accent mb-3">🏆</div>
                    <div className="font-bold text-foreground">Military-Grade</div>
                    <div className="text-sm text-muted-foreground">Fortress-level security</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl text-primary shield-glow">🛡️</div>
                <span className="text-xl font-bold text-foreground" data-testid="footer-brand">YardFlex</span>
              </div>
              <p className="text-muted-foreground" data-testid="footer-description">The world's most secure financial platform with impenetrable protection and global reach.</p>
              <div className="flex space-x-4">
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" data-testid="social-twitter">🐦</span>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" data-testid="social-linkedin">💼</span>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" data-testid="social-facebook">📘</span>
              </div>
            </div>

            <div data-testid="footer-security">
              <h4 className="font-bold text-foreground mb-4">Security</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Beast Mode Protection</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Maze Defense System</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Self-Defending AI</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Global Compliance</a></li>
              </ul>
            </div>

            <div data-testid="footer-features">
              <h4 className="font-bold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Global Money Transfer</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cash-to-Digital</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Business Integration</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Identity Protection</a></li>
              </ul>
            </div>

            <div data-testid="footer-support">
              <h4 className="font-bold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Security Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground" data-testid="footer-copyright">
            <p>&copy; 2024 YardFlex. All rights reserved. Protected by fortress-level security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
