import { useState } from "react";
import { GlamourLayout, GlamourPresets } from "@/components/GlamourLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";

export default function GlamourShowcase() {
  const [currentPreset, setCurrentPreset] = useState('medium');
  const [customSettings, setCustomSettings] = useState({
    intensity: 'medium' as 'subtle' | 'medium' | 'bold',
    backgroundStyle: 'luxury' as any,
    useWallpaper: true,
    wallpaperOpacity: 0.08,
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true,
    showYFWatermark: true,
    watermarkPosition: 'bottom-right' as any,
    watermarkOpacity: 0.15,
    enableScrollEffects: true,
    enableHoverEffects: true,
    disableOnMobile: false,
  });

  const presetConfigs = {
    custom: customSettings,
    ...GlamourPresets
  } as const;

  const currentConfig = (currentPreset in presetConfigs ? presetConfigs[currentPreset as keyof typeof presetConfigs] : customSettings) as typeof customSettings;

  return (
    <GlamourLayout
      {...currentConfig}
      title="YaadFlex Glamour Showcase - Luxury Design System"
      description="Experience the ultimate luxury design system with captivating animations, floating elements, and glamorous effects. Transform any page into a stunning visual experience."
      ogImage="/images/glamour-showcase-preview.jpg"
    >
      <div className="min-h-screen relative z-20">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Back to Home Link */}
            <div className="mb-8">
              <Link to="/">
                <Button variant="outline" className="glass-light border-glamour">
                  ← Back to Home
                </Button>
              </Link>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black mb-6 text-glamour-glow" data-testid="title-showcase">
              Glamour Showcase
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Experience the power of the <span className="text-glamour-glow font-bold">GlamourLayout</span> component - 
              transforming any page into a luxury, captivating, attention-grabbing experience.
            </p>

            {/* Current Settings Display */}
            <Card className="card-glamour-enhanced mb-12 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-glamour-glow">Current Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Preset:</strong> {currentPreset}
                  </div>
                  <div>
                    <strong>Intensity:</strong> {currentConfig.intensity}
                  </div>
                  <div>
                    <strong>Particles:</strong> {currentConfig.enableParticles ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Floating Elements:</strong> {currentConfig.enableFloatingElements ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Ambient Lighting:</strong> {currentConfig.enableAmbientLighting ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>YF Watermark:</strong> {currentConfig.showYFWatermark ? '✅' : '❌'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Control Panel */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12 text-glamour-glow">
              Live Configuration Panel
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Preset Selection */}
              <Card className="card-glamour-enhanced">
                <CardHeader>
                  <CardTitle>Quick Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.keys(presetConfigs).map((presetKey) => (
                      <Button
                        key={presetKey}
                        variant={currentPreset === presetKey ? "default" : "outline"}
                        className={`w-full justify-start ${currentPreset === presetKey ? 'bg-glamour-gradient' : 'border-glamour'}`}
                        onClick={() => setCurrentPreset(presetKey as keyof typeof presetConfigs)}
                        data-testid={`preset-${presetKey}`}
                      >
                        <span className="capitalize font-bold">{presetKey}</span>
                        {presetKey === 'subtle' && <span className="ml-2 text-xs opacity-75">Minimal effects</span>}
                        {presetKey === 'medium' && <span className="ml-2 text-xs opacity-75">Balanced glamour</span>}
                        {presetKey === 'bold' && <span className="ml-2 text-xs opacity-75">Maximum impact</span>}
                        {presetKey === 'corporate' && <span className="ml-2 text-xs opacity-75">Professional</span>}
                        {presetKey === 'party' && <span className="ml-2 text-xs opacity-75">Caribbean vibes</span>}
                        {presetKey === 'custom' && <span className="ml-2 text-xs opacity-75">Your settings</span>}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Controls */}
              <Card className="card-glamour-enhanced">
                <CardHeader>
                  <CardTitle>Custom Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Fine-tune your glamour experience</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Intensity Control */}
                  <div className="space-y-2">
                    <Label>Intensity Level</Label>
                    <Select 
                      value={customSettings.intensity} 
                      onValueChange={(value: any) => {
                        setCustomSettings(prev => ({ ...prev, intensity: value }));
                        setCurrentPreset('custom');
                      }}
                    >
                      <SelectTrigger className="border-glamour">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subtle">Subtle - Minimal effects</SelectItem>
                        <SelectItem value="medium">Medium - Balanced glamour</SelectItem>
                        <SelectItem value="bold">Bold - Maximum impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Background Style */}
                  <div className="space-y-2">
                    <Label>Background Style</Label>
                    <Select 
                      value={customSettings.backgroundStyle} 
                      onValueChange={(value: any) => {
                        setCustomSettings(prev => ({ ...prev, backgroundStyle: value }));
                        setCurrentPreset('custom');
                      }}
                    >
                      <SelectTrigger className="border-glamour">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="caribbean">Caribbean</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="textured">Textured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Opacity Controls */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Wallpaper Opacity: {(customSettings.wallpaperOpacity * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[customSettings.wallpaperOpacity * 100]}
                        onValueChange={([value]) => {
                          setCustomSettings(prev => ({ ...prev, wallpaperOpacity: value / 100 }));
                          setCurrentPreset('custom');
                        }}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Watermark Opacity: {(customSettings.watermarkOpacity * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[customSettings.watermarkOpacity * 100]}
                        onValueChange={([value]) => {
                          setCustomSettings(prev => ({ ...prev, watermarkOpacity: value / 100 }));
                          setCurrentPreset('custom');
                        }}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Toggle Controls */}
                  <div className="space-y-4">
                    {[
                      { key: 'useWallpaper', label: 'Show Wallpaper' },
                      { key: 'enableParticles', label: 'Floating Particles' },
                      { key: 'enableFloatingElements', label: 'Floating Elements' },
                      { key: 'enableAmbientLighting', label: 'Ambient Lighting' },
                      { key: 'showYFWatermark', label: 'YF Watermark' },
                      { key: 'enableScrollEffects', label: 'Scroll Effects' },
                      { key: 'enableHoverEffects', label: 'Hover Effects' },
                      { key: 'disableOnMobile', label: 'Disable on Mobile' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <Switch
                          id={key}
                          checked={customSettings[key as keyof typeof customSettings] as boolean}
                          onCheckedChange={(checked) => {
                            setCustomSettings(prev => ({ ...prev, [key]: checked }));
                            setCurrentPreset('custom');
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Content Sections */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12 text-glamour-glow">
              Demo Content
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Feature Cards */}
              {[
                {
                  title: "Luxury Design",
                  description: "Premium visual effects that captivate and engage users with sophisticated animations.",
                  icon: "💎",
                  color: "emerald"
                },
                {
                  title: "Floating Elements",
                  description: "Magical floating symbols and particles that create depth and visual interest.",
                  icon: "✨",
                  color: "gold"
                },
                {
                  title: "Ambient Lighting",
                  description: "Subtle lighting effects that create atmosphere and enhance the luxury feel.",
                  icon: "🌟",
                  color: "rose"
                },
                {
                  title: "YF Branding",
                  description: "Elegant watermark system that maintains brand presence without interference.",
                  icon: "👑",
                  color: "orange"
                },
                {
                  title: "Responsive Design",
                  description: "Optimized performance across all devices with mobile-friendly adaptations.",
                  icon: "📱",
                  color: "purple"
                },
                {
                  title: "SEO Enhanced",
                  description: "Built-in SEO optimization with Open Graph tags for social media sharing.",
                  icon: "🚀",
                  color: "blue"
                }
              ].map((feature, index) => (
                <Card key={index} className="card-glamour-enhanced hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-glamour-glow">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Example */}
            <Card className="card-glamour-enhanced">
              <CardHeader>
                <CardTitle className="text-glamour-glow">How to Use GlamourLayout</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/20 p-4 rounded-lg overflow-x-auto text-sm">
{`import { GlamourLayout, GlamourPresets } from "@/components/GlamourLayout";

// Basic usage
<GlamourLayout intensity="medium">
  <YourPageContent />
</GlamourLayout>

// With custom settings
<GlamourLayout
  intensity="bold"
  backgroundStyle="luxury"
  enableParticles={true}
  enableFloatingElements={true}
  showYFWatermark={true}
  title="My Glamorous Page"
  description="A captivating user experience"
>
  <YourPageContent />
</GlamourLayout>

// Using presets
<GlamourLayout {...GlamourPresets.party}>
  <YourPageContent />
</GlamourLayout>`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance Info */}
        <section className="py-16 px-6 bg-muted/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-8 text-glamour-glow">
              Performance & Accessibility
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="card-glamour-enhanced">
                <CardHeader>
                  <CardTitle>🚀 Optimized Performance</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-2">
                  <p>✅ GPU-accelerated animations</p>
                  <p>✅ Reduced effects on mobile devices</p>
                  <p>✅ Efficient CSS animations</p>
                  <p>✅ Will-change optimizations</p>
                  <p>✅ Conditional rendering based on device capabilities</p>
                </CardContent>
              </Card>

              <Card className="card-glamour-enhanced">
                <CardHeader>
                  <CardTitle>♿ Accessibility Features</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-2">
                  <p>✅ Respects prefers-reduced-motion</p>
                  <p>✅ Keyboard navigation support</p>
                  <p>✅ Screen reader friendly</p>
                  <p>✅ High contrast compatibility</p>
                  <p>✅ Semantic HTML structure</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </GlamourLayout>
  );
}