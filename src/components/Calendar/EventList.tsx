
import React from 'react';
import { format, isSameDay } from 'date-fns';
import EventCard from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';

interface EventListProps {
  date: Date;
  events: CalendarEvent[];
  isLoading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ date, events, isLoading = false }) => {
  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    isSameDay(new Date(event.start), date) || 
    isSameDay(new Date(event.end), date)
  );
  
  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  
  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{format(date, 'EEEE, MMMM d')}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl p-4 border animate-pulse">
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(date, 'EEEE, MMMM d')}</h2>
        <span className="text-sm text-muted-foreground">
          {sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'}
        </span>
      </div>
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No events scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
