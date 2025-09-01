declare module 'expo-constants' {
  export interface ExpoConfig {
    extra?: {
      PERPLEXITY_API_KEY?: string;
    };
  }

  export interface Constants {
    expoConfig?: ExpoConfig;
  }

  const Constants: Constants;
  export default Constants;
}
