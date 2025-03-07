
import { useState, useEffect } from 'react';
import { addDays, subDays } from 'date-fns';
import { toast } from 'sonner';

// Types for our calendar application
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date string
  end: string; // ISO date string
  location?: string;
  type?: 'personal' | 'work' | string;
  userId: string;
  attendees?: string[];
}

export interface CalendarUser {
  id: string;
  name: string;
  email: string;
  calendarId: string;
  accessToken: string;
  colorClass?: string;
}

interface UseCalendarEventsProps {
  users: CalendarUser[];
}

interface UseCalendarEventsReturn {
  events: CalendarEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
}

// Mock data generator function
const generateMockEvents = (users: CalendarUser[]): CalendarEvent[] => {
  if (users.length === 0) return [];
  
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Create some events for the current month
  users.forEach(user => {
    // Personal events
    const personalEvent: CalendarEvent = {
      id: `event-${Date.now()}-1`,
      title: 'Lunch with friends',
      description: 'Meet at the usual spot',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30).toISOString(),
      location: 'Downtown Cafe',
      type: 'personal',
      userId: user.id,
      attendees: ['Friend 1', 'Friend 2']
    };
    events.push(personalEvent);
    
    // Work events
    const workEvent: CalendarEvent = {
      id: `event-${Date.now()}-2`,
      title: 'Team Meeting',
      description: 'Weekly status update',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0).toISOString(),
      location: 'Conference Room B',
      type: 'work',
      userId: user.id,
      attendees: ['Colleague 1', 'Colleague 2', 'Manager']
    };
    events.push(workEvent);
    
    // Event for tomorrow
    const tomorrowEvent: CalendarEvent = {
      id: `event-${Date.now()}-3`,
      title: 'Doctor Appointment',
      start: new Date(addDays(today, 1).setHours(10, 0, 0, 0)).toISOString(),
      end: new Date(addDays(today, 1).setHours(11, 0, 0, 0)).toISOString(),
      type: 'personal',
      userId: user.id
    };
    events.push(tomorrowEvent);
    
    // Event for yesterday
    const yesterdayEvent: CalendarEvent = {
      id: `event-${Date.now()}-4`,
      title: 'Product Launch',
      start: new Date(subDays(today, 1).setHours(9, 0, 0, 0)).toISOString(),
      end: new Date(subDays(today, 1).setHours(10, 30, 0, 0)).toISOString(),
      type: 'work',
      userId: user.id
    };
    events.push(yesterdayEvent);
  });
  
  return events;
};

export const useCalendarEvents = ({ users }: UseCalendarEventsProps): UseCalendarEventsReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to Google Calendar
      // For now, we'll use mock data
      setTimeout(() => {
        const mockEvents = generateMockEvents(users);
        setEvents(mockEvents);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch events');
      setError(error);
      setIsLoading(false);
      toast.error('Failed to load calendar events');
      console.error('Error fetching calendar events:', error);
    }
  };
  
  // Add new event function
  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    try {
      // Create a new event with a unique ID
      const newEvent: CalendarEvent = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      // In a real app, this would be an API call to the calendar service
      // For now, we'll just update our local state
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      toast.success('Appointment added successfully');
      return newEvent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add event');
      toast.error('Failed to add appointment');
      console.error('Error adding event:', error);
      throw error;
    }
  };
  
  // Fetch events when users change
  useEffect(() => {
    if (users.length > 0) {
      fetchEvents();
    } else {
      setEvents([]);
      setIsLoading(false);
    }
  }, [users]);
  
  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    addEvent
  };
};
