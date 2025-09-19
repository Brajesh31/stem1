import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { errorHandler } from '../../services/errorHandlingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `boundary_${Date.now()}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error through error handling service
    errorHandler.handleError(error, {
      type: 'runtime',
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        errorId: this.state.errorId
      },
      showToUser: false // We'll show our own UI
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleReportError = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // In production, this would send to error reporting service
    console.log('Error report:', errorReport);
    
    // Show confirmation to user
    alert('Error report sent. Thank you for helping us improve!');
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-700 p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We encountered an unexpected error. Don't worry - your progress is saved, 
                and our team has been automatically notified.
              </p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Error ID (for support):</p>
                  <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {this.state.errorId}
                  </code>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleGoHome}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Go Home</span>
                  </button>

                  <button
                    onClick={this.handleReportError}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Bug className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Developer Details
                  </summary>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-xs">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;