"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { triggerSessionCompleteConfetti } from "@/utils/confetti";
import Image from "next/image";

export const Footer = () => {
  const handleHeartClick = async () => {
    try {
      // Trigger the spectacular triple-burst confetti explosion! 🌈💥✨
      console.log('❤️ Heart clicked! Triggering spectacular confetti explosion...');
      triggerSessionCompleteConfetti();
    } catch (error) {
      console.error('Error triggering confetti:', error);
    }
  };

  return (
    <footer className="mt-auto py-3 sm:py-6 px-4 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 sm:gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} TalkAI. All rights reserved.
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground text-center">
          Made with{" "}
          <button
            onClick={handleHeartClick}
            className="inline-flex items-center heartbeat-pulse hover:scale-110 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded"
            aria-label="Click for a surprise!"
          >
            ❤️
          </button>
          {" "}by talkAI
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/mental-health-resources"
            className="hover:text-foreground transition-colors font-medium text-primary"
          >
            Mental Health Resources
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/disclaimer"
            className="hover:text-foreground transition-colors"
          >
            Disclaimer
          </Link>
        </div>
        
        {/* Social Media Icons and Logo */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://x.com/talkai_im"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <div className="ml-4">
            <Link
              href="https://www.uneed.best"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Uneed"
            >
              <Image
                src="/marketing/uneed_EMBED3_light.png"
                alt="Uneed logo light"
                width={80}
                height={16}
                className="block dark:hidden"
                priority
              />
            </Link>
            <Link
              href="https://www.uneed.best"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Uneed"
            >
              <Image
                src="/marketing/uneed_EMBED3B_dark.png"
                alt="Uneed logo dark"
                width={80}
                height={16}
                className="hidden dark:block"
                priority
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 