
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelectDate,
}) => {
  const hasEvents = events.length > 0;
  
  // Generate class names based on day status
  const dayClasses = cn(
    'relative h-14 border border-border/30 p-1 transition-all',
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
      
      {/* Event indicators */}
      {hasEvents && (
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
    </div>
  );
};

export default DayCell;
