export default function StartupCard({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      className="relative w-[222px] shrink-0 overflow-hidden rounded-2xl border border-[#33363c] bg-[linear-gradient(180deg,#1b1b1d_0%,#17181a_100%)] px-4 py-4 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-[#4a4f58] hover:shadow-hover"
    >
      <span className="absolute right-0 top-0 whitespace-nowrap rounded-tr-2xl rounded-bl-lg bg-[#3b2a18] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.05em] text-[#f4b022]">
        FOR SALE
      </span>

      <div className="mb-3.5 flex items-start gap-2.5">
        <span className="mt-0.5 grid h-9 w-9 place-content-center rounded-xl border border-[#33486a] bg-[#1a2740] text-[11px] font-bold text-[#8fb4ff]">
          {item.logo}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold leading-[1.2] text-[#f5f7fb]">{item.name}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="truncate text-[9px] leading-[1.2] text-[#a5acb7]">{item.niche}</span>
            <span className="shrink-0 rounded-full border border-[#35548a] bg-[#182844] px-1.5 py-[2px] text-[8px] font-semibold text-[#9fc2ff]">
              {item.category || "SaaS"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 border-t border-[#2a2d33] pt-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#7f8793]">
          Revenue
          <b className="mt-1.5 block text-[13px] font-semibold tracking-normal text-[#f5f7fb]">{item.revenue}</b>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#7f8793]">
          Price
          <b className="mt-1.5 block text-[13px] font-semibold tracking-normal text-[#f5f7fb]">{item.price}</b>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#7f8793]">
          Multiple
          <b className="mt-1.5 block text-[13px] font-semibold tracking-normal text-[#f5f7fb]">{item.multiple}</b>
        </span>
      </div>
    </button>
  );
}
