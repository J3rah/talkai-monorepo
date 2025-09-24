"use client";

import { useState, useRef } from "react";
import TurnstileComponent from "@/components/Turnstile";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Heart, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";

export default function NewJournalPage() {
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // Basic validation
    if (content.trim().length === 0) {
      setError("Please write something first.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the security verification.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Verify Turnstile server-side first
      const verifyRes = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error("Security verification failed, please try again.");
      }

      const res = await fetch("/api/journal/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create entry");
      }
      setReflection(data.entry.reflection);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAnother = () => {
    setContent("");
    setReflection(null);
    setTurnstileToken(null);
    setCopied(false);
  };

  const handleViewWall = () => {
    router.push("/journal");
  };

  const handleCopyToClipboard = async () => {
    const shareText = `My journal entry on TalkAI:\n\n"${content}"\n\nTherapist reflection:\n"${reflection}"\n\nCheck out TalkAI's community journal wall: https://www.talkai.im/journal`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareText = `My journal entry on TalkAI:\n\n"${content}"\n\nTherapist reflection:\n"${reflection}"\n\nCheck out TalkAI's community journal wall: https://www.talkai.im/journal`;
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://www.talkai.im/journal');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Public Journal</h1>
      {reflection ? (
        <div className="space-y-6">
          {/* User's Entry */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Journal Entry</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700 italic">"{content}"</p>
            </div>
          </Card>

          {/* AI Reflection */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Therapist Reflection</h2>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
              <p className="whitespace-pre-wrap leading-relaxed text-blue-800">"{reflection}"</p>
            </div>
          </Card>

          {/* Social Sharing */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Share Your Entry</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handlePublishAnother} variant="outline" className="flex-1">
              Write Another Entry
            </Button>
            <Button onClick={handleViewWall} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" /> View Community Wall
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Write what's on your mind..."
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <TurnstileComponent
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            onVerify={(token) => setTurnstileToken(token)}
            onError={(error) => setError(error)}
          />
          <Button onClick={handleSubmit} disabled={loading || !turnstileToken} className="w-full">
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
            {loading ? "Thinking..." : "Get Reflection & Publish"}
          </Button>
        </Card>
      )}
    </div>
  );
} 