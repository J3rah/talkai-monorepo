"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Displays a cookie consent banner the first time a visitor lands on the site.
 *
 * The banner is hidden once the visitor chooses **Accept All** or **Reject All**.
 * The choice is persisted in `localStorage` under the key `cookieConsent`.
 */
export default function CookieConsent() {
  // Start visible by default; we'll hide immediately in useEffect if the user already chose.
  const [visible, setVisible] = useState(true);

  // Only run on the client – check if the visitor has already made a choice.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cookieConsent");
      if (stored) {
        setVisible(false);
      }
    } catch {
      // localStorage might be unavailable; leave banner visible.
    }
  }, []);

  const handleChoice = (choice: "accepted" | "rejected") => {
    try {
      localStorage.setItem("cookieConsent", choice);
    } catch {
      // Ignore write errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[1000] mx-auto mb-2 w-[95%] sm:left-4 sm:bottom-4 sm:mb-0 sm:w-auto relative flex flex-col sm:flex-row items-center gap-3 rounded-lg border bg-popover p-3 shadow-lg text-popover-foreground"
      )}
    >
      {/* Cookie icon – hide on very small screens to save space */}
      <Cookie
        className="hidden sm:block absolute -top-4 -left-4 h-10 w-10 rounded-full bg-popover p-1 text-yellow-500 shadow"
        strokeWidth={1.5}
      />

      {/* Message */}
      <p className="flex-1 text-xs sm:text-sm leading-relaxed sm:mr-3">
        We use cookies to improve your browsing experience and for marketing purposes. {" "}
        <Link
          href="/privacy"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Read our Privacy Policy
        </Link>
      </p>

      {/* Action buttons */}
      <div className="flex w-full sm:w-auto items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 sm:flex-none text-xs py-2"
          onClick={() => handleChoice("rejected")}
        >
          Reject
        </Button>
        <Button
          className="flex-1 sm:flex-none text-xs py-2"
          onClick={() => handleChoice("accepted")}
        >
          Accept
        </Button>
      </div>

      {/* Settings link – stack underneath on very small screens */}
      <Link
        href="/privacy#cookies"
        className="mt-2 sm:mt-0 sm:ml-2 text-center text-[10px] sm:text-xs font-medium underline underline-offset-4 hover:text-primary w-full sm:w-auto"
      >
        Cookie Settings
      </Link>
    </div>
  );
} 