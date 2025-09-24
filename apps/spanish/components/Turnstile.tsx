'use client';

import { useEffect, useRef, useState } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileComponentProps {
  onVerify: (token: string | null) => void;
  onError?: (error: string) => void;
  siteKey: string;
}

export default function TurnstileComponent({ 
  onVerify, 
  onError,
  siteKey 
}: TurnstileComponentProps) {
  const [mounted, setMounted] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[65px] w-full bg-gray-100 rounded animate-pulse" />
    );
  }

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      onSuccess={onVerify}
      onError={onError}
      options={{
        theme: 'light',
        size: 'normal',
      }}
    />
  );
}
