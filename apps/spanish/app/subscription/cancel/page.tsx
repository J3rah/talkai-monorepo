'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SubscriptionCancel() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Subscription Cancelled</h1>
      <p className="mb-4">Your subscription process was cancelled. No charges were made.</p>
      <div className="space-x-4">
        <Button onClick={() => router.push('/dashboard')}>
          Return to Dashboard
        </Button>
        <Button variant="outline" onClick={() => router.push('/subscription')}>
          Try Again
        </Button>
      </div>
    </div>
  );
} 