import type { Opportunity } from "@/lib/types";

type ResearchStage = "solo" | "smallTeam" | "domainExpert" | "venture";

type ResearchIdeaSeed = {
  stage: ResearchStage;
  slug: string;
  title: string;
  summary: string;
};

type StageDefaults = {
  founder_path: Opportunity["founder_path"];
  difficulty: Opportunity["difficulty"];
  starting_capital: Opportunity["starting_capital"];
  time_to_launch: Opportunity["time_to_launch"];
  build_stack_hint: Opportunity["build_stack_hint"];
  revenue_ceiling: Opportunity["revenue_ceiling"];
  model_type: Opportunity["model_type"];
};

type Classification = {
  industry: Opportunity["industry"];
  niche: string;
  audience: Opportunity["audience"];
  distribution_play: Opportunity["distribution_play"];
  moat: Opportunity["moat"];
  demand_trend: Opportunity["demand_trend"];
  timing_rationale: string;
};

const BASE_DATE = new Date("2026-05-24T00:00:00Z").toISOString();
const BASE_RANK = 36;

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
    model_type: "SaaS",
  },
};

const RESEARCH_IDEA_SEEDS: ResearchIdeaSeed[] = [
  { stage: "solo", slug: "eu-accessibility-evidence-packs-for-shopify-merchants", title: "EU accessibility evidence packs for Shopify merchants", summary: "Sell a fixed-price audit + remediation + statement pack through agencies managing 20+ stores; the wedge is evidence and code fixes, not a crowded overlay." },
  { stage: "solo", slug: "vpat-sprint-for-b2b-saas-companies", title: "VPAT sprint for B2B SaaS companies", summary: "Package procurement-ready accessibility docs and issue triage for startups trying to close enterprise deals without buying a full platform." },
  { stage: "solo", slug: "accessible-pdf-remediation-for-insurers-and-lenders", title: "Accessible PDF remediation for insurers and lenders", summary: "Start with policy packets, disclosures, and statements where teams already know they have compliance exposure but no document workflow." },
  { stage: "solo", slug: "a2l-retrofit-photo-audit-service-for-hvac-shops", title: "A2L retrofit photo-audit service for HVAC shops", summary: "Offer a post-job documentation and checklist product to small contractors that are learning new refrigerant rules on the fly." },
  { stage: "solo", slug: "refrigerant-log-backfill-service-for-commercial-hvac-contractors", title: "Refrigerant-log backfill service for commercial HVAC contractors", summary: "Clean up historical records and create a repeatable template before shops invest in software." },
  { stage: "solo", slug: "lead-line-homeowner-outreach-concierge-for-engineering-firms", title: "Lead-line homeowner outreach concierge for engineering firms", summary: "Handle calls, consents, and paperwork for municipalities that have replacement money but no resident-ops muscle." },
  { stage: "solo", slug: "water-utility-public-inventory-publishing-service", title: "Water-utility public inventory publishing service", summary: "Turn messy spreadsheets into searchable public-facing lead-service-line maps and notice pages for small systems." },
  { stage: "solo", slug: "dairy-biosecurity-sop-builder-for-regional-vet-groups", title: "Dairy biosecurity SOP builder for regional vet groups", summary: "Sell standardized staff, visitor, and vehicle protocols plus printable field materials to multi-farm networks." },
  { stage: "solo", slug: "milk-sample-chain-of-custody-setup-for-processors", title: "Milk-sample chain-of-custody setup for processors", summary: "Start as forms, labels, and exception handling for plants that now have testing obligations but weak admin tooling." },
  { stage: "solo", slug: "registered-apprenticeship-sponsor-application-service-for-school-districts", title: "Registered Apprenticeship sponsor application service for school districts", summary: "Package the DOL guidance into a done-for-you sponsor launch offer for districts entering nontraditional apprenticeships." },
  { stage: "solo", slug: "apprenticeship-launch-kit-for-small-manufacturers", title: "Apprenticeship launch kit for small manufacturers", summary: "Help local employers become sponsors without buying a full apprenticeship-management system on day one." },
  { stage: "solo", slug: "prior-auth-denial-taxonomy-cleanup-for-independent-specialty-clinics", title: "Prior-auth denial taxonomy cleanup for independent specialty clinics", summary: "Normalize payer denial language into something a practice manager can actually route and act on." },
  { stage: "solo", slug: "referral-packet-standardization-service-for-rural-hospitals", title: "Referral-packet standardization service for rural hospitals", summary: "Sell intake packet cleanup to sites where incomplete referrals still trigger scheduling and auth delays." },
  { stage: "solo", slug: "food-traceability-record-mapping-sprint-for-berry-greens-and-cheese-brands", title: "Food-traceability record-mapping sprint for berry, greens, and cheese brands", summary: "Start with the operations binder and spreadsheet layer, not a full ERP replacement." },
  { stage: "solo", slug: "supplier-document-chase-desk-for-food-hubs", title: "Supplier document chase desk for food hubs", summary: "Be the outsourced ops desk that keeps certifications, lot-code rules, and traceability contacts current." },
  { stage: "solo", slug: "osha-inspection-document-vault-setup-for-specialty-subcontractors", title: "OSHA inspection document vault setup for specialty subcontractors", summary: "Build the central folder structure, training matrix, and retrieval workflow before an inspection happens." },
  { stage: "solo", slug: "subcontractor-training-proof-concierge-for-mid-size-gcs", title: "Subcontractor training-proof concierge for mid-size GCs", summary: "Collect, verify, and organize certs from the long tail of subs that are still sending screenshots and PDFs." },
  { stage: "solo", slug: "part-107-waiver-packet-service-for-inspection-firms", title: "Part 107 waiver packet service for inspection firms", summary: "Start with roofing and mapping companies that fly often enough to need documentation but not a compliance department." },
  { stage: "solo", slug: "drone-compliance-back-office-for-utility-vegetation-contractors", title: "Drone compliance back office for utility vegetation contractors", summary: "Handle registration, waiver records, pilot documentation, and audit prep as a recurring service." },
  { stage: "solo", slug: "freight-detention-and-tonu-evidence-assembly-for-small-carriers", title: "Freight detention and TONU evidence assembly for small carriers", summary: "Build the photo, timestamp, and document package that owner-operators need to actually win disputes." },
  { stage: "solo", slug: "broker-transparency-request-prep-for-small-fleets", title: "Broker-transparency request prep for small fleets", summary: "Package transaction-record requests, response tracking, and escalation docs for carriers that will not buy a full freight stack." },
  { stage: "solo", slug: "cyber-disclosure-evidence-room-setup-for-microcap-public-companies", title: "Cyber-disclosure evidence-room setup for microcap public companies", summary: "Stand up a repeatable memo, artifact, and sign-off structure for teams facing SEC disclosure expectations with tiny legal benches." },
  { stage: "solo", slug: "board-cyber-governance-calendar-and-memo-pack", title: "Board cyber-governance calendar and memo pack", summary: "Sell recurring prep for quarterly cyber governance materials to newly public or soon-to-be public companies." },
  { stage: "solo", slug: "school-district-a2l-equipment-transition-workbook", title: "School-district A2L equipment transition workbook", summary: "Offer facilities teams a fixed-scope inventory, capital-plan, and vendor coordination package instead of complex software." },
  { stage: "solo", slug: "lead-line-private-side-financing-application-service", title: "Lead-line private-side financing application service", summary: "Help residents and landlords navigate paperwork for replacement programs where money exists but conversions lag." },
  { stage: "smallTeam", slug: "specialty-clinic-denial-reason-normalizer", title: "Specialty-clinic denial-reason normalizer", summary: "Turn payer responses into a consistent taxonomy and route next actions for GI, rheumatology, and infusion groups." },
  { stage: "smallTeam", slug: "prior-auth-appeal-qa-workspace", title: "Prior-auth appeal QA workspace", summary: "Review draft appeal packets for missing evidence before staff resubmits and loses another week." },
  { stage: "smallTeam", slug: "dme-order-completeness-checker", title: "DME order completeness checker", summary: "Catch missing fields, signatures, and clinical-support docs before an order hits a payer or supplier queue." },
  { stage: "smallTeam", slug: "home-health-intake-packet-gap-detector", title: "Home-health intake packet gap detector", summary: "Score referrals for missing documents and build the chase list before intake staff wastes cycles." },
  { stage: "smallTeam", slug: "infusion-auth-renewal-tracker", title: "Infusion auth-renewal tracker", summary: "Focus on recurring biologics where expiring approvals quietly wreck schedules and cash flow." },
  { stage: "smallTeam", slug: "rural-referral-intake-workbench", title: "Rural referral intake workbench", summary: "Give small hospitals a lightweight hub for referral status, missing docs, and payer handoffs without a giant care-coordination platform." },
  { stage: "smallTeam", slug: "prior-auth-api-sandbox-for-ehr-vendors", title: "Prior-auth API sandbox for EHR vendors", summary: "Simulate payer endpoints and edge cases so health-tech teams can test integrations before production." },
  { stage: "smallTeam", slug: "payer-metrics-page-generator-for-regional-health-plans", title: "Payer metrics page generator for regional health plans", summary: "Publish the public prior-auth metrics and denial summaries CMS now expects without building a custom reporting stack." },
  { stage: "smallTeam", slug: "eaa-regression-monitor-for-b2b-saas-release-teams", title: "EAA regression monitor for B2B SaaS release teams", summary: "Watch product changes for accessibility regressions and turn them into engineering tickets tied to actual releases." },
  { stage: "smallTeam", slug: "accessible-document-qa-api", title: "Accessible-document QA API", summary: "Scan PDFs, statements, and customer notices for machine-readable failures and route only the broken assets to humans." },
  { stage: "smallTeam", slug: "vpat-evidence-collector-for-sales-engineers", title: "VPAT evidence collector for sales engineers", summary: "Pull accessibility evidence from tickets, audits, and release notes into one answer bank for enterprise deals." },
  { stage: "smallTeam", slug: "a2l-parts-compatibility-checker-for-hvac-distributors", title: "A2L parts-compatibility checker for HVAC distributors", summary: "Let counter staff and contractors confirm fit, refrigerant class, and install caveats faster than a PDF hunt." },
  { stage: "smallTeam", slug: "property-manager-refrigerant-transition-reserve-planner", title: "Property-manager refrigerant transition reserve planner", summary: "Model which assets are most exposed and turn that into a capital plan for multi-site owners." },
  { stage: "smallTeam", slug: "refrigerant-job-log-vault-for-multi-tech-contractors", title: "Refrigerant job-log vault for multi-tech contractors", summary: "Centralize before/after photos, leak records, and equipment history across crews that still operate from text threads." },
  { stage: "smallTeam", slug: "hotel-and-senior-living-chiller-transition-planner", title: "Hotel and senior-living chiller transition planner", summary: "Start with portfolios that have aging equipment, tight downtime windows, and under-built documentation." },
  { stage: "smallTeam", slug: "lead-line-private-side-scheduling-portal", title: "Lead-line private-side scheduling portal", summary: "Coordinate homeowners, plumbers, utility crews, and inspections around one replacement event." },
  { stage: "smallTeam", slug: "replacement-contractor-capacity-board-for-municipal-lead-programs", title: "Replacement-contractor capacity board for municipal lead programs", summary: "Show which approved contractors have bandwidth so programs stop stalling at the scheduling layer." },
  { stage: "smallTeam", slug: "small-utility-customer-consent-workflow-for-line-replacement", title: "Small-utility customer-consent workflow for line replacement", summary: "Handle notice, follow-up, and approval tracking for teams that cannot hire a call center." },
  { stage: "smallTeam", slug: "service-line-inventory-ux-layer-for-small-water-systems", title: "Service-line inventory UX layer for small water systems", summary: "Put a clean map and resident lookup on top of legacy utility data without replacing the underlying system." },
  { stage: "smallTeam", slug: "dairy-visitor-and-vehicle-biosecurity-log-app", title: "Dairy visitor and vehicle biosecurity log app", summary: "Give farms a mobile-first logbook that works in bad connectivity and exports clean audit trails." },
  { stage: "smallTeam", slug: "bulk-milk-pickup-exception-tracker", title: "Bulk-milk pickup exception tracker", summary: "Catch missed pickups, chain-of-custody breaks, and positive-sample escalation paths for regional processors." },
  { stage: "smallTeam", slug: "food-traceability-24-hour-retrieval-layer", title: "Food-traceability 24-hour retrieval layer", summary: "Focus on record retrieval and cross-supplier stitching for covered brands instead of pretending to be the system of record." },
  { stage: "smallTeam", slug: "supplier-onboarding-crm-for-ftl-brands", title: "Supplier onboarding CRM for FTL brands", summary: "Keep traceability contacts, lot-code rules, and document status organized across a fragmented supplier base." },
  { stage: "smallTeam", slug: "recall-drill-simulator-for-mid-market-food-brands", title: "Recall drill simulator for mid-market food brands", summary: "Run tabletop scenarios and surface where records, contacts, and lot links are still broken." },
  { stage: "smallTeam", slug: "apprenticeship-supervisor-text-check-in-app", title: "Apprenticeship supervisor text check-in app", summary: "Confirm OJT hours and milestone progress from the field without forcing supervisors into a portal." },
  { stage: "smallTeam", slug: "ojt-hour-anomaly-detector", title: "OJT hour anomaly detector", summary: "Flag suspicious or incomplete apprentice logs before they become a compliance or completion problem." },
  { stage: "smallTeam", slug: "apprenticeship-completion-risk-dashboard", title: "Apprenticeship completion-risk dashboard", summary: "Help intermediaries spot which employers or cohorts are drifting before drop-off becomes visible in annual reporting." },
  { stage: "smallTeam", slug: "walkaround-inspection-prep-app-for-small-gcs", title: "Walkaround inspection prep app for small GCs", summary: "Centralize the checklists, representative designations, and key documents a site lead needs on inspection day." },
  { stage: "smallTeam", slug: "near-miss-voice-note-triage-for-field-crews", title: "Near-miss voice-note triage for field crews", summary: "Turn rough voice memos into categorized incidents and follow-up tasks instead of letting them die in group chats." },
  { stage: "smallTeam", slug: "subcontractor-credential-wallet-for-construction-subs", title: "Subcontractor credential wallet for construction subs", summary: "Give small subs one reusable packet for training, insurance, and workforce docs they can share job to job." },
  { stage: "smallTeam", slug: "remote-id-registry-for-local-drone-service-fleets", title: "Remote ID registry for local drone-service fleets", summary: "Start with survey, roof, and inspection firms that manage just enough aircraft to feel pain but not enough to buy heavy software." },
  { stage: "smallTeam", slug: "drone-waiver-evidence-locker", title: "Drone waiver evidence locker", summary: "Store prior approvals, operating procedures, and mission evidence so pilots can reuse documentation instead of recreating it." },
  { stage: "smallTeam", slug: "agricultural-spray-compliance-logbook", title: "Agricultural spray compliance logbook", summary: "Focus on operators juggling drone, chemical, and state-record requirements rather than generic drone ops." },
  { stage: "smallTeam", slug: "carrier-onboarding-reuse-vault-across-freight-brokers", title: "Carrier onboarding reuse vault across freight brokers", summary: "Let carriers maintain one verified packet and push it to multiple brokers instead of rekeying everything." },
  { stage: "smallTeam", slug: "load-exception-inbox-for-small-importers", title: "Load-exception inbox for small importers", summary: "Turn scattered ETA changes, holds, and appointment issues into one operational queue for 5-50 container importers." },
  { stage: "domainExpert", slug: "community-oncology-auth-to-scheduling-workbench", title: "Community-oncology auth-to-scheduling workbench", summary: "Tie payer status, medical necessity docs, and infusion-chair scheduling together for independent oncology groups." },
  { stage: "domainExpert", slug: "drug-prior-auth-documentation-rules-simulator", title: "Drug prior-auth documentation rules simulator", summary: "Help plans, PBMs, and vendors test how proposed CMS drug-related API rules would hit their current workflows." },
  { stage: "domainExpert", slug: "payer-api-conformance-test-harness", title: "Payer API conformance test harness", summary: "Sell to payers and vendors that need to validate FHIR prior-auth behavior without building their own deep test bench." },
  { stage: "domainExpert", slug: "denial-benchmark-exchange-for-independent-provider-groups", title: "Denial benchmark exchange for independent provider groups", summary: "Aggregate normalized denial patterns across peers so small groups can see what is payer-specific versus staff-specific." },
  { stage: "domainExpert", slug: "pediatric-therapy-referral-to-authorization-os", title: "Pediatric therapy referral-to-authorization OS", summary: "Speech, OT, and PT clinics still lose weeks between referral, auth, and first appointment; the wedge is the pre-visit workflow." },
  { stage: "domainExpert", slug: "multi-site-lead-replacement-equity-planner", title: "Multi-site lead-replacement equity planner", summary: "Help cities prioritize replacements by risk, readiness, and customer-response rate rather than just pipe age." },
  { stage: "domainExpert", slug: "utility-route-optimizer-for-customer-approved-replacements", title: "Utility route optimizer for customer-approved replacements", summary: "Combine crew capacity with consent windows so approved jobs actually convert into completed work." },
  { stage: "domainExpert", slug: "funding-workflow-os-for-lead-replacement-contractors-and-engineers", title: "Funding-workflow OS for lead-replacement contractors and engineers", summary: "Track program eligibility, funding source, resident paperwork, and reimbursement status in one place." },
  { stage: "domainExpert", slug: "multifamily-lead-line-tenant-communication-platform", title: "Multifamily lead-line tenant communication platform", summary: "Focus on buildings where owners, tenants, and utilities all need different messages and access windows." },
  { stage: "domainExpert", slug: "grocery-cold-chain-refrigerant-conversion-pm-tool", title: "Grocery cold-chain refrigerant conversion PM tool", summary: "Sell to regional grocery operators managing phased retrofit work across dozens of stores." },
  { stage: "domainExpert", slug: "school-facilities-a2l-readiness-tracker", title: "School facilities A2L readiness tracker", summary: "Coordinate equipment inventory, training status, vendor work, and budget timing across district campuses." },
  { stage: "domainExpert", slug: "dairy-interstate-movement-testing-scheduler", title: "Dairy interstate-movement testing scheduler", summary: "Start with operators moving animals across state lines who now have recurring testing and documentation friction." },
  { stage: "domainExpert", slug: "dairy-processor-positive-sample-escalation-dashboard", title: "Dairy processor positive-sample escalation dashboard", summary: "Manage who knows what, when milk moves, and which downstream steps fire after a positive result." },
  { stage: "domainExpert", slug: "produce-grower-lot-code-translation-layer", title: "Produce grower lot-code translation layer", summary: "Normalize farm, packer, and buyer codes so traceability records are usable during a real event." },
  { stage: "domainExpert", slug: "food-hub-supplier-readiness-crm-for-2028-traceability", title: "Food-hub supplier readiness CRM for 2028 traceability", summary: "Sell to aggregators that are too small for enterprise suites but too complex for shared drives." },
  { stage: "domainExpert", slug: "k-12-apprenticeship-intermediary-os", title: "K-12 apprenticeship intermediary OS", summary: "Give districts a lightweight system for employer relationships, student placement, and compliance proof without buying an enterprise AMS." },
  { stage: "domainExpert", slug: "cyber-apprenticeship-sponsor-network-manager", title: "Cyber apprenticeship sponsor network manager", summary: "Focus on the long-tail employer and mentor coordination problem instead of generic apprenticeship tracking." },
  { stage: "domainExpert", slug: "municipal-digital-accessibility-procurement-checker", title: "Municipal digital-accessibility procurement checker", summary: "Review RFPs, vendor claims, and delivered assets so cities stop buying inaccessible software and PDFs." },
  { stage: "domainExpert", slug: "transit-ticketing-eaa-conformance-tracker", title: "Transit ticketing EAA conformance tracker", summary: "Start with regional transit operators and vendors that have multiple mobile, kiosk, and web surfaces to document." },
  { stage: "domainExpert", slug: "government-vendor-accessible-document-pipeline", title: "Government-vendor accessible-document pipeline", summary: "Handle remediation, versioning, and approval for the recurring PDFs and notices public contractors keep shipping." },
  { stage: "domainExpert", slug: "construction-insurer-underwriting-data-pack-for-specialty-trades", title: "Construction-insurer underwriting data pack for specialty trades", summary: "Pull safety, training, and near-miss evidence into a cleaner package for renewals and audits." },
  { stage: "domainExpert", slug: "utility-drone-storm-response-workpack-generator", title: "Utility drone storm-response workpack generator", summary: "Build preapproved mission packets, pilot assignments, and chain-of-custody docs for outage-response contractors." },
  { stage: "domainExpert", slug: "data-center-interconnection-document-room", title: "Data-center interconnection document room", summary: "Sell to developers that need one controlled workspace for utility studies, land, permitting, and power negotiations." },
  { stage: "domainExpert", slug: "generator-co-location-diligence-tracker-for-large-load-developers", title: "Generator co-location diligence tracker for large-load developers", summary: "Focus on the checklist and red-flag workflow around behind-the-meter or co-located generation deals." },
  { stage: "domainExpert", slug: "demand-response-enrollment-ops-for-c-i-aggregators", title: "Demand-response enrollment ops for C&I aggregators", summary: "Handle meter, contract, site-contact, and readiness workflows across a messy commercial portfolio." },
  { stage: "venture", slug: "brownfield-data-center-site-aggregator-with-utility-readiness-data", title: "Brownfield data-center site aggregator with utility-readiness data", summary: "Package substations, land status, water, and local-process timelines into something buyers can actually underwrite." },
  { stage: "venture", slug: "behind-the-meter-flexibility-platform-for-secondary-data-centers", title: "Behind-the-meter flexibility platform for secondary data centers", summary: "Start with smaller AI and inference sites that need dispatchable backup, not hyperscaler-style bespoke projects." },
  { stage: "venture", slug: "lead-line-financing-marketplace-with-municipal-escrow", title: "Lead-line financing marketplace with municipal escrow", summary: "Connect contractors, homeowners, and program funds so private-side replacement does not become the blocking step." },
  { stage: "venture", slug: "refrigerant-recovery-and-resale-exchange-for-commercial-retrofits", title: "Refrigerant recovery and resale exchange for commercial retrofits", summary: "Build around verified chain-of-custody and quality testing, not a generic industrial marketplace." },
  { stage: "venture", slug: "independent-provider-prior-auth-benchmarking-network", title: "Independent-provider prior-auth benchmarking network", summary: "Aggregate denial, turnaround, and appeal outcomes across small providers that individually lack negotiating leverage." },
  { stage: "venture", slug: "regional-dairy-biosecurity-mutual-with-software-rails", title: "Regional dairy biosecurity mutual with software rails", summary: "Pair shared protocols, audits, and outbreak-response tooling with pooled financial protection." },
  { stage: "venture", slug: "large-load-interconnection-brokerage-for-industrial-parks", title: "Large-load interconnection brokerage for industrial parks", summary: "Help site owners package demand flexibility, generation options, and queue strategy for power-hungry tenants." },
  { stage: "venture", slug: "drone-compliant-utility-vegetation-contractor-network", title: "Drone-compliant utility vegetation contractor network", summary: "Standardize pilot, aircraft, and mission documentation across a fragmented contractor base and sell to utilities." },
  { stage: "venture", slug: "distributed-cold-storage-load-flex-aggregator", title: "Distributed cold-storage load-flex aggregator", summary: "Turn regional refrigerated warehouses into a dispatchable load portfolio with audit-friendly operational controls." },
  { stage: "venture", slug: "food-recall-working-capital-and-execution-platform", title: "Food-recall working-capital and execution platform", summary: "Finance the short-term chaos while bundling the ops layer needed to trace, contact, and document." },
  { stage: "venture", slug: "local-apprenticeship-marketplace-tied-to-employers-and-classrooms", title: "Local apprenticeship marketplace tied to employers and classrooms", summary: "Pair open roles, approved training providers, and sponsor compliance into one supply-and-demand network." },
  { stage: "venture", slug: "heat-pump-retrofit-underwriting-platform-for-multifamily-lenders", title: "Heat-pump retrofit underwriting platform for multifamily lenders", summary: "Focus on project readiness, contractor capacity, and utility assumptions rather than pure climate reporting." },
  { stage: "venture", slug: "shared-compliance-os-for-small-water-systems", title: "Shared compliance OS for small water systems", summary: "Bundle lead-line, public notice, sampling, and contractor coordination for utilities too small to build internal ops teams." },
  { stage: "venture", slug: "cyber-incident-counsel-and-ir-coordination-platform-for-microcaps", title: "Cyber-incident counsel and IR coordination platform for microcaps", summary: "Give outside counsel, IR, finance, and security a controlled clock-and-artifact workspace during material incidents." },
  { stage: "venture", slug: "regulated-contractor-credential-network-for-utilities-and-primes", title: "Regulated-contractor credential network for utilities and primes", summary: "Standardize safety, licensing, and training proof across the long tail of field contractors that still email PDFs." },
];

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function classifyIdea(seed: ResearchIdeaSeed): Classification {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();

  if (includesAny(text, ["data-center", "large-load", "interconnection", "co-location", "demand-response"])) {
    return {
      industry: "Energy & Grid Infrastructure",
      niche: "Large-load infrastructure",
      audience: "B2B",
      distribution_play: "Direct sales",
      moat: "Regulatory access",
      demand_trend: "Accelerating",
      timing_rationale: "NERC's 2025 Long-Term Reliability Assessment and FERC's December 18, 2025 large-load actions made AI-driven power demand and interconnection bottlenecks explicit planning issues. The coordination layer around load, siting, and power access is still immature.",
    };
  }

  if (includesAny(text, ["cyber", "incident", "public companies", "microcap", "ir coordination", "board"])) {
    return {
      industry: "Cybersecurity",
      niche: "Disclosure operations",
      audience: "B2B",
      distribution_play: "Direct sales",
      moat: "Regulatory access",
      demand_trend: "Steady growth",
      timing_rationale: "SEC cyber-incident disclosure expectations are now part of normal public-company governance, but smaller issuers still lack enterprise-sized legal and security teams. That keeps the evidence, clock-management, and coordination problem acute in 2026.",
    };
  }

  if (includesAny(text, ["prior-auth", "payer", "clinic", "referral", "oncology", "infusion", "dme", "ehr", "hospital", "pbm", "therapy"])) {
    return {
      industry: "Healthcare & Med-Adjacent",
      niche: "Prior auth workflows",
      audience: "B2B",
      distribution_play: "Direct sales",
      moat: "Proprietary data",
      demand_trend: "Accelerating",
      timing_rationale: "CMS's Interoperability and Prior Authorization Final Rule introduced new operational deadlines beginning on January 1, 2026, including faster response windows and public metrics. That turns messy authorization workflows into budgeted software projects.",
    };
  }

  if (includesAny(text, ["accessibility", "vpat", "accessible", "eaa", "pdf remediation"])) {
    return {
      industry: "Accessibility & Compliance",
      niche: "Digital accessibility",
      audience: "B2B",
      distribution_play: "Partnerships",
      moat: "Speed of execution",
      demand_trend: "Accelerating",
      timing_rationale: "The European Accessibility Act entered into application on June 28, 2025. That moved accessibility from a deferred initiative to a compliance and procurement issue for private-sector software, documents, and digital services selling into Europe.",
    };
  }

  if (includesAny(text, ["apprenticeship", "ojt", "district", "classroom", "sponsor"])) {
    return {
      industry: "Education & Workforce",
      niche: "Apprenticeship operations",
      audience: "B2B",
      distribution_play: "Partnerships",
      moat: "Distribution",
      demand_trend: "Steady growth",
      timing_rationale: "The Department of Labor published updated Registered Apprenticeship guidance on March 9, 2026, with an explicit push toward faster determinations and clearer sponsor expectations. That lowers coordination friction while increasing demand for workable operating systems.",
    };
  }

  if (includesAny(text, ["drone", "remote id", "part 107", "spray"])) {
    return {
      industry: "Industrial & Drone Ops",
      niche: "Drone compliance",
      audience: "B2B",
      distribution_play: "Direct sales",
      moat: "Regulatory access",
      demand_trend: "Steady growth",
      timing_rationale: "Remote ID is now a baseline operating requirement, and Part 107 waiver workflows still create real paperwork overhead in 2026. Commercial operators increasingly need a reusable compliance layer rather than one-off mission docs.",
    };
  }

  if (includesAny(text, ["freight", "carrier", "broker", "importer", "load", "detention", "tonu"])) {
    return {
      industry: "Logistics & Supply Chain",
      niche: "Carrier and importer ops",
      audience: "B2B",
      distribution_play: "Cold outbound",
      moat: "Distribution",
      demand_trend: "Steady growth",
      timing_rationale: "FMCSA's broker-transparency rulemaking keeps pressure on documentation and transaction records even before every detail is finalized. Smaller carriers and importers still lack purpose-built tooling for the evidence and exception layer.",
    };
  }

  if (includesAny(text, ["dairy", "milk", "food", "traceability", "recall", "grower", "processor", "grocery"])) {
    return {
      industry: "Food & Agriculture",
      niche: "Traceability and biosecurity",
      audience: "B2B",
      distribution_play: "Direct sales",
      moat: "Proprietary data",
      demand_trend: "Steady growth",
      timing_rationale: "USDA's National Milk Testing Strategy kept dairy testing and biosecurity workflows active into 2026, while FDA's food-traceability push still matters even after enforcement moved to July 20, 2028. Operators now have time to buy lighter readiness tools instead of waiting for giant ERP projects.",
    };
  }

  if (includesAny(text, ["a2l", "hvac", "refrigerant", "chiller", "heat-pump", "cold-storage"])) {
    return {
      industry: "Climate & Energy",
      niche: "Refrigerant transition",
      audience: "B2B",
      distribution_play: "Partnerships",
      moat: "Distribution",
      demand_trend: "Accelerating",
      timing_rationale: "EPA technology-transition restrictions began hitting equipment categories on January 1, 2025, pushing contractors, distributors, and facilities teams into new refrigerant workflows. The rules are already real, but much of the long tail still runs on PDFs and tribal knowledge.",
    };
  }

  if (includesAny(text, ["lead-line", "service-line", "water system", "water-utility", "line replacement", "municipal"])) {
    return {
      industry: "Water & Utilities",
      niche: "Lead-line replacement ops",
      audience: "B2B2C",
      distribution_play: "Direct sales",
      moat: "Regulatory access",
      demand_trend: "Accelerating",
      timing_rationale: "EPA's Lead and Copper Rule Improvements pushed water systems toward full lead service-line replacement programs, with resident communication and scheduling now becoming the operational bottleneck. The funding exists in many regions, but execution is still fragmented.",
    };
  }

  if (includesAny(text, ["osha", "construction", "subcontractor", "gc", "safety", "underwriting"])) {
    return {
      industry: "Construction & Skilled Trades",
      niche: "Field compliance ops",
      audience: "B2B",
      distribution_play: "Partnerships",
      moat: "Distribution",
      demand_trend: "Steady growth",
      timing_rationale: "OSHA's walkaround rule became effective on May 31, 2024, and many specialty contractors and general contractors still have thin operational processes around inspections, training proof, and safety evidence. They need workflow readiness rather than heavy enterprise EHS suites.",
    };
  }

  return {
    industry: "Vertical SaaS",
    niche: "Workflow automation",
    audience: "B2B",
    distribution_play: "Direct sales",
    moat: "Speed of execution",
    demand_trend: "Emerging",
    timing_rationale: "The underlying workflow changed materially in 2025-2026, but the market is still being served by spreadsheets, inboxes, and generic project tools. That gap creates room for a focused founder wedge before broader suites react.",
  };
}

