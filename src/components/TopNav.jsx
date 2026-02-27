import { Star } from "lucide-react";
import { topLinks } from "../data/mockData";

export default function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[#24323a] bg-[#13252e]/95">
      <div className="mx-auto flex max-w-[1720px] items-center gap-2 overflow-x-auto px-5 py-2 hide-scrollbar">
        <div className="mr-2 flex items-center gap-2 rounded-full border border-[#2e4652] bg-[#102029] px-3 py-1.5 text-xs text-gray-100">
          <Star size={12} className="text-accent" />
          <span>realmrr.com</span>
        </div>
        {topLinks.map((link) => (
          <span
            key={link}
            className="whitespace-nowrap rounded-md border border-[#2d4250] bg-[#13252e] px-2.5 py-1 text-xs text-gray-200"
          >
            {link}
          </span>
        ))}
      </div>
    </header>
  );
}


