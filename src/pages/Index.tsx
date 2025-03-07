
import React, { useState, useEffect } from 'react';
import MonthView from '@/components/Calendar/MonthView';
import EventList from '@/components/Calendar/EventList';
import AppointmentForm from '@/components/Calendar/AppointmentForm';
import GoogleAuth from '@/components/UserManagement/GoogleAuth';
import { Button } from '@/components/ui/button';
import { useCalendarEvents, CalendarUser } from '@/hooks/useCalendarEvents';
import { PlusCircle, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState<CalendarUser[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const { events, isLoading, addEvent } = useCalendarEvents({ users });

  // Check for stored users on initial load
  useEffect(() => {
    const storedUsers = localStorage.getItem('calendarUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Failed to parse stored users:', error);
      }
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('calendarUsers', JSON.stringify(users));
    }
  }, [users]);

  const handleAddUser = (user: CalendarUser) => {
    setUsers((prev) => [...prev, user]);
    toast.success(`Connected ${user.name}'s calendar`);
  };

  const handleConnect = () => {
    setIsAuthDialogOpen(true);
  };

  const handleAddAppointment = () => {
    if (users.length === 0) {
      toast.error('Please connect a calendar first');
      setIsAuthDialogOpen(true);
      return;
    }
    setIsAppointmentFormOpen(true);
  };

  const handleSaveAppointment = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      await addEvent(eventData);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-3">
            Your Smart Calendar Assistant
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">TimeSync Calendar</h1>
          <p className="text-muted-foreground">
            Seamlessly sync and manage events from multiple Google calendars
          </p>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mb-8 rounded-xl bg-card border text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Connect Your First Calendar</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              To get started, connect your Google Calendar account to see your events.
            </p>
            <Button size="lg" onClick={handleConnect}>
              Connect Google Calendar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Calendar</h2>
                <Button onClick={handleAddAppointment} className="gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  Add Appointment
                </Button>
              </div>
              <MonthView
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                events={events}
              />
            </div>
            <div className="md:col-span-12">
              <EventList 
                date={selectedDate} 
                events={events} 
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      <GoogleAuth 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
        onSuccess={handleAddUser} 
      />

      <AppointmentForm
        isOpen={isAppointmentFormOpen}
        onClose={() => setIsAppointmentFormOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveAppointment}
        currentUser={users.length > 0 ? users[0] : null}
        connectedUsers={users}
      />
    </div>
  );
};

export default Index;
