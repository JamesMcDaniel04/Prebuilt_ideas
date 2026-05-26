/**
 * stripe-webhook — Supabase Edge Function (Deno)
 *
 * Deploy with `supabase functions deploy stripe-webhook --no-verify-jwt`
 * so Stripe can POST to it without a Supabase JWT. We authenticate the
 * payload via Stripe's signed signature header instead.
 *
 * Handles:
 *   checkout.session.completed       → first-time upgrade
 *   customer.subscription.updated    → plan change, renewal, cancel scheduled
 *   customer.subscription.deleted    → cancellation took effect
 *
 * Idempotency: every event id is logged to stripe_webhook_events; replays
 * short-circuit with 200 OK.
 *
 * Required env:
 *  - STRIPE_SECRET_KEY              (to fetch subscription details when needed)
 *  - STRIPE_WEBHOOK_SECRET          (whsec_... — set in Stripe dashboard)
 *  - STRIPE_PRICE_ENTREPRENEUR      (used to map price → plan)
 *  - STRIPE_PRICE_VENTURE_STUDIO
 *  - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (writes need service role)
 */

// @ts-expect-error — Deno URL imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PlanTier = "scout" | "entrepreneur" | "venture_studio" | "university";

// @ts-expect-error — Deno.serve
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // @ts-expect-error
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  // @ts-expect-error
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  // @ts-expect-error
  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY")!;
  // @ts-expect-error
  const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  const priceToPlan = new Map<string, PlanTier>([
    // @ts-expect-error
    [Deno.env.get("STRIPE_PRICE_ENTREPRENEUR") ?? "", "entrepreneur"],
    // @ts-expect-error
    [Deno.env.get("STRIPE_PRICE_VENTURE_STUDIO") ?? "", "venture_studio"],
  ]);

  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  const valid = await verifyStripeSignature(rawBody, sigHeader, WEBHOOK_SECRET);
  if (!valid) return new Response("Bad signature", { status: 400 });

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // Idempotency: drop replays.
  const { data: prior } = await admin
    .from("stripe_webhook_events")
    .select("id, processed_at")
    .eq("id", event.id)
    .maybeSingle();
  if (prior?.processed_at) {
    return new Response("Already processed", { status: 200 });
  }
  if (!prior) {
    await admin.from("stripe_webhook_events").insert({
      id: event.id,
      type: event.type,
      payload: event,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as CheckoutSession;
        const teamId = session.client_reference_id ?? session.metadata?.team_id;
        const subId = typeof session.subscription === "string" ? session.subscription : null;
        if (!teamId || !subId) break;
        await syncFromSubscription(admin, STRIPE_SECRET, priceToPlan, teamId, subId);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as StripeSubscription;
        const teamId = sub.metadata?.team_id ?? (await teamFromCustomer(admin, sub.customer));
        if (!teamId) break;
        await applySub(admin, priceToPlan, teamId, sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as StripeSubscription;
        const teamId = sub.metadata?.team_id ?? (await teamFromCustomer(admin, sub.customer));
        if (!teamId) break;
        // Drop the team back to scout and clear the subscription pointer.
        await admin.rpc("apply_stripe_subscription", {
          p_team_id: teamId,
          p_customer_id: sub.customer,
          p_subscription_id: sub.id,
          p_price_id: sub.items?.data?.[0]?.price?.id ?? null,
          p_plan: "scout",
          p_status: "canceled",
          p_current_period_end: new Date((sub.current_period_end ?? 0) * 1000).toISOString(),
          p_cancel_at_period_end: false,
        });
        break;
      }
      default:
        // Ignored event — still mark processed so we don't fetch it again.
        break;
    }
    await admin.from("stripe_webhook_events").update({ processed_at: new Date().toISOString() }).eq("id", event.id);
    return new Response("ok", { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(`Handler error: ${msg}`, { status: 500 });
  }
});

async function syncFromSubscription(
  admin: ReturnType<typeof createClient>,
  stripeSecret: string,
  priceToPlan: Map<string, PlanTier>,
  teamId: string,
  subscriptionId: string,
) {
  const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${stripeSecret}` },
  });
  if (!subRes.ok) throw new Error(`Stripe sub fetch failed: ${subRes.status}`);
  const sub = (await subRes.json()) as StripeSubscription;
  await applySub(admin, priceToPlan, teamId, sub);
}

async function applySub(
  admin: ReturnType<typeof createClient>,
  priceToPlan: Map<string, PlanTier>,
  teamId: string,
  sub: StripeSubscription,
) {
  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const plan: PlanTier = (priceId && priceToPlan.get(priceId)) || "scout";
  await admin.rpc("apply_stripe_subscription", {
    p_team_id: teamId,
    p_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    p_subscription_id: sub.id,
    p_price_id: priceId,
    p_plan: plan,
    p_status: sub.status,
    p_current_period_end: new Date((sub.current_period_end ?? 0) * 1000).toISOString(),
    p_cancel_at_period_end: !!sub.cancel_at_period_end,
  });
}

async function teamFromCustomer(
  admin: ReturnType<typeof createClient>,
  customer: string | { id: string },
): Promise<string | null> {
  const cid = typeof customer === "string" ? customer : customer?.id;
  if (!cid) return null;
  const { data } = await admin.from("teams").select("id").eq("stripe_customer_id", cid).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

/** Verify Stripe's `t=...,v1=...` signature. Constant-time compare on the HMAC. */
async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k.trim(), v?.trim()];
    }),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  // Reject signatures older than 5 minutes (Stripe's default tolerance).
  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - Number(t));
  if (!Number.isFinite(ageSec) || ageSec > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const macBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${t}.${payload}`),
  );
  const expected = Array.from(new Uint8Array(macBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(expected, v1);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// --- minimal Stripe payload shapes (only the fields we read) ---
type StripeEvent = {
  id: string;
  type: string;
  data: { object: unknown };
};
type CheckoutSession = {
  client_reference_id: string | null;
  metadata?: { team_id?: string; user_id?: string; plan?: string };
  subscription: string | { id: string } | null;
};
type StripeSubscription = {
  id: string;
  customer: string | { id: string };
  status: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  metadata?: { team_id?: string; plan?: string };
  items?: { data: Array<{ price?: { id: string } }> };
};
