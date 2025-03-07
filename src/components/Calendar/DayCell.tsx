
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/dateUtils';

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  isFullscreen?: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelectDate,
  isFullscreen = false,
}) => {
  const hasEvents = events.length > 0;
  
  // Generate class names based on day status
  const dayClasses = cn(
    'relative border border-border/30 p-1 transition-all',
    isFullscreen ? 'h-auto min-h-24' : 'h-14',
    !isCurrentMonth && 'text-muted-foreground bg-background/50',
    isCurrentMonth && 'bg-card'
  );
  
  const dayNumberClasses = cn(
    'calendar-day flex items-center justify-center',
    isToday && !isSelected && 'calendar-day-today',
    isSelected && 'calendar-day-selected'
  );
  
  const handleClick = () => {
    onSelectDate(day);
  };
  
  // Group events by type for color-coded indicators
  const personalEvents = events.filter(e => e.type === 'personal');
  const workEvents = events.filter(e => e.type === 'work');
  const otherEvents = events.filter(e => !e.type || (e.type !== 'personal' && e.type !== 'work'));
  
  return (
    <div className={dayClasses} onClick={handleClick}>
      <div className="flex justify-end">
        <div className={dayNumberClasses}>
          {format(day, 'd')}
        </div>
      </div>
      
      {/* Event indicators for non-fullscreen mode */}
      {hasEvents && !isFullscreen && (
        <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-0.5">
          {personalEvents.length > 0 && (
            <div className="w-1 h-1 rounded-full bg-calendar-event-personal" />
          )}
          {workEvents.length > 0 && (
            <div className="w-1 h-1 rounded-full bg-calendar-event-work" />
          )}
          {otherEvents.length > 0 && (
            <div className="w-1 h-1 rounded-full bg-calendar-event-other" />
          )}
        </div>
      )}

      {/* Event details for fullscreen mode */}
      {isFullscreen && hasEvents && (
        <div className="mt-2 space-y-1 text-xs overflow-hidden">
          {events.slice(0, 3).map((event, index) => (
            <div 
              key={index}
              className={cn(
                "px-1 py-0.5 rounded truncate",
                event.type === 'personal' ? 'bg-calendar-event-personal/20 text-calendar-event-personal' :
                event.type === 'work' ? 'bg-calendar-event-work/20 text-calendar-event-work' :
                'bg-calendar-event-other/20 text-calendar-event-other'
              )}
              title={event.title}
            >
              <div className="font-medium truncate">{event.title}</div>
              <div className="text-[10px] truncate">
                {formatTime(new Date(event.start))}
              </div>
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-[10px] text-muted-foreground text-center">
              +{events.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCell;
