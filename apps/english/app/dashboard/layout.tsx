"use client";

import AutoReload from '@/components/AutoReload';
import { useEffect, useRef } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const getSupabaseUserIdFromLocalStorage = (): string | null => {
      try {
        if (typeof window === 'undefined') return null;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith('sb-') && key.includes('auth-token')) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            try {
              const parsed = JSON.parse(raw);
              const userId = parsed?.user?.id || parsed?.currentSession?.user?.id || parsed?.data?.user?.id || parsed?.session?.user?.id;
              if (userId) return userId as string;
            } catch {
              // ignore JSON parse errors
            }
          }
        }
      } catch {
        // ignore
      }
      return null;
    };

    (async () => {
      try {
        const userId = getSupabaseUserIdFromLocalStorage();
        if (!userId) return;

        const storageKey = `tally_dashboard_shown_${userId}`;
        if (typeof window === 'undefined') return;
        if (localStorage.getItem(storageKey)) return;

        const openTally = () => {
          try {
            if ((window as any).Tally?.openPopup) {
              (window as any).Tally.openPopup('wzl9lR');
              localStorage.setItem(storageKey, '1');
              return;
            }

            (window as any).TallyConfig = {
              formId: 'wzl9lR',
              popup: {
                emoji: {
                  text: '👋',
                  animation: 'wave'
                },
                open: { trigger: 'load' },
                layout: 'modal',
                showOnce: false
              }
            };

            setTimeout(() => {
              (window as any).Tally?.openPopup?.('wzl9lR');
              localStorage.setItem(storageKey, '1');
            }, 50);
          } catch (err) {
            console.error('Tally popup open error:', err);
          }
        };

        if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://tally.so/widgets/embed.js';
          script.async = true;
          script.onload = openTally;
          script.onerror = (e) => console.error('Failed to load Tally script', e);
          document.head.appendChild(script);
        } else {
          openTally();
        }
      } catch (error) {
        console.error('Dashboard Tally init error:', error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AutoReload />
      {children}
    </div>
  );
} 