function modelTypeFor(seed: ResearchIdeaSeed, stage: ResearchStage): Opportunity["model_type"] {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();

  if (includesAny(text, ["api", "sandbox", "harness"])) return "API / Usage-Based";
  if (includesAny(text, ["marketplace", "exchange", "network", "aggregator", "brokerage"])) return "Marketplace";
  if (includesAny(text, ["financing", "working-capital", "underwriting"])) return "Transactional";
  if (stage === "solo") return "Productized Service";
  if (stage === "venture" && includesAny(text, ["flexibility platform", "cold-storage", "recovery and resale", "lead-line financing"])) {
    return "Hardware + Software";
  }
  return STAGE_DEFAULTS[stage].model_type;
}

function buildStackFor(stage: ResearchStage, modelType: Opportunity["model_type"]): Opportunity["build_stack_hint"] {
  if (modelType === "Productized Service") return "No-code";
  if (modelType === "API / Usage-Based") return "Traditional engineering";
  return STAGE_DEFAULTS[stage].build_stack_hint;
}

function difficultyFor(seed: ResearchIdeaSeed, stage: ResearchStage): Opportunity["difficulty"] {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();

  if (stage === "venture") return includesAny(text, ["interconnection", "flexibility", "financing", "mutual", "cold-storage"]) ? "Expert" : "Hard";
  if (stage === "domainExpert" && includesAny(text, ["payer api", "oncology", "lead-replacement", "utility", "transit", "government"])) return "Hard";
  if (stage === "smallTeam" && includesAny(text, ["payer", "utility", "water system", "regional health plans"])) return "Hard";
  if (stage === "solo" && includesAny(text, ["microcap", "public companies", "municipalities", "dairy"])) return "Medium";
  return STAGE_DEFAULTS[stage].difficulty;
}

