
import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { formatTime } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  // Determine background color based on event type
  const getEventColor = () => {
    switch (event.type) {
      case 'personal':
        return 'bg-calendar-event-personal/10 border-calendar-event-personal/20';
      case 'work':
        return 'bg-calendar-event-work/10 border-calendar-event-work/20';
      default:
        return 'bg-calendar-event-other/10 border-calendar-event-other/20';
    }
  };

  // Animation delay based on index
  const animationDelay = `${index * 50}ms`;

  return (
    <div 
      className={cn(
        'event-card border',
        getEventColor(),
        'opacity-0 animate-scale-in'
      )}
      style={{ animationDelay, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium truncate">{event.title}</h3>
        <div className={cn(
          'text-xs font-medium rounded-full px-2 py-0.5',
          event.type === 'personal' ? 'bg-calendar-event-personal/20 text-calendar-event-personal' :
          event.type === 'work' ? 'bg-calendar-event-work/20 text-calendar-event-work' :
          'bg-calendar-event-other/20 text-calendar-event-other'
        )}>
          {event.type || 'Other'}
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          <span>
            {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
          </span>
        </div>
        
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            <span>{event.location}</span>
          </div>
        )}
        
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            <span>{event.attendees.length} attendees</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
