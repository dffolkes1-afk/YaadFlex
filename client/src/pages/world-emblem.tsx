import CSSWorldEmblem from "@/components/CSSWorldEmblem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function WorldEmblemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0b1d35] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3" data-testid="nav-home">
              <div className="text-2xl">🌍</div>
              <span className="text-xl font-bold">YaadFlex</span>
            </Link>
            <div className="text-sm text-white/70">Global Unity • Cultural Ambition</div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Emblem */}
      <section className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-black mb-4" data-testid="emblem-title">
              <span className="bg-gradient-to-r from-[#1cb0f6] to-[#e83e8c] bg-clip-text text-transparent">
                YaadFlex World Emblem
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto" data-testid="emblem-description">
              A symbol of global unity, cultural connection, and limitless ambition. 
              People from all cultures holding hands around Earth, with the Flex Vybz Duo representing our dreams to connect the world.
            </p>
          </div>

          {/* Interactive Emblem */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <CSSWorldEmblem height="600px" />
            <div className="bg-white/5 backdrop-blur-sm p-4 text-center">
              <p className="text-white/70 text-sm">
                ✨ Watch the global unity in motion ✨
              </p>
            </div>
          </div>

          {/* Meaning & Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10" data-testid="meaning-unity">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-2xl font-bold text-white">Global Unity</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  The silhouettes holding hands around our spinning Earth represent people from every culture, 
                  every nation, every background coming together. YaadFlex isn't just an app - it's a bridge 
                  that connects communities worldwide, celebrating our differences while highlighting our shared humanity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10" data-testid="meaning-ambition">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white">Limitless Ambition</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  The Flex Vybz Duo floating above represents our big dreams and strategic thinking. 
                  One embodies focused ambition, the other brings enthusiastic energy. Together, they symbolize 
                  YaadFlex's mission to think globally while acting locally, always reaching for the stars.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vision Statement */}
          <Card className="bg-gradient-to-r from-[#1cb0f6]/10 to-[#e83e8c]/10 backdrop-blur-sm border border-white/20 mb-12" data-testid="vision-statement">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
              <p className="text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
                "To create a world where distance disappears, cultures connect, and dreams have no borders. 
                Where a farmer in Jamaica can instantly sell to a customer in Kenya, where a student in Trinidad 
                can learn from a teacher in London, and where every person - regardless of where they're from - 
                feels part of one global family."
              </p>
              <div className="mt-8 text-lg text-[#ffd700] font-semibold">
                — The YaadFlex Global Family
              </div>
            </CardContent>
          </Card>

          {/* Interactive Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#1cb0f6]/50 transition-all" data-testid="feature-interactive">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🎮</div>
                <h4 className="text-lg font-bold text-white mb-2">Interactive Controls</h4>
                <p className="text-white/70 text-sm">
                  Drag to orbit, scroll to zoom, adjust animation speeds to customize your experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#e83e8c]/50 transition-all" data-testid="feature-cultural">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🎨</div>
                <h4 className="text-lg font-bold text-white mb-2">Cultural Themes</h4>
                <p className="text-white/70 text-sm">
                  Colors and designs adapt to celebrate different cultures and regions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#ffd700]/50 transition-all" data-testid="feature-original">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="text-lg font-bold text-white mb-2">Original Design</h4>
                <p className="text-white/70 text-sm">
                  Completely original characters and artwork, inspired by greatness but uniquely ours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Ready to Join the Global Vybz?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-[#1cb0f6] hover:bg-[#1cb0f6]/90 text-white px-8 py-3 text-lg font-semibold"
                data-testid="button-experience-app"
              >
                <Link href="/">Experience YaadFlex</Link>
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                data-testid="button-learn-more"
              >
                Learn More About Our Mission
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}