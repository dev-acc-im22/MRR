export const topLinks = [
  "Gmail",
  "CORE",
  "GD",
  "GT",
  "FOLDER",
  "Gemini",
  "Notes",
  "GPC",
  "SPC",
  "Docs",
  "Sheets",
  "MOM",
  "Stash",
  "TA",
  "KRUPA & CO",
  "MY BUILDZ",
  "TO BUILD",
  "Google AI Studio",
  "ROCKET GEO.ai",
  "KTM",
];

export const leftFeatures = [
  {
    title: "Hugo AI",
    desc: "Automate support. Ship faster.",
    tone: "bg-[linear-gradient(135deg,#2d4768_0%,#263f5c_55%,#20334a_100%)] border-[#4e7097]",
    icon: "spark",
    rotations: [
      { title: "QueuePilot", desc: "Inbox triage on autopilot.", icon: "trend" },
      { title: "BugRelay", desc: "Route bugs to the right owner.", icon: "bug" },
    ],
  },
  {
    title: "Rank Press",
    desc: "AI content for authority rankings.",
    tone: "bg-[linear-gradient(135deg,#5c4731_0%,#4f3f2e_56%,#3f3124_100%)] border-[#7f664a]",
    icon: "trend",
    rotations: [{ title: "FormMint", desc: "Smart forms that convert.", icon: "dot" }],
  },
  {
    title: "Brand.dev",
    desc: "Brand personalization API.",
    tone: "bg-[linear-gradient(135deg,#5b3768_0%,#4c3058_56%,#3d2648_100%)] border-[#7c5590]",
    icon: "dot",
    rotations: [{ title: "LoopDock", desc: "Retention loops for SaaS.", icon: "cloud" }],
  },
  {
    title: "xCloud",
    desc: "Cloud hosting for modern builders.",
    tone: "bg-[linear-gradient(135deg,#2f5575_0%,#274a66_56%,#213b53_100%)] border-[#4a759c]",
    icon: "cloud",
    rotations: [{ title: "SnapLedger", desc: "Auto-bookkeeping in one click.", icon: "bars" }],
  },
  {
    title: "Claw Patrol",
    desc: "AI agents that ship products.",
    tone: "bg-[linear-gradient(135deg,#6a3a43_0%,#5a333b_56%,#4a2b32_100%)] border-[#8c5a64]",
    icon: "bug",
    rotations: [{ title: "AutoNudge", desc: "Follow-ups without the grind.", icon: "spark" }],
  },
];

export const rightFeatures = [
  {
    title: "DevBox",
    desc: "Idea to production, autonomous.",
    tone: "bg-[linear-gradient(135deg,#2d4768_0%,#263f5c_55%,#20334a_100%)] border-[#4e7097]",
    icon: "box",
    rotations: [{ title: "LeadPatch", desc: "Patch leaks in your funnel.", icon: "shield" }],
  },
  {
    title: "Insight Analytics",
    desc: "AI-powered stock insights.",
    tone: "bg-[linear-gradient(135deg,#2f5c7e_0%,#2a4f6c_56%,#233f58_100%)] border-[#4f7fa5]",
    icon: "bars",
    rotations: [{ title: "SyncHarbor", desc: "Unify metrics across tools.", icon: "box" }],
  },
  {
    title: "GojiberryAI",
    desc: "Find leads and book calls.",
    tone: "bg-[linear-gradient(135deg,#713f48_0%,#603640_56%,#4f2d35_100%)] border-[#96616c]",
    icon: "seed",
    rotations: [{ title: "PromptNest", desc: "Prompt libraries for teams.", icon: "seed" }],
  },
  {
    title: "Chargeback.io",
    desc: "Chargeback prevention on autopilot.",
    tone: "bg-[linear-gradient(135deg,#36498b_0%,#2f4178_56%,#273565_100%)] border-[#5b72bb]",
    icon: "shield",
    rotations: [{ title: "MetricBloom", desc: "Realtime KPI blooms.", icon: "bars" }],
  },
];

