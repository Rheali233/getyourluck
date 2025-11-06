/**
 * 错误边界组件
 * 捕获和处理组件错误
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch() {
    // Error boundary implementation
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API错误处理Hook
export function useApiError() {
  const [error, setError] = React.useState<string | null>(null);

  const handleError = (err: any) => {
    if (err.message?.includes('CORS')) {
      setError('Unable to connect to server. Please check if the backend is running.');
    } else if (err.message?.includes('Network')) {
      setError('Network error. Please check your connection.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}
