import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MapPin, Car, Users, Globe, Sparkles } from 'lucide-react';
import { InteractiveMap } from '@/components/InteractiveMap';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ModernLanding() {
  return (
    <div className="min-h-screen text-[#e6eef6]" style={{
      background: `
        radial-gradient(1200px 600px at 70% -10%, rgba(109,167,255,0.10), transparent 60%),
        radial-gradient(900px 500px at 10% -10%, rgba(180,197,214,0.08), transparent 60%),
        #0c1116
      `
    }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl shadow-xl"
            style={{
              background: `
                radial-gradient(80% 80% at 20% 20%, rgba(109,167,255,.9), transparent 60%),
                radial-gradient(80% 80% at 80% 80%, rgba(180,197,214,.8), transparent 60%), 
                #0e141b
              `,
              boxShadow: '0 8px 30px rgba(0,0,0,.45), inset 0 0 16px rgba(109,167,255,.25)'
            }}
          />
          <h1 className="text-lg font-bold tracking-wider">YaadFlex Global Vybz</h1>
        </div>
        
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <Button 
            className="bg-gradient-to-r from-[#6da7ff] to-[#8ec1ff] text-[#06101a] font-bold border-0 hover:shadow-lg" 
            asChild
          >
            <Link href="/driver-registration" data-testid="button-signup">
              Get Early Access
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-[#1b2633] bg-[rgba(255,255,255,0.03)] text-[#e6eef6] hover:bg-[#28394d] hover:border-[#28394d]" 
            asChild
          >
            <Link href="/links" data-testid="button-enter-app">
              Enter Platform
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#1b2633] rounded-full bg-[rgba(255,255,255,0.03)]">
              <div className="w-2 h-2 rounded-full bg-[#6da7ff] shadow-[0_0_10px_#6da7ff]"></div>
              <span className="text-[#9fb0c2] font-semibold text-sm">Caribbean-born. World-class.</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              A{' '}
              <span 
                className="font-bold"
                style={{
                  background: 'linear-gradient(135deg, #eaf2ff, #8ec1ff 60%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 8px 80px rgba(142,193,255,.18)'
                }}
              >
                Super-App
              </span>
              {' '}for Rides, Delivery & More.
            </h2>

            <p className="text-lg text-[#9fb0c2] leading-relaxed">
              Serious design. Serious performance. Book a driver, send a package, shop local & global—manage it all in one place.
            </p>
            
            <div className="flex gap-3 flex-wrap">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#6da7ff] to-[#8ec1ff] text-[#06101a] font-bold border-0 hover:shadow-xl" 
                asChild
              >
                <Link href="/driver-registration" data-testid="button-main-cta">
                  Get Early Access
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-[#1b2633] bg-[rgba(255,255,255,0.03)] text-[#e6eef6] hover:bg-[#28394d]" 
                asChild
              >
                <Link href="/ride-booking" data-testid="button-demo">
                  View Demo
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                '⚡ Fast',
                '🔒 Secure', 
                '🌍 Multi-language',
                '💳 Smart Payouts'
              ].map((chip) => (
                <span 
                  key={chip}
                  className="px-3 py-1.5 text-sm border border-[#1b2633] rounded-full bg-[rgba(255,255,255,0.03)] text-[#cdd9e6]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Interactive Preview */}
          <div 
            className="relative border border-[#1b2633] rounded-3xl p-6 min-h-[400px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              boxShadow: '0 12px 40px rgba(0,0,0,.35)'
            }}
          >
            {/* Orbital Ring */}
            <div 
              className="absolute -top-10 -right-16 w-[520px] h-[520px] border border-dashed border-[rgba(142,193,255,.25)] rounded-full animate-spin"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(142,193,255,.15))',
                animationDuration: '26s'
              }}
            />
            
            {/* Live Badge */}
            <div className="absolute top-4 right-4 px-3 py-2 rounded-full bg-[rgba(109,167,255,.12)] border border-[rgba(109,167,255,.3)] text-[#d8e6ff] text-sm font-bold">
              Live Preview
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: '🚖', title: 'Rides', desc: 'Pro drivers' },
                { icon: '📦', title: 'Delivery', desc: 'Fast & reliable' },
                { icon: '🛒', title: 'Shop', desc: 'Local & global' },
                { icon: '✈️', title: 'Travel', desc: 'Flights & stays' },
                { icon: '💼', title: 'Work', desc: 'Gigs & equipment' },
                { icon: '💳', title: 'Pay', desc: 'Smart payouts' }
              ].map((item) => (
                <div 
                  key={item.title}
                  className="border border-[#1b2633] rounded-2xl p-3 bg-[rgba(255,255,255,0.03)] text-center"
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-semibold text-[#dfe9f5] text-sm">{item.title}</div>
                  <div className="text-xs text-[#9fb0c2]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold mb-8 tracking-wide">Elite Feature Set</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: 'Precision Rides', 
              desc: 'Dark basemap, smart pricing, multi-stop, wait-time add-ons, safe zones.' 
            },
            { 
              title: 'Unified Commerce', 
              desc: 'From supermarkets to boutiques—inventory, carts, secure checkout in one system.' 
            },
            { 
              title: 'Global-Ready Travel', 
              desc: 'Trips, flights & hotels with local services at destination.' 
            },
            { 
              title: 'Workforce Engine', 
              desc: 'Jobs, gigs, equipment rentals—hire, track, and pay in-app.' 
            },
            { 
              title: 'Smart Payments', 
              desc: 'Transparent fares, weekly driver payouts, dispute center, analytics for vendors.' 
            },
            { 
              title: 'Voice + Translate', 
              desc: 'Accessibility-first: voice controls and instant translation in chats.' 
            }
          ].map((feature) => (
            <div 
              key={feature.title}
              className="border border-[#1b2633] rounded-2xl p-6 bg-[rgba(255,255,255,0.03)]"
            >
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-[#9fb0c2] text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Be First In</h3>
          <p className="text-[#9fb0c2] max-w-md mx-auto">
            Enter your email to join the private beta and get early driver/vendor onboarding.
          </p>
          
          <div className="flex gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 border border-[#1b2633] rounded-xl bg-[rgba(255,255,255,0.03)] text-[#e6eef6] placeholder-[#9fb0c2]"
            />
            <Button 
              className="bg-gradient-to-r from-[#6da7ff] to-[#8ec1ff] text-[#06101a] font-bold border-0"
            >
              Request Invite
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-[#1b2633]">
        <div className="flex justify-between items-center text-[#95a6ba] text-sm">
          <div>© 2025 YaadFlex Global Vybz</div>
          <div>Kingston • Montego Bay • Global</div>
        </div>
      </footer>

    </div>
  );
}