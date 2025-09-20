"use client";

import { Twitter, Facebook, Linkedin, Instagram, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface JournalSocialShareProps {
  entry: {
    id: string;
    content: string;
    reflection: string;
  };
}

export default function JournalSocialShare({ entry }: JournalSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Anonymous journal entry on TalkAI:\n\n${entry.content}\n\nTherapist reflection:\n${entry.reflection}`;
  const url = typeof window !== "undefined" ? window.location.href : "";
  const fullShareText = `${shareText}\n\n${url}`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleTwitterShare}
        className="p-2 h-8 w-8 text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleFacebookShare}
        className="p-2 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleLinkedInShare}
        className="p-2 h-8 w-8 text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleInstagramShare}
        className="p-2 h-8 w-8 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950"
        title="Copy for Instagram"
      >
        <Instagram className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopyLink}
        className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        title="Copy link"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      {copied && (
        <span className="text-xs text-green-600 dark:text-green-400 ml-2">
          Copied!
        </span>
      )}
    </div>
  );
} 