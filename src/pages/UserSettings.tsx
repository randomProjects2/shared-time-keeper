
import React, { useState, useEffect } from 'react';
import UserList from '@/components/UserManagement/UserList';
import GoogleAuth from '@/components/UserManagement/GoogleAuth';
import ApiKeyForm from '@/components/UserManagement/ApiKeyForm';
import { CalendarUser } from '@/hooks/useCalendarEvents';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  const handleSaveApiKey = (clientId: string) => {
    // This will update the client ID in localStorage
    // The GoogleAuth component will use this value when connecting
    console.log('API key updated:', clientId ? 'Yes (value hidden)' : 'No value provided');
    
    // Force refresh to ensure components pick up the new API key
    window.location.reload();
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
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts">Calendar Accounts</TabsTrigger>
            <TabsTrigger value="api">API Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="mt-6">
            <UserList 
              users={users}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
            />
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Configure the Google Calendar API credentials needed for TimeSync to connect to your calendars.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeyForm onSave={handleSaveApiKey} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
