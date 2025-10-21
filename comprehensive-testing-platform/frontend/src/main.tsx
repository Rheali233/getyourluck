/**
 * 前端应用主入口文件
 * 遵循统一开发标准的应用初始化
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { getApiBaseUrl } from './config/environment'
import { useEffect } from 'react'
import { trackEvent, buildBaseContext } from '@/services/analyticsService'
import { registerServiceWorker } from '@/utils/serviceWorker'


// 启动时环境与基地址调试日志（用于定位 API 指向）
// 注意：构建已保留 console，不会被移除
// Debug info removed for production

// 错误边界处理
const root = ReactDOM.createRoot(document.getElementById('root')!)

function RouteAnalyticsWrapper() {
  // 监听路由变更并上报 page_view（SPA 场景）
  useEffect(() => {
    const handler = () => {
      const base = buildBaseContext()
      trackEvent({
        eventType: 'page_view',
        ...base,
        data: { route: window.location.pathname },
      })
    }
    // 初次也触发一次，防止遗漏
    handler()
    window.addEventListener('popstate', handler)
    window.addEventListener('pushstate', handler as any)
    window.addEventListener('replacestate', handler as any)
    return () => {
      window.removeEventListener('popstate', handler)
      window.removeEventListener('pushstate', handler as any)
      window.removeEventListener('replacestate', handler as any)
    }
  }, [])
  return <App />
}

// 注册Service Worker
registerServiceWorker();

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <RouteAnalyticsWrapper />
    </BrowserRouter>
  </React.StrictMode>
)