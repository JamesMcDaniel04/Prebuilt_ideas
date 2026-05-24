import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function PricingPage() {
  const { user, profile } = useAuth();

  function startUpgrade() {
    // Stripe wiring lands post-MVP. For tomorrow we flip is_pro manually in Supabase.
    toast.info("Checkout coming online shortly — message us and we'll flip you on.");
  }

  return (
    <section className="container-narrow py-16 max-w-3xl">
      <h1 className="font-display text-4xl">Pricing</h1>
      <p className="mt-2 text-muted-foreground">
        Free to browse. Pro unlocks every build brief.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Tier
          name="Free"
          price="$0"
          tagline="Browse the full catalogue."
          features={[
            "All opportunities, all filters",
            "Save to a personal list",
            "New entries every week",
          ]}
          cta={<Button variant="outline" asChild className="w-full"><Link to="/">Start browsing</Link></Button>}
        />
        <Tier
          highlight
          name="Pro"
          price="$24"
          period="/ month"
          tagline="Ship from a brief, not from scratch."
          features={[
            "Everything in Free",
            "Download Markdown build briefs",
            "Paste straight into Claude Code, Cursor, or Codex",
            "Early access to new opportunities",
          ]}
          cta={
            profile?.is_pro ? (
              <Button disabled className="w-full">You're Pro — thank you</Button>
            ) : user ? (
              <Button className="w-full" onClick={startUpgrade}>
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            ) : (
              <Button className="w-full" asChild>
                <Link to="/auth?mode=signup&next=/pricing">
                  <Sparkles className="h-4 w-4" />
                  Create account & upgrade
                </Link>
              </Button>
            )
          }
        />
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Annual plans and team seats coming soon. Cancel anytime.
      </p>
    </section>
  );
}

function Tier({
  name, price, period, tagline, features, cta, highlight,
}: {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-6 " +
        (highlight ? "border-primary/40 bg-gradient-to-br from-primary/[0.04] to-accent/[0.06]" : "bg-card")
      }
    >
      <div className="flex items-baseline gap-2">
        <h3 className="font-display text-xl">{name}</h3>
        {highlight && (
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            Pro
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">{cta}</div>
    </div>
  );
}
