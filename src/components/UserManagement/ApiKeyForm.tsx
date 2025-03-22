
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Key } from 'lucide-react';

interface ApiKeyFormProps {
  onSave: (clientId: string) => void;
}

interface FormValues {
  clientId: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave }) => {
  const [currentClientId, setCurrentClientId] = useState<string>('');
  
  // Initialize form with current values
  const form = useForm<FormValues>({
    defaultValues: {
      clientId: '',
    }
  });

  // Load saved client ID on mount
  useEffect(() => {
    const savedClientId = localStorage.getItem('googleClientId') || '';
    setCurrentClientId(savedClientId);
    form.reset({ clientId: savedClientId });
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const { clientId } = data;
    
    // Save to localStorage
    localStorage.setItem('googleClientId', clientId);
    setCurrentClientId(clientId);
    
    // Call the parent handler
    onSave(clientId);
    
    toast.success('Google API Client ID saved successfully');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google API Client ID</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your Google API Client ID" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Enter your Google API Client ID to enable Calendar integration.
                {currentClientId && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Current ID:</span> {currentClientId.substring(0, 10)}...
                  </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          <Key className="mr-2 h-4 w-4" />
          Save API Client ID
        </Button>
      </form>
    </Form>
  );
};

export default ApiKeyForm;
