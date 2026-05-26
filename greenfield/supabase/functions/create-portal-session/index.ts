/**
 * create-portal-session — Supabase Edge Function (Deno)
 *
 * POST /functions/v1/create-portal-session
 *
 * Auth: caller's JWT. Looks up the caller's owned team, resolves its Stripe
 * customer id, and creates a Billing Portal session so the user can manage
 * payment method, view invoices, or cancel.
 *
 * Required env:
 *  - STRIPE_SECRET_KEY
 *  - APP_URL  (return URL)
 */

// @ts-expect-error — Deno URL imports resolve at runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// @ts-expect-error — Deno.serve
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // @ts-expect-error
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  // @ts-expect-error
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  // @ts-expect-error
  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY")!;
  // @ts-expect-error
  const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:5173";

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "UNAUTHENTICATED" }, 401);

  const user = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await user.auth.getUser();
  if (userErr || !userData.user) return json({ error: "UNAUTHENTICATED" }, 401);

  const { data: rows, error: teamErr } = await user
    .from("team_members")
    .select("teams!inner(stripe_customer_id)")
    .eq("user_id", userData.user.id)
    .eq("role", "owner");
  if (teamErr) return json({ error: "INTERNAL", details: teamErr.message }, 500);
  const customerId = (rows ?? [])
    .map((r: { teams: { stripe_customer_id: string | null } }) => r.teams.stripe_customer_id)
    .find((c) => !!c) as string | undefined;
  if (!customerId) return json({ error: "NO_CUSTOMER", details: "No Stripe customer yet — upgrade first." }, 404);

  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("return_url", `${APP_URL}/pricing`);

  const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const session = await portalRes.json();
  if (!portalRes.ok) {
    return json({ error: "STRIPE_ERROR", details: session?.error?.message ?? "Stripe rejected the request" }, 502);
  }
  return json({ url: session.url as string }, 200);
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
