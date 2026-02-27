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
            <h3 className="text-[clamp(1.85rem,2.2vw,2.15rem)] font-bold tracking-[-0.02em] text-[#f3f5fa]">Add Your Startup</h3>
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
            <p className="max-w-[640px] rounded-xl border border-[#3e4a63] bg-[linear-gradient(135deg,rgba(52,66,95,0.28)_0%,rgba(37,45,63,0.38)_100%)] px-4 py-3 text-[clamp(1rem,1.02vw,1.1rem)] leading-relaxed text-gray-200 shadow-[inset_0_0_0_1px_rgba(130,156,206,0.08)]">
              Showcase your verified revenue to <span className="text-[1.08em] font-semibold text-[#7fd0ff]">120,000+ monthly visitors</span> and get a
              <span className="text-[1.08em] font-semibold text-[#7fd0ff]"> 54+ DR dofollow backlink</span>
            </p>
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

            <label className="inline-flex items-center gap-2.5 text-[clamp(1rem,1.04vw,1.1rem)] text-gray-200">
              <input
                type="checkbox"
                checked={anonymousMode}
                onChange={(event) => setAnonymousMode(event.target.checked)}
                className="h-4 w-4 rounded border border-[#5b606b] bg-[#23262d]"
              />
              <span>Anonymous mode</span>
            </label>
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
              <div className="flex items-center gap-2.5">
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
  const [isAddStartupPage, setIsAddStartupPage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#add-startup" : false
  );
  const [isAdvertisePage, setIsAdvertisePage] = useState(() =>
    typeof window !== "undefined" ? window.location.hash === "#advertise" : false
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
    setSelectedStartup(startup);
  };

  const openAdvertisePage = () => {
    setSelectedStartup(null);
    setSelectedCategory(null);
    setIsAddStartupPage(false);
    setIsAdvertisePage(true);
    window.location.hash = "advertise";
  };

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
      <div className="mx-auto max-w-[1720px] px-4 pb-10 pt-6 lg:h-full lg:pt-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:h-full lg:grid-cols-[180px_minmax(0,1fr)_180px] xl:grid-cols-[200px_minmax(0,1fr)_200px]">
          <aside className="order-2 grid gap-2.5 sm:grid-cols-2 lg:order-1 lg:sticky lg:top-2 lg:max-h-[calc(100vh-1rem)] lg:grid-cols-1 lg:overflow-hidden">
            {leftFeatures.map((feature) => (
              <SidebarCard
                key={feature.title}
                title={feature.title}
                desc={feature.desc}
                tone={feature.tone}
                icon={feature.icon}
                rotations={feature.rotations}
                onSelect={(entry) => openStartup(entry)}
              />
            ))}
          </aside>

          <main className="order-1 min-w-0 lg:order-2 lg:h-[calc(100vh-2.5rem)] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
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
                <section className="pb-5 pt-4 text-center sm:pt-8 lg:pt-10">
                  <div className="inline-flex items-center gap-2 text-[clamp(1.45rem,1.7vw,1.9rem)] font-bold">
                    <CheckCircle2 className="text-[#22c55e]" size={38} strokeWidth={2.5} />
                    <span className={isLight ? "text-[#1f2937]" : "text-gray-300"}>RealMRR</span>
                  </div>

                  <h1 className={`${isLight ? "text-[#0f172a]" : "text-gray-100"} mx-auto mt-4 max-w-[980px] text-[clamp(1.95rem,3.9vw,3.35rem)] font-bold leading-[1.08] tracking-[-0.02em]`}>
                    The database of verified startup revenues
                  </h1>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:flex-nowrap">
                    <label className={`${isLight ? "border-[#ced6e1] bg-[#ffffffcc]" : "border-[#2d2d2d] bg-[#1b1b1bd9]"} flex w-[min(62vw,460px)] min-w-[240px] items-center gap-2 rounded-xl border px-3.5 py-0.5 backdrop-blur-md`}>
                      <Search size={16} className="text-gray-500" />
                      <input
                        className={`${isLight ? "text-[#111827]" : "text-gray-100"} w-full border-0 bg-transparent py-2.5 text-[clamp(0.88rem,0.92vw,0.98rem)] outline-none`}
                        placeholder='"SaaS over $10K/mo"'
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStartup(null);
                        setSelectedCategory(null);
                        setIsAdvertisePage(false);
                        setIsAddStartupPage(true);
                        window.location.hash = "add-startup";
                      }}
                      className="relative shrink-0 overflow-hidden rounded-xl border border-white/95 bg-[linear-gradient(120deg,#88deff_0%,#3d86ff_48%,#6c54ff_100%)] px-6 py-2.5 text-[clamp(0.9rem,0.94vw,0.98rem)] font-semibold text-white ring-1 ring-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_26px_rgba(156,205,255,0.65),0_12px_30px_rgba(66,116,255,0.45)] transition duration-200 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_0_34px_rgba(171,217,255,0.8),0_16px_36px_rgba(86,101,255,0.55)] animate-[pulse_2.4s_ease-in-out_infinite]"
                    >
                      + Add startup
                    </button>
                  </div>

                  <nav className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {["New", "Stats", "Acquisition", "Co-founders", "$1 vs $1,000,000"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="rounded-full border border-[#32405d] bg-[#141d2d]/65 px-3.5 py-1.5 text-[clamp(0.82rem,0.9vw,0.92rem)] text-[#b5c3df] transition hover:border-[#4f74bc] hover:text-[#dbe8ff]"
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </section>

                <Section title="Recently listed" items={recentlyListed} onSelectStartup={openStartup} />
                <Section title="Best deals this week" items={bestDeals} onSelectStartup={openStartup} />
                <LeaderboardTable rows={leaderboard} onSelectStartup={openStartup} />
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
                setSelectedCategory(category);
              }}
            />
          </main>

          <aside className="order-3 grid gap-2.5 sm:grid-cols-2 lg:sticky lg:top-2 lg:max-h-[calc(100vh-1rem)] lg:grid-cols-1 lg:overflow-hidden">
            {rightFeatures.map((feature) => (
              <SidebarCard
                key={feature.title}
                title={feature.title}
                desc={feature.desc}
                tone={feature.tone}
                icon={feature.icon}
                rotations={feature.rotations}
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









































































