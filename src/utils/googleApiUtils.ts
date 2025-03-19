
// Google Calendar API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ');

// The client ID from the Google Cloud Console
// Priority: 1. Environment variable 2. Hardcoded value
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Add debugging to help troubleshoot
console.log('Google Client ID available:', CLIENT_ID ? 'Yes' : 'No');

// Handle Google Auth initialization
export const initGoogleAuth = (): Promise<google.accounts.oauth2.TokenClient> => {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
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
          client_id: CLIENT_ID,
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
    // Check if CLIENT_ID is set
    if (!CLIENT_ID) {
      console.log('No Google Client ID found, falling back to demo mode');
      throw new Error('Google Client ID is not configured. Using demo mode instead.');
    }
    
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
