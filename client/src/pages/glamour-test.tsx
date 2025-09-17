import { 
  GlamorousButton, 
  LuxuryButton, 
  PremiumButton, 
  GlamourButton,
  NeonButton,
  PartyButton 
} from "@/components/ui/glamorous-button";
import { 
  GlamorousCard, 
  GlamorousCardHeader, 
  GlamorousCardTitle, 
  GlamorousCardDescription, 
  GlamorousCardContent,
  LuxuryCard,
  PremiumCard,
  HolographicCard
} from "@/components/ui/glamorous-card";
import { 
  GlamorousSection, 
  LuxuryHeroSection,
  PremiumSection,
  GradientSection 
} from "@/components/ui/glamorous-section";
import { GlamourLayout } from "@/components/GlamourLayout";

export default function GlamourTest() {
  return (
    <GlamourLayout 
      intensity="medium"
      title="Glamorous Components Test - YaadFlex"
      description="Testing luxury UI components with premium effects and animations"
      backgroundStyle="luxury"
      enableParticles={true}
      enableAmbientLighting={true}
      enableFloatingElements={true}
    >
      {/* Hero Section */}
      <LuxuryHeroSection data-testid="section-hero-test">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black text-glamour mb-6">
            ✨ Glamorous Components Test ✨
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the luxury and glamour of YaadFlex's premium UI components
          </p>
          
          {/* Button Showcase */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <LuxuryButton data-testid="test-luxury-button">
              Luxury Button ✨
            </LuxuryButton>
            <PremiumButton data-testid="test-premium-button">
              Premium Gold 💎
            </PremiumButton>
            <GlamourButton data-testid="test-glamour-button">
              Glamour Rose 🌹
            </GlamourButton>
            <NeonButton data-testid="test-neon-button">
              Neon Cyber ⚡
            </NeonButton>
            <PartyButton data-testid="test-party-button">
              Party Mode 🎉
            </PartyButton>
          </div>
        </div>
      </LuxuryHeroSection>

      {/* Cards Showcase Section */}
      <PremiumSection data-testid="section-cards-showcase">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gold-glow mb-4">
              💎 Glamorous Cards Collection
            </h2>
            <p className="text-lg text-muted-foreground">
              Featuring glass morphism, 3D effects, and luxury animations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Luxury Card */}
            <LuxuryCard data-testid="test-luxury-card">
              <GlamorousCardHeader>
                <GlamorousCardTitle glamour data-testid="luxury-card-title">
                  ✨ Luxury Experience
                </GlamorousCardTitle>
                <GlamorousCardDescription data-testid="luxury-card-description">
                  Premium features with emerald glow effects and floating elements
                </GlamorousCardDescription>
              </GlamorousCardHeader>
              <GlamorousCardContent data-testid="luxury-card-content">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">💎</span>
                    <span>Premium glass morphism</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">✨</span>
                    <span>Ambient particles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">🌟</span>
                    <span>3D hover effects</span>
                  </div>
                </div>
              </GlamorousCardContent>
            </LuxuryCard>

            {/* Premium Card */}
            <PremiumCard data-testid="test-premium-card">
              <GlamorousCardHeader gradient>
                <GlamorousCardTitle data-testid="premium-card-title">
                  👑 Premium Gold
                </GlamorousCardTitle>
                <GlamorousCardDescription data-testid="premium-card-description">
                  Luxury gold effects with bold particle animations
                </GlamorousCardDescription>
              </GlamorousCardHeader>
              <GlamorousCardContent data-testid="premium-card-content">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gold-500">🏆</span>
                    <span>Gold gradient backgrounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-500">💰</span>
                    <span>Premium glow borders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-500">⭐</span>
                    <span>Luxury shine sweeps</span>
                  </div>
                </div>
              </GlamorousCardContent>
            </PremiumCard>

            {/* Holographic Card */}
            <HolographicCard data-testid="test-holographic-card">
              <GlamorousCardHeader>
                <GlamorousCardTitle glamour data-testid="holographic-card-title">
                  🔮 Holographic Future
                </GlamorousCardTitle>
                <GlamorousCardDescription data-testid="holographic-card-description">
                  Next-generation holographic effects with rainbow gradients
                </GlamorousCardDescription>
              </GlamorousCardHeader>
              <GlamorousCardContent data-testid="holographic-card-content">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500">🌈</span>
                    <span>Rainbow gradients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-500">⚡</span>
                    <span>Holographic effects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-500">💫</span>
                    <span>Future animations</span>
                  </div>
                </div>
              </GlamorousCardContent>
            </HolographicCard>
          </div>
        </div>
      </PremiumSection>

      {/* Button Variants Showcase */}
      <GradientSection data-testid="section-button-variants">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-rose-glow mb-4">
              🎭 Button Variants Collection
            </h2>
            <p className="text-lg text-muted-foreground">
              Featuring sparkle effects, magnetic hover, and premium interactions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Different button sizes and effects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Luxury Collection</h3>
              <div className="space-y-3">
                <GlamorousButton 
                  variant="luxury" 
                  size="sm" 
                  sparkle="enabled"
                  floatingElements
                  data-testid="luxury-small-button"
                >
                  Small Luxury
                </GlamorousButton>
                <GlamorousButton 
                  variant="luxury" 
                  size="default"
                  sparkle="enabled"
                  floatingElements
                  data-testid="luxury-default-button"
                >
                  Default Luxury
                </GlamorousButton>
                <GlamorousButton 
                  variant="luxury" 
                  size="lg"
                  sparkle="enabled"
                  floatingElements
                  data-testid="luxury-large-button"
                >
                  Large Luxury
                </GlamorousButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Premium Collection</h3>
              <div className="space-y-3">
                <GlamorousButton 
                  variant="premium" 
                  glow="intense"
                  sparkle="enabled"
                  data-testid="premium-intense-button"
                >
                  Premium Intense
                </GlamorousButton>
                <GlamorousButton 
                  variant="glass" 
                  glow="medium"
                  sparkle="enabled"
                  data-testid="glass-medium-button"
                >
                  Glass Elegant
                </GlamorousButton>
                <GlamorousButton 
                  variant="magnetic" 
                  magneticHover
                  data-testid="magnetic-hover-button"
                >
                  Magnetic Hover
                </GlamorousButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Special Effects</h3>
              <div className="space-y-3">
                <GlamorousButton 
                  variant="neon" 
                  glow="extreme"
                  floatingElements
                  elementIntensity="bold"
                  data-testid="neon-extreme-button"
                >
                  Neon Extreme
                </GlamorousButton>
                <GlamorousButton 
                  variant="holographic" 
                  floatingElements
                  elementIntensity="bold"
                  data-testid="holographic-button"
                >
                  Holographic
                </GlamorousButton>
                <GlamorousButton 
                  variant="party" 
                  size="xl"
                  glow="extreme"
                  floatingElements
                  elementIntensity="bold"
                  magneticHover
                  data-testid="party-xl-button"
                >
                  Party Mode! 🎉
                </GlamorousButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Professional</h3>
              <div className="space-y-3">
                <GlamorousButton 
                  variant="luxury" 
                  glow="subtle"
                  sparkle="none"
                  data-testid="professional-subtle-button"
                >
                  Professional
                </GlamorousButton>
                <GlamorousButton 
                  variant="glass" 
                  glow="none"
                  sparkle="none"
                  data-testid="minimal-button"
                >
                  Minimal Glass
                </GlamorousButton>
                <GlamorousButton 
                  variant="glamour" 
                  glow="medium"
                  data-testid="glamour-medium-button"
                >
                  Elegant Rose
                </GlamorousButton>
              </div>
            </div>
          </div>
        </div>
      </GradientSection>

      {/* Accessibility Test Section */}
      <GlamorousSection 
        variant="glass"
        spacing="default"
        entrance="fade"
        data-testid="section-accessibility-test"
      >
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">🔍 Accessibility & Performance Test</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All components maintain proper contrast ratios, focus states, and performance optimization
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <GlamorousCard 
              variant="corporate" 
              glow="none"
              data-testid="accessibility-card"
            >
              <GlamorousCardContent>
                <h3 className="text-lg font-semibold mb-3">✅ Accessibility Features</h3>
                <ul className="space-y-2 text-sm text-left">
                  <li>• WCAG 2.1 AA compliant contrast ratios</li>
                  <li>• Proper focus management and states</li>
                  <li>• data-testid attributes for testing</li>
                  <li>• Reduced motion support</li>
                  <li>• Semantic HTML structure</li>
                </ul>
              </GlamorousCardContent>
            </GlamorousCard>

            <GlamorousCard 
              variant="corporate" 
              glow="none"
              data-testid="performance-card"
            >
              <GlamorousCardContent>
                <h3 className="text-lg font-semibold mb-3">⚡ Performance Features</h3>
                <ul className="space-y-2 text-sm text-left">
                  <li>• GPU-accelerated animations</li>
                  <li>• CSS transforms for smooth performance</li>
                  <li>• Intersection Observer for lazy loading</li>
                  <li>• Optimized bundle size</li>
                  <li>• Mobile responsive design</li>
                </ul>
              </GlamorousCardContent>
            </GlamorousCard>
          </div>
        </div>
      </GlamorousSection>
    </GlamourLayout>
  );
}