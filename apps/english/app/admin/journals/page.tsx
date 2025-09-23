"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Flag, CheckCircle2, Trash2 } from "lucide-react";
import supabase from "@/supabaseClient";
import type { JournalEntry } from "@/types/journal";

interface AdminJournalEntry extends JournalEntry {
  is_flagged: boolean;
}

export default function AdminJournalsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<AdminJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterFlagged, setFilterFlagged] = useState<"all" | "flagged" | "unflagged">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEntries = async (flaggedParam: "all" | "flagged" | "unflagged") => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
      const qp = flaggedParam === "all" ? "" : `?flagged=${flaggedParam === "flagged"}`;
      const res = await fetch(`/api/admin/journals${qp}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch journals");
      setEntries(data.journals as AdminJournalEntry[]);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(filterFlagged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFlagged]);

  const toggleFlag = async (id: string, current: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    // optimistic update
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, is_flagged: !current } : e)));
    try {
      const res = await fetch(`/api/admin/journals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ is_flagged: !current }),
      });
      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      // roll back
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, is_flagged: current } : e)));
      alert("Failed to update flag status");
    }
  };

  const deleteEntry = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    if (!confirm("Delete this journal entry? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/journals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to delete entry");
      }
      // remove from list
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete entry");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Journal Moderation</h1>
        <div className="space-x-2">
          <Button
            variant={filterFlagged === "all" ? "default" : "outline"}
            onClick={() => setFilterFlagged("all")}
          >
            All
          </Button>
          <Button
            variant={filterFlagged === "unflagged" ? "default" : "outline"}
            onClick={() => setFilterFlagged("unflagged")}
          >
            Unflagged
          </Button>
          <Button
            variant={filterFlagged === "flagged" ? "default" : "outline"}
            onClick={() => setFilterFlagged("flagged")}
          >
            Flagged
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : entries.length === 0 ? (
        <p className="text-muted-foreground text-center">No entries.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-6 space-y-4 border-2 border-muted">
              <div className="whitespace-pre-wrap leading-relaxed">
                {entry.content.length > 300 ? entry.content.slice(0, 297) + "..." : entry.content}
              </div>
              <div className="border-t pt-2 text-muted-foreground text-sm">
                <span className="font-medium">Reflection:</span> {entry.reflection.length > 250 ? entry.reflection.slice(0, 247) + "..." : entry.reflection}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`text-sm ${entry.is_flagged ? "text-red-600" : "text-green-600"}`}>
                  {entry.is_flagged ? "Flagged" : "OK"}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleFlag(entry.id, entry.is_flagged)}>
                    {entry.is_flagged ? (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    ) : (
                      <Flag className="w-4 h-4 mr-1" />
                    )}
                    {entry.is_flagged ? "Unflag" : "Flag"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEntry(entry.id)}
                    disabled={deletingId === entry.id}
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> {deletingId === entry.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 