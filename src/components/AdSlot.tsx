"use client";

interface AdSlotProps {
  slotId: string;
  className?: string;
}

export default function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-slate-600 text-xs overflow-hidden ${className}`}
      data-ad-slot={slotId}
      aria-hidden="true"
    >
      {isDev ? (
        <div className="flex flex-col items-center gap-1 select-none py-4">
          <svg
            className="w-6 h-6 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
            />
          </svg>
          <span>Ad Slot: {slotId}</span>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
