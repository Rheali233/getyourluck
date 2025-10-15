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


// 启动时环境与基地址调试日志（用于定位 API 指向）
// 注意：构建已保留 console，不会被移除
try {
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.log('Boot Debug - window.location.hostname =', typeof window !== 'undefined' ? window.location.hostname : 'undefined')
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.log('Boot Debug - VITE_API_BASE_URL =', (import.meta as any).env?.VITE_API_BASE_URL)
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.log('Boot Debug - getApiBaseUrl() =', getApiBaseUrl())
} catch {}

// 错误边界处理
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
)