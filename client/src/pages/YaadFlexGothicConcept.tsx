import { ArrowRight, Download, Palette, Shirt, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function YaadFlexGothicConcept() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 print:bg-white">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .print-page-break {
            page-break-before: always;
          }
        }
      `}</style>

      {/* Header with Print Button */}
      <div className="no-print fixed top-4 right-4 z-50">
        <Button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          data-testid="button-print-document"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Cover Page */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-emerald-900 to-black text-white print:bg-white print:text-black p-8">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Main Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-7xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 bg-clip-text text-transparent print:text-black">
              YaadFlex
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-rose-400 mx-auto"></div>
            <h2 className="text-4xl font-light tracking-wide text-slate-300 print:text-gray-700">
              BlackRock Gothic Concept
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-slate-400 print:text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            Where Caribbean Soul Meets Gothic Elegance
            <br />
            <span className="text-emerald-400 print:text-black font-medium">Afro-Jamaican Heritage × Dark Luxury Fusion</span>
          </p>

          {/* Design Elements */}
          <div className="flex justify-center space-x-8 text-emerald-400 print:text-gray-600">
            <Palette className="w-8 h-8" />
            <Shirt className="w-8 h-8" />
            <Zap className="w-8 h-8" />
          </div>

          {/* Date */}
          <p className="text-slate-500 print:text-gray-500 text-sm">
            Concept Document • {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Vision Summary */}
      <section className="print-page-break min-h-screen bg-slate-800 print:bg-white text-white print:text-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-emerald-400 print:text-black">Vision Summary</h2>
            <div className="h-1 w-24 bg-emerald-400 print:bg-gray-300 mx-auto"></div>
          </div>

          <Card className="bg-slate-700 print:bg-gray-50 border-emerald-500 print:border-gray-300">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-emerald-400 print:text-black">
                Gothic + Afro-Jamaican Fusion Concept
              </h3>
              
              <div className="space-y-4 text-slate-200 print:text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong className="text-emerald-400 print:text-black">YaadFlex BlackRock Gothic</strong> represents a revolutionary 
                  fusion of Caribbean cultural authenticity with dark luxury aesthetics. This concept bridges the gap between 
                  Jamaica's rich heritage and contemporary gothic fashion sensibilities.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xl font-medium text-rose-400 print:text-black">Afro-Jamaican Elements</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Rastafarian color palette reinterpreted</li>
                      <li>• Traditional patterns in modern cuts</li>
                      <li>• Caribbean craftsmanship heritage</li>
                      <li>• Patois-inspired typography</li>
                      <li>• Island-to-world storytelling</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-medium text-amber-400 print:text-black">Gothic Luxury</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Dark romantic aesthetics</li>
                      <li>• Premium materials & hardware</li>
                      <li>• Architectural silhouettes</li>
                      <li>• Mysterious brand narrative</li>
                      <li>• Underground culture appeal</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-600 print:bg-gray-100 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-emerald-400 print:text-black mb-3">Brand Philosophy</h4>
                  <p className="italic">
                    "From the mountains of Jamaica to the gothic cathedrals of Europe, YaadFlex BlackRock Gothic 
                    celebrates the beauty found in contrasts. We honor our ancestors while embracing the darkness 
                    that makes us whole."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Design Roadmap */}
      <section className="print-page-break min-h-screen bg-slate-900 print:bg-white text-white print:text-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-rose-400 print:text-black">Design Roadmap</h2>
            <div className="h-1 w-24 bg-rose-400 print:bg-gray-300 mx-auto"></div>
          </div>

          <div className="space-y-8">
            {/* Phase 1 */}
            <Card className="bg-slate-800 print:bg-gray-50 border-emerald-500 print:border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-emerald-600 print:bg-gray-600 text-white p-2 rounded-full">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-400 print:text-black">Foundation Phase</h3>
                </div>
                <div className="space-y-3 text-slate-200 print:text-gray-700">
                  <p><strong>Timeline:</strong> 3-6 months</p>
                  <p><strong>Focus:</strong> Core product development and brand establishment</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Develop signature sneaker line with gothic hardware</li>
                    <li>• Establish dark luxury aesthetic guidelines</li>
                    <li>• Create brand story and cultural narrative</li>
                    <li>• Build Caribbean artisan partnerships</li>
                    <li>• Launch limited edition "Genesis Collection"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="bg-slate-800 print:bg-gray-50 border-rose-500 print:border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-rose-600 print:bg-gray-600 text-white p-2 rounded-full">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-rose-400 print:text-black">Expansion Phase</h3>
                </div>
                <div className="space-y-3 text-slate-200 print:text-gray-700">
                  <p><strong>Timeline:</strong> 6-12 months</p>
                  <p><strong>Focus:</strong> Product line diversification and market penetration</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Expand into apparel (gothic-inspired streetwear)</li>
                    <li>• Introduce accessories and lifestyle products</li>
                    <li>• Develop premium coffee line with dark roasts</li>
                    <li>• Establish flagship experiences in key markets</li>
                    <li>• Launch influencer and cultural ambassador program</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="bg-slate-800 print:bg-gray-50 border-amber-500 print:border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-amber-600 print:bg-gray-600 text-white p-2 rounded-full">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-400 print:text-black">Cultural Movement</h3>
                </div>
                <div className="space-y-3 text-slate-200 print:text-gray-700">
                  <p><strong>Timeline:</strong> 12+ months</p>
                  <p><strong>Focus:</strong> Global cultural impact and community building</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Establish YaadFlex Gothic cultural festivals</li>
                    <li>• Create scholarship programs for Caribbean artists</li>
                    <li>• Develop digital platform for gothic-Caribbean content</li>
                    <li>• Launch collaborative collections with artists</li>
                    <li>• Build global community of cultural fusion advocates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Product Page */}
      <section className="print-page-break min-h-screen bg-slate-800 print:bg-white text-white print:text-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-amber-400 print:text-black">Sample Product</h2>
            <div className="h-1 w-24 bg-amber-400 print:bg-gray-300 mx-auto"></div>
          </div>

          <Card className="bg-slate-700 print:bg-gray-50 border-amber-500 print:border-gray-300">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-amber-400 print:text-black mb-6">
                BlackRock Fortress Sneaker
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Mockup Description */}
                <div className="space-y-6">
                  <div className="bg-slate-600 print:bg-gray-100 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-emerald-400 print:text-black mb-4">Schematic Views</h4>
                    <div className="space-y-3 text-sm text-slate-200 print:text-gray-700">
                      <div className="border-2 border-dashed border-emerald-400 print:border-gray-400 p-4 rounded">
                        <p><strong>Front View:</strong> High-top silhouette with gothic arch cutouts</p>
                        <p>Brass buckle strap system, emerald accent stitching</p>
                      </div>
                      <div className="border-2 border-dashed border-rose-400 print:border-gray-400 p-4 rounded">
                        <p><strong>Side View:</strong> Cathedral-inspired side panel design</p>
                        <p>Dark leather upper with suede gothic pattern overlay</p>
                      </div>
                      <div className="border-2 border-dashed border-amber-400 print:border-gray-400 p-4 rounded">
                        <p><strong>Back View:</strong> Embossed YaadFlex crest with gothic lettering</p>
                        <p>Blood red accent on heel tab and inner lining</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-rose-400 print:text-black">Material Notes</h4>
                    <ul className="space-y-2 text-sm text-slate-200 print:text-gray-700">
                      <li>• <strong>Upper:</strong> Premium dark leather with suede overlays</li>
                      <li>• <strong>Hardware:</strong> Antique brass buckles and eyelets</li>
                      <li>• <strong>Lining:</strong> Blood red leather with gothic pattern</li>
                      <li>• <strong>Sole:</strong> Custom gothic tread pattern in charcoal</li>
                      <li>• <strong>Laces:</strong> Waxed cotton in dusty white</li>
                    </ul>
                  </div>
                </div>

                {/* Colorway Palette */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-emerald-400 print:text-black mb-4">Colorway Palette</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="h-16 bg-emerald-800 print:bg-gray-300 rounded flex items-center justify-center text-white print:text-black font-medium">
                          Dark Emerald
                        </div>
                        <div className="h-16 bg-red-900 print:bg-gray-400 rounded flex items-center justify-center text-white font-medium">
                          Blood Red
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-16 bg-stone-200 print:bg-gray-200 rounded flex items-center justify-center text-black font-medium">
                          Dusty White
                        </div>
                        <div className="h-16 bg-black print:bg-gray-600 rounded flex items-center justify-center text-white font-medium">
                          Obsidian Black
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600 print:bg-gray-100 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-amber-400 print:text-black mb-3">Product Features</h4>
                    <ul className="space-y-2 text-sm text-slate-200 print:text-gray-700">
                      <li>• Gothic cathedral-inspired architecture</li>
                      <li>• Caribbean heritage pattern details</li>
                      <li>• Premium brass hardware throughout</li>
                      <li>• Limited edition numbering system</li>
                      <li>• Custom YaadFlex gothic typography</li>
                      <li>• Sustainable leather sourcing</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 print:text-black">$299</div>
                    <p className="text-slate-400 print:text-gray-600 text-sm">Limited Genesis Collection</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section className="print-page-break min-h-screen bg-slate-900 print:bg-white text-white print:text-black p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-emerald-400 print:text-black">Next Steps</h2>
            <div className="h-1 w-24 bg-emerald-400 print:bg-gray-300 mx-auto"></div>
          </div>

          <Card className="bg-slate-800 print:bg-gray-50 border-emerald-500 print:border-gray-300">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-emerald-400 print:text-black">
                Moving to Full Tech Pack Development
              </h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xl font-medium text-rose-400 print:text-black">Immediate Actions</h4>
                    <ul className="space-y-2 text-sm text-slate-200 print:text-gray-700">
                      <li>• Create detailed technical drawings</li>
                      <li>• Source sustainable materials from Caribbean suppliers</li>
                      <li>• Develop size run and grading specifications</li>
                      <li>• Design gothic hardware custom molds</li>
                      <li>• Create brand story documentation</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-medium text-amber-400 print:text-black">Technical Requirements</h4>
                    <ul className="space-y-2 text-sm text-slate-200 print:text-gray-700">
                      <li>• CAD files for all pattern pieces</li>
                      <li>• Material specification sheets</li>
                      <li>• Manufacturing process documentation</li>
                      <li>• Quality control standards</li>
                      <li>• Packaging and brand presentation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-700 print:bg-gray-100 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-emerald-400 print:text-black mb-3">Partnership Opportunities</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-200 print:text-gray-700">
                    <div>
                      <strong>Caribbean Artisans</strong>
                      <p>Traditional craftsmanship integration</p>
                    </div>
                    <div>
                      <strong>Gothic Fashion Houses</strong>
                      <p>Luxury market positioning</p>
                    </div>
                    <div>
                      <strong>Cultural Institutions</strong>
                      <p>Heritage authenticity validation</p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex justify-center space-x-4">
                    <ArrowRight className="w-6 h-6 text-emerald-400 print:text-black" />
                    <span className="text-lg font-medium">Ready for Production Planning</span>
                    <ArrowRight className="w-6 h-6 text-emerald-400 print:text-black" />
                  </div>
                  <p className="text-slate-400 print:text-gray-600 text-sm">
                    This concept document provides the foundation for full technical development
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}