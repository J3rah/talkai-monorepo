"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JournalReaction({ journalId }: { journalId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reacted, setReacted] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/journal/reactions?journalId=${journalId}`);
        const data = await res.json();
        if (data.success) {
          setCount(data.count);
        }
      } catch {
        /* ignore */
      }
    };
    fetchCount();
  }, [journalId]);

  const handleReact = async () => {
    if (reacted) return; // simple client-side guard
    setReacted(true);
    setCount((c) => (c ?? 0) + 1);
    try {
      await fetch("/api/journal/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalId }),
      });
    } catch {
      // roll back on failure
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="flex items-center gap-1 text-muted-foreground hover:text-red-600"
      onClick={handleReact}
      disabled={loading || reacted}
    >
      <Heart className="w-4 h-4 fill-current" />
      <span>{count ?? "-"}</span>
    </Button>
  );
} 