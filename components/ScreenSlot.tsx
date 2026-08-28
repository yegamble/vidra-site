/**
 * A labelled empty slot where a real screenshot will land. Not a mockup, not an
 * illustration, not a stock photo — the brand shows the product or shows nothing,
 * and this is the "nothing", stated out loud.
 */
export function ScreenSlot({
  label,
  ground = "ink",
}: {
  label: string;
  ground?: "ink" | "paper";
}) {
  const ink = ground === "ink";

  return (
    <figure className="mt-10">
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-card border border-dashed ${
          ink
            ? "hatch-ink border-slate/80 text-onink-2"
            : "hatch-paper border-paper-hairline text-label"
        }`}
      >
        <div className="px-6 text-center">
          <p className="text-micro uppercase">product screen · 16:9</p>
          <p className="mt-2 text-small">{label}</p>
        </div>
      </div>
      <figcaption
        className={`mt-3 text-small ${ink ? "text-onink-2" : "text-onpaper-2"}`}
      >
        Empty on purpose. A real capture from a running instance goes here — no
        mockup stands in for it.
      </figcaption>
    </figure>
  );
}
