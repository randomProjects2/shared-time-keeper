
import React, { useState } from 'react';
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

interface GoogleAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CalendarUser) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthClick = () => {
    setIsLoading(true);
    
    // Mock Google Auth flow - in a real app, this would connect to Google's OAuth
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
      
      toast.success('Calendar connected successfully!');
      onSuccess(mockUser);
      onClose();
    }, 1500);
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAuthClick} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Calendar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleAuth;
