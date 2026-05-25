import type { Opportunity, SourceCitation } from "@/lib/types";

type ThemeKey =
  | "accounting"
  | "industrialMro"
  | "syntheticData"
  | "complianceReadiness"
  | "oncology"
  | "counterUas"
  | "agentInference"
  | "agentOrchestration"
  | "priorAuth"
  | "accessibility"
  | "refrigerantTransition"
  | "leadLine"
  | "dairyBiosecurity"
  | "apprenticeship"
  | "foodTraceability"
  | "droneCompliance"
  | "gridInterconnection"
  | "freightTransparency"
  | "constructionSafety"
  | "shiftWork";

type ResearchStage = "solo" | "smallTeam" | "domainExpert" | "venture";

type StageDefaults = {
  founder_path: Opportunity["founder_path"];
  difficulty: Opportunity["difficulty"];
  starting_capital: Opportunity["starting_capital"];
  time_to_launch: Opportunity["time_to_launch"];
  build_stack_hint: Opportunity["build_stack_hint"];
  revenue_ceiling: Opportunity["revenue_ceiling"];
  model_type: Opportunity["model_type"];
};

type ThemeDefinition = {
  industry: Opportunity["industry"];
  audience: Opportunity["audience"];
  niche: string;
  model_type: Opportunity["model_type"];
  revenue_ceiling?: Opportunity["revenue_ceiling"];
  moat: Opportunity["moat"];
  distribution_play: Opportunity["distribution_play"];
  demand_trend: Opportunity["demand_trend"];
  market_size_summary: string;
  timing_rationale: string;
  sources: SourceCitation[];
};

type IdeaSeed = {
  theme: ThemeKey;
  stage: ResearchStage;
  title: string;
  niche: string;
  summary: string;
  model_type?: Opportunity["model_type"];
  audience?: Opportunity["audience"];
  revenue_ceiling?: Opportunity["revenue_ceiling"];
  moat?: Opportunity["moat"];
  distribution_play?: Opportunity["distribution_play"];
  demand_trend?: Opportunity["demand_trend"];
};

type SeedTuple = [ResearchStage, string, string, string, Opportunity["model_type"]?];

const BASE_DATE = new Date("2026-05-24T00:00:00Z").toISOString();
const BASE_RANK = 36;

function src(
  source_type: SourceCitation["source_type"],
  daysAgo: number,
  url: string,
  title: string,
  snippet: string,
): SourceCitation {
  const d = new Date("2026-05-24T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return {
    source_type,
    url,
    title,
    snippet,
    published_at: d.toISOString(),
    ingested_at: BASE_DATE,
  };
}

const STAGE_DEFAULTS: Record<ResearchStage, StageDefaults> = {
  solo: {
    founder_path: "Bootstrap",
    difficulty: "Easy",
    starting_capital: "Under $1k",
    time_to_launch: "Weeks",
    build_stack_hint: "No-code",
    revenue_ceiling: "Lifestyle ($100k-$1M ARR)",
    model_type: "Productized Service",
  },
  smallTeam: {
    founder_path: "Bootstrap",
    difficulty: "Medium",
    starting_capital: "$1k-$10k",
    time_to_launch: "1-3 months",
    build_stack_hint: "AI-coded (Claude/Cursor/Codex)",
    revenue_ceiling: "Scale ($1M-$10M ARR)",
    model_type: "SaaS",
  },
  domainExpert: {
    founder_path: "Bootstrap",
    difficulty: "Hard",
    starting_capital: "$10k-$100k",
    time_to_launch: "1-3 months",
    build_stack_hint: "Hybrid",
    revenue_ceiling: "Scale ($1M-$10M ARR)",
    model_type: "SaaS",
  },
  venture: {
    founder_path: "VC-backed",
    difficulty: "Expert",
    starting_capital: "$100k+",
    time_to_launch: "3+ months",
    build_stack_hint: "Traditional engineering",
    revenue_ceiling: "Venture ($10M+ ARR)",
    model_type: "Hardware + Software",
  },
};

