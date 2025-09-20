"use client";

import { useState, useEffect } from 'react';
import { X, Info, AlertCircle, CheckCircle, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  id: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'announcement';
  delay?: number; // in milliseconds
  autoHide?: boolean;
  autoHideDelay?: number; // in milliseconds
  persistDismissal?: boolean; // remember if user dismissed it
  showLink?: boolean;
  href?: string; // optional link
  linkText?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  id,
  message,
  type = 'info',
  delay = 3000,
  autoHide = false,
  autoHideDelay = 10000,
  persistDismissal = true,
  showLink = false,
  href,
  linkText = 'Learn more'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [confettiCooldown, setConfettiCooldown] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const CONFETTI_LIMIT = 1; // Changed from 3 to 1 - only once per session

  useEffect(() => {
    // Check if user has already dismissed this banner
    if (persistDismissal) {
      const dismissed = localStorage.getItem(`banner-dismissed-${id}`);
      if (dismissed === 'true') {
        return;
      }
    }

    // Show banner after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      // Small delay for smooth animation
      setTimeout(() => setIsShowing(true), 50);
    }, delay);

    // Auto-hide timer if enabled
    let autoHideTimer: number | NodeJS.Timeout;
    if (autoHide) {
      autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, delay + autoHideDelay);
    }

    return () => {
      clearTimeout(showTimer);
      if (autoHideTimer) clearTimeout(autoHideTimer);
    };
  }, [id, delay, autoHide, autoHideDelay, persistDismissal]);

  const handleDismiss = () => {
    setIsShowing(false);
    setTimeout(() => {
      setIsVisible(false);
      if (persistDismissal) {
        localStorage.setItem(`banner-dismissed-${id}`, 'true');
      }
    }, 300); // Wait for animation
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 flex-shrink-0" />;
      case 'announcement':
        return <span className="text-base flex-shrink-0">🎉</span>;
      default:
        return <Info className="h-4 w-4 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/95 text-yellow-50 border-yellow-400';
      case 'success':
        return 'bg-green-500/95 text-green-50 border-green-400';
      case 'announcement':
        // Light mode: #49d5d3, dark mode: purple
        return 'bg-[#49d5d3] text-black border-[#49d5d3] dark:bg-purple-500/95 dark:text-purple-50 dark:border-purple-400';
      default:
        return 'bg-blue-500/95 text-blue-50 border-blue-400';
    }
  };

  if (!isVisible) return null;

  // Confetti on hover (announcement only)
  const handleConfettiHover = () => {
    if (type !== 'announcement' || confettiCooldown || confettiTriggered) return;
    setConfettiCooldown(true);
    setConfettiTriggered(true);
    try {
      // Dynamically import to avoid SSR issues
      import('@/utils/confetti').then(mod => {
        mod.triggerSessionCompleteConfetti();
      });
    } catch (e) {
      // fallback: do nothing
    }
    setTimeout(() => setConfettiCooldown(false), 2000);
  };

  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300',
        'border backdrop-blur-sm rounded-lg shadow-lg',
        'w-[calc(100vw-16px)] max-w-sm sm:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4',
        getStyles(),
        isShowing ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
      onMouseEnter={handleConfettiHover}
    >
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-center">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center">
            {getIcon()}
            <span className="text-xs sm:text-sm font-medium leading-tight">
              {message}
            </span>
            {showLink && href && (
              <a
                href={href}
                className="text-xs sm:text-sm font-semibold underline hover:no-underline whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkText}
              </a>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors ml-1 sm:ml-2"
            aria-label="Dismiss notification"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner; 