function inferCategory(text) {
  const value = String(text || "").toLowerCase();
  if (value.includes("ai") || value.includes("artificial")) return "AI";
  if (value.includes("saas") || value.includes("crm")) return "SaaS";
  if (value.includes("dev") || value.includes("api") || value.includes("code") || value.includes("engineering")) return "Developer Tools";
  if (value.includes("fintech") || value.includes("payment") || value.includes("finance") || value.includes("ledger")) return "Fintech";
  if (value.includes("productivity") || value.includes("workflow") || value.includes("automation")) return "Productivity";
  if (value.includes("market") || value.includes("sales") || value.includes("outbound") || value.includes("seo")) return "Marketing";
  if (value.includes("design") || value.includes("brand")) return "Design Tools";
  if (value.includes("analytic") || value.includes("metric") || value.includes("kpi")) return "Analytics";
  if (value.includes("health") || value.includes("fitness") || value.includes("telehealth") || value.includes("clinic")) return "Health & Fitness";
  if (value.includes("social") || value.includes("creator") || value.includes("ugc") || value.includes("content")) return "Social Media";
  if (value.includes("video") || value.includes("capture")) return "Content Creation";
  if (value.includes("real estate") || value.includes("property")) return "Real Estate";
  if (value.includes("travel") || value.includes("shipping")) return "Travel";
  if (value.includes("security") || value.includes("chargeback") || value.includes("shield")) return "Security";
  return "SaaS";
}
const recentlyListedSeed = [
  { logo: "PT", name: "PicToLines.com", niche: "AI", revenue: "$98", price: "$1.9k", multiple: "1.6x" },
  { logo: "SS", name: "SetSmart", niche: "SaaS", revenue: "$16k", price: "$499k", multiple: "2.6x" },
  { logo: "AF", name: "AlgoFuse.ai", niche: "AI", revenue: "$1.9k", price: "$109k", multiple: "4.8x" },
  { logo: "MR", name: "motionreplica", niche: "AI", revenue: "$52", price: "$300", multiple: "1.3x" },
  { logo: "UR", name: "UserRally", niche: "AI", revenue: "$20k", price: "$310k", multiple: "1.9x" },
];

export const recentlyListed = recentlyListedSeed.map((item) => ({
  ...item,
  category: inferCategory(`${item.niche} ${item.name}`),
}));

const bestDealsSeed = [
  { logo: "LF", name: "LeadFind.ai", niche: "SaaS", revenue: "$933", price: "$15k", multiple: "1.3x" },
  { logo: "CM", name: "Caricature Maker", niche: "AI", revenue: "$256", price: "$6k", multiple: "2.0x" },
  { logo: "DP", name: "DropPop", niche: "SaaS", revenue: "$6k", price: "$140k", multiple: "2.0x" },
  { logo: "LK", name: "Looktara", niche: "SaaS", revenue: "$3.1k", price: "$40k", multiple: "1.1x" },
  { logo: "RD", name: "RapidDesk", niche: "DevTools", revenue: "$5.1k", price: "$62k", multiple: "1.5x" },
];

export const bestDeals = bestDealsSeed.map((item) => ({
  ...item,
  category: inferCategory(`${item.niche} ${item.name}`),
}));

const seedLeaderboard = [
  { startup: "Tri-Tech", startupTag: "Tri-Tech enables people to make a living with AI tutors", founder: "Vitali Dodonov", mrr: 950000, growth: "up", growthPct: "18%" },
  { startup: "PulseCRM", startupTag: "CRM workflows for founders and growth teams", founder: "Nora West", mrr: 828647, growth: "up", growthPct: "12%" },
  { startup: "TrimRx", startupTag: "Telehealth workflows for modern clinics", founder: "Cris", mrr: 756922, growth: "down", growthPct: "6%" },
  { startup: "Rezi", startupTag: "Resume tools used by thousands of job seekers", founder: "Jacob Jacquet", mrr: 287921, growth: "flat", growthPct: "0%", forSale: true },
  { startup: "Cometly", startupTag: "Marketing attribution and analytics for scaling teams", founder: "Grant Cooper", mrr: 233987, growth: "up", growthPct: "9%" },
  { startup: "1Capture", startupTag: "Double trial-to-paid conversion with lifecycle scoring", founder: "Robby Frank", mrr: 215115, growth: "up", growthPct: "7%", forSale: true },
  { startup: "SignalCore", startupTag: "Mobile ad intelligence for performance teams", founder: "Simon", mrr: 175085, growth: "up", growthPct: "4%" },
  { startup: "Looktera", startupTag: "Design subscriptions optimized for SaaS launches", founder: "Mina Cole", mrr: 148402, growth: "down", growthPct: "3%" },
  { startup: "ReplyForge", startupTag: "Personalized outbound replies with reply scoring", founder: "Arman Hale", mrr: 131778, growth: "up", growthPct: "11%" },
  { startup: "ShipVista", startupTag: "Cross-border shipping ops for e-commerce teams", founder: "Niko Cruz", mrr: 124660, growth: "flat", growthPct: "0%" },
  { startup: "AEO Engine", startupTag: "AEO Engine is a living network of AI agents", founder: "Vijay C. Jacob", mrr: 70331, growth: "up", growthPct: "3%" },
  { startup: "Teachizy", startupTag: "Teachizy is the fastest way to launch classes", founder: "Le Dev ULTIME", mrr: 68183, growth: "down", growthPct: "2%" },
  { startup: "Speel.co", startupTag: "Use AI to generate realistic UGC-style videos", founder: "Yann | Prosp.ai", mrr: 66124, growth: "flat", growthPct: "0%", forSale: true },
  { startup: "DataExpert / TechCreator", startupTag: "Data engineering education for creators", founder: "Zach Wilson", mrr: 64723, growth: "down", growthPct: "4%" },
  { startup: "WaLead AI", startupTag: "10x your sales on LinkedIn with AI outreach", founder: "Walid Amarir", mrr: 38680, growth: "up", growthPct: "22%" },
  { startup: "FitCal", startupTag: "Calorie and nutrition tracking with streak coaching", founder: "@enzosegattoc", mrr: 40626, growth: "flat", growthPct: "0%", forSale: true },
  { startup: "Simple Analytics", startupTag: "Privacy-first analytics for business websites", founder: "Simple Analytics", mrr: 40281, growth: "down", growthPct: "2%" },
  { startup: "AE-intelligence", startupTag: "Holding company for applied AI micro-tools", founder: "Dilyar Buzan", mrr: 37604, growth: "down", growthPct: "5%" },
];