function startingCapitalFor(seed: ResearchIdeaSeed, stage: ResearchStage): Opportunity["starting_capital"] {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();

  if (stage === "venture") return "$100k+";
  if (stage === "domainExpert") return includesAny(text, ["utility", "data-center", "interconnection"]) ? "$10k-$100k" : "$1k-$10k";
  if (stage === "smallTeam" && includesAny(text, ["regional health plans", "utility", "water systems"])) return "$10k-$100k";
  if (stage === "solo" && includesAny(text, ["public companies", "municipalities"])) return "$1k-$10k";
  return STAGE_DEFAULTS[stage].starting_capital;
}

function revenueCeilingFor(seed: ResearchIdeaSeed, stage: ResearchStage): Opportunity["revenue_ceiling"] {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();

  if (stage === "venture") return "Venture ($10M+ ARR)";
  if (stage === "domainExpert" && includesAny(text, ["benchmark exchange", "conformance", "interconnection", "transit"])) return "Venture ($10M+ ARR)";
  return STAGE_DEFAULTS[stage].revenue_ceiling;
}

function audienceFor(seed: ResearchIdeaSeed, classification: Classification): Opportunity["audience"] {
  const text = `${seed.title} ${seed.summary}`.toLowerCase();
  if (includesAny(text, ["homeowner", "resident", "tenant", "landlords", "students"])) return "B2B2C";
  return classification.audience;
}

