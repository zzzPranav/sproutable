import Link from "next/link";

const stages = [
  { id: "tree", rank: 6 },
  { id: "youngTree", rank: 5 },
  { id: "sapling", rank: 4 },
  { id: "plant", rank: 3 },
  { id: "young", rank: 2 },
  { id: "sprout", rank: 1 },
] as const;

type StageId = (typeof stages)[number]["id"];

export function GrowthTree({
  level,
  labels,
  you,
  youHref,
  start,
}: {
  level: number;
  labels: Record<StageId, string>;
  you: string;
  youHref?: string;
  start: string;
}) {
  const rank = Math.min(6, Math.max(1, level));

  return (
    <figure className="overflow-hidden">
      <div className="garden-sky px-2 pb-2 pt-4 sm:px-8 sm:pt-6">
        <div className="relative mx-auto max-w-lg">
          <div aria-hidden="true" className="absolute bottom-6 left-[0.35rem] top-6 w-1">
            <div className="absolute inset-0 rounded-full bg-[#c4a574]" />
            <div className="absolute inset-x-0 bottom-0 rounded-full bg-[#215c45]" style={{ height: `${((rank - 1) / 5) * 100}%` }} />
          </div>
          <ol className="space-y-2 pl-8">
          {stages.map((stage) => {
            const state = stage.rank === rank ? "now" : stage.rank < rank ? "done" : "ahead";
            return (
              <li key={stage.id} className={`relative flex items-center gap-2 rounded-2xl px-2 py-2 sm:gap-4 sm:px-3 ${state === "now" ? "bg-[#fffdf8] shadow-[3px_3px_0_#3d2914]" : ""}`}>
                <span
                  aria-hidden="true"
                  className={`absolute -left-8 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 ${
                    state === "ahead" ? "border-[#c4a574] bg-[#fffdf8]" : "border-[#215c45] bg-[#e3b23c]"
                  }`}
                />
                <StageArt id={stage.id} state={state} />
                <div className="min-w-0">
                  <p className={`font-game text-xl leading-tight sm:text-3xl ${state === "ahead" ? "text-[#5c564e]" : "text-[#3d2914]"}`}>
                    {labels[stage.id]}
                  </p>
                  {state === "now" ? (
                    youHref ? (
                      <Link href={youHref} className="mt-2 inline-flex min-h-11 items-center rounded-full bg-[#e3b23c] px-3 py-1 text-sm font-semibold text-[#3d2914] underline">
                        {you}
                      </Link>
                    ) : (
                      <p className="mt-2 inline-flex rounded-full bg-[#e3b23c] px-3 py-1 text-sm font-semibold text-[#3d2914]">{you}</p>
                    )
                  ) : null}
                  {state === "done" ? <p className="mt-1 text-sm text-[#215c45]">✓</p> : null}
                </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
      <div className="bg-[#6b3f22] px-4 py-3 text-center text-[#f7f3ea]">
        <p className="font-game text-xl">{start}</p>
        <div className="mx-auto mt-2 h-3 max-w-xs rounded-full bg-[#8a5a32]" />
      </div>
    </figure>
  );
}

function StageArt({ id, state }: { id: StageId; state: "done" | "now" | "ahead" }) {
  const size = id === "tree" || id === "youngTree" ? "h-14 w-14 sm:h-20 sm:w-20" : id === "sapling" ? "h-12 w-12 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-14 sm:w-14";
  const sway = state === "now" ? "plant-sway" : "";
  const fade = state === "ahead" ? "opacity-45" : "";
  return (
    <svg viewBox="0 0 64 64" className={`${size} shrink-0 ${sway} ${fade}`} aria-hidden="true" focusable="false">
      <rect x="8" y="52" width="48" height="8" fill="#8a5a32" />
      <rect x="10" y="54" width="44" height="4" fill="#c4a574" />
      {id === "sprout" ? (
        <>
          <rect x="30" y="36" width="4" height="16" fill="#2f6b45" />
          <rect x="22" y="32" width="12" height="6" fill="#7dbe6a" />
          <rect x="32" y="28" width="12" height="6" fill="#3f8f55" />
        </>
      ) : null}
      {id === "young" ? (
        <>
          <rect x="30" y="28" width="4" height="24" fill="#2f6b45" />
          <rect x="18" y="30" width="14" height="8" fill="#7dbe6a" />
          <rect x="32" y="22" width="16" height="8" fill="#3f8f55" />
          <rect x="24" y="18" width="12" height="8" fill="#8fce73" />
        </>
      ) : null}
      {id === "plant" ? (
        <>
          <rect x="30" y="26" width="4" height="26" fill="#2f6b45" />
          <rect x="14" y="28" width="16" height="10" fill="#3f8f55" />
          <rect x="34" y="20" width="16" height="10" fill="#2f6b45" />
          <rect x="20" y="16" width="18" height="10" fill="#8fce73" />
          <rect x="40" y="32" width="8" height="8" fill="#e3b23c" />
        </>
      ) : null}
      {id === "sapling" ? (
        <>
          <rect x="29" y="24" width="6" height="28" fill="#6b3f22" />
          <rect x="16" y="16" width="32" height="16" fill="#2f6b45" />
          <rect x="20" y="10" width="24" height="12" fill="#3f8f55" />
          <rect x="26" y="6" width="12" height="8" fill="#8fce73" />
        </>
      ) : null}
      {id === "youngTree" ? (
        <>
          <rect x="28" y="22" width="8" height="30" fill="#6b3f22" />
          <rect x="10" y="16" width="44" height="16" fill="#215c45" />
          <rect x="16" y="8" width="32" height="14" fill="#2f6b45" />
          <rect x="24" y="2" width="16" height="10" fill="#3f8f55" />
        </>
      ) : null}
      {id === "tree" ? (
        <>
          <rect x="27" y="24" width="10" height="28" fill="#5a3418" />
          <rect x="6" y="16" width="52" height="16" fill="#215c45" />
          <rect x="12" y="6" width="40" height="16" fill="#2f6b45" />
          <rect x="22" y="0" width="20" height="10" fill="#3f8f55" />
          <rect x="8" y="22" width="8" height="8" fill="#d84b3a" />
          <rect x="46" y="18" width="8" height="8" fill="#e3b23c" />
        </>
      ) : null}
    </svg>
  );
}