const THEMES: Record<ThemeKey, ThemeDefinition> = {
  accounting: {
    industry: "Vertical SaaS",
    audience: "B2B",
    niche: "Small-firm accounting ops",
    model_type: "SaaS",
    moat: "Brand & community",
    distribution_play: "Community-led",
    demand_trend: "Steady growth",
    market_size_summary: "Solo and small accounting firms represent a large, fragmented buyer base with meaningful recurring spend and low appetite for enterprise software. A product that owns one painful workflow at $100-$500 per month can become a durable niche business long before it needs broad-firm penetration.",
    timing_rationale: "Karbon and Intuit are both still investing in workflow layers for tax and bookkeeping firms, and practitioners continue discussing practice-management gaps in public communities. That combination signals a live software budget, not just founder imagination.",
    sources: [
      src("blog", 11, "https://www.globenewswire.com/news-release/2025/06/04/3093624/0/en/Karbon-Launches-End-to-End-Tax-Workflows-AI-Innovations-and-Practice-Intelligence-to-Accelerate-Firm-Growth.html", "Karbon launches end-to-end tax workflows and AI innovations", "Practice-management vendors are still shipping deeper workflow tooling for accountants."),
      src("blog", 120, "https://investors.intuit.com/news-events/press-releases/detail/235/intuit-proconnect-announces-karbon-partnership-to-deliver-intuit-practice-management-to-tax-professionals", "Intuit ProConnect announces Karbon partnership", "Major tax software distribution validating lightweight practice-management demand."),
      src("reddit", 21, "https://www.reddit.com/r/Bookkeeping/comments/1sydmst/best_practice_management_software/", "r/Bookkeeping discussion on practice-management software", "Recent thread comparing Karbon, Financial Cents, and other small-firm workflow tools."),
    ],
  },
  industrialMro: {
    industry: "Logistics & Supply Chain",
    audience: "B2B",
    niche: "Obsolete industrial parts",
    model_type: "SaaS",
    moat: "Proprietary data",
    distribution_play: "Cold outbound",
    demand_trend: "Niche but durable",
    market_size_summary: "The obsolete-parts problem is narrow but expensive because it is tied to downtime, decommissioning, and non-standard equipment histories. Buyers do not need a giant platform to justify spend here; they need speed, verification, and sourcing confidence.",
    timing_rationale: "Plants still run aging automation hardware while service brokers and component houses keep publishing guidance on sourcing discontinued parts. The persistence of these operational workarounds suggests the market is still underserved by purpose-built software.",
    sources: [
      src("blog", 95, "https://www.controleng.com/services-for-obsolete-electronic-components/", "Control Engineering on services for obsolete electronic components", "Industry trade guidance focused on keeping legacy electronics alive in production."),
      src("blog", 32, "https://3etech.com/resources/guides/sourcing-obsolete-electronic-components/", "Guide to sourcing obsolete electronic components", "Commercial sourcing workflows still revolve around verification, traceability, and broker relationships."),
      src("reddit", 19, "https://www.reddit.com/r/PLC/comments/1e9glbe/", "r/PLC discussion on Allen-Bradley obsolescence plans", "Operators are still publicly asking how to source and plan around legacy control hardware."),
    ],
  },
  syntheticData: {
    industry: "Developer Tools",
    audience: "B2B",
    niche: "Synthetic regulated data",
    model_type: "API / Usage-Based",
    moat: "Proprietary data",
    distribution_play: "Product-led growth",
    demand_trend: "Accelerating",
    market_size_summary: "Regulated engineering teams increasingly need realistic staging data without moving production records around. This makes synthetic-data infrastructure a real budget line for health-tech, fintech, and enterprise software teams shipping into compliance-heavy environments.",
    timing_rationale: "Open-source synthetic-data tooling remains active, vendors are adding AI-specific configuration features, and fresh academic work is still benchmarking fidelity and privacy tradeoffs. The category is evolving quickly enough that there is room for narrower wedges on top of the core tooling layer.",
    sources: [
      src("blog", 18, "https://www.tonic.ai/blog/agentification-of-test-data-management-meet-structural-agent", "Tonic introduces an agent for structural test-data configuration", "The incumbent category is still investing in workflow automation around synthetic and masked data."),
      src("arxiv", 44, "https://arxiv.org/abs/2504.01908", "Benchmarking Synthetic Tabular Data: A Multi-Dimensional Evaluation Framework", "Recent paper on how to evaluate synthetic data quality beyond one metric."),
      src("github", 60, "https://github.com/sdv-dev/SDV", "Synthetic Data Vault on GitHub", "Active open-source baseline that many teams already use as a starting point."),
    ],
  },
  complianceReadiness: {
    industry: "Legal & Compliance",
    audience: "B2B",
    niche: "Trust and audit readiness",
    model_type: "SaaS",
    moat: "Speed of execution",
    distribution_play: "Partnerships",
    demand_trend: "Steady growth",
    market_size_summary: "Startups selling into larger customers are forced into security reviews, policy requests, and audit prep long before they are ready for heavy enterprise governance software. That creates a wide downmarket wedge for lightweight readiness tooling and productized delivery.",
    timing_rationale: "Vanta’s continued scale and ongoing founder discussion around SOC 2 pressure both indicate that the problem has moved downmarket. Teams are not debating whether this work exists; they are debating how to survive it with tiny headcount.",
    sources: [
      src("blog", 300, "https://www.vanta.com/resources/vanta-announces-series-c", "Vanta announces $150M Series C", "Compliance automation remains a scaled category rather than a fringe workflow."),
      src("hackernews", 65, "https://news.ycombinator.com/item?id=46706083", "Ask HN: Why does SOC 2 feel so hard for early-stage startups?", "Founders openly discussing audit burden and evidence collection pain."),
      src("reddit", 150, "https://www.reddit.com/r/SaaS/comments/1p87eed/customer_asked_if_we_have_soc2_i_said_working_on/", "r/SaaS post about enterprise leads asking for SOC 2", "The compliance request now shows up early in startup sales cycles."),
    ],
  },
  oncology: {
    industry: "Healthcare & Med-Adjacent",
    audience: "B2C",
    niche: "Precision oncology navigation",
    model_type: "Transactional",
    moat: "Regulatory access",
    distribution_play: "Partnerships",
    demand_trend: "Accelerating",
    market_size_summary: "Cancer care is a high-value, high-friction workflow where second opinions, genomics, and trial coordination carry direct willingness to pay. Even niche products can become meaningful businesses because the operational pain is clinical, emotional, and expensive.",
    timing_rationale: "More oncology decisions are now genomics-informed, major cancer centers continue to promote structured second-opinion programs, and new research keeps showing that deeper profiling changes care recommendations. That is enough to support focused workflow businesses around record gathering, navigation, and review.",
    sources: [
      src("other", 72, "https://www.nature.com/articles/s41698-025-00942-5", "Study on comprehensive genomic profiling changing treatment recommendations", "Recent precision-oncology evidence linking deeper profiling to changed care plans."),
      src("other", 14, "https://www.dana-farber.org/appointments-second-opinions/second-opinion-program", "Dana-Farber second-opinion program", "Top-tier cancer centers continue to run explicit second-opinion workflows."),
      src("blog", 12, "https://www.mskcc.org/news/what-to-know-about-getting-second-opinion-after-cancer-diagnosis", "MSK on getting a cancer second opinion", "Patient demand for second opinions is explicit enough to warrant dedicated education and intake systems."),
    ],
  },
  counterUas: {
    industry: "Cybersecurity",
    audience: "B2B",
    niche: "Critical-infrastructure counter-UAS",
    model_type: "Hardware + Software",
    moat: "Regulatory access",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "Utilities, energy sites, ports, and defense-adjacent operators are spending against drone threat models that sit between physical security and regulated infrastructure. The buyer count is limited, but contract values and maintenance potential are high.",
    timing_rationale: "The market is moving from awareness to deployed systems: Anduril is winning international C-UAS contracts, CISA is publishing critical-infrastructure guidance, and DoD keeps updating homeland policy posture. That creates room for software, evidence, and deployment workflows around the hardware stack.",
    sources: [
      src("blog", 14, "https://www.anduril.com/news/anduril-awarded-dutch-ministry-of-defence-cuas-contract", "Anduril awarded Dutch Ministry of Defence C-UAS contract", "Counter-UAS procurement is moving into fielded international programs."),
      src("blog", 40, "https://www.cisa.gov/topics/physical-security/be-air-aware/protect-critical-infrastructure-and-public-gatherings", "CISA guidance on protecting critical infrastructure from UAS threats", "Government guidance now treats drone threats as an operational planning issue."),
      src("other", 90, "https://media.defense.gov/2026/Feb/10/2003873921/-1/-1/1/FACT-SHEET-C-UAS-POLICY-IN-THE-US-HOMELAND.PDF", "DoD fact sheet on U.S. homeland counter-UAS policy", "Homeland counter-UAS authorities and policy scaffolding continue to expand."),
    ],
  },
  agentInference: {
    industry: "AI Infrastructure",
    audience: "B2B",
    niche: "Agent inference performance",
    model_type: "Hardware + Software",
    revenue_ceiling: "Venture ($10M+ ARR)",
    moat: "Capital intensity",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "As agents spend more tokens on branching, tool calling, retries, and speculative decoding, the cost surface shifts away from simple chat benchmarks. That creates room for performance tooling, benchmarking, and specialized infrastructure focused on real agent traces instead of lab demos.",
    timing_rationale: "Groq is publicly marketing speculative decoding gains, new research is focusing on schema-aware tool calling, and enterprises are now measuring agent workloads separately from chat. The workload shape is specific enough to support focused products rather than generic inference claims.",
    sources: [
      src("blog", 25, "https://groq.com/groq-first-generation-14nm-chip-just-got-a-6x-speed-boost-introducing-llama-3-1-70b-speculative-decoding-on-groqcloud/", "Groq launches speculative decoding endpoint with large speed gains", "Speculative decoding is now a commercial performance wedge, not just an academic curiosity."),
      src("blog", 18, "https://groq.com/blog/inside-the-lpu-deconstructing-groq-speed", "Inside the LPU: deconstructing Groq speed", "Low-latency inference architecture is being framed around real workload behavior."),
      src("arxiv", 36, "https://arxiv.org/abs/2604.13519", "ToolSpec: accelerating tool calling with schema-aware speculative decoding", "Fresh research focused specifically on tool-calling traces and decoding behavior."),
    ],
  },
  agentOrchestration: {
    industry: "AI Infrastructure",
    audience: "B2B",
    niche: "Enterprise agent orchestration",
    model_type: "SaaS",
    revenue_ceiling: "Venture ($10M+ ARR)",
    moat: "Network effects",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "Mid-market and enterprise teams now have enough internal agents, automations, and vendor stacks to need shared control planes. The budget shows up as reliability, permissioning, and observability spend rather than generic AI experimentation.",
    timing_rationale: "Anthropic’s Model Context Protocol made tool schemas portable, while Microsoft and others are productizing multi-agent orchestration patterns. The market has moved past one-bot demos and into fleet-management problems.",
    sources: [
      src("blog", 160, "https://www.anthropic.com/research/model-context-protocol", "Anthropic introduces the Model Context Protocol", "Portable tool schemas make shared agent infrastructure substantially more realistic."),
      src("blog", 30, "https://devblogs.microsoft.com/agent-framework/semantic-kernel-multi-agent-orchestration/", "Microsoft on Semantic Kernel multi-agent orchestration", "Large platform vendors are standardizing multi-agent workflow patterns."),
      src("blog", 10, "https://opensource.microsoft.com/blog/2026/05/14/conductor-deterministic-orchestration-for-multi-agent-ai-workflows/", "Conductor for deterministic multi-agent orchestration", "Recent tooling focused on safety limits, workflow control, and cross-model orchestration."),
    ],
  },
  priorAuth: {
    industry: "Healthcare & Med-Adjacent",
    audience: "B2B",
    niche: "Prior authorization operations",
    model_type: "SaaS",
    moat: "Proprietary data",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "Prior authorization is a universal admin burden across specialty care, home health, DME, and payer integrations. Because the workflow touches scheduling, revenue, and patient outcomes, even narrow products can command real ACV if they remove rework or denials.",
    timing_rationale: "CMS operational deadlines under the Interoperability and Prior Authorization Final Rule started on January 1, 2026, CMS published additional drug-related proposals in April 2026, and the AMA’s May 13, 2026 survey still shows deep physician skepticism and burden. The pain is current and budget-relevant.",
    sources: [
      src("other", 145, "https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f", "CMS Interoperability and Prior Authorization Final Rule", "Federal deadlines now force payers and providers to operationalize more transparent authorization workflows."),
      src("other", 40, "https://www.cms.gov/newsroom/fact-sheets/2026-cms-interoperability-standards-prior-authorization-drugs-proposed-rule", "CMS proposed rule on interoperability standards and prior authorization for drugs", "Drug-related authorization APIs and standards remain an active policy area in 2026."),
      src("blog", 11, "https://www.ama-assn.org/practice-management/prior-authorization/ama-prior-authorization-physician-survey", "AMA prior authorization physician survey", "Recent survey data shows physicians still see high burden and low confidence in voluntary payer reform."),
    ],
  },
  accessibility: {
    industry: "Accessibility & Compliance",
    audience: "B2B",
    niche: "Digital accessibility execution",
    model_type: "Productized Service",
    moat: "Speed of execution",
    distribution_play: "Partnerships",
    demand_trend: "Accelerating",
    market_size_summary: "Accessibility work is now tied to procurement, international market access, and release-management risk rather than only litigation fear. That makes room for productized services, tooling, and evidence layers that sit below the full-platform vendors.",
    timing_rationale: "The European Accessibility Act entered into application on June 28, 2025, and WCAG 2 remains the technical baseline many teams must map to across web, app, document, and software surfaces. Accessibility is now a release and compliance workflow, not just an audit event.",
    sources: [
      src("other", 330, "https://accessible-eu-centre.ec.europa.eu/content-corner/news/new-era-inclusion-begins-eaa-enters-force-2025-06-27_en", "AccessibleEU on the EAA entering into force", "The legal trigger for digital-accessibility work is already live across Europe."),
      src("other", 240, "https://digital-strategy.ec.europa.eu/en/policies/web-accessibility", "European Commission web accessibility policy page", "European institutions continue to frame accessibility as an active policy and implementation domain."),
      src("other", 19, "https://www.w3.org/WAI/standards-guidelines/wcag/", "W3C WCAG 2 overview", "WCAG remains the shared technical standard buyers and delivery teams map accessibility work to."),
    ],
  },
  refrigerantTransition: {
    industry: "Climate & Energy",
    audience: "B2B",
    niche: "A2L refrigerant transition",
    model_type: "SaaS",
    moat: "Distribution",
    distribution_play: "Partnerships",
    demand_trend: "Accelerating",
    market_size_summary: "The refrigerant transition creates operational work across contractors, distributors, inspectors, facility owners, and retrofit planners. Buyers do not need a moonshot here; they need documentation, compatibility, training, and project coordination tied to real installs.",
    timing_rationale: "EPA restrictions bit new equipment categories starting January 1, 2025, AHRI is still publishing transition-specific training, and trade coverage keeps documenting field confusion and shortages around A2L equipment. That means there is active demand for transition-specific workflows today.",
    sources: [
      src("other", 9, "https://www.epa.gov/climate-hfcs-reduction/technology-transitions-program", "EPA Technology Transitions Program", "The regulatory transition away from higher-GWP HFCs is active and still evolving."),
      src("blog", 45, "https://www.ahrinet.org/a2l-video-series", "AHRI A2L video series", "Industry groups are still educating contractors, distributors, and inspectors on A2L handling and code changes."),
      src("blog", 22, "https://www.achrnews.com/articles/166001-a2ls-advance-despite-regulatory-uncertainty", "ACHR News on A2Ls advancing despite regulatory uncertainty", "Trade coverage shows the transition is underway even while operational uncertainty remains high."),
    ],
  },
  leadLine: {
    industry: "Water & Utilities",
    audience: "B2B2C",
    niche: "Lead-line replacement operations",
    model_type: "SaaS",
    moat: "Regulatory access",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "Lead-service-line replacement programs sit at the intersection of regulation, resident coordination, contractor management, and public funding. That makes them ideal for workflow software because the bottleneck is operational execution more than strategy.",
    timing_rationale: "EPA’s Lead and Copper Rule Improvements require systems to identify and replace lead pipes on a defined timeline, while funding and execution support materials continue to expand. Utilities and engineering partners now have both deadlines and budget, but still lack resident-facing operating systems.",
    sources: [
      src("other", 140, "https://www.epa.gov/ground-water-and-drinking-water/lead-and-copper-rule-improvements", "EPA Lead and Copper Rule Improvements", "The final rule requires drinking water systems to identify and replace lead pipes within 10 years."),
      src("other", 90, "https://www.epa.gov/ground-water-and-drinking-water/funding-lead-service-line-replacement", "EPA funding sources for lead service line replacement", "Federal and non-federal funding paths exist specifically for lead-line work."),
      src("other", 70, "https://www.epa.gov/ground-water-and-drinking-water/planning-and-conducting-lead-service-line-replacement", "EPA planning and conducting lead service line replacement", "EPA is publishing detailed operational guidance for full replacement programs."),
    ],
  },
  dairyBiosecurity: {
    industry: "Food & Agriculture",
    audience: "B2B",
    niche: "Dairy H5N1 operations",
    model_type: "SaaS",
    moat: "Regulatory access",
    distribution_play: "Direct sales",
    demand_trend: "Steady growth",
    market_size_summary: "The H5N1 response creates recurring logistics, testing, documentation, and biosecurity workflows across farms, processors, and regulators. These are narrow markets but painful enough to sustain focused vertical products.",
    timing_rationale: "USDA launched the National Milk Testing Strategy on December 6, 2024, APHIS continues to update guidance and FAQs, and dairy-specific biosecurity materials remain active. The need is operational and immediate, not theoretical.",
    sources: [
      src("other", 169, "https://www.usda.gov/about-usda/news/press-releases/2024/12/06/usda-announces-new-federal-order-begins-national-milk-testing-strategy-address-h5n1-dairy-herds", "USDA announces National Milk Testing Strategy", "Federal testing and reporting requirements are now shaping dairy operations."),
      src("other", 70, "https://www.aphis.usda.gov/national-milk-testing-strategy", "APHIS National Milk Testing Strategy page", "APHIS continues to maintain and update the strategy as a live program."),
      src("other", 120, "https://www.aphis.usda.gov/livestock-poultry-disease/avian/avian-influenza/hpai-detections/livestock/nmts/faq", "APHIS NMTS FAQ", "Producers and processors still need detailed implementation guidance around testing stages and obligations."),
    ],
  },
  apprenticeship: {
    industry: "Education & Workforce",
    audience: "B2B",
    niche: "Registered apprenticeship operations",
    model_type: "SaaS",
    moat: "Distribution",
    distribution_play: "Partnerships",
    demand_trend: "Steady growth",
    market_size_summary: "Employers, school systems, and intermediaries are being pushed into apprenticeship structures without having apprenticeship-native operating tools. This is a classic wedge where process complexity grows faster than incumbent software quality.",
    timing_rationale: "The Department of Labor released updated Registered Apprenticeship guidance on March 9, 2026, announced new expansion funding on April 13, 2026, and continues to publish fresh participation data in education-linked apprenticeships. That is a strong signal that apprenticeship administration is growing beyond the trades-only core.",
    sources: [
      src("other", 76, "https://www.dol.gov/newsroom/releases/eta/eta20260309", "DOL updated guidance for Registered Apprenticeship", "Federal guidance is still changing the operating expectations for sponsors and partners."),
      src("other", 41, "https://www.dol.gov/newsroom/releases/eta/eta20260413?lang=fa", "DOL announces $85M in apprenticeship expansion funding", "States and intermediaries are still being funded to expand and modernize apprenticeship programs."),
      src("other", 20, "https://www.apprenticeship.gov/sites/default/files/Education-20260501.pdf", "Education apprentices served, fiscal years 2021-2025", "Fresh apprenticeship participation data shows the model expanding into education pathways."),
    ],
  },
  foodTraceability: {
    industry: "Food & Agriculture",
    audience: "B2B",
    niche: "Food traceability readiness",
    model_type: "SaaS",
    moat: "Proprietary data",
    distribution_play: "Direct sales",
    demand_trend: "Steady growth",
    market_size_summary: "Traceability remains a painful problem because it spans suppliers, lot codes, receiving, recalls, and record retrieval across fragmented operators. The compliance delay to 2028 buys time, but it does not remove the work or the budget need.",
    timing_rationale: "FDA is still actively publishing implementation resources, FAQs, and stakeholder actions around the Food Traceability Rule even after Congress pushed enforcement out to July 20, 2028. That means the market is in preparedness mode rather than dead mode.",
    sources: [
      src("other", 25, "https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods", "FDA FSMA final rule for additional traceability records", "The core recordkeeping rule remains the central compliance anchor for covered foods."),
      src("other", 95, "https://www.fda.gov/food/hfp-constituent-updates/fda-takes-several-actions-related-food-traceability-rule", "FDA actions related to the Food Traceability Rule", "FDA is still investing in implementation materials and stakeholder engagement in 2026."),
      src("other", 120, "https://www.fda.gov/food/new-era-smarter-food-safety/tracking-and-tracing-food", "FDA tracking and tracing of food overview", "FDA continues to frame traceability as a strategic public-health capability rather than a paperwork exercise."),
    ],
  },
  droneCompliance: {
    industry: "Industrial & Drone Ops",
    audience: "B2B",
    niche: "FAA drone compliance",
    model_type: "SaaS",
    moat: "Regulatory access",
    distribution_play: "Direct sales",
    demand_trend: "Steady growth",
    market_size_summary: "Commercial drone operators are still small enough to reject heavyweight aviation software but regulated enough to need documentation, waiver, and authorization workflows. That gap supports narrow compliance and mission-readiness products.",
    timing_rationale: "Remote ID is now a standing operational requirement, Part 107 waiver workflows are still active, and the FAA continues updating application guidance and authorization processes. The paperwork surface is now durable enough to build on.",
    sources: [
      src("other", 430, "https://www.faa.gov/uas/getting_started/remote_id", "FAA Remote Identification of Drones", "Remote ID is now a baseline requirement for registered drone operations."),
      src("other", 70, "https://www.faa.gov/uas/commercial_operators/part_107_waivers", "FAA Part 107 waivers", "Waivers remain a live path for operations outside standard Part 107 limits."),
      src("other", 60, "https://www.faa.gov/uas/commercial_operators/part_107_airspace_authorizations", "FAA Part 107 airspace authorizations", "Commercial operators still need a formal pathway for controlled-airspace approvals."),
    ],
  },
  gridInterconnection: {
    industry: "Energy & Grid Infrastructure",
    audience: "B2B",
    niche: "Large-load power coordination",
    model_type: "SaaS",
    revenue_ceiling: "Venture ($10M+ ARR)",
    moat: "Regulatory access",
    distribution_play: "Direct sales",
    demand_trend: "Accelerating",
    market_size_summary: "Large-load coordination around data centers, co-location, interconnection, and demand flexibility is high-value, slow-moving, and deeply document-heavy. That favors workflow and brokerage products because each win supports meaningful contract value.",
    timing_rationale: "NERC’s 2025 Long-Term Reliability Assessment explicitly calls out data-center and large-load growth, while FERC is forcing PJM and other market participants to clarify co-location and forecasting rules. The pain is no longer speculative; it is on the grid operator agenda.",
    sources: [
      src("other", 35, "https://www.nerc.com/globalassets/our-work/assessments/nerc_ltra_2025.pdf", "NERC 2025 Long-Term Reliability Assessment", "NERC explicitly highlights data-center and large-load growth as a planning challenge."),
      src("other", 160, "https://www.ferc.gov/news-events/news/fact-sheet-ferc-directs-nations-largest-grid-operator-create-new-rules-embrace", "FERC fact sheet on large-load co-location rules", "FERC is forcing new tariff clarity around data centers and co-located generation."),
      src("other", 250, "https://www.ferc.gov/news-events/news/chairman-rosners-letter-rtosisos-large-load-forecasting", "FERC Chairman letter on large-load forecasting", "Large-load forecasting and queue realism are now explicit regulatory concerns."),
    ],
  },
  freightTransparency: {
    industry: "Logistics & Supply Chain",
    audience: "B2B",
    niche: "Carrier and broker transparency",
    model_type: "SaaS",
    moat: "Distribution",
    distribution_play: "Cold outbound",
    demand_trend: "Steady growth",
    market_size_summary: "Owner-operators, small fleets, and importers live inside high-friction exception workflows with thin margins and weak visibility. Narrow tools that resolve disputes, onboarding friction, or broker opacity can win because they touch cash flow directly.",
    timing_rationale: "FMCSA’s broker-transparency NPRM is active, OOIDA continues to press for stronger enforcement, and litigation around transparency rights remains live. The argument is not whether the workflow matters; it is how quickly it gets modernized.",
    sources: [
      src("other", 560, "https://www.fmcsa.dot.gov/regulations/docket-no-fmcsa-2023-0257-rin-2126-ac63-transparency-property-broker-transactions", "FMCSA NPRM on transparency in property broker transactions", "Federal regulators are still actively revising broker recordkeeping and access rules."),
      src("blog", 120, "https://www.ooida.com/2025/ooida-calls-for-stronger-broker-transparency-regs-to-protect-small-business-truckers/", "OOIDA calls for stronger broker transparency rules", "The largest owner-operator group continues to frame transparency as an urgent small-business issue."),
      src("blog", 430, "https://www.freightwaves.com/news/tql-faces-federal-lawsuit-over-broker-transparency-dispute", "FreightWaves on TQL broker-transparency dispute", "The issue is active enough to surface in litigation, not just policy commentary."),
    ],
  },
  constructionSafety: {
    industry: "Construction & Skilled Trades",
    audience: "B2B",
    niche: "Inspection and safety ops",
    model_type: "SaaS",
    moat: "Distribution",
    distribution_play: "Partnerships",
    demand_trend: "Steady growth",
    market_size_summary: "Construction safety workflows remain fragmented across general contractors, subcontractors, insurers, and job sites. Buyers will pay for products that reduce document chaos, inspection risk, or insurance friction without trying to replace their entire field stack.",
    timing_rationale: "OSHA’s walkaround rule changed inspection representation in 2024, implementation guidance remains active, and BLS continues to show construction as the deadliest private-sector industry by count. That is enough pressure to support better inspection and recordkeeping tools.",
    sources: [
      src("other", 420, "https://www.osha.gov/worker-walkaround/final-rule", "OSHA worker walkaround final rule", "Inspection representation changed recently enough that operating procedures are still catching up."),
      src("other", 380, "https://www.osha.gov/memos/2024-05-10/interim-guidance-worker-walkaround-representative-designation-process", "OSHA interim guidance for walkaround representative designation", "OSHA had to issue implementation guidance immediately after the rule change."),
      src("other", 20, "https://www.bls.gov/opub/ted/2026/national-safety-stand-down-highlights-fall-hazards-in-construction.htm", "BLS on construction fall hazards and fatalities", "Construction still leads private-industry workplace deaths, with falls dominating the risk profile."),
    ],
  },
  shiftWork: {
    industry: "Education & Workforce",
    audience: "B2C",
    niche: "Predictable scheduling",
    model_type: "SaaS",
    moat: "Network effects",
    distribution_play: "Community-led",
    demand_trend: "Steady growth",
    market_size_summary: "Scheduling instability remains a real pain for hourly workers and a compliance cost for multi-location employers. The wedge exists both on the worker side and the employer evidence side because predictable scheduling rules create recurring recordkeeping and premium-pay workflows.",
    timing_rationale: "New York City and Seattle still maintain active fair-workweek and secure-scheduling enforcement pages, while vertical scheduling vendors continue publishing compliance explainers in 2026. That indicates the problem has not normalized into a solved feature.",
    sources: [
      src("other", 180, "https://www.nyc.gov/site/dca/workers/workersrights/fastfood-retail-workers.page", "NYC Fair Workweek protections for fast food workers", "Large cities still maintain active scheduling-rights enforcement and documentation requirements."),
      src("other", 240, "https://www.glb.seattle.gov/laborstandards/ordinances/secure-scheduling", "Seattle secure scheduling ordinance", "Advance notice, premium pay, and access-to-hours requirements remain active obligations."),
      src("blog", 100, "https://www.7shifts.com/blog/fair-workweek-law/", "7shifts overview of fair workweek law", "Scheduling vendors continue publishing compliance explainers because operators still need help implementing the rules."),
    ],
  },
};

