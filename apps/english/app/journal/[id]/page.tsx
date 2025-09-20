"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Share2 } from "lucide-react";
import JournalReaction from "@/components/JournalReaction";
import NextDynamic from "next/dynamic";
const SEO = NextDynamic(() => import("@/components/SEO"), { ssr: false });
import type { JournalEntry, JournalEntryResponse } from "@/types/journal";

export default function JournalEntryPage() {
  const { id } = useParams() as { id: string };
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/journal/entries/${id}`);
        const data: JournalEntryResponse | { success: false; error: string } = await res.json();
        if (!res.ok || !data.success) {
          throw new Error((data as any).error || "Failed to load entry");
        }
        setEntry(data.entry);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEntry();
  }, [id]);

  const handleShare = async () => {
    if (!entry) return;
    const shareText = `Anonymous journal entry on TalkAI:\n\n${entry.content}\n\nTherapist reflection:\n${entry.reflection}`;
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: "TalkAI Journal Entry", text: shareText, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      alert("Link copied to clipboard!");
    }
  };

  // Prepare SEO description based on entry content when available
  const seoDescription = entry
    ? entry.content.length > 150
      ? entry.content.slice(0, 147) + "..."
      : entry.content
    : "Read an anonymous journal entry and therapeutic reflection from the TalkAI community.";

  return (
    <>
      <SEO
        title="Journal Entry | TalkAI"
        description={seoDescription}
        type="article"
      />
      <div className="max-w-2xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : entry ? (
          <Card className="p-6 space-y-4">
            <div className="whitespace-pre-wrap leading-relaxed">{entry.content}</div>
            <div className="border-t pt-4 text-muted-foreground text-sm">
              <span className="font-medium">Therapist reflection:</span> {entry.reflection}
            </div>
            <div className="flex items-center justify-between pt-2">
              <JournalReaction journalId={entry.id} />
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground">Entry not found.</p>
        )}
      </div>
    </>
  );
} 