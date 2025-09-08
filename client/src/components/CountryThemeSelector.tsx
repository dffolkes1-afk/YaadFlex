import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAvailableCountries, applyCountryTheme, type CountryTheme } from '@/lib/countryThemes';

export function CountryThemeSelector() {
  const [selectedCountry, setSelectedCountry] = useState('JM');
  const [isOpen, setIsOpen] = useState(false);
  const countries = getAvailableCountries();

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    applyCountryTheme(countryCode);
    localStorage.setItem('yaadflex-country', countryCode);
    setIsOpen(false);
  };

  // Apply saved theme on load
  useEffect(() => {
    const saved = localStorage.getItem('yaadflex-country') || 'JM';
    setSelectedCountry(saved);
    applyCountryTheme(saved);
  }, []);

  const currentTheme = countries.find(c => c.code === selectedCountry)!;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary/90 text-primary-foreground hover:bg-primary border border-accent/20"
        data-testid="country-theme-toggle"
      >
        {currentTheme.flag} {currentTheme.name}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-64 bg-card/95 backdrop-blur border-accent/20" data-testid="country-theme-selector">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-foreground mb-3">
              🌍 Choose Your Country Theme
            </div>
            
            <div className="space-y-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-primary/20 ${
                    selectedCountry === country.code 
                      ? 'bg-primary/30 border border-accent/30' 
                      : 'hover:bg-secondary/20'
                  }`}
                  data-testid={`country-${country.code.toLowerCase()}`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">
                      {country.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {country.code === 'JM' ? 'Original YardFlex' : 'YardFlex Global'}
                    </div>
                  </div>
                  {selectedCountry === country.code && (
                    <div className="ml-auto text-accent">✓</div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
              🇯🇲 Born in Jamaica, Built for the World
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}