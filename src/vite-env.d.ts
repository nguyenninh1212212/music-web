/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PINTA_JWT: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_RESALE_CONTRACT_ADDRESS: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
