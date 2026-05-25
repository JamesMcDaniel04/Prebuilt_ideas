export type PricingTier = {
  name: string;
  priceLabel: string;
  per: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

export const TIERS: PricingTier[] = [
  {
    name: "Starter",
    priceLabel: "$99",
    per: "/ year",
    tagline: "For one founder picking what to build next.",
    features: [
      "Full opportunity catalogue, no caps",
      "All filters, search, and saved lists",
      "Download every build brief as Markdown",
      "New opportunities added weekly",
    ],
  },
  {
    name: "Team",
    priceLabel: "$350",
    per: "/ year",
    tagline: "For small teams scouting markets and shortlisting bets together.",
    features: [
      "Everything in Starter",
      "Research agents — point one at an industry and get back a populated set of opportunities",
      "Lead generation — surface real-world buyers and design partners for the opportunities you save",
      "Weekly competitor and market reports tailored to your saved list",
      "Up to 5 seats included",
    ],
    highlight: true,
  },
];
