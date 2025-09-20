"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import NextDynamic from "next/dynamic";
const SEO = NextDynamic(() => import("@/components/SEO"), { ssr: false });
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Share2 } from "lucide-react";
import JournalReaction from "@/components/JournalReaction";
import JournalSocialShare from "@/components/JournalSocialShare";
import Link from "next/link";
import type { JournalEntry } from "@/types/journal";

export default function JournalWallPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const nextOffsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchEntries = async (offset: number) => {
    try {
      const res = await fetch(`/api/journal/entries?offset=${offset}&limit=20`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load entries");
      }
      if (offset === 0) {
        setEntries(data.entries);
      } else {
        setEntries((prev) => [...prev, ...data.entries]);
      }
      nextOffsetRef.current = data.nextOffset ?? offset + (data.entries?.length || 0);
      if (!data.entries || data.entries.length < 20) {
        setFinished(true);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      setFinished(true);
    }
  };

  useEffect(() => {
    fetchEntries(0).finally(() => setLoading(false));
  }, []);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (finished) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entriesObs) => {
      const first = entriesObs[0];
      if (first.isIntersecting && !loadingMore) {
        setLoadingMore(true);
        fetchEntries(nextOffsetRef.current).finally(() => setLoadingMore(false));
      }
    }, { threshold: 1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [finished, loadingMore]);

  const handleShare = async (entry: JournalEntry) => {
    const shareText = `Anonymous journal entry on TalkAI:\n\n${entry.content}\n\nTherapist reflection:\n${entry.reflection}`;
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: "TalkAI Journal Entry", text: shareText, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <SEO
        title="Community Journal Wall | TalkAI"
        description="Read anonymous journal entries and therapeutic reflections from the TalkAI community."
        type="website"
      />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Community Journal Wall</h1>
          <Link href="/journal/new" className="text-primary underline">
            Write a new entry
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-center">No entries yet. Be the first to share!</p>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6 space-y-4">
                <div className="whitespace-pre-wrap leading-relaxed">{entry.content}</div>
                <div className="border-t pt-4 text-muted-foreground text-sm">
                  <span className="font-medium">Therapist reflection:</span> {entry.reflection}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <JournalReaction journalId={entry.id} />
                  <div className="flex items-center gap-2">
                    <JournalSocialShare entry={entry} />
                    <Button size="sm" variant="outline" onClick={() => handleShare(entry)}>
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {/* Sentinel for infinite scroll */}
            {!finished && (
              <div ref={sentinelRef} className="h-10" />
            )}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 