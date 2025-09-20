"use client";

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="h-full min-h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
} 