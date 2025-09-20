# Project TODOs (Public Journal Mode)

- [ ] Add TypeScript types for `JournalEntry` and related API responses (`types/journal.ts`).
- [ ] Add Open Graph / meta tags for shareable journal links (SEO + social).
- [ ] Implement moderation workflow:
  - Add `is_flagged` boolean column to `public_journals`.
  - Create admin-only API/page to view and flag/unflag entries.
  - Optional automatic content filtering.

(Completed tasks are tracked in commit history and internal tooling.) 