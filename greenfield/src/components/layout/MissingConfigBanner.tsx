import { AlertTriangle } from "lucide-react";

import { isSupabaseConfigured } from "@/lib/supabase";

export default function MissingConfigBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="border-b border-amber-300/60 bg-amber-50 text-amber-900">
      <div className="container-wide flex items-start gap-3 py-3 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div>
          <p className="font-medium">
            Supabase isn't configured — the app is rendering, but no data will load.
          </p>
          <p className="mt-0.5 text-amber-800/90">
            Create <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env</code> in the{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">greenfield/</code> directory
            with <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{" "}
            (see <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env.example</code>), then restart{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">npm run dev</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
