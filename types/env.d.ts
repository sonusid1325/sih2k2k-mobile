declare module '@env' {
  export const EXPO_PUBLIC_GEMINI_API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_GEMINI_API_KEY: string;
    }
  }
}

export {};
