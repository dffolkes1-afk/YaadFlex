import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Palette, Eye, Copy } from "lucide-react";
import { YFBackgroundSwitcher } from "@/components/YFBackgroundSystem";

export default function YFBrandingPage() {
  const wallpaperStyles = [
    {
      id: 'corporate',
      name: 'Corporate Professional',
      description: 'Clean, minimalist design for business presentations',
      colors: ['#1e293b', '#64748b', '#f8fafc'],
      className: 'corporate-yf'
    },
    {
      id: 'luxury',
      name: 'Luxury Premium',
      description: 'Sophisticated gold and emerald elegance',
      colors: ['#059669', '#fbbf24', '#111827'],
      className: 'luxury-yf'
    },
    {
      id: 'tech',
      name: 'Tech Modern',
      description: 'Sleek digital-inspired aesthetic',
      colors: ['#3730a3', '#6366f1', '#f1f5f9'],
      className: 'tech-yf'
    },
    {
      id: 'caribbean',
      name: 'Caribbean Heritage',
      description: 'Warm tropical cultural aesthetic',
      colors: ['#059669', '#f59e0b', '#fef3c7'],
      className: 'caribbean-yf'
    },
    {
      id: 'classic',
      name: 'Classic Business',
      description: 'Timeless traditional corporate style',
      colors: ['#374151', '#9ca3af', '#ffffff'],
      className: 'classic-yf'
    },
    {
      id: 'textured',
      name: 'Textured Premium',
      description: 'Sophisticated with subtle texture effects',
      colors: ['#64748b', '#e2e8f0', '#f8fafc'],
      className: 'textured-yf'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-md text-foreground flex items-center gap-3 caribbean-accent" data-testid="text-branding-title">
              <Palette className="h-7 w-7 text-primary" />
              YF Branding Hub
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Wallpaper concepts, design specifications, and branding assets for YaadFlex
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Wallpaper Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {wallpaperStyles.map((style) => (
            <Card key={style.id} className="card-elegant overflow-hidden" data-testid={`wallpaper-${style.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground flex items-center justify-between">
                  {style.name}
                  <Badge variant="secondary" className="badge text-xs">{style.id}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* YF Monogram Preview */}
                <div className={`yf-wallpaper-preview ${style.className} relative h-48 rounded border border-border overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="yf-monogram text-6xl font-bold">YF</div>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="badge bg-background/80 backdrop-blur-sm text-xs">
                      16:9 Format
                    </Badge>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Color Palette</p>
                  <div className="flex gap-2">
                    {style.colors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 btn-secondary">
                    <Eye className="h-3 w-3 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 btn-secondary">
                    <Copy className="h-3 w-3 mr-2" />
                    CSS
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Design Specifications */}
        <Card className="card-elegant mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Design Specifications</CardTitle>
            <p className="text-muted-foreground">Technical requirements and usage guidelines</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Technical Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Format:</strong> 16:9 aspect ratio (1920x1080 recommended)</li>
                  <li>• <strong>Resolution:</strong> Minimum 1080p for crisp display</li>
                  <li>• <strong>File Types:</strong> PNG for transparency, JPG for solid backgrounds</li>
                  <li>• <strong>YF Monogram:</strong> Always centered, readable at any size</li>
                  <li>• <strong>Color Profile:</strong> sRGB for web compatibility</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Usage Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>App Backgrounds:</strong> Subtle, non-distracting patterns</li>
                  <li>• <strong>Presentations:</strong> Professional contrast for text overlay</li>
                  <li>• <strong>Marketing:</strong> Bold, attention-grabbing designs</li>
                  <li>• <strong>Corporate:</strong> Conservative, trustworthy aesthetics</li>
                  <li>• <strong>Accessibility:</strong> WCAG AA contrast compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Examples and Background System */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="text-foreground">Integration Examples</CardTitle>
              <p className="text-muted-foreground">How YF branding appears across YaadFlex</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="integration-example app-background p-4 rounded border border-border">
                  <h4 className="font-medium text-foreground mb-2">App Background</h4>
                  <p className="text-sm text-muted-foreground">Subtle YF monogram as app wallpaper</p>
                </div>
                <div className="integration-example login-screen p-4 rounded border border-border">
                  <h4 className="font-medium text-foreground mb-2">Login Screen</h4>
                  <p className="text-sm text-muted-foreground">Prominent YF branding for brand recognition</p>
                </div>
                <div className="integration-example loading-states p-4 rounded border border-border">
                  <h4 className="font-medium text-foreground mb-2">Loading States</h4>
                  <p className="text-sm text-muted-foreground">Animated YF logo during transitions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="text-foreground">Live Background System</CardTitle>
              <p className="text-muted-foreground">Test YF background styles across the entire app</p>
            </CardHeader>
            <CardContent>
              <YFBackgroundSwitcher />
              <div className="mt-4 p-3 bg-muted rounded border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Background changes apply to the entire YaadFlex app. 
                  Your selection is saved and persists across page reloads.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}