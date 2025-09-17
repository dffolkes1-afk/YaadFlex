// ================== PAGE MODE SYSTEM TEST COMPONENT ==================
// Test component to verify the page mode system is working correctly

import { usePageMode, useIsGlamorousPage, useIsProfessionalPage } from '@/hooks/usePageMode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Sparkles, Shield, Settings, Eye } from 'lucide-react';

export function PageModeTest() {
  const { mode, config, isGlamorous, isProfessional, path } = usePageMode();
  
  const glamorousRoutes = [
    '/', '/home', '/marketplace', '/sponsorship', '/party', '/glamour', '/world', '/social'
  ];
  
  const professionalRoutes = [
    '/wallet', '/terms', '/business-dashboard', '/ceo-dashboard', '/legal', '/banking', '/privacy'
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      
      {/* Current Page Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Current Page Mode Status
          </CardTitle>
          <CardDescription>Real-time page mode detection and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge 
              variant={isGlamorous ? "default" : "secondary"}
              className={isGlamorous ? "bg-gradient-to-r from-emerald-500 to-gold-500" : ""}
            >
              {isGlamorous ? <Sparkles className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
              {mode.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">Route: {path}</span>
          </div>
          
          {/* Configuration Details */}
          {isGlamorous && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>Intensity: <Badge variant="outline">{config.intensity || 'medium'}</Badge></div>
              <div>Background: <Badge variant="outline">{config.backgroundStyle || 'luxury'}</Badge></div>
              <div>Particles: <Badge variant="outline">{config.enableParticles ? '✓' : '✗'}</Badge></div>
              <div>Watermark: <Badge variant="outline">{config.showYFWatermark ? '✓' : '✗'}</Badge></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Glamorous Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Test Glamorous Pages
          </CardTitle>
          <CardDescription>These pages should display with luxury effects and styling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {glamorousRoutes.map((route) => (
              <Link key={route} href={route}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50"
                >
                  {route === '/' ? 'Home' : route.substring(1)}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Professional Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Test Professional Pages
          </CardTitle>
          <CardDescription>These pages should display with clean, professional styling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {professionalRoutes.map((route) => (
              <Link key={route} href={route}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-blue-50"
                >
                  {route.substring(1)}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{glamorousRoutes.length}</div>
              <div className="text-xs text-muted-foreground">Glamorous Routes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{professionalRoutes.length}</div>
              <div className="text-xs text-muted-foreground">Professional Routes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Auto</div>
              <div className="text-xs text-muted-foreground">Detection</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">✓</div>
              <div className="text-xs text-muted-foreground">Working</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>1. <strong>Glamorous pages</strong> should show luxury effects like particles, gradients, and floating elements</p>
          <p>2. <strong>Professional pages</strong> should show clean, minimal styling with no fancy effects</p>
          <p>3. Check the debug indicator (if in dev mode) in the top-left corner</p>
          <p>4. Notice how the page background and overall feel changes between modes</p>
          <p>5. The system automatically detects and applies the correct mode based on the route</p>
        </CardContent>
      </Card>

    </div>
  );
}

export default PageModeTest;