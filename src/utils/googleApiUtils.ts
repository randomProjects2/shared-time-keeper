
// Google Calendar API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ');

// Get Client ID from various sources with priority
// 1. localStorage (set via UI)
// 2. Runtime window.ENV (for Docker)
// 3. Vite environment variable
const getClientId = (): string => {
  // Check for client ID saved in localStorage (highest priority)
  const localStorageClientId = localStorage.getItem('googleClientId');
  if (localStorageClientId) {
    console.log('Using Client ID from localStorage (set via UI)');
    return localStorageClientId;
  }
  
  // Check for runtime environment variable (from Docker)
  if (typeof window !== 'undefined' && window.ENV && window.ENV.VITE_GOOGLE_CLIENT_ID) {
    console.log('Using Client ID from runtime environment variable');
    return window.ENV.VITE_GOOGLE_CLIENT_ID;
  }
  
  // Check for Vite environment variable
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.log('Using Client ID from Vite environment variable');
    return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }
  
  console.log('No Client ID found in any source');
  return '';
};

// Get authorized origin for OAuth
const getAuthOrigin = (): string => {
  // Check localStorage first (highest priority, set via UI)
  const localStorageOrigin = localStorage.getItem('googleAuthOrigin');
  if (localStorageOrigin) {
    console.log('Using Auth Origin from localStorage:', localStorageOrigin);
    return localStorageOrigin;
  }
  
  // Fall back to current origin
  const currentOrigin = window.location.origin;
  console.log('Using current origin for Auth:', currentOrigin);
  return currentOrigin;
};

// Add debugging to help troubleshoot
const CLIENT_ID = getClientId();
console.log('Google Client ID available:', CLIENT_ID ? 'Yes' : 'No');
console.log('Client ID value (masked):', CLIENT_ID ? `${CLIENT_ID.substring(0, 3)}...${CLIENT_ID.substring(CLIENT_ID.length - 3)}` : 'none');

// Handle Google Auth initialization
export const initGoogleAuth = (): Promise<google.accounts.oauth2.TokenClient> => {
  return new Promise((resolve, reject) => {
    // Get the latest client ID value when needed
    const currentClientId = getClientId();
    
    if (!currentClientId) {
      console.error('Google Client ID is not configured. Using demo mode.');
      reject(new Error('Google Client ID is not configured. Please add your Google Client ID to the app.'));
      return;
    }

    console.log('Initializing Google Auth with Client ID');
    
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        console.log('Google API script loaded successfully');
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: currentClientId,
          scope: SCOPES,
          callback: () => {}, // We'll set this when we request the token
        });
        resolve(tokenClient);
      } catch (err) {
        console.error('Error initializing token client:', err);
        reject(err);
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load Google API script:', error);
      reject(error);
    };
    document.body.appendChild(script);
  });
};

// Request access token and fetch user info
export const requestGoogleCalendarAccess = async (): Promise<CalendarUser> => {
  try {
    // Check if CLIENT_ID is set (get fresh value)
    const currentClientId = getClientId();
    if (!currentClientId) {
      console.log('No Google Client ID found, falling back to demo mode');
      throw new Error('Google Client ID is not configured. Please go to Settings > API Configuration to add your Google API Client ID.');
    }
    
    // Log origin for debugging
    const authOrigin = getAuthOrigin();
    console.log('Using authorized origin:', authOrigin);
    
    console.log('Requesting Google Calendar access');
    
    // Initialize the token client
    const tokenClient = await initGoogleAuth();
    
    // Request the token
    return new Promise((resolve, reject) => {
      tokenClient.callback = async (response) => {
        if (response.error) {
          console.error('Error in token response:', response.error);
          reject(new Error(response.error));
          return;
        }
        
        const accessToken = response.access_token;
        console.log('Access token obtained successfully');
        
        try {
          // Fetch user info using the token
          console.log('Fetching user info');
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          const userInfo = await userInfoResponse.json();
          console.log('User info retrieved:', userInfo.email);
          
          // Create CalendarUser object
          const calendarUser: CalendarUser = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            calendarId: userInfo.email, // Primary calendar ID is usually the email
            accessToken,
            colorClass: 'bg-blue-500', // Default color
          };
          
          resolve(calendarUser);
        } catch (error) {
          console.error('Error fetching user info:', error);
          reject(error);
        }
      };
      
      // Prompt the user to select an account and grant consent
      tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  } catch (error) {
    console.error('Error requesting Google Calendar access:', error);
    throw error;
  }
};
