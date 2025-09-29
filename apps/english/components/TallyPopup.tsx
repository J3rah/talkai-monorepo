"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function TallyPopup() {
  useEffect(() => {
    // Configure Tally popup to show immediately when component mounts
    (window as any).TallyConfig = {
      "formId": "wg28kO",
      "popup": {
        "emoji": {
          "text": "❤️",
          "animation": "heart-beat"
        },
        "open": {
          "trigger": "load"
        },
        "layout": "modal",
        "showOnce": true,
        "formEventsForwarding": true
      }
    };
  }, []);

  return (
    <Script
      src="https://tally.so/widgets/embed.js"
      strategy="afterInteractive"
    />
  );
}