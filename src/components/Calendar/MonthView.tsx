
import React, { useState } from 'react';
import { addMonths, subMonths, format, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DayCell from './DayCell';
import { getCalendarDays, getWeekDaysShort } from '@/utils/dateUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events?: CalendarEvent[];
}

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  onSelectDate,
  events = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isMobile = useIsMobile();
  
  const today = new Date();
  const calendarDays = getCalendarDays(currentMonth);
  const weekDays = getWeekDaysShort();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), day) || 
      isSameDay(new Date(event.end), day)
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCurrentMonth(today)} 
            className="text-sm"
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl overflow-hidden shadow-sm border">
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className="p-2 text-center text-sm font-medium text-muted-foreground border-b"
            >
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
          
          {calendarDays.map((day, i) => (
            <DayCell
              key={i}
              day={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isSameDay(day, today)}
              isSelected={isSameDay(day, selectedDate)}
              events={getEventsForDay(day)}
              onSelectDate={onSelectDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
