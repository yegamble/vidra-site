/**
 * The shipped/planned vocabulary for /scale's ledger: a micro-label — the one
 * sanctioned all-caps register — with a drawn dot for redundancy. The word is
 * the signal, the dot repeats it; never colour alone. This extends the
 * NotYet idiom from "three things we don't do" to a per-claim mark.
 * Ink-ground only for now; add Paper tokens if a Paper surface ever needs it.
 */
export function StatusMark({ status }: { status: "shipped" | "planned" }) {
  return (
    <span className="text-micro inline-flex items-center gap-2 uppercase text-onink-2">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${
          status === "shipped"
            ? "bg-vidra"
            : "ring-1 ring-inset ring-onink-2"
        }`}
      />
      {status === "shipped" ? "Shipped" : "Planned"}
    </span>
  );
}
