import { useEffect, useState } from 'react';

interface YFBackgroundSystemProps {
  children: React.ReactNode;
  style?: 'corporate' | 'luxury' | 'tech' | 'caribbean' | 'classic' | 'textured' | 'old-english' | 'default';
  className?: string;
}

export function YFBackgroundSystem({ 
  children, 
  style = 'default',
  className = '' 
}: YFBackgroundSystemProps) {
  const [backgroundStyle, setBackgroundStyle] = useState(style);

  // Allow dynamic background switching via localStorage
  useEffect(() => {
    const savedStyle = localStorage.getItem('yf-background-style');
    if (savedStyle && ['corporate', 'luxury', 'tech', 'caribbean', 'classic', 'textured', 'old-english'].includes(savedStyle)) {
      setBackgroundStyle(savedStyle as any);
    }
  }, []);

  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case 'corporate':
        return 'yf-background-corporate';
      case 'luxury':
        return 'yf-background-luxury';
      case 'tech':
        return 'yf-background-tech';
      case 'caribbean':
        return 'yf-background-caribbean';
      case 'classic':
        return 'yf-background-classic';
      case 'textured':
        return 'yf-background-textured';
      case 'old-english':
        return 'yf-background-old-english';
      default:
        return '';
    }
  };

  return (
    <div className={`yf-background-system ${getBackgroundClass()} ${className}`}>
      {/* Subtle YF watermark */}
      <div className="yf-watermark" />
      {children}
    </div>
  );
}

// Background style switcher component
export function YFBackgroundSwitcher() {
  const [currentStyle, setCurrentStyle] = useState('default');

  const styles = [
    { id: 'default', name: 'Default', description: 'Clean background' },
    { id: 'corporate', name: 'Corporate', description: 'Professional gray' },
    { id: 'luxury', name: 'Luxury', description: 'Dark premium' },
    { id: 'tech', name: 'Tech', description: 'Modern digital' },
    { id: 'caribbean', name: 'Caribbean', description: 'Warm tropical' },
    { id: 'classic', name: 'Classic', description: 'Traditional business' },
    { id: 'textured', name: 'Textured', description: 'Sophisticated texture' },
    { id: 'old-english', name: 'Old English', description: 'Vintage parchment' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('yf-background-style') || 'default';
    setCurrentStyle(saved);
  }, []);

  const switchBackground = (styleId: string) => {
    setCurrentStyle(styleId);
    localStorage.setItem('yf-background-style', styleId);
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('yf-background-changed', { detail: styleId }));
    // Force a page refresh to apply the background
    window.location.reload();
  };

  return (
    <div className="yf-background-switcher p-4 border border-border rounded card-elegant">
      <h3 className="font-semibold text-foreground mb-3">YF Background Style</h3>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => switchBackground(style.id)}
            className={`p-2 text-sm border transition-smooth ${
              currentStyle === style.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div className="font-medium">{style.name}</div>
            <div className="text-xs opacity-75">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}