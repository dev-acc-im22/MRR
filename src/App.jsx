import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  CreditCard,
  Dumbbell,
  Eye,
  ExternalLink,
  Globe2,
  Heart,
  Home,
  Megaphone,
  Moon,
  Palette,
  Plane,
  Search,
  X,
  Share2,
  Shield,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SidebarCard from "./components/SidebarCard";
import StartupCard from "./components/StartupCard";
import LeaderboardTable from "./components/LeaderboardTable";
import { bestDeals, leaderboard, leftFeatures, recentlyListed, rightFeatures } from "./data/mockData";

const categories = [
  { label: "AI", Icon: Sparkles },
  { label: "SaaS", Icon: Search },
  { label: "Developer Tools", Icon: Code2 },
  { label: "Fintech", Icon: CreditCard },
  { label: "Productivity", Icon: Briefcase },
  { label: "Marketing", Icon: Megaphone },
  { label: "Design Tools", Icon: Palette },
  { label: "Analytics", Icon: BarChart3 },
  { label: "Health & Fitness", Icon: Dumbbell },
  { label: "Social Media", Icon: Users },
  { label: "Content Creation", Icon: Video },
  { label: "Real Estate", Icon: Home },
  { label: "Travel", Icon: Plane },
  { label: "Security", Icon: Shield },
];

const footerColumns = [
  {
    title: "Navigation",
    links: [
      "Buy/Sell Startups",
      "Find Co-founders",
      "Dashboard",
      "Search",
      "Stats",
      "Categories",
      "Top 100 Startups",
      "Terms of Service",
      "Support",
    ],
  },
  {
    title: "Browse startups",
    links: [
      "AI",
      "SaaS",
      "Developer Tools",
      "Fintech",
      "Marketing",
      "E-commerce",
      "Productivity",
      "Design Tools",
      "No-Code",
      "Analytics",
    ],
  },
];

