
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

// Format a date as "Monday, January 1, 2023"
export const formatFullDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

// Format a date as "Jan 1"
export const formatShortDate = (date: Date): string => {
  return format(date, 'MMM d');
};

// Format time as "1:30 PM"
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Format date range for event display
export const formatDateRange = (start: Date, end: Date): string => {
  if (isSameDay(start, end)) {
    return `${formatShortDate(start)}, ${formatTime(start)} - ${formatTime(end)}`;
  }
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
};

// Get all days in a month, including days from previous and next months to fill a calendar grid
export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  // Get all days in month
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(startDate);
  
  // Add days from previous month to fill the first row
  const previousMonthDays = [];
  if (startDay !== 0) {
    const previousMonth = subMonths(monthStart, 1);
    const previousMonthEnd = endOfMonth(previousMonth);
    
    // Get days from previous month to fill the first row
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(previousMonthEnd);
      day.setDate(previousMonthEnd.getDate() - i);
      previousMonthDays.push(day);
    }
  }
  
  // Add days from next month to complete the grid (6 rows x 7 columns = 42 cells)
  const nextMonthDays = [];
  const totalDays = previousMonthDays.length + daysInMonth.length;
  const remainingDays = 42 - totalDays;
  
  if (remainingDays > 0) {
    const nextMonth = addMonths(monthStart, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    
    // Get days from next month to fill the remaining cells
    for (let i = 0; i < remainingDays; i++) {
      const day = new Date(nextMonthStart);
      day.setDate(nextMonthStart.getDate() + i);
      nextMonthDays.push(day);
    }
  }
  
  // Combine all days
  return [...previousMonthDays, ...daysInMonth, ...nextMonthDays];
};

// Get the day status classes for calendar display
export const getDayStatusClass = (
  day: Date,
  currentMonth: Date,
  today: Date,
  selectedDate: Date | null
): string => {
  let classes = 'calendar-day ';
  
  // Check if day is in current month
  if (isSameMonth(day, currentMonth)) {
    classes += 'calendar-day-current-month ';
  } else {
    classes += 'calendar-day-other-month ';
  }
  
  // Check if day is today
  if (isSameDay(day, today)) {
    classes += 'calendar-day-today ';
  }
  
  // Check if day is selected
  if (selectedDate && isSameDay(day, selectedDate)) {
    classes += 'calendar-day-selected ';
  }
  
  return classes;
};

// Get week days headers
export const getWeekDaysShort = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};
