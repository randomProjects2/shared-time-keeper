
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
import { Switch } from '@/components/ui/switch';

interface ApiKeyFormProps {
  onSave: (clientId: string, origin?: string) => void;
}

interface FormValues {
  clientId: string;
  origin: string;
  useLocalhost: boolean;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave }) => {
  const [currentClientId, setCurrentClientId] = useState<string>('');
  const [currentOrigin, setCurrentOrigin] = useState<string>('');
  
  // Initialize form with current values
  const form = useForm<FormValues>({
    defaultValues: {
      clientId: '',
      origin: '',
      useLocalhost: false,
    }
  });

  // Load saved values on mount
  useEffect(() => {
    const savedClientId = localStorage.getItem('googleClientId') || '';
    const savedOrigin = localStorage.getItem('googleAuthOrigin') || '';
    
    setCurrentClientId(savedClientId);
    setCurrentOrigin(savedOrigin);
    
    form.reset({ 
      clientId: savedClientId, 
      origin: savedOrigin,
      useLocalhost: savedOrigin.includes('localhost') || savedOrigin.includes('127.0.0.1')
    });
  }, [form]);

  // Update origin when localhost toggle changes
  useEffect(() => {
    const useLocalhost = form.watch('useLocalhost');
    if (useLocalhost) {
      form.setValue('origin', window.location.protocol + '//localhost:8080');
    }
  }, [form.watch('useLocalhost')]);

  const onSubmit = (data: FormValues) => {
    const { clientId, origin, useLocalhost } = data;
    
    // Determine the final origin value
    const finalOrigin = useLocalhost 
      ? window.location.protocol + '//localhost:8080' 
      : origin;
    
    // Save to localStorage
    localStorage.setItem('googleClientId', clientId);
    localStorage.setItem('googleAuthOrigin', finalOrigin);
    
    setCurrentClientId(clientId);
    setCurrentOrigin(finalOrigin);
    
    // Call the parent handler
    onSave(clientId, finalOrigin);
    
    toast.success('Google API settings saved successfully');
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
        
        <FormField
          control={form.control}
          name="useLocalhost"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Use localhost origin</FormLabel>
                <FormDescription>
                  Enable this for local development (http://localhost:8080)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem className={form.watch('useLocalhost') ? "opacity-50" : ""}>
              <FormLabel>Authorized JavaScript Origin</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., https://yourdomain.com" 
                  {...field}
                  disabled={form.watch('useLocalhost')}
                />
              </FormControl>
              <FormDescription>
                This must match an origin registered in Google Cloud Console.
                {currentOrigin && !form.watch('useLocalhost') && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Current origin:</span> {currentOrigin}
                  </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          <Key className="mr-2 h-4 w-4" />
          Save API Settings
        </Button>
      </form>
    </Form>
  );
};

export default ApiKeyForm;
