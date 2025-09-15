import { COMPANY_INFO } from '@shared/company';

interface BlackRockLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
  showTooltip?: boolean;
}

export function BlackRockLogo({ 
  size = "md", 
  variant = "full",
  className = "",
  showTooltip = false 
}: BlackRockLogoProps) {
  
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm", 
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl"
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg",
    xl: "text-xl"
  };

  if (variant === "icon") {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg ${className}`}
        title={showTooltip ? COMPANY_INFO.PARENT_COMPANY : undefined}
        data-testid="blackrock-logo-icon"
      >
        <span className="text-white font-bold tracking-tight">BR</span>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div 
        className={`flex items-center space-x-2 ${className}`}
        title={showTooltip ? COMPANY_INFO.PARENT_COMPANY : undefined}
        data-testid="blackrock-logo-text"
      >
        <span className={`font-bold text-slate-700 dark:text-slate-300 ${textSizes[size]}`}>
          {COMPANY_INFO.PARENT_COMPANY}
        </span>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div 
      className={`flex items-center space-x-3 ${className}`}
      title={showTooltip ? `${COMPANY_INFO.PARENT_COMPANY} - Investment Management` : undefined}
      data-testid="blackrock-logo-full"
    >
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold tracking-tight">BR</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-slate-700 dark:text-slate-300 ${textSizes[size]} leading-tight`}>
          BlackRock
        </span>
        <span className="text-xs text-slate-500 leading-tight">
          Investment Management
        </span>
      </div>
    </div>
  );
}

// Corporate Badge Component
interface BlackRockBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BlackRockBadge({ size = "md", className = "" }: BlackRockBadgeProps) {
  const badgeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  return (
    <div 
      className={`inline-flex items-center space-x-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-600 rounded-full ${badgeClasses[size]} ${className}`}
      data-testid="blackrock-portfolio-badge"
    >
      <div className="w-4 h-4 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">BR</span>
      </div>
      <span className="font-medium text-slate-700 dark:text-slate-300">
        {COMPANY_INFO.BRANDING.corporate_badge}
      </span>
    </div>
  );
}

// Corporate Watermark Component
interface BlackRockWatermarkProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  opacity?: number;
  className?: string;
}

export function BlackRockWatermark({ 
  position = "bottom-right", 
  opacity = 0.1,
  className = ""
}: BlackRockWatermarkProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4", 
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4"
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-0 pointer-events-none ${className}`}
      style={{ opacity }}
      data-testid="blackrock-watermark"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">BR</span>
      </div>
    </div>
  );
}