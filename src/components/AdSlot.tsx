"use client";

interface AdSlotProps {
  slotId?: string;
  bannerId?: string;
  className?: string;
}

const DEFAULT_BANNER_MAP: Record<string, string> = {
  "top-leaderboard": "2031283",
  "sidebar-rectangle": "2031285",
  "bottom-leaderboard": "2031285",
};

export default function AdSlot({
  slotId = "top-leaderboard",
  bannerId,
  className = "",
}: AdSlotProps) {
  const isDev = process.env.NODE_ENV === "development";
  const resolvedBannerId = bannerId || DEFAULT_BANNER_MAP[slotId] || "2031283";

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-500 text-xs overflow-hidden ${className}`}
      data-ad-slot={slotId}
      aria-label="Advertisement"
    >
      {/* MyBid Banner Unit */}
      <div data-banner-id={resolvedBannerId} className="w-full flex justify-center" />

      {/* Development indicator */}
      {isDev && (
        <div className="flex flex-col items-center gap-1 select-none py-3 text-slate-600 pointer-events-none">
          <span className="text-[11px] font-mono text-emerald-500/70">
            MyBid Ad Banner #{resolvedBannerId}
          </span>
          <span className="text-[10px] text-slate-600">Slot: {slotId}</span>
        </div>
      )}
    </div>
  );
}
