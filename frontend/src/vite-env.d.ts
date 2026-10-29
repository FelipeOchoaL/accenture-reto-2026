/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_API_BACKEND?: string
  readonly VITE_USE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
