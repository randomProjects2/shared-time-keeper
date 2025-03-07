
import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserListProps {
  users: CalendarUser[];
  onAddUser: () => void;
  onRemoveUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onAddUser, onRemoveUser }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connected Calendars</CardTitle>
        <CardDescription>
          Manage the Google Calendar accounts that are connected to TimeSync.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No calendars connected yet</p>
            <Button onClick={onAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
                      user.colorClass || "bg-primary"
                    )}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onRemoveUser(user.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {users.length > 0 && (
        <CardFooter>
          <Button onClick={onAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Calendar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserList;
