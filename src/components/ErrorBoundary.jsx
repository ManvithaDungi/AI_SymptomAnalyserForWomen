import React from 'react';
import { logger } from '../utils/logger';

/**
 * Error Boundary Component
 * Catches React component errors and displays a fallback UI
 * Prevents entire app from crashing
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo: errorInfo,
    });

    // Log to console in development
    logger.error('React Error Boundary caught:', { error, errorInfo });

    // Could send to error tracking service here (e.g., Sentry)
    // sendToErrorTrackingService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. The app has encountered an unexpected error.
            </p>

            {/* Retry Count */}
            {this.state.retryCount > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Retry attempt: {this.state.retryCount}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>

            {/* Error Details (Development Only) */}
            {isDev && this.state.error && (
              <details className="mt-6 pt-6 border-t border-gray-200 text-left">
                <summary className="cursor-pointer font-mono text-xs font-semibold text-gray-700 hover:text-gray-900">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="text-red-600 mt-1 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="text-gray-700 mt-1 whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
