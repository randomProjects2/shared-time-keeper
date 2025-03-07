
// Global type definitions

interface CalendarEvent {
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

interface CalendarUser {
  id: string;
  name: string;
  email: string;
  calendarId: string;
  accessToken: string;
  colorClass?: string;
}
