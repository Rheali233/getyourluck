/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENVIRONMENT: 'development' | 'production' | 'test'
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
