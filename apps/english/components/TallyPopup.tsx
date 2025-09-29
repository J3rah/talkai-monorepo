"use client";

import { useEffect } from 'react';

export default function TallyPopup() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const devBypass = params.get('trial_bypass') === 'true';

    // Configure Tally popup to show immediately when component mounts
    ;(window as any).TallyConfig = {
      formId: 'wg28kO',
      popup: {
        emoji: {
          text: '❤️',
          animation: 'heart-beat'
        },
        open: {
          trigger: 'load'
        },
        layout: 'modal',
        // In dev bypass, allow multiple opens per session
        showOnce: !devBypass,
        formEventsForwarding: true
      }
    };

    // Load Tally script dynamically
    const loadTallyScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
        console.log('TallyPopup: Tally script already loaded');
        if (devBypass && (window as any).Tally?.openPopup) {
          console.log('TallyPopup: Forcing Tally popup open in trial bypass mode');
          (window as any).Tally.openPopup('wg28kO');
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      script.onload = () => {
        console.log('TallyPopup: Tally script loaded');
        if (devBypass && (window as any).Tally?.openPopup) {
          console.log('TallyPopup: Forcing Tally popup open in trial bypass mode');
          (window as any).Tally.openPopup('wg28kO');
        }
      };
      script.onerror = (error) => {
        console.error('TallyPopup: Failed to load Tally script:', error);
      };
      document.head.appendChild(script);
    };

    loadTallyScript();

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}