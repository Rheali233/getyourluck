/**
 * 错误边界组件
 * 用于捕获React组件树中的JavaScript错误，记录错误信息，并显示降级UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface ErrorBoundaryProps extends BaseComponentProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetOnError?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
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
    // 生成错误ID
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
  private logError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    console.error('Error Boundary caught an error:', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
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

      await fetch('/api/analytics/errors', {
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
      console.error('Failed to report error:', reportError);
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
      const { fallback, testId = 'error-boundary' } = this.props;
      const { error, errorInfo, errorId } = this.state;

      // 如果提供了自定义fallback，使用它
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error!, errorInfo!);
        }
        return fallback;
      }

      // 默认错误UI
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
          data-testid={testId}
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* 错误图标 */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* 错误标题 */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              页面出现错误
            </h2>

            {/* 错误描述 */}
            <p className="text-gray-600 mb-4">
              抱歉，页面遇到了一个意外错误。我们已经记录了这个错误，并将尽快修复。
            </p>

            {/* 错误ID */}
            {errorId && (
              <div className="bg-gray-100 rounded p-3 mb-4 text-sm text-gray-600">
                <strong>错误ID:</strong> {errorId}
              </div>
            )}

            {/* 错误详情（开发环境显示） */}
            {process.env['NODE_ENV'] === 'development' && error && (
              <details className="text-left mb-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  查看错误详情
                </summary>
                <div className="mt-2 p-3 bg-red-50 rounded text-xs text-red-800 overflow-auto max-h-32">
                  <div><strong>错误信息:</strong> {error.message}</div>
                  {error.stack && (
                    <div className="mt-2">
                      <strong>堆栈跟踪:</strong>
                      <pre className="whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div className="mt-2">
                      <strong>组件堆栈:</strong>
                      <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                返回首页
              </button>
              
              <button
                onClick={this.handleRefresh}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                刷新页面
              </button>
            </div>

            {/* 联系支持 */}
            <div className="mt-4 text-sm text-gray-500">
              如果问题持续存在，请联系
              <a 
                href="mailto:support@example.com" 
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                技术支持
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
