
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { requestGoogleCalendarAccess } from '@/utils/googleApiUtils';
import { CalendarUser } from '@/hooks/useCalendarEvents';
import { useNavigate } from 'react-router-dom';

interface GoogleAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CalendarUser) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientIdAvailable, setClientIdAvailable] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if client ID is available on component mount and dialog open
  useEffect(() => {
    if (isOpen) {
      checkClientId();
    }
  }, [isOpen]);

  const checkClientId = () => {
    // Check various sources for client ID with localStorage having highest priority
    const hasLocalStorageClientId = !!localStorage.getItem('googleClientId');
    const hasViteEnvClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const hasRuntimeEnvClientId = !!(typeof window !== 'undefined' && window.ENV && window.ENV.VITE_GOOGLE_CLIENT_ID);
    
    const clientIdExists = hasLocalStorageClientId || hasViteEnvClientId || hasRuntimeEnvClientId;
    setClientIdAvailable(clientIdExists);
    
    console.log('Client ID check on dialog open:', clientIdExists ? 'Available' : 'Not available');
    console.log('From localStorage:', hasLocalStorageClientId ? 'Yes' : 'No');
    console.log('From Vite env:', hasViteEnvClientId ? 'Yes' : 'No');
    console.log('From Runtime env:', hasRuntimeEnvClientId ? 'Yes' : 'No');
  };

  const handleAuthClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting Google auth process');
      
      if (!clientIdAvailable) {
        console.log('No client ID detected, using demo mode');
        handleDemoAuth();
        return;
      }
      
      const user = await requestGoogleCalendarAccess();
      toast.success('Calendar connected successfully!');
      onSuccess(user);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Google Calendar';
      
      // If the error indicates missing client ID, use demo mode
      if (errorMessage.includes('Client ID is not configured')) {
        console.log('Error indicated missing client ID, switching to demo mode');
        handleDemoAuth();
        return;
      }
      
      setError(errorMessage);
      toast.error('Failed to connect calendar');
      console.error('Error connecting to Google Calendar:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback to demo mode if Google auth isn't configured
  const handleDemoAuth = () => {
    console.log('Using demo mode');
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock successful auth
      const mockUser: CalendarUser = {
        id: `user-${Date.now()}`,
        name: 'Demo User',
        email: 'demo@example.com',
        calendarId: 'demo@example.com',
        accessToken: 'mock-token',
        colorClass: 'bg-blue-500'
      };
      
      toast.success('Demo calendar connected successfully!');
      onSuccess(mockUser);
      onClose();
    }, 1500);
  };

  const handleConfigureApiKey = () => {
    onClose();
    navigate('/settings?tab=api');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20">
        <DialogHeader>
          <DialogTitle>Connect Google Calendar</DialogTitle>
          <DialogDescription>
            Grant TimeSync access to your Google Calendar to sync events.
            Your data will only be used within this app.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-6 rounded-full bg-primary/10 p-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">
            We'll only access your calendar events and will never modify them without your permission.
          </p>
          
          {!clientIdAvailable && (
            <div className="w-full p-3 mb-4 bg-amber-50 text-amber-600 rounded-md text-sm">
              Google Calendar API credentials not detected. You can configure them in settings or use demo mode.
            </div>
          )}
          
          {error && (
            <div className="w-full p-3 mb-4 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!clientIdAvailable && (
            <Button variant="outline" onClick={handleConfigureApiKey}>
              Configure API Key
            </Button>
          )}
          <Button onClick={handleAuthClick} disabled={isLoading}>
            {isLoading ? 'Connecting...' : clientIdAvailable ? 'Connect Calendar' : 'Use Demo Mode'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleAuth;
