
// Google Calendar API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ');

// The client ID you would get from the Google Cloud Console
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Handle Google Auth initialization
export const initGoogleAuth = (): Promise<google.accounts.oauth2.TokenClient> => {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: () => {}, // We'll set this when we request the token
        });
        resolve(tokenClient);
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
  });
};

// Request access token and fetch user info
export const requestGoogleCalendarAccess = async (): Promise<CalendarUser> => {
  try {
    // Initialize the token client
    const tokenClient = await initGoogleAuth();
    
    // Request the token
    return new Promise((resolve, reject) => {
      tokenClient.callback = async (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        
        const accessToken = response.access_token;
        
        try {
          // Fetch user info using the token
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          const userInfo = await userInfoResponse.json();
          
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