function firstClause(summary: string) {
  return summary.split(";")[0].trim().replace(/\.$/, "");
}

function secondClause(summary: string) {
  const parts = summary.split(";");
  return (parts[1] ?? "").trim().replace(/\.$/, "");
}

function oneLinerFor(seed: ResearchIdeaSeed) {
  const sentence = firstClause(seed.summary);
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function gapFor(seed: ResearchIdeaSeed) {
  const sentence = firstClause(seed.summary);
  return `${sentence}. Right now the buyer usually patches this workflow together with email, spreadsheets, shared drives, and software designed for much larger operators. That leaves a narrow but painful wedge under-owned even though the need is obvious to the people doing the work.`;
}

function playFor(seed: ResearchIdeaSeed, modelType: Opportunity["model_type"]) {
  const wedge = secondClause(seed.summary);
  const wedgeLine = wedge
    ? `${wedge.charAt(0).toUpperCase()}${wedge.slice(1)}.`
    : "Package the narrow operating layer around this workflow instead of trying to become a full suite on day one.";
  return `${wedgeLine} Sell a focused ${modelType.toLowerCase()} around one buyer, one trigger event, and one repeatable proof point so the product wins on clarity rather than scope.`;
}

function marketFor(industry: Classification["industry"], stage: ResearchStage) {
  if (industry === "Healthcare & Med-Adjacent") {
    return "The buyer set is finite but valuable: independent clinics, specialty groups, regional plans, and health-tech vendors feel this pain weekly and can justify meaningful spend to remove revenue delays or admin labor. A wedge that lands a few hundred accounts at mid-four-figure to low-five-figure ACVs becomes a real $1M-$10M business.";
  }
  if (industry === "Accessibility & Compliance") {
    return "This market is driven by compliance and procurement rather than discretionary tooling budgets. Thousands of software vendors, agencies, banks, and document-heavy operators need point solutions here, so a few hundred customers can support a durable niche business.";
  }
  if (industry === "Water & Utilities") {
    return "There are fewer buyers, but budgets are real and deadline-driven. Winning dozens to a few hundred utilities, engineering firms, or municipal programs at meaningful ACVs is enough to build a serious company in this niche.";
  }
  if (industry === "Energy & Grid Infrastructure") {
    return "The buyer count is smaller, but project values are high and timing matters. Even dozens of customers can support a venture-scale business if the product becomes part of site selection, interconnection, or dispatch operations.";
  }
  if (industry === "Food & Agriculture") {
    return "The buyer universe spans processors, brands, growers, and regional operators with recurring compliance and operations pain. A focused product can support $1M-$10M ARR long before it needs broad enterprise scale.";
  }
  if (industry === "Industrial & Drone Ops") {
    return "Commercial operators, contractors, and utilities buy slowly but value auditability and reuse. A focused workflow product can expand from compliance into the system of record for missions, crews, and assets once the first wedge sticks.";
  }
  if (industry === "Logistics & Supply Chain") {
    return "The buyer pool is fragmented and operationally stressed, which is exactly why broad platforms miss the wedge. Small carriers, brokers, and importers will pay to reduce one painful exception path if the ROI is visible inside a week.";
  }
  if (industry === "Construction & Skilled Trades") {
    return "This market is fragmented and local, which is why broad software vendors under-serve it. If a product reaches a few hundred contractors, districts, or facilities teams at modest ACVs, it compounds into a durable niche business.";
  }
  if (industry === "Cybersecurity") {
    return "Public-company and incident-response workflows carry outsized willingness to pay because failure is expensive and visible. A few hundred customers at five-figure ACVs is already a strong business.";
  }
  if (stage === "venture") {
    return "The buyer count is not huge, but the budget and operational leverage per deployment are. If this becomes the default workflow layer in one regulated niche, the revenue ceiling moves well past the first $10M ARR.";
  }
  return "The buyer universe here is narrower than a generic horizontal SaaS market, but that is part of the wedge. A few hundred customers paying for a clearly recurring problem is enough to build a meaningful business before the category gets crowded.";
}

function buildPathFor(stage: ResearchStage) {
  if (stage === "solo") {
    return "Start as a service, not a software company. Pick one buyer type and one deliverable inside this wedge, sell 5-10 engagements manually, and template the work until the handoffs repeat. Only then productize the recurring checklist, portal, or evidence layer.";
  }
  if (stage === "smallTeam") {
    return "Start with one workflow, one source system boundary, and one narrow ICP. Land 3-5 design partners, do ugly edge cases manually in the back end, and automate only the recurring path. Avoid adjacent modules until the first wedge is used weekly.";
  }
  if (stage === "domainExpert") {
    return "Start with two or three design partners and one regulated use case. Build only the minimum workflow, reporting, and audit trail needed to survive a real pilot. Expect implementation work at first, then use that to learn which steps deserve product.";
  }
  return "Prove the coordination wedge before attempting the full platform. Secure one anchor partner, one geography or asset type, and one repeatable transaction path, then build the operating software around live projects. Do not broaden before the first deployment shows real throughput or margin.";
}

export const RESEARCH_OPPORTUNITIES: Opportunity[] = RESEARCH_IDEA_SEEDS.map((seed, index) => {
  const classification = classifyIdea(seed);
  const model_type = modelTypeFor(seed, seed.stage);

  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    one_liner: oneLinerFor(seed),
    the_gap: gapFor(seed),
    the_play: playFor(seed, model_type),
    market_size_summary: marketFor(classification.industry, seed.stage),
    timing_rationale: classification.timing_rationale,
    build_path: buildPathFor(seed.stage),
    model_type,
    audience: audienceFor(seed, classification),
    industry: classification.industry,
    niche: classification.niche,
    revenue_ceiling: revenueCeilingFor(seed, seed.stage),
    founder_path: STAGE_DEFAULTS[seed.stage].founder_path,
    difficulty: difficultyFor(seed, seed.stage),
    starting_capital: startingCapitalFor(seed, seed.stage),
    time_to_launch: STAGE_DEFAULTS[seed.stage].time_to_launch,
    build_stack_hint: buildStackFor(seed.stage, model_type),
    moat: classification.moat,
    distribution_play: classification.distribution_play,
    demand_trend: classification.demand_trend,
    featured: false,
    rank: BASE_RANK + index,
    cover_image_url: null,
    yc_rfs_slug: null,
    sources: [],
    created_at: BASE_DATE,
    updated_at: BASE_DATE,
  };
});
