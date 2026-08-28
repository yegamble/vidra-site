/**
 * A comparison that has to survive being read by someone who works at the thing
 * in column one. Every cell is either checkable or an admission that it varies.
 * No adjectives, no scoring, no ticks and crosses — the reader can do the
 * arithmetic. Where Vidra matches the other self-hosted options, the table says
 * so rather than inventing a difference.
 */

export const COMPARISON_COLUMNS = [
  "Hosted platforms (YouTube)",
  "Other self-hosted video platforms",
  "Vidra",
] as const;

export const COMPARISON_ROWS: { label: string; cells: [string, string, string] }[] =
  [
    {
      label: "Who sets the rules",
      cells: [
        "Google. The terms, the moderation policy and the ranking are theirs to change.",
        "You do. That is what self-hosting means.",
        "You do. Registration approval, reports and instance settings sit in your own admin console.",
      ],
    },
    {
      label: "Ads and your audience",
      cells: [
        "The platform sells advertising against your audience and sets the revenue share.",
        "No ad system unless the project ships one.",
        "No ad system and no monetisation layer. Vidra is not a creator monetisation platform.",
      ],
    },
    {
      label: "Federation",
      cells: [
        "None. Accounts, subscriptions and discovery stay on one platform.",
        "Varies by project. ActivityPub where it is offered.",
        "ActivityPub and ATProto. On by default, off per channel.",
      ],
    },
    {
      label: "Runtime",
      cells: [
        "Not something you run.",
        "Varies by project. Check the one you are comparing.",
        "A Go backend (Go 1.26, Echo) and a Next.js 16 frontend, over PostgreSQL 18 and Redis 8.",
      ],
    },
    {
      label: "Egress",
      cells: [
        "Theirs to pay for.",
        "Yours to pay for.",
        "Yours, and offloadable: a CDN in front of your HLS, or IPFS gateways carrying public media.",
      ],
    },
    {
      label: "Licence",
      cells: [
        "Proprietary, hosted service.",
        "Varies. Check the licence before you commit to it.",
        "AGPL v3. Use it, study it, modify it, redistribute it — and a modified service owes its users the source.",
      ],
    },
    {
      label: "Leaving",
      cells: [
        "Takeout exports your video files. The URLs, the embeds and the audience stay on the platform.",
        "Your files and your database are already on your disk.",
        "Your files and your database are already on your disk, behind one compose file.",
      ],
    },
  ];

/** Emphasis on the third column, without marking the other two down. */
const cellTone = (i: number) => (i === 2 ? "text-onink" : "text-onink-2");

export function Comparison() {
  return (
    <>
      {/* Table for anything wide enough to hold three columns of prose. */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Vidra compared with hosted video platforms and with other
            self-hosted video platforms
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[15%] pb-4" />
              {COMPARISON_COLUMNS.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`w-[28%] border-b border-slate/70 px-5 pb-4 align-bottom text-micro uppercase ${
                    i === 2 ? "text-vidra" : "text-onink-2"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label} className="align-top">
                <th
                  scope="row"
                  className="border-b border-slate/70 py-5 pr-5 text-body font-bold text-onink"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={COMPARISON_COLUMNS[i]}
                    className={`border-b border-slate/70 px-5 py-5 text-small ${cellTone(
                      i,
                    )} ${i === 2 ? "bg-ink-surface" : ""}`}
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
        {COMPARISON_ROWS.map((row) => (
          <section key={row.label} aria-label={row.label}>
            <h3 className="border-b border-slate/70 pb-3 text-card text-onink">
              {row.label}
            </h3>
            <dl className="mt-4 flex flex-col gap-4">
              {row.cells.map((cell, i) => (
                <div
                  key={COMPARISON_COLUMNS[i]}
                  className={
                    i === 2 ? "rounded-card bg-ink-surface p-4" : "px-4"
                  }
                >
                  <dt
                    className={`text-micro uppercase ${
                      i === 2 ? "text-vidra" : "text-onink-2"
                    }`}
                  >
                    {COMPARISON_COLUMNS[i]}
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
