import { Check, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { TIERS, type PricingTier } from "@/lib/pricing";

export default function PricingPage() {
  const { user, profile } = useAuth();

  function startUpgrade(tier: string) {
    toast.info(`${tier} checkout coming online shortly — message us and we'll get you set up.`);
  }

  return (
    <section className="px-6 md:px-10 py-12 max-w-4xl">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Pricing</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl leading-tight">
          Annual plans. No metered usage, no surprise bills.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Pick a plan to unlock the full catalogue, downloadable build briefs, and — on Team — research agents, lead gen, and weekly intel reports.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {TIERS.map((tier) => (
          <TierCard
            key={tier.name}
            tier={tier}
            isCurrent={!!profile?.is_pro && tier.name === "Starter"}
            ctaState={user ? "upgrade" : "signup"}
            onUpgrade={() => startUpgrade(tier.name)}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Annual billing only. Cancel any time — your access stays active through the end of the term. Need a custom plan? <a href="mailto:hello@greenfield.app" className="text-primary hover:underline">Talk to us.</a>
      </p>
    </section>
  );
}

function TierCard({
  tier, isCurrent, ctaState, onUpgrade,
}: {
  tier: PricingTier;
  isCurrent: boolean;
  ctaState: "upgrade" | "signup";
  onUpgrade: () => void;
}) {
  return (
    <div
      className={
        "relative flex flex-col rounded-2xl border p-6 " +
        (tier.highlight
          ? "border-primary/50 bg-gradient-to-br from-primary/[0.05] to-accent/[0.07] shadow-md"
          : "bg-card")
      }
    >
      {tier.highlight && (
        <Badge className="absolute -top-3 left-6 bg-accent text-accent-foreground hover:bg-accent">
          Most teams pick this
        </Badge>
      )}

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl">{tier.name}</h3>
        {tier.highlight && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Includes Team features
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-4xl">{tier.priceLabel}</span>
        <span className="text-sm text-muted-foreground">{tier.per}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {isCurrent ? (
          <Button disabled className="w-full">
            <Check className="h-4 w-4" />
            Current plan
          </Button>
        ) : ctaState === "signup" ? (
          <Button className="w-full" variant={tier.highlight ? "default" : "outline"} asChild>
            <Link to={`/auth?mode=signup&next=/pricing&plan=${tier.name.toLowerCase()}`}>
              <Lock className="h-4 w-4" />
              Create account & subscribe
            </Link>
          </Button>
        ) : (
          <Button className="w-full" variant={tier.highlight ? "default" : "outline"} onClick={onUpgrade}>
            <Sparkles className="h-4 w-4" />
            Start {tier.name}
          </Button>
        )}
      </div>
    </div>
  );
}
