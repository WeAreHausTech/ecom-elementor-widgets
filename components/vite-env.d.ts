/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_SKELETON_PRODUCT_LIST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
