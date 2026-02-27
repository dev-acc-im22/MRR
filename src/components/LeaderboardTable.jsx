import { ArrowDown, ArrowUp, Check, ChevronDown, Medal, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function SelectPill({ id, value, options, isOpen, onToggle, onSelect, minWidth = 118 }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="inline-flex items-center justify-between rounded-xl border border-[#3a3d46] bg-[#1f2026] px-3.5 py-2 text-xs text-gray-200"
        style={{ minWidth }}
      >
        <span>{value}</span>
        <ChevronDown size={13} className="text-gray-500" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-20 max-h-56 min-w-full overflow-y-auto rounded-xl border border-[#313644] bg-[#171a22] p-1 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-200 transition hover:bg-[#222a38]"
            >
              <span className="truncate">{option}</span>
              {value === option ? <Check size={12} className="shrink-0 text-[#a8c6ff]" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank <= 3) {
    const tone = rank === 1 ? "text-amber-300" : rank === 2 ? "text-slate-300" : "text-orange-300";
    return (
      <span className={`inline-flex items-center ${tone}`}>
        <Medal size={18} />
      </span>
    );
  }
  return <span className="text-[15px] font-semibold text-gray-200">{rank}</span>;
}

function Trend({ growth, growthPct }) {
  if (growth === "up") {
    return (
      <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap text-emerald-400">
        <ArrowUp size={18} />
        <span className="text-[11px] font-semibold">{growthPct}</span>
      </span>
    );
  }
  if (growth === "down") {
    return (
      <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap text-rose-400">
        <ArrowDown size={18} />
        <span className="text-[11px] font-semibold">{growthPct}</span>
      </span>
    );
  }
  return <span className="text-[11px] font-semibold text-gray-500">{growthPct || "0%"}</span>;
}

function InitialChip({ text }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-content-center rounded-full border border-[#36507b] bg-[#21304a] text-[10px] font-semibold text-[#c3d8ff]">
      {text}
    </span>
  );
}

function SponsoredRow({ index }) {
  return (
    <tr>
      <td colSpan={5} className="border-b border-[#222] px-0 py-0">
        <div className="mx-2 my-3 rounded-xl border border-[#343434] bg-[linear-gradient(180deg,#252525_0%,#202020_100%)] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold text-[#f2f2f2]">
              DataFast <span className="text-gray-400">| SPONSORED #{index}</span>
            </div>
            <X size={14} className="text-gray-400" />
          </div>
          <div className="text-[11px] text-gray-300">
            144 visitors on <span className="font-semibold text-white">realmrr.com</span> (est. value: <span className="text-emerald-400">$20</span>)
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-gray-300">
            <span className="rounded-md bg-[#2a2a2a] px-2 py-1">Direct (68)</span>
            <span className="rounded-md bg-[#2a2a2a] px-2 py-1">Google (22)</span>
            <span className="rounded-md bg-[#2a2a2a] px-2 py-1">Facebook (17)</span>
            <span className="rounded-md bg-[#2a2a2a] px-2 py-1">Desktop (82)</span>
            <span className="rounded-md bg-[#2a2a2a] px-2 py-1">Mobile (62)</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function parseMoney(value) {
  const numeric = Number(String(value || "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getGrowthValue(row) {
  const pct = Number.parseFloat(String(row.growthPct || "0").replace("%", ""));
  const safePct = Number.isFinite(pct) ? pct : 0;
  if (row.growth === "down") return -safePct;
  if (row.growth === "up") return safePct;
  return 0;
}

export default function LeaderboardTable({ rows, onSelectStartup }) {
  const [metric, setMetric] = useState("MRR");
  const [period, setPeriod] = useState("All time");
  const [category, setCategory] = useState("All categories");
  const [openMenu, setOpenMenu] = useState(null);
  const filterRef = useRef(null);

  const categoryOptions = useMemo(() => {
    const values = new Set(rows.map((row) => row.category || "SaaS"));
    return ["All categories", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [rows]);

  const preparedRows = useMemo(() => {
    const categoryScoped = category === "All categories"
      ? rows
      : rows.filter((row) => (row.category || "SaaS") === category);

    const adjusted = categoryScoped.map((row) => {
      const growthValue = getGrowthValue(row);
      const baseMrr = parseMoney(row.mrr);
      const periodFactor = period === "Last 30 days" ? 1 + growthValue / 200 : 1;
      const computedMrr = Math.max(0, baseMrr * periodFactor);

      return {
        ...row,
        computedMrr,
        computedMrrLabel: formatMoney(computedMrr),
        growthValue,
      };
    });

    adjusted.sort((a, b) => {
      if (metric === "Growth") {
        if (b.growthValue !== a.growthValue) return b.growthValue - a.growthValue;
      }
      return b.computedMrr - a.computedMrr;
    });

    return adjusted.map((row, index) => ({ ...row, rank: index + 1 }));
  }, [rows, category, period, metric]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!filterRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <section className="mt-12 rounded-2xl border border-[#2a2a2a] bg-[#141414] px-6 py-5 shadow-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[clamp(1.1rem,1.25vw,1.35rem)] font-bold text-gray-100">Leaderboard</h3>
        <div ref={filterRef} className="flex flex-wrap gap-2">
          <SelectPill
            id="metric"
            value={metric}
            options={["MRR", "Growth"]}
            isOpen={openMenu === "metric"}
            onToggle={(id) => setOpenMenu((prev) => (prev === id ? null : id))}
            onSelect={(value) => {
              setMetric(value);
              setOpenMenu(null);
            }}
          />
          <SelectPill
            id="period"
            value={period}
            options={["All time", "Last 30 days"]}
            isOpen={openMenu === "period"}
            onToggle={(id) => setOpenMenu((prev) => (prev === id ? null : id))}
            onSelect={(value) => {
              setPeriod(value);
              setOpenMenu(null);
            }}
            minWidth={126}
          />
          <SelectPill
            id="category"
            value={category}
            options={categoryOptions}
            isOpen={openMenu === "category"}
            onToggle={(id) => setOpenMenu((prev) => (prev === id ? null : id))}
            onSelect={(value) => {
              setCategory(value);
              setOpenMenu(null);
            }}
            minWidth={138}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[42%]" />
            <col className="w-[23%]" />
            <col className="w-[18%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="bg-[linear-gradient(90deg,#242a37_0%,#1e2430_45%,#25202c_100%)]">
              <th className="border-b border-[#3a4257] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">#</th>
              <th className="border-b border-[#3a4257] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">Startup</th>
              <th className="border-b border-[#3a4257] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">Founder</th>
              <th className="border-b border-[#3a4257] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-300">MRR</th>
              <th className="whitespace-nowrap border-b border-[#3a4257] px-2.5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-300">MoM</th>
            </tr>
          </thead>
          <tbody>
            {preparedRows.flatMap((row, idx) => {
              const isTop3 = row.rank <= 3;
              const rowClass = isTop3 ? "bg-[linear-gradient(90deg,#1b212f_0%,#191d27_100%)] shadow-[inset_3px_0_0_#7aa2ff]" : "";

              const items = [
                <tr key={`row-${row.rank}`} className={rowClass}>
                  <td className="border-b border-[#222] px-3 py-3.5 align-middle"><RankBadge rank={row.rank} /></td>
                  <td className="border-b border-[#222] px-3 py-3.5 align-middle">
                    <button
                      type="button"
                      onClick={() => onSelectStartup?.({ ...row, name: row.startup, niche: row.startupTag, category: row.category })}
                      className="flex min-w-0 w-full items-center gap-2.5 rounded-lg text-left transition hover:bg-[#1a2230]/45"
                    >
                      <InitialChip text={row.startup.slice(0, 2).toUpperCase()} />
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-2">
                          <p className={`truncate ${isTop3 ? "text-[14px]" : "text-[13px]"} font-semibold text-gray-100`}>{row.startup}</p>
                          <span className="shrink-0 rounded-full border border-[#35548a] bg-[#182844] px-1.5 py-[2px] text-[9px] font-semibold text-[#9fc2ff]">
                            {row.category || "SaaS"}
                          </span>
                          {row.forSale ? (
                            <span className="shrink-0 rounded-md bg-[#f3a30f] px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.03em] text-[#2b1f02]">
                              FOR SALE
                            </span>
                          ) : null}
                        </div>
                        <p className={`truncate ${isTop3 ? "text-[12px]" : "text-[11px]"} text-gray-400`}>{row.startupTag}</p>
                      </div>
                    </button>
                  </td>
                  <td className="border-b border-[#222] px-3 py-3.5 align-middle">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <InitialChip text={row.founderInitial} />
                      <span className="truncate text-[12px] text-gray-200">{row.founder}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap border-b border-[#222] px-3 py-3.5 text-right text-[14px] font-semibold text-gray-100">{row.computedMrrLabel}</td>
                  <td className="border-b border-[#222] px-2.5 py-3.5 text-right"><Trend growth={row.growth} growthPct={row.growthPct} /></td>
                </tr>,
              ];

              if ((idx + 1) % 10 === 0 && idx < preparedRows.length - 1) {
                items.push(<SponsoredRow key={`ad-${idx + 1}`} index={(idx + 1) / 10} />);
              }

              return items;
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400">
        <ShieldCheck size={14} className="text-gray-500" />
        <span>All revenue is verified through Stripe/LemonSqueezy/Polar API keys. Data updates hourly.</span>
      </div>
    </section>
  );
}
