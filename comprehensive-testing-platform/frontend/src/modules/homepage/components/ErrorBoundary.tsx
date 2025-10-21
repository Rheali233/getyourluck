import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui';
import { getApiBaseUrl } from '@/config/environment';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  // eslint-disable-next-line no-unused-vars
  onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // 记录错误信息
    this.logError(error, errorInfo, errorId);

    // 调用错误处理回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 发送错误报告到服务器
    this.reportError(error, errorInfo, errorId);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // 如果启用了props变化时重置，则清除错误状态
    if (this.props.resetOnPropsChange && prevProps !== this.props) {
      this.resetError();
    }
  }

  // 生成错误ID
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 记录错误信息
  // eslint-disable-next-line no-unused-vars
  private logError(_error: Error, _errorInfo: ErrorInfo, _errorId: string) {
    // Error logged for monitoring service in production
    // In production, error data would be sent to a logging service
  }

  // 发送错误报告到服务器
  private async reportError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    try {
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(),
        sessionId: this.getSessionId()
      };

      await fetch(`${getApiBaseUrl()}/api/analytics/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'error_boundary',
          data: errorReport
        })
      });
    } catch (reportError) {
      // Failed to report error - handled silently in production
    }
  }

  // 获取用户ID
  private getUserId(): string | null {
    try {
      return localStorage.getItem('user_id') || null;
    } catch {
      return null;
    }
  }

  // 获取会话ID
  private getSessionId(): string | null {
    try {
      return localStorage.getItem('session_id') || null;
    } catch {
      return null;
    }
  }

  // 重置错误状态
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  // 重试操作
  private handleRetry = () => {
    this.resetError();
  };

  // 返回首页
  private handleGoHome = () => {
    window.location.href = '/';
  };

  // 刷新页面
  private handleRefresh = () => {
    window.location.reload();
  };

  // 渲染降级UI
  override render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const { handleRetry, handleGoHome, handleRefresh } = this;
      
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              {errorId && (
                <p className="text-sm text-gray-500 mb-6">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{errorId}</code>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleRefresh}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Refresh Page
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>

            {error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-mono text-red-600 break-all">
                    {error.message}
                  </p>
                  {error.stack && (
                    <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;