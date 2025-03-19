
// Type definitions for Google API client
declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: Error) => void;
        prompt?: string;
      }

      interface TokenClient {
        requestAccessToken: (options?: { prompt?: string }) => void;
        callback: (response: TokenResponse) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
    }
  }
}

// Add custom window ENV property for runtime environment variables
interface Window {
  ENV?: {
    VITE_GOOGLE_CLIENT_ID?: string;
    [key: string]: string | undefined;
  };
}