const extraStartups = [
  "PromptHarbor", "MetricNest", "FunnelFox", "ChurnPilot", "NotionFlow", "AdSmith", "MailOrbit", "SnapBoard", "FounderKit", "Tracklance",
  "Monetly", "Cashbeam", "Proofwave", "Onboardly", "Launchgrid", "ScaleDock", "AgentBase", "RevenueKit", "GrowthMint", "AuditLane",
  "PingSales", "ViralDock", "KPIloop", "DeckForge", "AutoBloom", "Opsy", "Listly", "PipeSprint", "Warmline", "ChatShelf",
  "StorySpark", "DealFunnel", "FormBridge", "NicheScope", "SEOForge", "B2BAtlas", "SignalLoop", "InboxCrew", "ReachMate", "StudioPulse",
  "DataSail", "AirtimeHQ", "BrandPilot", "Linkharvest", "FoundryAI", "GrowthBento", "Acquirely", "ZipLeads", "WaveCRM", "HyperSend",
  "SparkLedger", "InboxPilot", "NovaLaunch", "TrendAnchor", "FocusFlow", "ProofStack", "AtlasOps", "ScaleSync", "GoToMarketly", "RevenueSage",
  "ProspectIQ", "SessionScout", "Pulseboard", "SaaSForge", "FlowIndex", "UnitMetrics", "AgentHarbor", "SignalPatch", "FounderOps", "DripCore",
  "RankSprint", "AudienceDock", "DemoLane", "Retentionly", "MotionStack", "PipelineIQ", "Shipcraft", "NurtureHQ", "KPIFoundry", "PlaybookAI",
  "DealPilot", "AnchorSuite"
];

const fillerFounders = [
  "Alex Kim", "Priya Rao", "Noah Miles", "Emma Stone", "Luca Brown", "Isha Patel", "Marco Lee", "Sofia Cruz", "Ethan Blake", "Maya Chen",
  "Ravi Das", "Lena Frost", "Omar Shah", "Tina Park", "Nia Grant", "Ivan Cole", "Liam Rose", "Ava Brooks", "Nolan Hart", "Mila Quinn"
];

function toInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const combined = [...seedLeaderboard];

let mrrCursor = 36000;
for (let i = 0; combined.length < 100; i += 1) {
  const startup = extraStartups[i % extraStartups.length] + (i >= extraStartups.length ? ` ${i + 1}` : "");
  const founder = fillerFounders[i % fillerFounders.length];
  const growthMode = i % 5 === 0 ? "down" : i % 4 === 0 ? "flat" : "up";
  const growthPct = growthMode === "flat" ? "0%" : `${(i % 13) + 1}%`;
  const forSale = i % 9 === 0;

  combined.push({
    startup,
    startupTag: `${startup} helps teams automate growth and revenue workflows`,
    category: inferCategory(startup),
    founder,
    mrr: mrrCursor,
    growth: growthMode,
    growthPct,
    forSale,
  });

  mrrCursor = Math.max(9000, mrrCursor - (420 + (i % 7) * 85));
}

combined.sort((a, b) => b.mrr - a.mrr);

export const leaderboard = combined.slice(0, 100).map((row, idx) => ({
  rank: idx + 1,
  startup: row.startup,
  startupTag: row.startupTag,
  founder: row.founder,
  founderInitial: row.founderInitial || toInitials(row.founder || "NA"),
  mrr: `$${row.mrr.toLocaleString()}`,
  growth: row.growth,
  growthPct: row.growthPct,
  category: row.category || inferCategory(`${row.startup} ${row.startupTag}`),
  forSale: Boolean(row.forSale),
}));




