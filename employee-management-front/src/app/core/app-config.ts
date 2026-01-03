export interface AppConfig {
  apiBaseUrl: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

export const appConfig: AppConfig = window.APP_CONFIG ?? {
  apiBaseUrl: 'http://localhost:7057/api/v1'
};
