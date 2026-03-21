/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MATCHING_API_BASE_URL?: string;
  readonly VITE_NOTIFICATIONS_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
