"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "@/supabaseClient";

interface VoiceConfiguration {
  id: string;
  internal_name: string;
  display_name: string;
  description: string | null;
  hume_config_id: string;
  tts_config_id?: string;
  required_plan: "calm" | "centered" | "grounded";
  sort_order: number;
  is_active: boolean;
}

interface VoiceConfigurationGroup {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  voice_configurations: VoiceConfiguration[];
}

export default function VoicesDebugPage() {
  const [groups, setGroups] = useState<VoiceConfigurationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("voice_configuration_groups")
          .select(
            `*, voice_configurations!voice_configurations_group_id_fkey(*)`
          )
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;

        const normalized: VoiceConfigurationGroup[] = (data || []).map(
          (g: any) => ({
            ...g,
            voice_configurations: (g.voice_configurations || [])
              .filter((vc: any) => vc.is_active)
              .sort((a: any, b: any) => a.sort_order - b.sort_order),
          })
        );
        if (!active) return;
        setGroups(normalized);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Failed to load voice configurations");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const flat = useMemo(() => {
    return groups.flatMap((g) =>
      g.voice_configurations.map((vc) => ({
        group: g.display_name,
        display_name: vc.display_name,
        internal_name: vc.internal_name,
        hume_config_id: vc.hume_config_id,
        tts_config_id: vc.tts_config_id,
        required_plan: vc.required_plan,
        is_active: vc.is_active,
      }))
    );
  }, [groups]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(flat, null, 2)
      );
      alert("Copied voice list JSON to clipboard");
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Therapist Voices (DB)</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Showing active voices from Supabase. Compare display names and Hume config IDs.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={copyJson}
          className="px-3 py-2 border rounded bg-card hover:bg-accent"
        >
          Copy JSON
        </button>
        <span className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${flat.length} voices`}
          {error ? ` • ${error}` : ""}
        </span>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border border-border rounded">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2 border-b">Group</th>
              <th className="text-left p-2 border-b">Display Name</th>
              <th className="text-left p-2 border-b">Internal Name</th>
              <th className="text-left p-2 border-b">EVI Config ID</th>
              <th className="text-left p-2 border-b">TTS Config ID</th>
              <th className="text-left p-2 border-b">Plan</th>
              <th className="text-left p-2 border-b">Active</th>
            </tr>
          </thead>
          <tbody>
            {flat.map((row) => (
              <tr key={`${row.internal_name}-${row.hume_config_id}`}>
                <td className="p-2 border-b whitespace-nowrap">{row.group}</td>
                <td className="p-2 border-b whitespace-nowrap">{row.display_name}</td>
                <td className="p-2 border-b whitespace-nowrap">{row.internal_name}</td>
                <td className="p-2 border-b font-mono text-xs">
                  {row.hume_config_id}
                </td>
                <td className="p-2 border-b font-mono text-xs">
                  {row.tts_config_id || 'NULL'}
                </td>
                <td className="p-2 border-b whitespace-nowrap">{row.required_plan}</td>
                <td className="p-2 border-b whitespace-nowrap">
                  {row.is_active ? "true" : "false"}
                </td>
              </tr>
            ))}
            {!loading && flat.length === 0 && (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={7}>
                  No voices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
