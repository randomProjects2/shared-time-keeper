
import React, { useState, useEffect } from 'react';
import UserList from '@/components/UserManagement/UserList';
import GoogleAuth from '@/components/UserManagement/GoogleAuth';
import { CalendarUser } from '@/hooks/useCalendarEvents';
import { toast } from 'sonner';

const UserSettings = () => {
  const [users, setUsers] = useState<CalendarUser[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  // Load users from localStorage on mount
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
    localStorage.setItem('calendarUsers', JSON.stringify(users));
  }, [users]);

  const handleAddUser = () => {
    setIsAuthDialogOpen(true);
  };

  const handleNewUser = (user: CalendarUser) => {
    setUsers((prev) => [...prev, user]);
    toast.success(`Connected ${user.name}'s calendar`);
  };

  const handleRemoveUser = (userId: string) => {
    const userToRemove = users.find(user => user.id === userId);
    if (userToRemove) {
      setUsers((prev) => prev.filter(user => user.id !== userId));
      toast.success(`Removed ${userToRemove.name}'s calendar`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your calendar connections and preferences
        </p>
      </div>

      <div className="space-y-8">
        <UserList 
          users={users}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />
      </div>

      <GoogleAuth 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
        onSuccess={handleNewUser} 
      />
    </div>
  );
};

export default UserSettings;
