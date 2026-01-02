export interface AppConfig {
  apiBaseUrl: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

export const appConfig: AppConfig = window.APP_CONFIG ?? {
  apiBaseUrl: 'http://localhost:5000/api/v1'
};
