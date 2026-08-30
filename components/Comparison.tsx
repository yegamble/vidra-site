/**
 * A comparison that has to survive being read by someone who works at the thing
 * in column one. Every cell is either checkable or an admission that it varies.
 * No adjectives, no scoring, no ticks and crosses — the reader can do the
 * arithmetic. Where Vidra matches the other self-hosted options, the table says
 * so rather than inventing a difference.
 *
 * The component is the idiom; the dataset below is its canonical instance
 * (YouTube · Vidra). Other pages pass their own columns and rows, and the
 * paired table/stacked structure, the emphasis-by-heading-colour-and-fill-and-
 * position treatment and the one-copy-in-the-a11y-tree behaviour carry over.
 *
 * There used to be a middle column, "Other self-hosted video platforms". It
 * was removed on 2026-08-30 and should not come back in that shape. Every
 * cell in it was a universally quantified claim about an open set nobody can
 * check — and it could not be written honestly, so it wasn't: four of its
 * seven cells agreed with the Vidra column, two answered "varies by project",
 * and the Leaving row's Vidra cell was the middle cell plus four words. A
 * column that cannot state a difference is not evidence, it is a shape. If a
 * later cycle wants the comparison back, it starts from a named sample —
 * "Two examples: PeerTube, MediaCMS" — not from the anonymous category.
 */

export type ComparisonRow = { label: string; cells: string[] };

export const COMPARISON_COLUMNS: string[] = [
  "Hosted platforms (YouTube)",
  "Vidra",
];

export const COMPARISON_ROWS: ComparisonRow[] =
  [
    {
      label: "Who sets the rules",
      cells: [
        "Google. The terms, the moderation policy and the ranking are theirs to change.",
        "You do. Registration approval, reports and instance settings sit in your own admin console.",
      ],
    },
    {
      label: "Ads and your audience",
      cells: [
        "The platform sells advertising against your audience and sets the revenue share.",
        "No ad system and no monetisation layer. Vidra is not a creator monetisation platform.",
      ],
    },
    {
      label: "Federation",
      cells: [
        "None. Accounts, subscriptions and discovery stay on one platform.",
        "ActivityPub and ATProto. Enabled per instance; once on, every channel federates by default and can opt out.",
      ],
    },
    {
      label: "Runtime",
      cells: [
        "Not something you run.",
        "A Go backend (Go 1.26, Echo) and a Next.js 16 frontend, over PostgreSQL 18 and Redis 8.",
      ],
    },
    {
      label: "Egress",
      cells: [
        "Theirs to pay for.",
        "Yours, and offloadable: a CDN in front of your HLS, or IPFS gateways carrying public media.",
      ],
    },
    {
      label: "Licence",
      cells: [
        "Proprietary, hosted service.",
        "AGPL v3. Use it, study it, modify it, redistribute it — and a modified service owes its users the source.",
      ],
    },
    {
      label: "Leaving",
      cells: [
        "Takeout exports your video files. The URLs, the embeds and the audience stay on the platform.",
        "Your files and your database stay where you put them: media in the storage backend you configured, everything else in one PostgreSQL. Your domain is your domain, so the URLs and the embeds are yours too.",
      ],
    },
  ];

export function Comparison({
  columns = COMPARISON_COLUMNS,
  rows = COMPARISON_ROWS,
  emphasisIndex = 1,
  srCaption = "Vidra compared with hosted video platforms",
}: {
  columns?: string[];
  rows?: ComparisonRow[];
  /** The Vidra column: emphasised by heading colour, fill and position — never colour alone. */
  emphasisIndex?: number;
  srCaption?: string;
}) {
  /** Emphasis on one column, without marking the others down. */
  const cellTone = (i: number) =>
    i === emphasisIndex ? "text-onink" : "text-onink-2";
  // Proportional measures, like the ones this table has always carried: the
  // label column and equal data columns, for the two widths the site renders.
  const labelWidth = columns.length === 2 ? "w-[20%]" : "w-[15%]";
  const cellWidth = columns.length === 2 ? "w-[40%]" : "w-[28%]";

  return (
    <>
      {/* Table for anything wide enough to hold the columns as prose. */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{srCaption}</caption>
          <thead>
            <tr>
              <th scope="col" className={`${labelWidth} pb-4`} />
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`${cellWidth} border-b border-slate/70 px-5 pb-4 align-bottom text-micro uppercase ${
                    i === emphasisIndex ? "text-vidra" : "text-onink-2"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th
                  scope="row"
                  className="border-b border-slate/70 py-5 pr-5 text-body font-bold text-onink"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={columns[i]}
                    className={`border-b border-slate/70 px-5 py-5 text-small ${cellTone(
                      i,
                    )} ${i === emphasisIndex ? "bg-ink-surface" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked on small screens: same data, no sideways scrolling.
          Exactly one of the two is in the accessibility tree at any width. */}
      <div className="flex flex-col gap-8 md:hidden">
        {rows.map((row) => (
          <section key={row.label} aria-label={row.label}>
            <h3 className="border-b border-slate/70 pb-3 text-card text-onink">
              {row.label}
            </h3>
            <dl className="mt-4 flex flex-col gap-4">
              {row.cells.map((cell, i) => (
                <div
                  key={columns[i]}
                  className={
                    i === emphasisIndex ? "rounded-card bg-ink-surface p-4" : "px-4"
                  }
                >
                  <dt
                    className={`text-micro uppercase ${
                      i === emphasisIndex ? "text-vidra" : "text-onink-2"
                    }`}
                  >
                    {columns[i]}
                  </dt>
                  <dd className={`mt-2 text-small ${cellTone(i)}`}>{cell}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
