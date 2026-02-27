import {
  BadgeCheck,
  Box,
  Bug,
  ChartColumnIncreasing,
  Cloud,
  Dot,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const iconMap = {
  spark: Sparkles,
  trend: TrendingUp,
  dot: Dot,
  cloud: Cloud,
  bug: Bug,
  box: Box,
  bars: ChartColumnIncreasing,
  seed: BadgeCheck,
  shield: Shield,
};

function TileFace({ tone, entry }) {
  const Icon = iconMap[entry.icon] || Box;

  return (
    <article className={`min-h-[74px] overflow-hidden rounded-xl border p-2.5 shadow-panel ${tone}`}>
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-content-center rounded-full border border-white/20 bg-black/15">
          <Icon size={14} strokeWidth={1.7} className="text-blue-300" />
        </span>
        <h4 className="truncate text-[12px] font-bold leading-none tracking-tight text-gray-100">{entry.title}</h4>
      </div>
      <p className="mt-1 truncate text-[8px] leading-[1.2] text-gray-400">{entry.desc}</p>
    </article>
  );
}

export default function SidebarCard({
  title,
  desc,
  advertise = false,
  tone = "bg-card border-line",
  icon = "box",
  rotations = [],
  onSelect,
  onAdvertise,
}) {
  if (advertise) {
    return (
      <button
        type="button"
        onClick={onAdvertise}
        className="grid min-h-[108px] w-full place-content-center gap-1 rounded-xl border border-dashed border-[#2a2a2a] bg-[#0e0e0e] text-center text-gray-500 shadow-panel transition hover:border-[#3e4d72] hover:bg-[#121722]"
      >
        <strong className="text-[10px] text-gray-300">Advertise</strong>
        <small className="text-[10px]">1/20 spot left</small>
      </button>
    );
  }

  const entries = useMemo(
    () => [{ title, desc, icon }, ...rotations],
    [title, desc, icon, rotations]
  );

  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (entries.length < 2) return;

    const interval = setInterval(() => {
      setFlipping(true);
      const mid = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % entries.length);
      }, 240);
      const end = setTimeout(() => {
        setFlipping(false);
      }, 520);

      return () => {
        clearTimeout(mid);
        clearTimeout(end);
      };
    }, 3600);

    return () => clearInterval(interval);
  }, [entries.length]);

  const currentEntry = entries[current];
  const nextEntry = entries[(current + 1) % entries.length];

  return (
    <button type="button" onClick={() => onSelect?.(currentEntry)} className="w-full text-left [perspective:1000px]">
      <div
        className="relative transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipping ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          <TileFace tone={tone} entry={currentEntry} />
        </div>
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <TileFace tone={tone} entry={nextEntry} />
        </div>
      </div>
    </button>
  );
}

