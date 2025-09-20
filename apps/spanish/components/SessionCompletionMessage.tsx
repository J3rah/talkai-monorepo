"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Heart, Pencil, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionCompletionMessageProps {
  sessionDuration: number;
  onClose: () => void;
}

export default function SessionCompletionMessage({ 
  sessionDuration, 
  onClose 
}: SessionCompletionMessageProps) {
  const router = useRouter();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleWriteReflection = () => {
    router.push('/journal/new');
  };

  const handleNewSession = () => {
    router.push('/chat');
    onClose();
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-semibold mb-2">Session Complete!</h3>
        
        {/* Show session duration */}
        <div className="mb-4">
          <Card className="p-4 max-w-sm mx-auto">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{formatDuration(sessionDuration)}</div>
            <div className="text-sm text-muted-foreground">Session Duration</div>
          </Card>
        </div>
        
        <p className="text-muted-foreground mb-2">
          Thank you for your therapy session!
        </p>
        
        <p className="text-sm text-muted-foreground mb-6">
          As a Calm tier user, your conversations remain private and meaningful.
        </p>
        
        {/* Upgrade message for Calm users */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 text-center">
            Want detailed session analytics?
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3 text-center">
            Upgrade to Centered or Grounded to get:
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 text-center list-none">
            <li>• Emotion analysis and trends</li>
            <li>• Session history and insights</li>
            <li>• Conversation transcripts</li>
            <li>• Progress tracking over time</li>
          </ul>
          <Button 
            onClick={() => window.open('/subscription', '_blank')} 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
          >
            View Plans
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button onClick={handleWriteReflection} variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Write Reflection
          </Button>

          <Button onClick={handleNewSession}>
            <Heart className="w-4 h-4 mr-2" />
            Start New Session
          </Button>
          
          <Button onClick={handleGoToDashboard} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
