
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent, CalendarUser } from '@/hooks/useCalendarEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Check, Users } from 'lucide-react';
import { toast } from 'sonner';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  currentUser: CalendarUser | null;
  connectedUsers: CalendarUser[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  currentUser,
  connectedUsers
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [type, setType] = useState<'personal' | 'work' | string>('personal');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the appointment');
      return;
    }
    
    if (!currentUser) {
      toast.error('No calendar connected. Please connect a calendar first.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create start and end date objects
      const startDate = new Date(selectedDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(selectedDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      if (endDate <= startDate) {
        toast.error('End time must be after start time');
        setIsSubmitting(false);
        return;
      }
      
      const newEvent: Omit<CalendarEvent, 'id'> = {
        title,
        description,
        location,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type,
        userId: currentUser.id,
        attendees: selectedAttendees.length > 0 ? selectedAttendees : undefined
      };
      
      await onSave(newEvent);
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setStartTime('09:00');
      setEndTime('10:00');
      setType('personal');
      setSelectedAttendees([]);
      
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAttendee = (email: string) => {
    setSelectedAttendees(prev => 
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input 
              value={format(selectedDate, 'EEEE, MMMM d, yyyy')} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Title*</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Meeting with client" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={type}
              onValueChange={setType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Conference Room B"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Details about the appointment"
              rows={3}
            />
          </div>

          {connectedUsers.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium">
                <Users className="h-4 w-4" />
                Attendees
              </label>
              <div className="border rounded-md p-2 space-y-1">
                {connectedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleAttendee(user.email)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.colorClass || 'bg-primary'}`} />
                      <span>{user.name}</span>
                    </div>
                    {selectedAttendees.includes(user.email) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
