import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Wraps a createClient() factory in a proxy that defers construction until the
 * first property access. This keeps route modules free of import-time side
 * effects, so a missing/misconfigured env var surfaces as a handled request-time
 * error (the route's try/catch) instead of crashing `next build` during the
 * "Collecting page data" step.
 */
export function lazySupabase(factory: () => SupabaseClient): SupabaseClient {
  let client: SupabaseClient | null = null;
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!client) client = factory();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (client as any)[prop];
    },
  });
}