function toInitials(name) {
  return String(name || "RM")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function buildAnonymousId(apiKey, handle) {
  if (typeof window === "undefined") return "AMRR-LOCAL";

  const storageKey = "realmrr-anon-seed";
  let seed = window.localStorage.getItem(storageKey);
  if (!seed) {
    seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    window.localStorage.setItem(storageKey, seed);
  }

  const raw = `${seed}|${apiKey || ""}|${handle || ""}`;
  const code = hashText(raw).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `AMRR-${code}`;
}

function hashText(text) {
  return Array.from(String(text || ""))
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
}

function parseMoney(input) {
  if (!input) return 10000;
  const cleaned = String(input).replace(/[$,\s]/g, "").toLowerCase();
  const amount = parseFloat(cleaned.replace(/[kmb]/g, ""));
  if (!Number.isFinite(amount)) return 10000;
  if (cleaned.endsWith("m")) return amount * 1_000_000;
  if (cleaned.endsWith("k")) return amount * 1_000;
  if (cleaned.endsWith("b")) return amount * 1_000_000_000;
  return amount;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function buildStartupProfile(source, byName) {
  const name = source?.name || source?.startup || source?.title || "Startup";
  const seedRow = byName.get(name.toLowerCase());
  const code = hashText(name);
  const founder = source?.founder || seedRow?.founder || "Founder Team";
  const niche = source?.niche || source?.startupTag || source?.desc || seedRow?.startupTag || "Revenue-focused software startup";
  const revenueValue = parseMoney(source?.revenue || seedRow?.mrr || "$12,500");
  const mrrValue = Math.max(3800, revenueValue * (source?.revenue ? 22 : 1));
  const allTimeRevenue = mrrValue * (28 + (code % 34));
  const foundedMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][code % 12];
  const foundedYear = 2020 + (code % 6);

  const trendPercent = 4 + (code % 19);
  const trendUp = code % 4 !== 0;

  const points = Array.from({ length: 30 }, (_, i) => {
    const wave = Math.sin((i + code % 7) / 3.1) * 12;
    const base = 78 + (code % 15);
    const drift = i * 0.35;
    return Math.max(42, base + wave + drift);
  });

  return {
    name,
    logo: source?.logo || toInitials(name),
    niche,
    category: source?.category || seedRow?.category || "SaaS",
    founder,
    founderInitial: source?.founderInitial || toInitials(founder),
    allTimeRevenue: formatMoney(allTimeRevenue),
    mrr: source?.mrr || formatMoney(mrrValue),
    followers: `${(1.4 + (code % 40) / 10).toFixed(1)}k followers on X`,
    founded: `${foundedMonth} ${foundedYear}`,
    country: ["United States", "United Kingdom", "India", "Canada", "Germany"][code % 5],
    trendPercent: `${trendPercent}%`,
    trendDirection: trendUp ? "up" : "down",
    chartPoints: points,
    updatedAt: "Feb 27, 2026, 05:08 PM",
    valueProposition: `${name} helps teams convert audience into recurring revenue with lean automation workflows.`, 
    problemSolved: `Founders use ${name} to remove manual busywork, improve retention, and grow predictable cashflow.`, 
    audience: ["Content Creators", "B2B Founders", "Growth Teams", "Indie Hackers"][code % 4],
    model: ["B2C", "B2B", "Hybrid"][code % 3],
  };
}

function RevenueChart({ profile }) {
  const [metric, setMetric] = useState("MRR");
  const [timeframe, setTimeframe] = useState("All time");
  const [openMenu, setOpenMenu] = useState(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!controlsRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (metric === "Growth" && timeframe !== "Last 30 days") {
      setTimeframe("Last 30 days");
    }
  }, [metric, timeframe]);

  const max = Math.max(...profile.chartPoints);
  const min = Math.min(...profile.chartPoints);
  const points = profile.chartPoints
    .map((point, index) => {
      const x = (index / (profile.chartPoints.length - 1)) * 100;
      const y = ((max - point) / (max - min || 1)) * 62 + 11;
      return `${x},${y}`;
    })
    .join(" ");

  const isGrowth = metric === "Growth";
  const heroValue = isGrowth ? `${profile.trendDirection === "up" ? "+" : "-"}${profile.trendPercent}` : profile.mrr;
  const subtitle = isGrowth ? "MoM growth in last 30 days" : `${metric} in ${timeframe.toLowerCase()}`;

  return (
    <section className="mt-5 rounded-2xl border border-[#242833] bg-[#11131a] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[clamp(1rem,1.35vw,1.5rem)] font-bold text-gray-100">{heroValue}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={12} className={profile.trendDirection === "up" ? "text-emerald-400" : "text-rose-400"} />
            <span>{subtitle}</span>
          </p>
        </div>

        <div ref={controlsRef} className="flex gap-2 text-xs text-gray-300">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => (prev === "metric" ? null : "metric"))}
              className="inline-flex min-w-[130px] items-center justify-between rounded-lg border border-[#2e3443] bg-[#181d28] px-3 py-1.5"
            >
              <span>{metric}</span>
              <ChevronDown size={13} className="text-gray-500" />
            </button>

            {openMenu === "metric" ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-[180px] rounded-xl border border-[#2d3445] bg-[#141820] p-1 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                {["MRR", "Growth"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setMetric(option);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-[#222a38]"
                  >
                    <span>{option}</span>
                    {metric === option ? <Check size={13} className="text-gray-300" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={isGrowth}
              onClick={() => {
                if (!isGrowth) {
                  setOpenMenu((prev) => (prev === "timeframe" ? null : "timeframe"));
                }
              }}
              className={`inline-flex min-w-[130px] items-center justify-between rounded-lg border px-3 py-1.5 ${
                isGrowth
                  ? "cursor-not-allowed border-[#2a2f3e] bg-[#161a23] text-gray-500"
                  : "border-[#2e3443] bg-[#181d28] text-gray-200"
              }`}
            >
              <span>{timeframe}</span>
              <ChevronDown size={13} className={isGrowth ? "text-gray-600" : "text-gray-500"} />
            </button>

            {openMenu === "timeframe" && !isGrowth ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-[180px] rounded-xl border border-[#2d3445] bg-[#141820] p-1 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                {["Last 30 days", "All time"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTimeframe(option);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-[#222a38]"
                  >
                    <span>{option}</span>
                    {timeframe === option ? <Check size={13} className="text-gray-300" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="h-[280px] rounded-xl border border-[#1f2430] bg-[linear-gradient(180deg,#101524_0%,#0f1320_100%)] p-3">
        <svg viewBox="0 0 100 84" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f6bff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4f6bff" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <polyline fill="none" stroke="#7387ff" strokeWidth="0.8" points={points} />
          <polygon fill="url(#revenueFill)" points={`0,84 ${points} 100,84`} />
        </svg>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        Revenue is verified with Stripe API key. Last updated: {profile.updatedAt}
      </p>
    </section>
  );
}

function AddStartupPage({ onClose }) {
  const providers = [
    { name: "Stripe", short: "S", logoBg: "bg-[#635bff]" },
    { name: "LemonSqueezy", short: "L", logoBg: "bg-[#5f2dff]" },
    { name: "Polar", short: "O", logoBg: "bg-[#2f3239]" },
    { name: "Dodo Payments", short: "D", logoBg: "bg-[#b9ff25] text-[#111319]" },
    { name: "RevenueCat", short: "RC", logoBg: "bg-[#ff5c73]" },
  ];
  const [provider, setProvider] = useState("Stripe");
  const [apiKey, setApiKey] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [listForSale, setListForSale] = useState(false);

  const anonymousId = useMemo(() => {
    if (!anonymousMode) return "";
    return buildAnonymousId(apiKey.trim(), xHandle.trim());
  }, [anonymousMode, apiKey, xHandle]);

  useEffect(() => {
    if (!anonymousMode || !anonymousId) return;
    try {
      const recordsKey = "realmrr-anon-records";
      const raw = window.localStorage.getItem(recordsKey);
      const records = raw ? JSON.parse(raw) : {};
      records[anonymousId] = {
        id: anonymousId,
        handle: xHandle.trim() || null,
        createdAt: records[anonymousId]?.createdAt || new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };
      window.localStorage.setItem(recordsKey, JSON.stringify(records));
    } catch (err) {
      // no-op: localStorage may be unavailable in private mode
    }
  }, [anonymousMode, anonymousId, xHandle]);



  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const canSubmit = apiKey.trim().length > 0;

  return (
    <section className="mx-auto w-full max-w-[820px] pt-4 sm:pt-8">
      <div className="overflow-hidden rounded-2xl border border-[#31333a] bg-[linear-gradient(180deg,#2a2a2d_0%,#232427_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="border-b border-[#3a3d44]">
          <div className="flex items-center justify-between gap-3 border-b border-[#4b7fe0] bg-[linear-gradient(100deg,#1f4fa8_0%,#2f6fda_36%,#4b8df5_62%,#5ba8ff_100%)] px-6 py-5 shadow-[inset_0_-1px_0_rgba(167,210,255,0.35),0_0_24px_rgba(71,131,255,0.25)]">
            <h3 className="text-[clamp(1.85rem,2.2vw,2.15rem)] font-bold tracking-[-0.02em] text-[#f3f5fa]">Add Your Startup & Get FREE Visbililty</h3>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg border border-[#9ec6ff]/50 bg-[#1a4fa3]/35 p-1.5 text-[#e9f3ff] shadow-[0_2px_12px_rgba(18,64,140,0.35)] transition hover:bg-[#2b66c3]/50 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <p className="w-full flex-1 rounded-xl border border-[#3e4a63] bg-[linear-gradient(135deg,rgba(52,66,95,0.28)_0%,rgba(37,45,63,0.38)_100%)] px-4 py-3 text-[clamp(1rem,1.02vw,1.1rem)] leading-relaxed text-gray-200 shadow-[inset_0_0_0_1px_rgba(130,156,206,0.08)]">
                Showcase your verified revenue to <span className="text-[1.08em] font-semibold text-[#7fd0ff]">120,000+ monthly visitors</span> and get a
                <span className="text-[1.08em] font-semibold text-[#7fd0ff]"> FREE 54+ DR dofollow backlink</span>
              </p>

              <div className="shrink-0 rounded-2xl border border-[#3b567f] bg-[#172640] px-4 py-3 text-xs font-semibold text-[#d8e6ff] shadow-[inset_0_0_0_1px_rgba(127,182,255,0.16)]">
                <div className="flex items-center justify-end gap-2 uppercase tracking-[0.06em]">
                  <span>Trusted</span>
                  <Shield size={14} className="text-[#7fd0ff]" />
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#cfe0ff]">List for Free</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="mb-6">
            <div className="grid grid-cols-5 gap-1.5 rounded-xl border border-[#3a3d44] bg-[#141518] p-1">
              {providers.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setProvider(item.name)}
                  className={`inline-flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-[clamp(0.78rem,0.9vw,0.92rem)] font-medium transition ${
                    provider === item.name
                      ? "border-[#3f4b67] bg-[#232a39] text-white"
                      : "border-transparent text-gray-400 hover:border-[#2f3648] hover:bg-[#232730] hover:text-gray-200"
                  }`}
                >
                  <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${item.logoBg}`}>
                    {item.short}
                  </span>
                  <span className="min-w-0 truncate whitespace-nowrap">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[clamp(1.22rem,1.3vw,1.45rem)] font-semibold tracking-[-0.01em] text-[#f2f3f6]">1. {provider} API key</label>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                className="w-full rounded-xl border border-[#4a4d55] bg-[#34363a] px-4 py-3 text-[clamp(1rem,1.02vw,1.08rem)] text-[#f2f4f8] outline-none placeholder:text-[#a4a8b3] focus:border-[#6e8fda]"
                placeholder="rk_live_...."
              />
            </div>

            <div className="rounded-xl border border-[#3b3e45] bg-[#181a1f] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[clamp(1.16rem,1.2vw,1.34rem)] font-semibold tracking-[-0.01em] text-[#f2f3f6]">Click here to create a read-only API key.</p>
                <button type="button" className="rounded-md p-1.5 text-gray-400 hover:bg-[#2f333b] hover:text-white">
                  <ExternalLink size={16} />
                </button>
              </div>
              <ol className="space-y-1 text-[clamp(1rem,1.02vw,1.08rem)] leading-8 text-gray-300">
                <li>1. Scroll down and click 'Create key'</li>
                <li>2. Don't change the permissions</li>
                <li>3. Don't delete the key or we can't refresh revenue</li>
              </ol>
            </div>

            <div>
              <label className="mb-2 block text-[clamp(1.22rem,1.3vw,1.45rem)] font-semibold tracking-[-0.01em] text-[#f2f3f6]">2. X handle (optional)</label>
              <input
                value={xHandle}
                onChange={(event) => setXHandle(event.target.value)}
                className="w-full rounded-xl border border-[#4a4d55] bg-[#34363a] px-4 py-3 text-[clamp(1rem,1.02vw,1.08rem)] text-[#f2f4f8] outline-none placeholder:text-[#a4a8b3] focus:border-[#6e8fda]"
                placeholder="username"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-[clamp(1rem,1.04vw,1.1rem)] text-gray-200">
              <input
                type="checkbox"
                checked={anonymousMode}
                onChange={(event) => setAnonymousMode(event.target.checked)}
                className="h-4 w-4 rounded border border-[#5b606b] bg-[#23262d]"
              />
              <span>Anonymous mode</span>
            </label>

            {anonymousMode ? (
              <div className="rounded-xl border border-[#3c3f47] bg-[#181a1f] p-3 text-[clamp(0.92rem,0.98vw,1rem)] text-gray-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[#e5edf9]">Anonymous profile enabled</p>
                  <span className="rounded-full border border-[#4a6aa5] bg-[#1a2b45] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#d8e6ff]">
                    ID: {anonymousId || "AMRR-XXXXXX"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#b3b7c4]">We will display your listing as Anonymous on the public marketplace. Your original handle is stored privately for verification.</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#3a3d44] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#454a55] bg-[#2c2f35] px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-[#383d47]"
          >
            Close
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setListForSale((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full border transition ${
                listForSale ? "border-[#6f90e8] bg-[#3557a8]" : "border-[#565a64] bg-[#3a3d43]"
              }`}
              aria-label="Toggle list for sale"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  listForSale ? "left-6" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-[clamp(1rem,1.04vw,1.1rem)] text-gray-200">List for sale</span>

            <button
              type="button"
              disabled={!canSubmit}
              className={`rounded-xl px-5 py-2.5 text-[clamp(1rem,1.06vw,1.12rem)] font-semibold transition ${
                canSubmit
                  ? "border border-[#8aa7ff] bg-[#eaf0ff] text-[#1a2a4f] shadow-[0_10px_24px_rgba(74,120,233,0.4)] hover:-translate-y-0.5"
                  : "cursor-not-allowed border border-[#555962] bg-[#a6a8ad] text-[#2a2c31]"
              }`}
            >
              Add startup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


function AdvertisePage({ onClose }) {
  return (
    <section className="mx-auto w-full max-w-[820px] pt-4 sm:pt-8">
      <div className="overflow-hidden rounded-2xl border border-[#31333a] bg-[linear-gradient(180deg,#2a2a2d_0%,#232427_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="border-b border-[#3a3d44] px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[clamp(1.65rem,2vw,2rem)] font-bold tracking-[-0.02em] text-[#f3f5fa]">Advertise on RealMRR</h3>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 transition hover:bg-[#3b3f46] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <p className="mt-3 text-[clamp(1rem,1.02vw,1.1rem)] leading-relaxed text-gray-300">
            Reach <span className="font-semibold text-[#9bd0ff]">120K+ entrepreneurs and founders</span> every month.
          </p>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-[#3d4351] bg-[#2a2d33] p-4 text-center">
              <Users size={20} className="mx-auto text-gray-200" />
              <p className="mt-2 text-[clamp(1.35rem,1.7vw,1.7rem)] font-bold text-[#dff1ff]">120K+</p>
              <p className="text-sm text-gray-300">Monthly visitors</p>
            </article>
            <article className="rounded-xl border border-[#3d4351] bg-[#2a2d33] p-4 text-center">
              <Eye size={20} className="mx-auto text-gray-200" />
              <p className="mt-2 text-[clamp(1.35rem,1.7vw,1.7rem)] font-bold text-[#dff1ff]">High-intent</p>
              <p className="text-sm text-gray-300">Buyers, not browsers</p>
            </article>
            <article className="rounded-xl border border-[#7a2d3d] bg-[#4a252f] p-4 text-center">
              <Zap size={20} className="mx-auto text-[#ff667f]" />
              <p className="mt-2 text-[clamp(1.35rem,1.7vw,1.7rem)] font-bold text-[#ff879a]">1/20</p>
              <p className="text-sm text-[#ffd5dc]">Spots left</p>
            </article>
          </div>

          <section>
            <h4 className="text-[clamp(1.1rem,1.2vw,1.28rem)] font-semibold text-gray-100">How it works</h4>
            <p className="mt-2 leading-8 text-gray-300">
              Your startup appears in rotating sponsor slots on desktop sidebars and mobile banners across all RealMRR pages.
              Sponsors rotate every 10 seconds to ensure fair visibility among all advertisers.
            </p>
          </section>

          <section className="rounded-xl border border-[#30333a] bg-[#131518] p-5">
            <h4 className="text-[clamp(1.1rem,1.2vw,1.28rem)] font-semibold text-gray-100">Pricing</h4>
            <p className="mt-3 text-[clamp(1.1rem,1.2vw,1.25rem)] text-gray-100">
              <span className="font-semibold">Monthly rate:</span> <span className="text-[#9fd4ff]">$1,499/month</span>
            </p>
            <p className="mt-2 text-[clamp(1rem,1.05vw,1.12rem)] text-gray-300">
              <span className="font-semibold text-gray-100">1 spot</span> available now. Cancel anytime.
            </p>
          </section>

          <a
            href="#"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#cad2df] bg-[#e8edf6] px-5 py-3 text-[clamp(1rem,1.1vw,1.15rem)] font-semibold text-[#111723] transition hover:bg-white"
          >
            Get started ($1,499/mo)
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

function SellStartupsPage({ onClose }) {
  const [goal, setGoal] = useState("Strategic exit");
  const [timeline, setTimeline] = useState("90 days");
  const [revenueBand, setRevenueBand] = useState("$10k - $50k MRR");

  const playbook = [
    {
      title: "Prepare your listing",
      detail: "Add verified MRR, growth trends, and operations notes so buyers can evaluate your startup quickly.",
      Icon: CheckCircle2,
    },
    {
      title: "Get expert pricing support",
      detail: "Use RealMRR data benchmarks to choose a valuation range that attracts qualified offers.",
      Icon: TrendingUp,
    },
    {
      title: "Meet serious buyers",
      detail: "Share with high-intent acquirers, protect confidentiality, and move to signed LOI faster.",
      Icon: Shield,
    },
  ];

  return (
    <section className="pt-4 sm:pt-8">
      <div className="overflow-hidden rounded-[26px] border border-[#6a4060]/70 bg-[linear-gradient(180deg,rgba(23,14,27,0.9)_0%,rgba(17,12,23,0.95)_100%)] shadow-[0_0_0_1px_rgba(221,157,191,0.12),0_24px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,214,234,0.12)] backdrop-blur-xl">
        <div className="border-b border-[#52354a] p-5 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-[#744f68] bg-[#2a1d2a] px-3 py-1.5 text-xs font-semibold text-[#f7dceb] transition hover:border-[#9f6f8f] hover:text-white"
            >
              <ArrowLeft size={13} />
              Back to home
            </button>

            <a
              href="https://acquire.com/sellers/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#68465d] bg-[#251a26] px-3 py-1.5 text-xs text-[#f0cade] transition hover:border-[#9a6f88] hover:text-white"
            >
              Seller playbook
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#ff9bc8]">RealMRR Sellers</p>
              <h1 className="mt-2 text-[clamp(1.7rem,3.4vw,2.8rem)] font-bold leading-[1.08] text-white">
                Sell your startup with confidence and verified traction.
              </h1>
              <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#e7c8d9] sm:text-base">
                Built for founders who want a clean process: prepare your numbers, launch a premium listing, and connect with
                qualified buyers without wasting months on low-intent conversations.
              </p>
            </div>

            <aside className="rounded-xl border border-[#704964] bg-[linear-gradient(160deg,#331f34_0%,#291a2c_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(255,203,225,0.1)]">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#ffc5df]">Seller Snapshot</p>
              <div className="mt-4 grid gap-3">
                <article className="rounded-lg border border-[#7a5670] bg-[#2a1d2a] p-3">
                  <p className="text-[11px] text-[#f0c5da]">Active buyer pool</p>
                  <p className="mt-1 text-2xl font-bold text-white">500k+</p>
                </article>
                <article className="rounded-lg border border-[#7a5670] bg-[#2a1d2a] p-3">
                  <p className="text-[11px] text-[#f0c5da]">Typical close window</p>
                  <p className="mt-1 text-2xl font-bold text-white">90 days</p>
                </article>
                <article className="rounded-lg border border-[#7a5670] bg-[#2a1d2a] p-3">
                  <p className="text-[11px] text-[#f0c5da]">Support model</p>
                  <p className="mt-1 text-2xl font-bold text-white">1:1 guidance</p>
                </article>
              </div>
            </aside>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="rounded-xl border border-[#61425a] bg-[#231727]/85 p-4">
            <h3 className="text-lg font-semibold text-white">How selling on RealMRR works</h3>
            <div className="mt-4 grid gap-3">
              {playbook.map(({ title, detail, Icon }) => (
                <article key={title} className="rounded-lg border border-[#76566f] bg-[#2d1f30] p-3">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffe5f1]">
                    <Icon size={14} className="text-[#ff9fcd]" />
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#edccdd]">{detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#61425a] bg-[#231727]/85 p-4">
            <h3 className="text-lg font-semibold text-white">Seller onboarding setup</h3>
            <div className="mt-4 space-y-3 text-sm">
              <label className="block">
                <span className="mb-1.5 block text-[#efc5da]">Goal</span>
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="w-full rounded-lg border border-[#815c76] bg-[#311f33] px-3 py-2 text-[#ffe8f2] outline-none focus:border-[#d58ab4]"
                >
                  {[
                    "Strategic exit",
                    "Partial sale",
                    "Lifestyle handoff",
                    "Growth-stage acquisition",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[#efc5da]">Preferred timeline</span>
                <select
                  value={timeline}
                  onChange={(event) => setTimeline(event.target.value)}
                  className="w-full rounded-lg border border-[#815c76] bg-[#311f33] px-3 py-2 text-[#ffe8f2] outline-none focus:border-[#d58ab4]"
                >
                  {["30 days", "60 days", "90 days", "Flexible"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[#efc5da]">Revenue band</span>
                <select
                  value={revenueBand}
                  onChange={(event) => setRevenueBand(event.target.value)}
                  className="w-full rounded-lg border border-[#815c76] bg-[#311f33] px-3 py-2 text-[#ffe8f2] outline-none focus:border-[#d58ab4]"
                >
                  {[
                    "Below $10k MRR",
                    "$10k - $50k MRR",
                    "$50k - $200k MRR",
                    "$200k+ MRR",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-[#7a5670] bg-[#2a1d2a] p-3 text-xs text-[#f1cbdf]">
              <p className="inline-flex items-center gap-1.5">
                <Users size={12} />
                Get matched to buyers based on your selected profile.
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5">
                <CalendarDays size={12} />
                Median first qualified call booked in under 7 days.
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5">
                <Clock3 size={12} />
                Review offers with guided negotiation support.
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-[#52354a] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#6e4963] bg-[#261b29] px-4 py-3">
            <p className="text-sm text-[#f1cfe0]">Ready to list? Start seller onboarding and receive your valuation framework.</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#ffbfdc]/90 bg-[linear-gradient(120deg,#f28ca8_0%,#e15abd_50%,#9856ff_100%)] px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110"
              >
                Start seller onboarding
              </button>
              <button
                type="button"
                className="rounded-lg border border-[#7d5872] bg-[#312235] px-3.5 py-2 text-xs font-semibold text-[#ffdff0] transition hover:border-[#b987a8] hover:text-white"
              >
                Book valuation call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function AcquireStartupsPage({ onClose, listings, onSelectStartup }) {
  const sectors = ["All", "SaaS", "AI", "Fintech", "Developer Tools", "Marketing", "E-commerce"];
  const [activeSector, setActiveSector] = useState("All");

  const filteredListings = useMemo(() => {
    if (activeSector === "All") return listings;
    return listings.filter((item) => item.category === activeSector);
  }, [activeSector, listings]);

  const displayListings = filteredListings.slice(0, 12);
  const saleListings = listings.filter((item) => item.forSale);
  const featuredListings = (saleListings.length ? saleListings : filteredListings).slice(0, 2);
  const allSaleListings = saleListings.length ? saleListings : filteredListings;

  const medianMrr = useMemo(() => {
    if (!filteredListings.length) return "$0";
    const sorted = filteredListings
      .map((item) => parseMoney(item.revenue || item.price || item.mrr || "$0"))
      .sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const value = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return formatMoney(value);
  }, [filteredListings]);

  const averageMultiple = useMemo(() => {
    const values = filteredListings
      .map((item) => Number.parseFloat(String(item.multiple || "").replace(/[^0-9.]/g, "")))
      .filter((value) => Number.isFinite(value));

    if (!values.length) return "3.2x";
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return `${avg.toFixed(1)}x`;
  }, [filteredListings]);

  return (
    <section className="pt-4 sm:pt-8">
      <div className="overflow-hidden rounded-[26px] border border-[#314467]/80 bg-[linear-gradient(180deg,rgba(17,25,40,0.86)_0%,rgba(10,15,25,0.92)_100%)] shadow-[0_0_0_1px_rgba(131,171,235,0.2),0_24px_70px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(185,217,255,0.18)] backdrop-blur-xl">
        <div className="border-b border-[#24324a] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-[#334769] bg-[#121b2b] px-3 py-1.5 text-xs font-semibold text-[#c6dcff] transition hover:border-[#4d6ea1] hover:text-white"
            >
              <ArrowLeft size={13} />
              Back to home
            </button>

            <a
              href="https://help.acquire.com/how-to-sign-up-on-acquire.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2f3f5c] bg-[#101829] px-3 py-1.5 text-xs text-[#b9caea] transition hover:border-[#4f6fa8] hover:text-white"
            >
              Buyer guide
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7fb6ff]">acquire startups</p>
              <h1 className="mt-2 text-[clamp(1.7rem,3.5vw,2.8rem)] font-bold leading-[1.08] text-white">
                Acquire startups with verified recurring revenue.
              </h1>
              <p className="mt-3 max-w-[740px] text-sm leading-6 text-[#9cb0d1] sm:text-base">
                A combined buy-and-acquire flow built for transparent MRR-first deals. Browse vetted businesses,
                compare performance snapshots, and connect with founders in minutes.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {sectors.map((sector) => {
                  const active = sector === activeSector;
                  return (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setActiveSector(sector)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-[#4f7be0] bg-[#1a2a49] text-[#d6e5ff]"
                          : "border-[#2e3c56] bg-[#101726] text-[#9db2d6] hover:border-[#446293] hover:text-[#d6e5ff]"
                      }`}
                    >
                      {sector}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-xl border border-[#2d3d59] bg-[linear-gradient(160deg,#132037_0%,#0f1a2d_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(120,162,235,0.1)]">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8fb5f2]">Marketplace Snapshot</p>
              <div className="mt-4 grid gap-3">
                <article className="rounded-lg border border-[#324766] bg-[#101b2e] p-3">
                  <p className="text-[11px] text-[#8ea9d5]">Live listings</p>
                  <p className="mt-1 text-2xl font-bold text-white">{filteredListings.length.toLocaleString()}</p>
                </article>
                <article className="rounded-lg border border-[#324766] bg-[#101b2e] p-3">
                  <p className="text-[11px] text-[#8ea9d5]">Median MRR</p>
                  <p className="mt-1 text-2xl font-bold text-white">{medianMrr}</p>
                </article>
                <article className="rounded-lg border border-[#324766] bg-[#101b2e] p-3">
                  <p className="text-[11px] text-[#8ea9d5]">Avg. revenue multiple</p>
                  <p className="mt-1 text-2xl font-bold text-white">{averageMultiple}</p>
                </article>
              </div>
            </aside>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[clamp(240px,26vw,320px)_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-[#2a3751] bg-[#0f1624] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7fb6ff]">Filters</p>

            <div className="mt-4 space-y-4 text-sm text-[#c7d6f3]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Categories</p>
                <div className="mt-2 relative">
                  <select
                    className="w-full rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] outline-none"
                    value={activeSector}
                    onChange={(event) => setActiveSector(event.target.value)}
                  >
                    {sectors.map((sector) => (
                      <option key={`filter-${sector}`} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Monthly Revenue</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="$ Min"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                  <input
                    type="text"
                    placeholder="$ Max"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Growth (30d)</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Min %"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                  <input
                    type="text"
                    placeholder="Max %"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Asking Price</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="$ Min"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                  <input
                    type="text"
                    placeholder="$ Max"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Max Multiple</p>
                <select
                  className="mt-2 w-full rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] outline-none"
                  defaultValue="Any multiple"
                >
                  <option>Any multiple</option>
                  <option>1x - 3x</option>
                  <option>3x - 5x</option>
                  <option>5x+</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Profit Margin</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Min %"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                  <input
                    type="text"
                    placeholder="Max %"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Mobile App</p>
                <select
                  className="mt-2 w-full rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] outline-none"
                  defaultValue="Any"
                >
                  <option>Any</option>
                  <option>iOS</option>
                  <option>Android</option>
                  <option>Web</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Listed</p>
                <select
                  className="mt-2 w-full rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] outline-none"
                  defaultValue="Any time"
                >
                  <option>Any time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#91a7cf]">Founded</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="From"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    className="rounded-lg border border-[#2b3952] bg-[#0c1321] px-3 py-2 text-xs text-[#dbe7ff] placeholder:text-[#6f7f9a]"
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-lg border border-[#3b5a93] bg-[#13223a] px-3 py-2 text-xs font-semibold text-[#cfe0ff] transition hover:border-[#5d86d4] hover:text-white"
              >
                Apply filters
              </button>
            </div>
          </aside>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8fb5f2]">Featured deals</p>
              <span className="text-xs text-[#9cb0d1]">{filteredListings.length.toLocaleString()} listings</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {featuredListings.map((item, idx) => (
                <article
                  key={`featured-${item.name}-${idx}`}
                  className="rounded-2xl border border-[#2a3751] bg-[#101623] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-[#eef4ff]">{item.name}</p>
                      <p className="mt-1 truncate text-xs text-[#9cb0d1]">{item.niche || "Profitable internet business"}</p>
                    </div>
                    <span className="rounded-md border border-[#355080] bg-[#16233b] px-2 py-1 text-[10px] font-semibold text-[#aaccff]">
                      {item.category || "SaaS"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                      <p className="text-[#7f95bc]">MRR</p>
                      <p className="mt-1 font-semibold text-[#e8f0ff]">{item.revenue || item.price || "$0"}</p>
                    </div>
                    <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                      <p className="text-[#7f95bc]">Multiple</p>
                      <p className="mt-1 font-semibold text-[#e8f0ff]">{item.multiple || "3.0x"}</p>
                    </div>
                    <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                      <p className="text-[#7f95bc]">Category</p>
                      <p className="mt-1 font-semibold text-[#e8f0ff]">{item.category || "SaaS"}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectStartup?.(item)}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#4e79c8] bg-[linear-gradient(120deg,#1c6dff_0%,#3c86ff_48%,#34c9bf_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    View startup
                  </button>
                </article>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8fb5f2]">All startups for sale</p>
                <span className="text-xs text-[#9cb0d1]">{allSaleListings.length.toLocaleString()} listings</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {allSaleListings.map((item, idx) => (
                  <article
                    key={`sale-${item.name}-${idx}`}
                    className="rounded-2xl border border-[#24324a] bg-[#0c1524] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[#eef4ff]">{item.name}</p>
                        <p className="mt-1 truncate text-xs text-[#9cb0d1]">{item.niche || "Profitable internet business"}</p>
                      </div>
                      <span className="rounded-md border border-[#355080] bg-[#16233b] px-2 py-1 text-[10px] font-semibold text-[#aaccff]">
                        {item.category || "SaaS"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                        <p className="text-[#7f95bc]">MRR</p>
                        <p className="mt-1 font-semibold text-[#e8f0ff]">{item.revenue || item.price || item.mrr || "$0"}</p>
                      </div>
                      <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                        <p className="text-[#7f95bc]">Price</p>
                        <p className="mt-1 font-semibold text-[#e8f0ff]">{item.price || item.revenue || "$0"}</p>
                      </div>
                      <div className="rounded-lg border border-[#273349] bg-[#0c1321] p-2.5">
                        <p className="text-[#7f95bc]">Multiple</p>
                        <p className="mt-1 font-semibold text-[#e8f0ff]">{item.multiple || "3.0x"}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectStartup?.(item)}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#4e79c8] bg-[linear-gradient(120deg,#1c6dff_0%,#3c86ff_48%,#34c9bf_100%)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      View startup
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#24324a] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2f3f5f] bg-[#10192a] px-4 py-3">
            <p className="text-sm text-[#afc2e2]">Need a better fit? Set your criteria and get new listings in your inbox.</p>
            <button
              type="button"
              className="rounded-lg border border-[#476cae] bg-[#152642] px-3.5 py-2 text-xs font-semibold text-[#d3e3ff] transition hover:border-[#6f93d3] hover:text-white"
            >
              Create buyer profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
function TopNav({
  isLight,
  isNavMenuOpen,
  setIsNavMenuOpen,
  setTheme,
  onHome,
  onAdd,
  onAcquire,
  onSell,
  onAdvertise,
}) {
  return (
    <div className="relative">
      <div className={`mx-auto mb-6 grid w-full max-w-[min(1200px,90vw)] grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl ${isLight ? "border-[#c9d6ea] bg-[linear-gradient(130deg,rgba(248,251,255,0.92)_0%,rgba(233,240,250,0.98)_100%)] shadow-[0_0_0_1px_rgba(120,140,170,0.2),0_12px_30px_rgba(20,30,60,0.12)]" : "border-[#3b5075]/85 bg-[linear-gradient(130deg,rgba(10,16,28,0.9)_0%,rgba(8,13,24,0.94)_100%)] shadow-[0_0_0_1px_rgba(141,173,230,0.24),0_22px_54px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(201,221,255,0.15)]"}`} >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={`group relative flex h-10 items-center gap-2 rounded-full border px-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${isLight ? "border-[#c3d2ea] bg-white text-[#334155] shadow-[inset_0_0_0_1px_rgba(120,140,170,0.15)] hover:border-[#8aa6d8]" : "border-[#3b5075]/85 bg-[#0b1220]/80 text-[#cfe0ff] shadow-[inset_0_0_0_1px_rgba(141,173,230,0.12)] hover:border-[#5b7fc0]"}`}
          >
            <span className={`grid h-7 w-7 place-content-center rounded-full border ${isLight ? "border-[#f1d48a] bg-[#ffd974] text-[#4a3300]" : "border-[#2a436d]/80 bg-[#0f1b2d] text-[#cfe0ff]"}`}>
              {isLight ? <Sun size={14} /> : <Moon size={14} />}
            </span>
            <span className="hidden sm:inline">{isLight ? "Light" : "Dark"}</span>
          </button>
        </div>

        <button type="button" onClick={onHome} className="inline-flex items-center justify-center gap-2 text-[clamp(1.15rem,1.3vw,1.55rem)] font-bold">
          <CheckCircle2 className="text-[#22c55e]" size={32} strokeWidth={2.5} />
          <span className={isLight ? "text-[#1f2937]" : "text-gray-300"}>RealMRR</span>
        </button>

        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isNavMenuOpen}
            onClick={() => setIsNavMenuOpen((prev) => !prev)}
            className={`group relative grid h-11 w-11 place-content-center rounded-2xl border transition ${isLight ? "border-[#c3d2ea] bg-white text-[#334155] shadow-[inset_0_0_0_1px_rgba(120,140,170,0.15),0_6px_18px_rgba(20,30,60,0.12)] hover:border-[#8aa6d8]" : "border-[#3b5075]/85 bg-[#0b1220]/80 text-[#cfe0ff] shadow-[inset_0_0_0_1px_rgba(141,173,230,0.12),0_8px_22px_rgba(0,0,0,0.35)] hover:border-[#5b7fc0]"}`}
          >
            <span className="absolute inset-1 rounded-full border border-[#2a436d]/80" />
            <span className="relative flex flex-col gap-[3px]">
              <span className={`h-[2px] w-5 rounded-full bg-current transition ${isNavMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`h-[2px] w-5 rounded-full bg-current transition ${isNavMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-5 rounded-full bg-current transition ${isNavMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {isNavMenuOpen ? (
        <div
          className={`fixed inset-0 z-40 backdrop-blur-sm lg:absolute lg:inset-x-0 lg:top-[calc(100%+12px)] lg:mt-0 lg:bottom-auto lg:bg-transparent lg:backdrop-blur-0 ${isLight ? "bg-slate-200/75" : "bg-black/55"}`}
          onClick={() => setIsNavMenuOpen(false)}
        >
          <div className="mx-auto flex h-full w-full max-w-[min(1200px,90vw)] items-center justify-center px-4 py-6 lg:h-auto lg:justify-start lg:py-0">
            <div
              className={`w-full max-w-[min(860px,88vw)] rounded-3xl border p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:mx-auto lg:w-[min(100vw,1200px)] ${isLight ? "border-[#c7d3e6] bg-[linear-gradient(140deg,rgba(248,251,255,0.98)_0%,rgba(232,240,250,0.96)_100%)]" : "border-[#3b5075]/85 bg-[linear-gradient(140deg,rgba(11,18,32,0.95)_0%,rgba(7,12,22,0.92)_100%)]"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto grid max-h-[80vh] w-full gap-4 overflow-y-auto text-center lg:text-left">
                {[
                  { label: "HOME", action: onHome },
                  { label: "ADD STARTUP", action: onAdd },
                  { label: "ACQUIRE/BUY STARTUPS", action: onAcquire },
                  { label: "SELL STARTUP", action: onSell },
                  { label: "ADVERTISE", action: onAdvertise },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.action?.();
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full rounded-2xl border border-transparent px-3 py-2.5 text-[clamp(1.05rem,1.8vw,1.6rem)] font-semibold uppercase tracking-[0.06em] transition ${isLight ? "text-[#1f2937] hover:border-[#9fb6df] hover:bg-[#e9f0fa]" : "text-[#e6f1ff] hover:border-[#5a7fc4] hover:bg-[#0f182a]"} drop-shadow-[0_1px_6px_rgba(60,90,140,0.2)]`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DirectoryFooter({ isLight, theme, setTheme, onSelectCategory, activeCategory }) {
  return (
    <>
      <section className={`${isLight ? "border-[#d6deeb] bg-[#ffffff]" : "border-[#222831] bg-[#0f1117]"} mt-10 rounded-2xl border p-6`}>
        <h3 className={`${isLight ? "text-[#111827]" : "text-gray-100"} text-center text-[clamp(1.1rem,1.4vw,1.7rem)] font-bold`}>Browse by category</h3>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map(({ label, Icon }) => {
            const active = activeCategory === label;
            return (
              <button
                type="button"
                key={label}
                onClick={() => onSelectCategory?.(label)}
                className={`${
                  active
                    ? "border-[#5d8df7] bg-[#1d2c4a] text-[#dcebff]"
                    : isLight
                      ? "border-[#d6deeb] bg-[#f8fafc] text-[#1f2937]"
                      : "border-[#2d333d] bg-[#12161f] text-gray-100"
                } flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:border-[#3b82f6] hover:text-[#d9e8ff]`}
              >
                <Icon size={14} className="text-[#7ea5ff]" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className={`${isLight ? "border-[#d6deeb] bg-[#ffffff]" : "border-[#222831] bg-[#0d1016]"} mt-10 rounded-2xl border p-6`}>
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {footerColumns.map((col) => (
            <div key={col.title} className="flex min-w-0 flex-col">
              <h4 className={`${isLight ? "border-[#c9d8f4] bg-[#eaf1ff] text-[#1e40af]" : "border-[#2d446b] bg-[#111f35] text-[#8fb4ff]"} mb-4 flex w-full rounded-lg border px-3 py-1.5 text-lg font-semibold`}>
                {col.title}
              </h4>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className={`${isLight ? "text-[#374151] hover:bg-[#e8f1ff] hover:text-[#3b82f6]" : "text-gray-300 hover:bg-[#15243d] hover:text-[#9cc4ff]"} w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors`}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={`${isLight ? "border-[#d6deeb] bg-[#f8fafc]" : "border-[#273043] bg-[linear-gradient(135deg,#131a26_0%,#121726_60%,#1a1d2e_100%)]"} rounded-2xl border p-5`}>
            <h4 className={`${isLight ? "border-[#c9d8f4] bg-[#eaf1ff] text-[#1e40af]" : "border-[#2d446b] bg-[#111f35] text-[#8fb4ff]"} mb-4 flex w-full rounded-lg border px-3 py-1.5 text-lg font-semibold`}>
              A Note from Allen ??
            </h4>
            <p className={`${isLight ? "text-[#374151]" : "text-gray-300"} text-sm leading-7`}>
              Thank you for spending your precious time exploring RealMRR. Your support means a lot to me as the founder of this platform, and I am deeply grateful for your visit.
            </p>
          </div>
        </div>

        <div className={`${isLight ? "border-[#d6deeb]" : "border-[#222831]"} mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4`}>
          <p className={`${isLight ? "text-[#374151]" : "text-gray-300"} text-sm`}>
            Built by <span className="font-semibold">Allen</span> <span aria-hidden="true">{"\u2764\uFE0F"}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className={`${isLight ? "text-[#4b5563]" : "text-gray-400"} text-xs`}>Theme</span>
            <div className={`${isLight ? "bg-[#e5e7eb]" : "bg-[#1a1f2a]"} inline-flex rounded-full p-1`}>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`${theme === "light" ? "bg-white text-[#111827] shadow" : "text-gray-500"} rounded-full px-2 py-1 text-xs`}
              >
                <Sun size={12} />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`${theme === "dark" ? "bg-[#111827] text-white shadow" : "text-gray-500"} rounded-full px-2 py-1 text-xs`}
              >
                <Moon size={12} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
function StartupDetail({ profile, onBack, recommendations, onSelectStartup }) {
  return (
    <section className="pt-4 sm:pt-8">
      <div className="mb-4 rounded-2xl border border-[#5b3a1b] bg-[linear-gradient(120deg,rgba(76,34,16,0.85)_0%,rgba(45,22,12,0.92)_100%)] px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#f6d4b6]">
            <ArrowLeft size={14} className="text-[#f7b277]" />
            <span>This startup is for sale.</span>
            <span className="text-[#ffd8b5]">Asking price: {profile.price || profile.mrr}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#8f4a20] bg-[#2a1710] px-3 py-2 text-xs font-semibold text-[#ffc99a]">
              <Heart size={13} />
              Save
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#f4a460] bg-[#f0811f] px-3 py-2 text-xs font-semibold text-white">
              <Share2 size={13} />
              Contact Seller
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#f1caa5]">
          <span className="rounded-full border border-[#6b3b20] bg-[#2a1911] px-2 py-1">1.2x revenue</span>
          <span className="rounded-full border border-[#6b3b20] bg-[#2a1911] px-2 py-1">35 buyers saw this recently</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[#2f3542] bg-[#131720] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#1a2030]"
      >
        <ArrowLeft size={13} />
        Back to directory
      </button>

      <div className="rounded-2xl border border-[#252a35] bg-[#111319] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">RealMRR › Startup › {profile.name}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-14 w-14 place-content-center rounded-full border border-[#3a4f79] bg-[#314b89] text-xl font-bold text-white">
                {profile.logo}
              </span>
              <div>
                <h2 className="text-[clamp(1.4rem,2vw,2rem)] font-bold text-gray-100">{profile.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="max-w-2xl text-sm text-gray-400">{profile.niche}</p>
                  <span className="rounded-full border border-[#35548a] bg-[#182844] px-2 py-0.5 text-[10px] font-semibold text-[#9fc2ff]">{profile.category || "SaaS"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#2e3442] bg-[#171c26] px-3 py-2 text-xs text-gray-200">
              <Share2 size={13} />
              Share
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#dbdee8] bg-[#eceff7] px-3 py-2 text-xs font-semibold text-[#121621]">
              Visit
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-[#252d3a] bg-[#171b22] p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">All-time revenue</p>
            <p className="mt-2 text-2xl font-bold text-gray-100">{profile.allTimeRevenue}</p>
            <p className="mt-1 text-xs text-gray-500">Ranked on RealMRR</p>
          </article>
          <article className="rounded-xl border border-[#252d3a] bg-[#171b22] p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">MRR (estimated)</p>
            <p className="mt-2 text-2xl font-bold text-gray-100">{profile.mrr}</p>
            <p className="mt-1 text-xs text-gray-500">Monthly recurring revenue</p>
          </article>
          <article className="rounded-xl border border-[#252d3a] bg-[#171b22] p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Founder</p>
            <p className="mt-2 text-xl font-bold text-gray-100">{profile.founder}</p>
            <p className="mt-1 text-xs text-gray-500">{profile.followers}</p>
          </article>
          <article className="rounded-xl border border-[#252d3a] bg-[#171b22] p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Founded</p>
            <p className="mt-2 text-xl font-bold text-gray-100">{profile.founded}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
              <Globe2 size={12} />
              {profile.country}
            </p>
          </article>
        </div>

        <RevenueChart profile={profile} />

        <section className="mt-6 rounded-xl border border-[#252b37] bg-[#151922] p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-gray-100">Startup insights</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-[#242938] bg-[#111722] p-4">
              <p className="text-[10px] uppercase tracking-[0.06em] text-gray-500">Value proposition</p>
              <p className="mt-2 text-sm text-gray-200">{profile.valueProposition}</p>
            </article>
            <article className="rounded-lg border border-[#242938] bg-[#111722] p-4">
              <p className="text-[10px] uppercase tracking-[0.06em] text-gray-500">Target audience</p>
              <p className="mt-2 text-sm text-gray-200">{profile.audience}</p>
            </article>
            <article className="rounded-lg border border-[#242938] bg-[#111722] p-4">
              <p className="text-[10px] uppercase tracking-[0.06em] text-gray-500">Problem solved</p>
              <p className="mt-2 text-sm text-gray-200">{profile.problemSolved}</p>
            </article>
            <article className="rounded-lg border border-[#242938] bg-[#111722] p-4">
              <p className="text-[10px] uppercase tracking-[0.06em] text-gray-500">Business details</p>
              <p className="mt-2 text-sm text-gray-200">{profile.model}</p>
            </article>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Discover more startups</h3>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-100">Advanced Search {"->"}</a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectStartup(item)}
              className="rounded-xl border border-[#2d333f] bg-[#141820] p-3 text-left transition hover:border-[#4760a8]"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-content-center rounded-md border border-[#36507b] bg-[#21304a] text-[11px] font-bold text-[#8fb4ff]">
                  {item.logo}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-100">{item.name}</p>
                  <p className="truncate text-xs text-gray-400">{item.niche}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Total revenue</p>
              <p className="text-sm font-semibold text-gray-100">{item.price || item.revenue}</p>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function CategoryResults({ category, items, onBack, onSelectStartup }) {
  return (
    <section className="pt-4 sm:pt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2f3542] bg-[#131720] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#1a2030]"
        >
          <ArrowLeft size={13} />
          Back to all categories
        </button>
        <span className="rounded-full border border-[#35548a] bg-[#182844] px-3 py-1 text-[11px] font-semibold text-[#9fc2ff]">
          {items.length} results
        </span>
      </div>

      <section className="rounded-2xl border border-[#242833] bg-[#11131a] p-5">
        <h2 className="text-2xl font-bold text-gray-100">{category}</h2>
        <p className="mt-1 text-sm text-gray-400">Showing startups tagged under this category.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <StartupCard key={`${item.name}-${item.category}`} item={item} onSelect={onSelectStartup} />
          ))}
        </div>
      </section>
    </section>
  );
}
function AutoFitPillValue({ value, className, minSizePx = 16, maxSizePx = 34, laptopMinSizePx = null, laptopMaxSizePx = null }) {
  const pillRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafId = 0;
    const fitText = () => {
      const pill = pillRef.current;
      const text = textRef.current;
      if (!pill || !text) return;

      const isLaptop = window.innerWidth >= 1024;
      const activeMax = typeof laptopMaxSizePx === "number" && isLaptop ? laptopMaxSizePx : maxSizePx;
      const activeMin = typeof laptopMinSizePx === "number" && isLaptop ? laptopMinSizePx : minSizePx;
      text.style.fontSize = `${activeMax}px`;
      const availableWidth = Math.max(1, pill.clientWidth - 6);
      const textWidth = text.scrollWidth || 1;
      const nextSize = Math.min(activeMax, Math.max(activeMin, (availableWidth / textWidth) * activeMax));
      text.style.fontSize = `${nextSize.toFixed(2)}px`;
    };

    const scheduleFit = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(fitText);
    };

    scheduleFit();

    let observer;
    if (typeof ResizeObserver !== "undefined" && pillRef.current) {
      observer = new ResizeObserver(scheduleFit);
      observer.observe(pillRef.current);
    }

    window.addEventListener("resize", scheduleFit);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, [value, minSizePx, maxSizePx, laptopMinSizePx, laptopMaxSizePx]);

  return (
    <span ref={pillRef} className="inline-flex w-full items-center justify-center">
      <span
        ref={textRef}
        className={className}
        style={{ fontSize: `${laptopMaxSizePx ?? maxSizePx}px`}}
      >
        {value}
      </span>
    </span>
  );
}

function PodiumSection({ rows }) {
  const topThree = rows.slice(0, 3);
  if (topThree.length < 3) return null;

  const podium = [
    { position: 2, startup: topThree[1] },
    { position: 1, startup: topThree[0] },
    { position: 3, startup: topThree[2] },
  ];

  const suffixes = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  const cupPalette = {
    1: {
      metalTop: "#fff6c9",
      metalMid: "#f4c44e",
      metalDeep: "#9c5d05",
      edge: "#f7d06e",
      glow: "rgba(255, 197, 76, 0.56)",
    },
    2: {
      metalTop: "#f9fcff",
      metalMid: "#d7dfea",
      metalDeep: "#7f8ba1",
      edge: "#e5ebf5",
      glow: "rgba(197, 214, 240, 0.5)",
    },
    3: {
      metalTop: "#ffe0c2",
      metalMid: "#d79a5f",
      metalDeep: "#87431a",
      edge: "#efb47e",
      glow: "rgba(217, 147, 93, 0.45)",
    },
  };

  const podiumFrameTone = {
    1: "bg-[linear-gradient(135deg,#fff7cf_0%,#f2c766_16%,#b5791b_43%,#ffe59a_60%,#9a650f_82%,#f5cc6f_100%)] shadow-[0_0_0_1px_rgba(255,229,154,0.55),0_12px_28px_rgba(0,0,0,0.32)]",
    2: "bg-[linear-gradient(135deg,#ffffff_0%,#e9eef8_16%,#a2aec4_42%,#f4f8ff_62%,#7b879f_84%,#d9e1f2_100%)] shadow-[0_0_0_1px_rgba(232,239,255,0.5),0_12px_28px_rgba(0,0,0,0.28)]",
    3: "bg-[linear-gradient(135deg,#ffd8b8_0%,#e4a66a_18%,#a45b2f_44%,#ffd5a9_63%,#7a3f1f_84%,#d9925f_100%)] shadow-[0_0_0_1px_rgba(240,183,133,0.5),0_12px_28px_rgba(0,0,0,0.3)]",
  };

  const podiumTone = {
    1: "bg-[linear-gradient(180deg,#f3dea0_0%,#d8a736_40%,#9b6713_100%)]",
    2: "bg-[linear-gradient(180deg,#f7fafc_0%,#c8d0dd_40%,#7e889d_100%)]",
    3: "bg-[linear-gradient(180deg,#f0c39b_0%,#c07b3d_40%,#82461d_100%)]",
  };

  const podiumTextTone = {
    1: "text-[#4a2600]",
    2: "text-[#233147]",
    3: "text-[#452006]",
  };

  const RoyalCup = ({ position }) => {
    const tone = cupPalette[position];
    const metalId = `royal-cup-metal-${position}`;
    const rimId = `royal-cup-rim-${position}`;
    const stemId = `royal-cup-stem-${position}`;
    const baseId = `royal-cup-base-${position}`;
    const glossId = `royal-cup-gloss-${position}`;
    const glowId = `royal-cup-glow-${position}`;

    return (
      <svg viewBox="0 0 260 220" className="h-full w-full" role="presentation" aria-hidden="true">
        <defs>
          <linearGradient id={metalId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.97" />
            <stop offset="11%" stopColor={tone.metalTop} />
            <stop offset="46%" stopColor={tone.metalMid} />
            <stop offset="78%" stopColor={tone.metalDeep} />
            <stop offset="100%" stopColor="#1f1303" stopOpacity="0.58" />
          </linearGradient>
          <radialGradient id={rimId} cx="50%" cy="24%" r="86%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor={tone.metalTop} />
            <stop offset="100%" stopColor={tone.metalDeep} />
          </radialGradient>
          <linearGradient id={stemId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.87" />
            <stop offset="36%" stopColor={tone.metalTop} />
            <stop offset="66%" stopColor={tone.metalMid} />
            <stop offset="100%" stopColor={tone.metalDeep} />
          </linearGradient>
          <linearGradient id={baseId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="23%" stopColor={tone.metalTop} />
            <stop offset="68%" stopColor={tone.metalMid} />
            <stop offset="100%" stopColor={tone.metalDeep} />
          </linearGradient>
          <linearGradient id={glossId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor={tone.glow} floodOpacity="0.54" />
            <feDropShadow dx="0" dy="1" stdDeviation="1.6" floodColor="#ffffff" floodOpacity="0.31" />
          </filter>
        </defs>

        <ellipse cx="130" cy="192" rx="78" ry="12" fill={tone.glow} opacity="0.3" />

        <g filter={`url(#${glowId})`}>
          <path
            d="M66 56 H194 C188 100 164 128 130 133 C96 128 72 100 66 56 Z"
            fill={`url(#${metalId})`}
            stroke={tone.edge}
            strokeWidth="3.2"
          />

          <ellipse cx="130" cy="56" rx="64" ry="15" fill={`url(#${rimId})`} stroke={tone.edge} strokeWidth="2.6" />
          <path d="M82 60 C92 86 108 99 130 103 C152 99 168 86 178 60" fill="none" stroke="#ffffff" strokeOpacity="0.23" strokeWidth="5" />

          <path
            d="M79 52 C55 52 45 76 56 94 C64 106 79 110 96 99"
            fill="none"
            stroke={`url(#${stemId})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M181 52 C205 52 215 76 204 94 C196 106 181 110 164 99"
            fill="none"
            stroke={`url(#${stemId})`}
            strokeWidth="8"
            strokeLinecap="round"
          />

          <path
            d="M98 58 C106 48 118 42 130 42 C142 42 154 48 162 58"
            fill="none"
            stroke={`url(#${glossId})`}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.67"
          />

          <rect x="118" y="133" width="24" height="25" rx="6" fill={`url(#${stemId})`} stroke={tone.edge} strokeWidth="2.1" />
          <rect x="101" y="156" width="58" height="16" rx="5" fill={`url(#${baseId})`} stroke={tone.edge} strokeWidth="2.1" />
          <rect x="88" y="172" width="84" height="19" rx="5" fill={`url(#${baseId})`} stroke={tone.edge} strokeWidth="2.1" />

          <rect x="108" y="83" width="44" height="25" rx="12.5" fill="#ffffff" fillOpacity="0.11" stroke="#ffffff" strokeOpacity="0.22" />
          <circle cx="130" cy="95.5" r="6" fill={`url(#${rimId})`} opacity="0.93" />
        </g>
      </svg>
    );
  };

  return (
    <section className="mt-10 rounded-[28px] border border-[#6f5245] bg-[radial-gradient(circle_at_50%_0%,rgba(140,50,37,0.28)_0%,rgba(42,17,24,0.94)_42%,rgba(19,11,18,0.99)_100%)] px-4 pb-5 pt-7 shadow-[0_26px_72px_rgba(0,0,0,0.58)] sm:px-6 sm:pb-7 sm:pt-8">
      <div className="-mx-4 -mt-7 mb-6 overflow-hidden rounded-t-[28px] border-b border-[#8d3436] bg-[linear-gradient(90deg,#32040b_0%,#5a0b15_12%,#8f1825_28%,#cf3544_50%,#8f1825_72%,#5a0b15_88%,#32040b_100%)] shadow-[0_10px_26px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,220,220,0.14),inset_0_22px_34px_rgba(255,150,150,0.12)] sm:-mx-6 sm:-mt-8 sm:mb-8">
        <div className="flex min-h-[4.75rem] flex-wrap items-center justify-center gap-3 px-4 text-center sm:min-h-[5.25rem] sm:gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#f8fbff] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.85)]" />
            LIVE MRR
          </span>
          <h3 className="text-[clamp(1.22rem,2vw,1.95rem)] font-black uppercase tracking-[0.01em] text-[#fff8f4]">
            TOP RealMRR STARTUP WINNERS
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end sm:gap-4 lg:gap-6">
        {podium.map(({ position, startup }) => (
          <article
            key={`${position}-${startup.startup}`}
            className={`flex h-full w-full flex-col items-center justify-end ${position === 1 ? "lg:-translate-y-2" : ""}`}
          >
            <div className={`mb-1 h-20 w-24 sm:h-28 sm:w-36 lg:mb-2 lg:h-32 lg:w-40 ${position === 1 ? "sm:h-32 sm:w-40 lg:h-36 lg:w-44" : ""}`}>
              <RoyalCup position={position} />
            </div>

            <p className="mb-4 max-w-[12ch] text-center text-[clamp(1.24rem,1.95vw,2.28rem)] font-black leading-[0.95] tracking-[-0.025em] text-[#fff8ef] [text-shadow:0_4px_18px_rgba(0,0,0,0.42)]">
              {startup.startup}
            </p>

            <div className={`relative mx-auto h-[13.2rem] w-full overflow-hidden rounded-[22px] p-[3.5px] ${position === 1 ? "max-w-[20.5rem] sm:h-[16.6rem] lg:h-[18.6rem]" : "max-w-[19rem] sm:h-[14.2rem] lg:h-[15.8rem]"} ${podiumFrameTone[position]}`}>
              <div className={`relative h-full w-full overflow-hidden rounded-[18px] ${podiumTone[position]}`}>
              <div className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,rgba(255,223,176,0.32)_0%,rgba(255,223,176,0)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[linear-gradient(90deg,rgba(247,196,112,0)_0%,rgba(247,196,112,0.9)_50%,rgba(247,196,112,0)_100%)]" />

              <div className="relative z-10 flex h-full w-full items-center justify-center px-3 py-3 sm:px-4 sm:py-4 lg:py-5">
                {position === 1 ? (
                  <div className="mx-auto flex h-full min-h-0 w-[92%] max-w-[18.6rem] flex-col items-center px-4 pb-4 pt-6 text-center sm:pt-8 lg:pt-10">
                    <div className="mt-2 flex items-start justify-center leading-none text-[#fff2bc]">
                      <span className="text-[clamp(3.15rem,5.7vw,4.3rem)] font-black">{position}</span>
                      <sup className="ml-1 pt-2 text-[clamp(1.28rem,2.02vw,1.78rem)] font-black lowercase">{suffixes[position]}</sup>
                    </div>
                    <span className="mt-2 text-[clamp(0.98rem,1.62vw,1.48rem)] font-black tracking-[0.04em] text-[#fff2bc]">POSITION</span>
                    <div className="mt-auto flex w-full items-center justify-center pt-4">
                      <div className="mx-auto inline-flex w-[82%] max-w-[15.5rem] items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_100%)] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(0,0,0,0.1)] backdrop-blur-md">
                        <AutoFitPillValue                           value={startup.mrr}                           minSizePx={15}                           maxSizePx={34}                           laptopMinSizePx={21}                           laptopMaxSizePx={44}                           className="whitespace-nowrap text-center font-black leading-none tracking-[-0.01em] bg-[linear-gradient(180deg,#22c55e_0%,#16a34a_45%,#15803d_100%)] bg-clip-text text-transparent"                         />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center pt-4 text-center sm:pt-6 lg:pt-8">
                    <div className={`mt-2 flex items-start justify-center leading-none ${podiumTextTone[position]}`}>
                      <span className="text-[clamp(2.95rem,5.05vw,4rem)] font-black">{position}</span>
                      <sup className="ml-1 pt-2 text-[clamp(1.12rem,1.82vw,1.62rem)] font-black lowercase">{suffixes[position]}</sup>
                    </div>
                    <span className={`text-[clamp(0.88rem,1.42vw,1.26rem)] font-black tracking-[0.04em] ${podiumTextTone[position]}`}>POSITION</span>
                    <div className="mt-auto flex w-full items-center justify-center pt-4">
                      <div className="mx-auto inline-flex w-[82%] max-w-[15.5rem] items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_100%)] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(0,0,0,0.1)] backdrop-blur-md">
                        <AutoFitPillValue                           value={startup.mrr}                           minSizePx={13}                           maxSizePx={28}                           className="whitespace-nowrap text-center font-black leading-none tracking-[-0.01em] bg-[linear-gradient(180deg,#22c55e_0%,#16a34a_45%,#15803d_100%)] bg-clip-text text-transparent"                         />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Section({ title, items, onSelectStartup }) {
  const rowRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false, lastDragAt: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    const el = rowRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items]);

  const scrollByCards = (direction) => {
    if (!rowRef.current) return;
    const amount = Math.max(220, Math.floor(rowRef.current.clientWidth * 0.72));
    rowRef.current.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 || !rowRef.current) return;
    dragRef.current.active = true;
    dragRef.current.moved = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startScrollLeft = rowRef.current.scrollLeft;
    rowRef.current.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active || !rowRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 6) dragRef.current.moved = true;
    rowRef.current.scrollLeft = dragRef.current.startScrollLeft - delta;
  };

  const onPointerUp = (e) => {
    if (!dragRef.current.active || !rowRef.current) return;
    if (dragRef.current.moved) dragRef.current.lastDragAt = Date.now();
    dragRef.current.active = false;
    rowRef.current.releasePointerCapture?.(e.pointerId);
  };

  const handleSelect = (item) => {
    if (Date.now() - dragRef.current.lastDragAt < 140) return;
    onSelectStartup?.(item);
  };

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 rounded-md bg-[#1a1f2a] px-3 py-1 text-[clamp(1.05rem,1.2vw,1.3rem)] font-semibold text-[#f4f7ff] shadow-[inset_0_0_0_1px_#2c3b57]">{title}</h3>
        <a href="#" className="text-xs text-gray-300 hover:text-white">View all ›</a>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={rowRef}
          className="hide-scrollbar flex cursor-grab select-none gap-3 overflow-x-auto pr-10 active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onDragStart={(e) => e.preventDefault()}
        >
          {items.map((item) => (
            <StartupCard key={item.name} item={item} onSelect={handleSelect} />
          ))}
        </div>

        {canScrollLeft ? (
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollByCards(-1)}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#4e5a74] bg-[#1e2638]/45 p-2 text-[#dbe7ff] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-[#27314a]/65"
          >
            <ChevronLeft size={15} />
          </button>
        ) : null}

        {canScrollRight ? (
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollByCards(1)}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#4e5a74] bg-[#1e2638]/45 p-2 text-[#dbe7ff] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-[#27314a]/65"
          >
            <ChevronRight size={15} />
          </button>
        ) : null}
      </div>
    </section>
  );
}


export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("realmrr-theme") || "dark");
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isAddStartupPage, setIsAddStartupPage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#add-startup" : false
  );
  const [isAdvertisePage, setIsAdvertisePage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#advertise" : false
  );
  const [isSellStartupPage, setIsSellStartupPage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#sell-startups" : false
  );
  const [isAcquireStartupsPage, setIsAcquireStartupsPage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#acquire-startups" : false
  );
  const isLight = theme === "light";

  useEffect(() => {
    localStorage.setItem("realmrr-theme", theme);
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";
  }, [theme, isLight]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      setIsAddStartupPage(hash === "#add-startup");
      setIsAdvertisePage(hash === "#advertise");
      setIsSellStartupPage(hash === "#sell-startups");
      setIsAcquireStartupsPage(hash === "#acquire-startups");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const byName = useMemo(() => new Map(leaderboard.map((row) => [row.startup.toLowerCase(), row])), []);
  const profile = useMemo(
    () => (selectedStartup ? buildStartupProfile(selectedStartup, byName) : null),
    [selectedStartup, byName]
  );

  const relatedStartups = useMemo(() => {
    const pool = [...recentlyListed, ...bestDeals];
    if (!selectedStartup) return pool.slice(0, 6);
    return pool.filter((entry) => entry.name !== selectedStartup.name).slice(0, 6);
  }, [selectedStartup]);

  const openStartup = (startup) => {
    setSelectedCategory(null);
    setIsAddStartupPage(false);
    setIsAdvertisePage(false);
    setIsSellStartupPage(false);
    setIsAcquireStartupsPage(false);
    setSelectedStartup(startup);
  };

  const openAdvertisePage = () => {
    setSelectedStartup(null);
    setSelectedCategory(null);
    setIsAddStartupPage(false);
    setIsSellStartupPage(false);
    setIsAcquireStartupsPage(false);
    setIsAdvertisePage(true);
    window.location.hash = "advertise";
  };

  const openAcquireStartupsPage = () => {
    setSelectedStartup(null);
    setSelectedCategory(null);
    setIsAddStartupPage(false);
    setIsAdvertisePage(false);
    setIsSellStartupPage(false);
    setIsAcquireStartupsPage(true);
    window.location.hash = "acquire-startups";
  };


  const openSellStartupPage = () => {
    setSelectedStartup(null);
    setSelectedCategory(null);
    setIsAddStartupPage(false);
    setIsAdvertisePage(false);
    setIsAcquireStartupsPage(false);
    setIsSellStartupPage(true);
    window.location.hash = "sell-startups";
  };
  const sponsorTileCount = leftFeatures.length + rightFeatures.length;
  const [activeSponsorTile, setActiveSponsorTile] = useState(0);
  const [sponsorFlipStep, setSponsorFlipStep] = useState(0);

  useEffect(() => {
    setActiveSponsorTile(0);
    setSponsorFlipStep((prev) => prev + 1);

    const interval = setInterval(() => {
      setActiveSponsorTile((prev) => (prev + 1) % sponsorTileCount);
      setSponsorFlipStep((prev) => prev + 1);
    }, 1300);

    return () => clearInterval(interval);
  }, [sponsorTileCount]);

  const allStartupCards = useMemo(() => {
    const listRows = leaderboard.slice(0, 60).map((row) => ({
      logo: row.startup.slice(0, 2).toUpperCase(),
      name: row.startup,
      niche: row.startupTag,
      revenue: row.mrr,
      price: row.mrr,
      multiple: row.growthPct,
      founder: row.founder,
      category: row.category,
      anonymous: row.anonymous,
    }));

    return [...recentlyListed, ...bestDeals, ...listRows].map((item) => ({
      ...item,
      category: item.category || "SaaS",
    }));
  }, []);

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return allStartupCards
      .filter((item) => item.category === selectedCategory)
      .slice(0, 24);
  }, [allStartupCards, selectedCategory]);
  return (
    <div className={`${isLight ? "bg-[#f4f7fb] text-[#0f172a]" : "bg-[#050608] text-gray-100"} min-h-screen lg:h-screen lg:overflow-hidden transition-colors duration-300`}>
      <div className="mx-auto max-w-[min(1920px,96vw)] px-4 pb-10 pt-6 lg:h-full lg:pt-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:h-full lg:grid-cols-[clamp(180px,16vw,260px)_minmax(0,1fr)_clamp(180px,16vw,260px)]">
          <aside className="order-2 grid gap-2 sm:grid-cols-2 lg:order-1 lg:sticky lg:top-2 lg:max-h-[calc(100vh-1rem)] lg:grid-cols-1 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 hide-scrollbar">
            <div className="sm:col-span-2 lg:col-span-1">
                <p className={`rounded-xl border px-3 py-2 text-center text-[10px] font-semibold tracking-[0.08em] shadow-[inset_0_0_0_1px_rgba(151,187,245,0.12)] ${isLight ? "border-[#cbd5e1] bg-[linear-gradient(110deg,rgba(250,252,255,0.95)_0%,rgba(236,242,250,0.98)_100%)] text-[#334155]" : "border-[#3b4f74]/80 bg-[linear-gradient(110deg,rgba(22,33,52,0.85)_0%,rgba(13,22,36,0.88)_100%)] text-[#9fbef0]"}`}>
                  SPONSORS OF THE DAY
                </p>
              </div>
            {leftFeatures.map((feature, index) => (
              <SidebarCard
                key={feature.title}
                title={feature.title}
                desc={feature.desc}
                tone={feature.tone}
                icon={feature.icon}
                rotations={feature.rotations}
                disableAutoFlip
                flipSignal={activeSponsorTile === index ? sponsorFlipStep : undefined}
                onSelect={(entry) => openStartup(entry)}
              />
            ))}
          </aside>

          <main className="order-1 min-w-0 lg:order-2 lg:h-[calc(100vh-2.5rem)] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
            <TopNav
              isLight={isLight}
              isNavMenuOpen={isNavMenuOpen}
              setIsNavMenuOpen={setIsNavMenuOpen}
              setTheme={setTheme}
              onHome={() => {
                window.history.pushState("", document.title, window.location.pathname + window.location.search);
                setSelectedStartup(null);
                setSelectedCategory(null);
                setIsAddStartupPage(false);
                setIsAdvertisePage(false);
                setIsSellStartupPage(false);
                setIsAcquireStartupsPage(false);
              }}
              onAdd={() => {
                setSelectedStartup(null);
                setSelectedCategory(null);
                setIsAdvertisePage(false);
                setIsSellStartupPage(false);
                setIsAcquireStartupsPage(false);
                setIsAddStartupPage(true);
                window.location.hash = "add-startup";
              }}
              onAcquire={() => {
                setSelectedStartup(null);
                setSelectedCategory(null);
                setIsAddStartupPage(false);
                setIsAdvertisePage(false);
                setIsSellStartupPage(false);
                setIsAcquireStartupsPage(true);
                window.location.hash = "acquire-startups";
              }}
              onSell={() => {
                setSelectedStartup(null);
                setSelectedCategory(null);
                setIsAddStartupPage(false);
                setIsAdvertisePage(false);
                setIsAcquireStartupsPage(false);
                setIsSellStartupPage(true);
                window.location.hash = "sell-startups";
              }}
              onAdvertise={() => {
                setSelectedStartup(null);
                setSelectedCategory(null);
                setIsAddStartupPage(false);
                setIsSellStartupPage(false);
                setIsAcquireStartupsPage(false);
                setIsAdvertisePage(true);
                window.location.hash = "advertise";
              }}
            />
            {isAddStartupPage ? (
              <AddStartupPage
                onClose={() => {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  setIsAddStartupPage(false);
                }}
              />
            ) : isAdvertisePage ? (
              <AdvertisePage
                onClose={() => {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  setIsAdvertisePage(false);
                }}
              />
                        ) : isSellStartupPage ? (
              <SellStartupsPage
                onClose={() => {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  setIsSellStartupPage(false);
                }}
              />
            ) : isAcquireStartupsPage ? (
              <AcquireStartupsPage
                listings={allStartupCards}
                onSelectStartup={openStartup}
                onClose={() => {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  setIsAcquireStartupsPage(false);
                }}
              />
            ) : profile ? (
              <StartupDetail
                profile={profile}
                onBack={() => setSelectedStartup(null)}
                recommendations={relatedStartups}
                onSelectStartup={openStartup}
              />
            ) : selectedCategory ? (
              <CategoryResults
                category={selectedCategory}
                items={categoryItems}
                onBack={() => setSelectedCategory(null)}
                onSelectStartup={openStartup}
              />
            ) : (
              <>
                <section className="relative pb-5 pt-4 text-center sm:pt-8 lg:pt-10">
<h1 className={`${isLight ? "text-[#0f172a]" : "text-gray-100"} mx-auto mt-4 max-w-[min(1200px,90vw)] text-[clamp(1.68rem,3.2vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.02em]`}>
                    <span className="block">Use this platform as social proof</span>
                    <span className="block">to showcase your</span>
                    <span className="block">
                      RealMRR
                    </span>
                  </h1>
                  <div className="mx-auto mt-4 flex max-w-[min(1200px,90vw)] flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <p className={`text-[clamp(1.1rem,1.5vw,1.45rem)] font-semibold ${isLight ? "text-[#334155]" : "text-[#9fb7dd]"}`}>
                      Prove your Revenue publicly & Flex {"\u{1F609}"}
                    </p>
                    <span className={`text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold ${isLight ? "text-[#3b82f6]" : "text-[#7fb6ff]"}`}>{"\u2192"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStartup(null);
                        setSelectedCategory(null);
                        setIsAdvertisePage(false);
                        setIsSellStartupPage(false);
                        setIsAcquireStartupsPage(false);
                        setIsAddStartupPage(true);
                        window.location.hash = "add-startup";
                      }}
                      className="animated-outline-button relative shrink-0 overflow-hidden rounded-xl border border-white/40 bg-[linear-gradient(120deg,#88deff_0%,#3d86ff_48%,#6c54ff_100%)] px-6 py-2.5 text-[clamp(0.9rem,0.94vw,0.98rem)] font-semibold text-white ring-1 ring-white/50 shadow-[0_0_0_1px_rgba(255,255,255,0.28),0_0_14px_rgba(156,205,255,0.4),0_8px_18px_rgba(66,116,255,0.3)] transition duration-200 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.36),0_0_18px_rgba(171,217,255,0.55),0_12px_22px_rgba(86,101,255,0.4)]"
                    >
                      <span className="relative z-10">+ Add startup</span>
                    </button>
                  </div>
                </section>
                <PodiumSection rows={leaderboard} />
                <section className="mt-6">
                  <div className="mx-auto flex w-full max-w-[min(1400px,92vw)] flex-wrap items-center justify-between gap-3 rounded-[26px] border border-[#3b5075]/85 bg-[linear-gradient(130deg,rgba(10,16,28,0.92)_0%,rgba(8,13,24,0.96)_100%)] px-5 py-4 shadow-[0_0_0_1px_rgba(141,173,230,0.24),0_22px_54px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(201,221,255,0.15)] backdrop-blur-xl sm:flex-nowrap">
                    <div className="inline-flex items-center gap-3 text-[clamp(1.45rem,1.8vw,2rem)] font-bold">
                      <CheckCircle2 className="text-[#22c55e]" size={36} strokeWidth={2.5} />
                      <span className={isLight ? "text-[#1f2937]" : "text-gray-300"}>RealMRR</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={openAcquireStartupsPage}
                        className="group relative overflow-hidden rounded-[22px] border border-[#bcecff]/85 bg-[linear-gradient(120deg,#1cb2ff_0%,#3d7dff_50%,#34d7c8_100%)] px-8 py-3 text-[clamp(1rem,1.08vw,1.14rem)] font-extrabold text-white shadow-[0_0_0_1px_rgba(142,222,255,0.45),0_6px_18px_rgba(58,160,255,0.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                      >
                        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.38)_0%,transparent_55%)] opacity-80" />
                        <span className="relative">Acquire/Buy Startups</span>
                      </button>

                      <button
                        type="button"
                        onClick={openSellStartupPage}
                        className="group relative overflow-hidden rounded-[22px] border border-[#ffd7b8]/85 bg-[linear-gradient(120deg,#ff9a7a_0%,#ec5bb8_48%,#8f55ff_100%)] px-8 py-3 text-[clamp(1rem,1.08vw,1.14rem)] font-extrabold text-white shadow-[0_0_0_1px_rgba(255,183,140,0.4),0_6px_18px_rgba(215,88,175,0.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                      >
                        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35)_0%,transparent_58%)] opacity-85" />
                        <span className="relative">Sell Your Startup</span>
                      </button>
                    </div>
                  </div>
                </section>
                <LeaderboardTable rows={leaderboard} onSelectStartup={openStartup} />
                <div id="home-marketplace">
                  <Section title="Recently listed" items={recentlyListed} onSelectStartup={openStartup} />
                </div>
                <Section title="Best deals this week" items={bestDeals} onSelectStartup={openStartup} />
              </>
            )}

            <DirectoryFooter
              isLight={isLight}
              theme={theme}
              setTheme={setTheme}
              activeCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedStartup(null);
                setIsAddStartupPage(false);
                setIsAdvertisePage(false);
                setIsSellStartupPage(false);
                setIsAcquireStartupsPage(false);
                setSelectedCategory(category);
              }}
            />
          </main>

          <aside className="order-3 grid gap-2 sm:grid-cols-2 lg:sticky lg:top-2 lg:max-h-[calc(100vh-1rem)] lg:grid-cols-1 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 hide-scrollbar">
            <div className="sm:col-span-2 lg:col-span-1">
                <p className={`rounded-xl border px-3 py-2 text-center text-[10px] font-semibold tracking-[0.08em] shadow-[inset_0_0_0_1px_rgba(151,187,245,0.12)] ${isLight ? "border-[#cbd5e1] bg-[linear-gradient(110deg,rgba(250,252,255,0.95)_0%,rgba(236,242,250,0.98)_100%)] text-[#334155]" : "border-[#3b4f74]/80 bg-[linear-gradient(110deg,rgba(22,33,52,0.85)_0%,rgba(13,22,36,0.88)_100%)] text-[#9fbef0]"}`}>
                  SPONSORS OF THE DAY
                </p>
              </div>
            {rightFeatures.map((feature, index) => (
              <SidebarCard
                key={feature.title}
                title={feature.title}
                desc={feature.desc}
                tone={feature.tone}
                icon={feature.icon}
                rotations={feature.rotations}
                disableAutoFlip
                flipSignal={activeSponsorTile === leftFeatures.length + index ? sponsorFlipStep : undefined}
                onSelect={(entry) => openStartup(entry)}
              />
            ))}
            <SidebarCard advertise onAdvertise={openAdvertisePage} />
          </aside>
        </div>
      </div>

      
    </div>
  );
}


























































