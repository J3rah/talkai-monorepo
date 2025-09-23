"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import JournalReaction from "@/components/JournalReaction";
import NextDynamic from "next/dynamic";
import Link from "next/link";
import JournalSocialShare from "@/components/JournalSocialShare";
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

  // Prepare SEO description based on entry content when available
  const seoDescription = entry
    ? entry.content.length > 150
      ? entry.content.slice(0, 147) + "..."
      : entry.content
    : "Read an anonymous journal entry and therapeutic reflection from the TalkAI community.";

  const renderFormattedContent = (raw: string) => {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const hasHeader = /^(therapist\s+feedback|retroalimentación\s+del\s+terapeuta|reflexión\s+del\s+terapeuta)/i.test(lines[0] || "");
    const header = hasHeader ? lines[0] : null;
    const body = hasHeader ? lines.slice(1) : lines;

    return (
      <div className="space-y-4">
        {header && (
          <h3 className="text-lg font-semibold mb-1">{header.replace(/:$/, '')}</h3>
        )}
        <div className="space-y-3">
          {body.map((l, idx) => {
            const text = l.replace(/^-\s*/, '');
            const isTheme = /^tema\s*\d*:|^tema\s*clave|^key\s*theme/i.test(text);
            return (
              <div key={idx}>
                {isTheme ? <span className="font-medium">{text}</span> : text}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Panel</Button>
                </Link>
                <Link href="/sessions">
                  <Button size="sm">Iniciar Nueva Sesión</Button>
                </Link>
              </div>
              {entry && <JournalSocialShare entry={entry} />}
            </div>
            <Card className="p-6 space-y-6">
              <div className="leading-relaxed">{renderFormattedContent(entry.content)}</div>
              <div className="border-t pt-6 text-muted-foreground text-sm">
                <span className="font-medium">Reflexión del terapeuta:</span> {entry.reflection}
              </div>
              <div className="flex items-center justify-between pt-2">
                <JournalReaction journalId={entry.id} />
              </div>
            </Card>
          </>
        ) : (
          <p className="text-center text-muted-foreground">Entry not found.</p>
        )}
      </div>
    </>
  );
} 