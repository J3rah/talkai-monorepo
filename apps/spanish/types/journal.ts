export interface JournalEntry {
  id: string;
  /** Raw user-supplied journal content */
  content: string;
  /** AI-generated 2–3 sentence therapist reflection */
  reflection: string;
  /** ISO string timestamp from Supabase */
  created_at: string;
}

export interface JournalEntriesResponse {
  success: boolean;
  entries: JournalEntry[];
  /** Offset to request next page (null or number) */
  nextOffset: number;
}

export interface JournalEntryResponse {
  success: boolean;
  entry: JournalEntry;
}

/** Generic error shape returned by journal endpoints. */
export interface JournalErrorResponse {
  success: false;
  error: string;
} 