const IDEAS_BY_THEME: Record<ThemeKey, SeedTuple[]> = {
  accounting: [
    ["smallTeam", "Client onboarding OS for solo bookkeepers", "Bookkeeping onboarding", "A client-intake workspace for one- and two-person bookkeeping firms that still chase statements, portal access, and kickoff tasks across email and spreadsheets."],
    ["solo", "Tax organizer reminder autopilot for independent preparers", "Tax intake automation", "A reminder and status engine for independent tax preparers that automatically escalates missing documents before returns fall behind schedule."],
    ["smallTeam", "White-label portal for neighborhood accounting firms", "Client portal", "A branded portal small accounting firms can hand to clients for uploads, status updates, and recurring requests without buying enterprise practice software."],
    ["solo", "Practice migration assistant for spreadsheet-based firms", "Data migration", "A done-for-you migration and cleanup tool for small firms moving off shared drives and ad hoc spreadsheets into a repeatable workflow system."],
    ["domainExpert", "Cash-application copilot for outsourced CFO shops", "Receivables operations", "A workflow assistant for outsourced finance teams reconciling payments, follow-ups, and close tasks across multiple small-business clients."],
    ["smallTeam", "Recurring close tracker for fractional finance teams", "Monthly close ops", "A lightweight operating system for fractional controllers and outsourced close teams that need to run the same monthly sequence across dozens of clients."],
  ],
  industrialMro: [
    ["smallTeam", "Obsolescence alert feed for PLC-heavy plants", "Lifecycle intelligence", "A watchlist that flags end-of-life notices, secondary-market inventory changes, and replacement-risk signals for plants running aging PLC and HMI fleets."],
    ["smallTeam", "Compatibility ledger for legacy industrial boards", "Compatibility data", "A searchable compatibility ledger for legacy industrial boards and modules that records what worked, what failed, and what needed adaptation on real lines."],
    ["venture", "Estate-sale sourcing network for industrial spares", "Supply aggregation", "A sourcing marketplace that turns plant closures, auctions, and estate sales into structured supply for obsolete industrial spare parts."],
    ["domainExpert", "Return-grade verification service for surplus automation parts", "Quality assurance", "A verification workflow and certification layer for surplus automation parts so buyers can distinguish tested inventory from risky unknown stock."],
    ["smallTeam", "Shutdown parts war-room for maintenance teams", "Shutdown coordination", "A centralized war-room for planned shutdowns that tracks critical parts, backup vendors, courier chains, and last-minute substitutions."],
    ["solo", "BOM resurrection service for discontinued machine lines", "Bill-of-materials recovery", "A service-and-software hybrid that reconstructs missing bills of materials and replacement options for machine lines whose OEM support has disappeared."],
  ],
  syntheticData: [
    ["smallTeam", "FHIR sandbox data builder", "FHIR test data", "A synthetic-data builder for health-tech teams that need realistic FHIR bundles, linked patients, and edge cases in staging without touching production PHI."],
    ["smallTeam", "PCI-safe staging mirror for fintech apps", "Payments staging", "A staging-data layer that preserves transaction shapes and failure modes for fintech products without copying live PCI-sensitive records."],
    ["domainExpert", "Synthetic claims dataset exchange for health software vendors", "Claims simulation", "A licensed synthetic dataset exchange for health-tech vendors that need repeatable claims and reimbursement scenarios for product and QA teams."],
    ["smallTeam", "Schema drift detector for synthetic data pipelines", "Data pipeline QA", "A monitor that flags when schema or distribution drift makes previously generated synthetic datasets misleading or unusable for testing."],
    ["smallTeam", "Synthetic-data fidelity evaluation harness", "Quality benchmarking", "A benchmarking harness that compares synthetic-data outputs for fidelity, privacy, and edge-case coverage before teams trust them in test pipelines."],
    ["venture", "Vertical synthetic data warehouse for regulated AI teams", "Regulated AI infrastructure", "A managed warehouse of reusable synthetic datasets and generators tuned for healthcare, insurance, and financial AI product teams."],
  ],
  complianceReadiness: [
    ["solo", "Security questionnaire answer base for early-stage SaaS teams", "Questionnaire workflows", "A structured answer bank that turns repeated enterprise security questionnaires into a reusable, reviewable knowledge base for lean startup teams."],
    ["smallTeam", "Control-evidence calendar for lean compliance teams", "Evidence operations", "A recurring calendar and task system that tells small teams exactly which controls, screenshots, exports, and approvals they need to gather each week."],
    ["solo", "Vendor policy pack generator for first enterprise deals", "Policy generation", "A productized workflow that assembles a startup’s first usable policy pack, security FAQ, and supporting trust documents for enterprise sales."],
    ["smallTeam", "Audit-request portal for startups selling to banks", "Audit intake", "A secure portal for handling customer audit requests, follow-ups, and document exchange when startups start selling into regulated buyers."],
    ["domainExpert", "SOC 2 to ISO 27001 gap mapper for growing SaaS companies", "Framework mapping", "A mapping workspace for companies graduating from SOC 2 into ISO 27001 and trying to reuse evidence instead of restarting compliance from scratch."],
    ["smallTeam", "Continuous evidence collector for human-heavy controls", "Manual control automation", "A lightweight evidence collector for controls that still rely on screenshots, approvals, interviews, and recurring human sign-offs rather than APIs."],
  ],
  oncology: [
    ["smallTeam", "Pathology slide logistics coordinator for remote second opinions", "Slide logistics", "A coordination layer that handles consent, slide shipment, image requests, and receipt tracking for cancer patients seeking remote second opinions."],
    ["domainExpert", "Tumor board packet builder for community oncology clinics", "Tumor board prep", "A packet builder that assembles records, genomic highlights, imaging references, and treatment history for community oncology tumor boards."],
    ["smallTeam", "Trial-screening intake for rare-presentation oncology patients", "Trial intake", "A patient-intake and eligibility workflow for oncology cases that require structured trial-screening beyond a generic clinicaltrials.gov search."],
    ["smallTeam", "Genomics consent and record-chase concierge", "Consent and records", "A workflow service that obtains consents and chases pathology, imaging, and genomics files so precision-oncology opinions start with a complete packet."],
    ["venture", "Employer-sponsored oncology navigation layer", "Employer benefits", "A navigation platform for self-insured employers that routes cancer patients into second opinions, genomic review, and trial discussions earlier in care."],
    ["domainExpert", "Outcome-library tooling for subspecialty oncology networks", "Clinical outcomes knowledge", "A tooling layer for subspecialty oncology networks to maintain searchable outcomes libraries and case analogs for difficult treatment decisions."],
  ],
  counterUas: [
    ["domainExpert", "Drone-incursion evidence room for utilities", "Incident evidence", "A secure evidence room for utilities to log detections, incidents, site photos, law-enforcement handoffs, and post-event reporting around drone incursions."],
    ["smallTeam", "Site-readiness checklist platform for passive counter-UAS deployments", "Deployment readiness", "A checklist and commissioning workspace for facilities preparing to deploy passive detection or interception systems around critical sites."],
    ["venture", "Shared monitoring network for industrial drone incursions", "Threat intelligence", "A shared monitoring and intelligence network that lets industrial operators compare incident patterns and correlate drone threats across sites."],
    ["domainExpert", "Insurance underwriting pack for counter-UAS buyers", "Insurance workflows", "An underwriting and renewal pack that helps critical-infrastructure buyers document their counter-UAS posture for insurers and risk committees."],
    ["smallTeam", "Operator-in-the-loop decision console for passive intercept systems", "Decision support", "A console that structures the approval, escalation, and incident timeline around passive intercept or response actions at critical facilities."],
    ["venture", "Managed detection service for substations and storage terminals", "Managed security", "A managed service for utilities and fuel terminals that combines sensors, triage, and incident playbooks for persistent low-altitude drone threats."],
  ],
  agentInference: [
    ["domainExpert", "Speculative decoding profiler for enterprise agent teams", "Inference profiling", "A profiler that shows exactly where agent workloads lose time and cost to speculative decoding, retries, and tool-call stalls."],
    ["smallTeam", "Tool-call trace benchmark suite for inference vendors", "Benchmarking", "A benchmark suite built from real tool-calling traces so inference vendors can measure agent performance on something more realistic than chat prompts."],
    ["venture", "Low-latency tool memory module for agent appliances", "Tool-state hardware", "A hardware-aware memory module that keeps tool state and branch context hot for regulated on-prem agent deployments."],
    ["domainExpert", "Cost attribution layer for branchy agent workloads", "FinOps for agents", "A FinOps layer that assigns true cost to branching, tool retries, and long-context decisions in enterprise agent stacks."],
    ["smallTeam", "Enterprise agent load replay harness", "Load testing", "A replay harness that reproduces real agent traces for load testing, regression testing, and infrastructure planning."],
    ["venture", "On-prem agent inference box for regulated workloads", "Regulated deployment", "A bundled appliance for regulated teams that need predictable agent latency, local logs, and zero data egress for tool-heavy workflows."],
  ],
  agentOrchestration: [
    ["smallTeam", "Agent identity and secrets broker for mid-market companies", "Identity and secrets", "A shared broker that manages credentials, token scope, and agent identities across internal automation stacks."],
    ["smallTeam", "Cross-agent handoff audit log", "Handoff observability", "An audit log that records when one internal agent hands work, data, or authority to another so teams can reconstruct failures later."],
    ["domainExpert", "Permission graph for internal agents touching finance and HR", "Permission governance", "A permission graph that shows which agents can touch finance, HR, and customer systems and where risky overlaps exist."],
    ["smallTeam", "Fallback router for mixed-vendor internal agents", "Reliability routing", "A routing layer that decides when internal agents should retry, escalate, or fail over to a different model or workflow."],
    ["venture", "Shared policy engine for agent fleets", "Policy orchestration", "A central policy engine that enforces approved tools, escalation rules, and data boundaries across an enterprise’s agent fleet."],
    ["domainExpert", "Agent incident review workspace for compliance teams", "Incident review", "A workspace for compliance and ops teams to review agent incidents, attach evidence, and document corrective actions."],
  ],
  priorAuth: [
    ["smallTeam", "Specialty-clinic denial-reason normalizer", "Denial analytics", "A normalization layer that converts inconsistent payer denial language into a shared taxonomy specialty clinics can actually route and act on."],
    ["smallTeam", "Prior-auth appeal QA workspace", "Appeal workflows", "A pre-submission review workspace that catches missing evidence and weak packets before staff resubmit an appeal."],
    ["smallTeam", "DME order completeness checker", "DME order QA", "An intake checker that flags missing signatures, medical-necessity documents, and form gaps before a DME order leaves the provider."],
    ["smallTeam", "Home-health intake packet gap detector", "Referral completeness", "A referral-intake layer that scores incoming home-health packets for missing forms, missing signatures, and missing payer details."],
    ["domainExpert", "Infusion auth-renewal tracker", "Recurring approvals", "A renewal tracker for infusion centers handling recurring biologics where expiring approvals quietly break schedules and revenue."],
    ["domainExpert", "Payer API conformance test harness", "Payer integration QA", "A conformance harness that helps payers and vendors validate FHIR prior-auth behavior against realistic edge cases before production."],
  ],
  accessibility: [
    ["solo", "EU accessibility evidence packs for Shopify merchants", "Merchant accessibility packs", "A fixed-scope evidence and remediation pack for merchants selling into Europe who need a credible accessibility story without a full internal team."],
    ["solo", "VPAT sprint for B2B SaaS companies", "VPAT delivery", "A fast-turn VPAT preparation workflow for B2B SaaS companies trying to survive procurement reviews and accessibility questionnaires."],
    ["solo", "Accessible PDF remediation for insurers and lenders", "Document accessibility", "A remediation service and workflow system for insurers and lenders whose recurring disclosures and statements still fail accessibility requirements."],
    ["smallTeam", "EAA regression monitor for B2B SaaS release teams", "Release QA", "A regression monitor that watches product releases for accessibility slips and turns them into engineering tickets with proof attached."],
    ["smallTeam", "Accessible-document QA API", "Document QA API", "An API that evaluates generated PDFs and customer notices for machine-readable accessibility issues before they are sent downstream."],
    ["domainExpert", "Municipal digital-accessibility procurement checker", "Procurement review", "A procurement-review workflow for municipalities and public contractors buying software, kiosks, and document-heavy services under accessibility obligations."],
  ],
  refrigerantTransition: [
    ["solo", "A2L retrofit photo-audit service for HVAC shops", "Install documentation", "A photo-audit and checklist workflow for HVAC shops that need better documentation and post-install evidence as A2L equipment rolls out."],
    ["solo", "Refrigerant-log backfill service for commercial HVAC contractors", "Record cleanup", "A backfill service that cleans up historical refrigerant logs and asset histories before contractors move into stricter transition-era documentation."],
    ["smallTeam", "A2L parts-compatibility checker for HVAC distributors", "Counter sales tooling", "A compatibility checker that helps distributor counter teams confirm refrigerant class, component fit, and install caveats in real time."],
    ["smallTeam", "Property-manager refrigerant transition reserve planner", "Capital planning", "A planning tool for multi-site property owners trying to prioritize which assets are most exposed to the refrigerant transition."],
    ["domainExpert", "Grocery cold-chain refrigerant conversion PM tool", "Portfolio retrofit management", "A program-management tool for regional grocery operators sequencing refrigerant conversions across dozens of stores."],
    ["venture", "Refrigerant recovery and resale exchange for retrofit contractors", "Recovery marketplace", "An exchange that tracks recovery, testing, and resale of refrigerant pulled from retrofit projects rather than leaving it as waste or chaos."],
  ],
  leadLine: [
    ["solo", "Lead-line homeowner outreach concierge for engineering firms", "Resident outreach", "A resident outreach and paperwork workflow for engineering firms running municipal lead-line replacement programs."],
    ["solo", "Water-utility public inventory publishing service", "Public inventory UX", "A public-facing publishing layer that turns ugly utility spreadsheets into resident-friendly lead-line inventories and notice pages."],
    ["smallTeam", "Lead-line private-side scheduling portal", "Scheduling", "A scheduling portal that coordinates homeowners, plumbers, utility crews, and inspectors around one lead-line replacement event."],
    ["smallTeam", "Replacement-contractor capacity board for municipal lead programs", "Capacity management", "A contractor-capacity board that shows which approved replacement crews still have room and where programs are stalled."],
    ["domainExpert", "Multi-site lead-replacement equity planner", "Program prioritization", "A planning tool for cities trying to prioritize replacements by risk, readiness, and response rates instead of pipe age alone."],
    ["venture", "Lead-line financing marketplace with municipal escrow", "Financing workflows", "A financing and escrow layer that connects residents, contractors, and municipal programs on the private-side replacement problem."],
  ],
  dairyBiosecurity: [
    ["solo", "Dairy biosecurity SOP builder for regional vet groups", "Biosecurity procedures", "A standardized SOP builder for veterinary groups and dairy networks trying to operationalize H5N1-era biosecurity practices across farms."],
    ["solo", "Milk-sample chain-of-custody setup for processors", "Sample handling", "A forms-and-operations workflow for processors that need cleaner chain-of-custody around milk testing and exception handling."],
    ["smallTeam", "Dairy visitor and vehicle biosecurity log app", "Farm logging", "A mobile-first logbook for farms to record visitors, vehicles, and sanitation checks in a way that survives audits and outbreaks."],
    ["smallTeam", "Bulk-milk pickup exception tracker", "Pickup exceptions", "An operations tool that tracks missed pickups, positive-sample escalations, and chain-of-custody breaks for regional dairy operators."],
    ["domainExpert", "Dairy interstate-movement testing scheduler", "Movement compliance", "A scheduler that coordinates the recurring testing and documentation needed when dairy cattle move across state lines."],
    ["domainExpert", "Dairy processor positive-sample escalation dashboard", "Escalation management", "A dashboard for processors and regulators to coordinate the downstream actions that follow positive milk or herd signals."],
  ],
  apprenticeship: [
    ["solo", "Registered Apprenticeship sponsor application service for school districts", "Sponsor launch", "A done-for-you sponsor application workflow for school districts entering apprenticeship structures for the first time."],
    ["solo", "Apprenticeship launch kit for small manufacturers", "Employer launch", "A launch kit for manufacturers who want apprenticeship programs but do not want to navigate sponsor paperwork from scratch."],
    ["smallTeam", "Apprenticeship supervisor text check-in app", "Field supervision", "A text-first check-in tool that helps supervisors confirm OJT progress and milestones without logging into a portal every day."],
    ["smallTeam", "OJT hour anomaly detector", "Hours QA", "A detector that flags missing, suspicious, or inconsistent on-the-job training hour logs before reporting deadlines arrive."],
    ["domainExpert", "Apprenticeship completion-risk dashboard", "Retention analytics", "A dashboard for intermediaries and sponsors to see which cohorts, employers, or programs are drifting toward non-completion."],
    ["domainExpert", "K-12 apprenticeship intermediary OS", "Intermediary operations", "A lightweight operating system for K-12 apprenticeship intermediaries managing employers, placements, paperwork, and compliance proof."],
  ],
  foodTraceability: [
    ["solo", "Food-traceability record-mapping sprint for berry, greens, and cheese brands", "Traceability mapping", "A productized sprint that maps how a traceability-covered brand currently stores key data elements and where its retrieval gaps still are."],
    ["solo", "Supplier document chase desk for food hubs", "Supplier coordination", "An outsourced workflow desk that keeps supplier certifications, lot-code rules, and key traceability contacts current."],
    ["smallTeam", "Food-traceability 24-hour retrieval layer", "Record retrieval", "A retrieval layer that assembles the right lot, supplier, and receiving records within the 24-hour response window buyers fear most."],
    ["smallTeam", "Supplier onboarding CRM for traceability-covered brands", "Supplier onboarding", "A CRM built around collecting traceability contacts, lot-code formats, and readiness status across fragmented supplier networks."],
    ["domainExpert", "Recall drill simulator for mid-market food brands", "Recall readiness", "A simulator that runs traceability and recall drills so brands can see where their record, contact, and lot-link failures still exist."],
    ["domainExpert", "Produce grower lot-code translation layer", "Code normalization", "A translation layer that normalizes lot-code conventions across growers, packers, and buyers during traceability events."],
  ],
  droneCompliance: [
    ["solo", "Part 107 waiver packet service for inspection firms", "Waiver preparation", "A waiver packet service for drone inspection firms that need repeatable documentation for operations outside basic Part 107 limits."],
    ["solo", "Drone compliance back office for utility vegetation contractors", "Compliance admin", "A recurring admin workflow for utility vegetation contractors managing aircraft records, pilots, waivers, and policy documentation."],
    ["smallTeam", "Remote ID registry for local drone-service fleets", "Remote ID operations", "A registry and renewal tool for small commercial fleets that need to track aircraft, modules, and Remote ID compliance status."],
    ["smallTeam", "Drone waiver evidence locker", "Evidence management", "A locker that stores approvals, maps, mitigation plans, and prior mission evidence so operators can reuse strong submissions."],
    ["domainExpert", "Agricultural spray compliance logbook", "Ag operations compliance", "A logbook tuned for operators balancing drone rules, chemical records, and state or crop-specific requirements."],
    ["domainExpert", "Utility drone storm-response workpack generator", "Storm response", "A generator for pre-approved mission packets, assignments, and evidence sets used by utilities and contractors during storm response."],
  ],
  gridInterconnection: [
    ["domainExpert", "Data-center interconnection document room", "Interconnection documentation", "A controlled document room for developers managing utility studies, queue paperwork, land, and power-delivery negotiations."],
    ["domainExpert", "Generator co-location diligence tracker for large-load developers", "Co-location diligence", "A tracker for the technical, tariff, and counterparty diligence around co-locating large loads with generation assets."],
    ["venture", "Brownfield data-center site aggregator with utility-readiness data", "Site aggregation", "A data product that packages substations, land status, water, and local utility-readiness signals for AI and inference site selection."],
    ["venture", "Behind-the-meter flexibility platform for secondary data centers", "Load flexibility", "A platform that helps smaller data-center operators use flexible load, backup generation, and market participation to lower grid dependence."],
    ["domainExpert", "Demand-response enrollment ops for C&I aggregators", "Enrollment operations", "An operating system for commercial aggregators that need to move sites through meter, contract, and readiness steps faster."],
    ["venture", "Large-load interconnection brokerage for industrial parks", "Brokerage", "A brokerage layer that helps industrial parks package load flexibility, generation, and queue strategy for power-hungry tenants."],
  ],
  freightTransparency: [
    ["solo", "Freight detention and TONU evidence assembly for small carriers", "Dispute evidence", "An evidence-assembly workflow that helps small carriers prove detention, TONU, and accessorial claims with cleaner documentation."],
    ["solo", "Broker-transparency request prep for small fleets", "Transparency requests", "A workflow that prepares and tracks broker transaction-record requests for fleets that lack a dedicated back office."],
    ["smallTeam", "Carrier onboarding reuse vault across freight brokers", "Onboarding reuse", "A reuse vault that lets carriers maintain one verified packet and push it to multiple brokers instead of rekeying the same data."],
    ["smallTeam", "Load-exception inbox for small importers", "Exception management", "A unified inbox for small importers handling ETA changes, customs holds, appointment shifts, and last-mile exceptions."],
    ["smallTeam", "Last-mile freight visibility for small importers", "Visibility", "A visibility layer for importers shipping too little to buy enterprise freight software but too much to manage from phone calls and spreadsheets."],
    ["domainExpert", "Margin and dispute analytics for owner-operator fleets", "Margin analytics", "A dashboard that ties broker opacity, accessorial disputes, and load-level margin erosion together for owner-operator fleets."],
  ],
  constructionSafety: [
    ["solo", "OSHA inspection document vault setup for specialty subcontractors", "Inspection readiness", "A document vault and operating checklist for specialty subcontractors that need their inspection materials organized before OSHA arrives."],
    ["solo", "Subcontractor training-proof concierge for mid-size GCs", "Training proof collection", "A concierge workflow that collects, verifies, and maintains training proof from the long tail of subs on a general contractor’s jobs."],
    ["smallTeam", "Walkaround inspection prep app for small GCs", "Walkaround prep", "An app that centralizes contacts, checklists, site maps, and representative designations for general contractors on inspection day."],
    ["smallTeam", "Near-miss voice-note triage for field crews", "Incident capture", "A voice-to-workflow tool that turns rough field notes into categorized near misses and follow-up tasks."],
    ["smallTeam", "Subcontractor credential wallet for construction subs", "Credential sharing", "A reusable credential wallet that small subs can send from job to job for insurance, training, and compliance proof."],
    ["domainExpert", "Construction-insurer underwriting data pack for specialty trades", "Insurance underwriting", "A data pack that helps specialty trade contractors present cleaner safety, workforce, and near-miss data during underwriting and renewal."],
  ],
  shiftWork: [
    ["venture", "Multi-app schedule control for hourly workers", "Worker scheduling", "A worker-side scheduling app that unifies shifts, swaps, and availability across the multiple employer apps hourly workers already juggle."],
    ["smallTeam", "Shift-premium calculator for fair-workweek chains", "Premium-pay compliance", "A calculator and audit trail for multi-location chains that owe premium pay when managers edit schedules too late."],
    ["smallTeam", "Access-to-hours board for fast-food operators", "Hours allocation", "A board that helps operators offer new hours to current workers first and keep proof that they followed the rule."],
    ["smallTeam", "Clopening risk monitor for franchise groups", "Clopening compliance", "A monitor that flags risky close-open combinations and missing consent before schedules are posted."],
    ["smallTeam", "Worker-side schedule wallet across multiple employers", "Worker tooling", "A schedule wallet that gives hourly workers one place to track commitments, availability, and shift conflicts across multiple jobs."],
    ["domainExpert", "Fair-workweek evidence vault for large restaurant operators", "Employer evidence", "An evidence vault that stores notices, schedule versions, consent records, and premium-pay proof for restaurant operators under fair-workweek rules."],
  ],
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function gapFor(summary: string) {
  return `${summary} Today the workflow usually lives in spreadsheets, shared drives, inboxes, and tribal knowledge rather than purpose-built software. That creates missed deadlines, weak audit trails, and manual follow-up work that is expensive enough for a narrow founder wedge to matter.`;
}

function playFor(stage: ResearchStage, modelType: Opportunity["model_type"]) {
  const packaging =
    modelType === "Productized Service"
      ? "Package the work first as a repeatable service with a clear deliverable and only productize the steps that repeat every week."
      : modelType === "API / Usage-Based"
        ? "Make the first wedge a small, opinionated API or developer workflow that plugs into an existing system instead of trying to replace it."
        : modelType === "Marketplace"
          ? "Win on supply or trust first, then turn the repeating transaction into software rather than starting with an empty marketplace."
          : "Own the narrow evidence, queue, or coordination layer where existing systems are weakest instead of pretending to be a full suite on day one.";

  const launch =
    stage === "venture"
      ? "The initial product should prove one high-value deployment or contract path before broadening into a platform."
      : "The product should land with design partners quickly and expand only after the first workflow is used every week.";

  return `${packaging} ${launch}`;
}

function buildPathFor(stage: ResearchStage) {
  if (stage === "solo") {
    return "Start with one buyer profile and one deliverable. Sell 5 paid engagements manually, turn the recurring checklist into a lightweight portal or dashboard, and use that artifact to decide what deserves software. Ignore adjacent modules until the first service is repeatable without heroics.";
  }
  if (stage === "smallTeam") {
    return "Land 3-5 design partners with the narrowest version of the workflow. Handle edge cases manually behind the scenes, automate only the repeated path, and ship exports or proofs buyers can immediately use. Do not broaden into a full suite until the core job is used weekly.";
  }
  if (stage === "domainExpert") {
    return "Start with two or three domain-expert design partners and one operational surface that carries real compliance or financial pain. Expect some implementation work, but convert every repeated step into product quickly. The first milestone is a workflow teams trust in a live environment.";
  }
  return "Secure one anchor buyer, one deployment path, and one measurable proof point before building breadth. The first release should make a single high-value workflow materially faster, safer, or more auditable. Use that deployment to earn the right to expand into adjacent modules.";
}

function oneLiner(summary: string) {
  return summary.endsWith(".") ? summary : `${summary}.`;
}

const RESEARCH_IDEAS: IdeaSeed[] = Object.entries(IDEAS_BY_THEME).flatMap(([theme, tuples]) =>
  tuples.map(([stage, title, niche, summary, model_type]) => ({
    theme: theme as ThemeKey,
    stage,
    title,
    niche,
    summary,
    model_type,
  })),
);

export const RESEARCH_OPPORTUNITIES: Opportunity[] = RESEARCH_IDEAS.map((idea, index) => {
  const theme = THEMES[idea.theme];
  const stage = STAGE_DEFAULTS[idea.stage];
  const model_type = idea.model_type ?? theme.model_type ?? stage.model_type;

  return {
    id: slugify(idea.title),
    slug: slugify(idea.title),
    title: idea.title,
    one_liner: oneLiner(idea.summary),
    the_gap: gapFor(idea.summary),
    the_play: playFor(idea.stage, model_type),
    market_size_summary: theme.market_size_summary,
    timing_rationale: theme.timing_rationale,
    build_path: buildPathFor(idea.stage),
    model_type,
    audience: idea.audience ?? theme.audience,
    industry: theme.industry,
    niche: idea.niche,
    revenue_ceiling: idea.revenue_ceiling ?? theme.revenue_ceiling ?? stage.revenue_ceiling,
    founder_path: stage.founder_path,
    difficulty: stage.difficulty,
    starting_capital: stage.starting_capital,
    time_to_launch: stage.time_to_launch,
    build_stack_hint: model_type === "Productized Service"
      ? "No-code"
      : model_type === "API / Usage-Based"
        ? "Traditional engineering"
        : stage.build_stack_hint,
    moat: idea.moat ?? theme.moat,
    distribution_play: idea.distribution_play ?? theme.distribution_play,
    demand_trend: idea.demand_trend ?? theme.demand_trend,
    featured: false,
    rank: BASE_RANK + index,
    cover_image_url: null,
    yc_rfs_slug: null,
    sources: theme.sources,
    created_at: BASE_DATE,
    updated_at: BASE_DATE,
  };
});
