import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when both Supabase env vars are present. UI components read this to
 * render a "missing config" banner instead of silently failing.
 */
export const isSupabaseConfigured = !!(url && anonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    "[Greenfield] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env. " +
      "Copy .env.example to .env and fill them in. The app will render but no data will load.",
  );
}

/**
 * We always construct the client with a *valid-shaped* URL so this module
 * never throws at import time — that would white-screen the whole app before
 * React can mount. When env vars are missing, every query simply fails at
 * request time, which the UI handles via React Query error states + the
 * MissingConfigBanner.
 */
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: { persistSession: true, autoRefreshToken: true },
  },
);
