import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// ================== ERROR BOUNDARY TYPES ==================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ================== GLAMOROUS ERROR BOUNDARY ==================

/**
 * Error boundary specifically designed for glamorous components
 * Provides graceful degradation when visual effects fail
 */
export class GlamorousErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Glamorous component error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error monitoring service
      console.error('Production error in glamorous component:', {
        error: error.message,
        componentStack: errorInfo.componentStack,
        componentName: this.props.componentName,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Minimal fallback for isolated components
      if (this.props.isolate) {
        return (
          <div className="glamorous-error-fallback p-4 border border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/20 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Visual effect unavailable</span>
            </div>
          </div>
        );
      }

      // Full error UI with retry option
      return (
        <Card className="glamorous-error-boundary max-w-lg mx-auto my-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              {this.props.componentName 
                ? `Error in ${this.props.componentName} component`
                : 'A visual component encountered an error'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-slate-600 dark:text-slate-400">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="w-full"
              data-testid="error-boundary-retry"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// ================== EFFECT ERROR BOUNDARY WRAPPER ==================

/**
 * Higher-order component for wrapping glamorous effects with error boundaries
 */
export function withGlamorousErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const WithErrorBoundary = (props: P) => {
    return (
      <GlamorousErrorBoundary 
        isolate 
        componentName={componentName}
        fallback={
          <div 
            className="glamorous-fallback opacity-50"
            data-testid={`${componentName}-fallback`}
          >
            {/* Render a simplified version without effects */}
            <WrappedComponent {...props} />
          </div>
        }
      >
        <WrappedComponent {...props} />
      </GlamorousErrorBoundary>
    );
  };

  WithErrorBoundary.displayName = `withGlamorousErrorBoundary(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundary;
}

// ================== PERFORMANCE ERROR BOUNDARY ==================

/**
 * Error boundary that catches performance-related errors
 * and automatically downgrades to lower intensity effects
 */
interface PerformanceErrorBoundaryProps {
  children: ReactNode;
  onPerformanceError?: () => void;
  maxRetries?: number;
}

interface PerformanceErrorBoundaryState {
  hasError: boolean;
  retryCount: number;
}

export class PerformanceErrorBoundary extends Component<
  PerformanceErrorBoundaryProps,
  PerformanceErrorBoundaryState
> {
  constructor(props: PerformanceErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): PerformanceErrorBoundaryState | null {
    // Check if this is a performance-related error
    const isPerformanceError = 
      error.name === 'QuotaExceededError' ||
      error.message.includes('memory') ||
      error.message.includes('performance') ||
      error.message.includes('frame');

    if (isPerformanceError) {
      return {
        hasError: true,
        retryCount: 0,
      };
    }

    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const maxRetries = this.props.maxRetries ?? 2;
    
    if (this.state.retryCount < maxRetries) {
      console.warn('Performance error, retrying with reduced effects:', error.message);
      
      setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          retryCount: prevState.retryCount + 1,
        }));
      }, 1000);
      
      this.props.onPerformanceError?.();
    } else {
      console.error('Max performance error retries reached:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.retryCount >= (this.props.maxRetries ?? 2)) {
      return (
        <div className="performance-fallback opacity-75" data-testid="performance-fallback">
          {/* Render children but with reduced performance */}
          {this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

// ================== EXPORT ==================

export default GlamorousErrorBoundary;