'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/supabaseClient';

export default function VoiceUpdatesPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleUpdateVoiceDescriptions = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setMessage('❌ You must be logged in to perform this action');
        return;
      }

      const response = await fetch('/api/admin/update-voice-descriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ ' + result.error);
      }
    } catch (error) {
      console.error('Error updating voice descriptions:', error);
      setMessage('❌ Failed to update voice descriptions: ' + error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Admin: Voice Description Updates</CardTitle>
          <CardDescription>
            Update voice descriptions and categories to Spanish
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">What this does:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Updates voice group names to Spanish</li>
              <li>• Updates voice descriptions to Spanish</li>
              <li>• Updates voice category descriptions</li>
              <li>• Affects both Classic and Character voice categories</li>
            </ul>
          </div>

          <Button 
            onClick={handleUpdateVoiceDescriptions}
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : 'Update Voice Descriptions to Spanish'}
          </Button>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
