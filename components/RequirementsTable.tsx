import { REQUIREMENTS } from "@/lib/site";

/** Sizing from deploy/README. The numbers are the numbers. */
export function RequirementsTable({ compact = false }: { compact?: boolean }) {
  return (
    // Five columns do not fit a phone, so the table keeps its width and
    // scrolls. A scrollable region must be reachable without a mouse
    // (WCAG 2.1.1) — the ArchitectureDiagram pattern: tabbable and named.
    <div
      className="overflow-x-auto rounded-card border border-paper-hairline bg-white"
      tabIndex={0}
      role="group"
      aria-label="Server sizing table. Scrolls horizontally on narrow screens."
    >
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">
          Server sizing profiles for a Vidra instance, with monthly droplet cost
        </caption>
        <thead>
          <tr className="border-b border-paper-hairline">
            <th scope="col" className="p-4 text-micro uppercase text-label">
              Profile
            </th>
            <th scope="col" className="p-4 text-micro uppercase text-label">
              vCPU
            </th>
            <th scope="col" className="p-4 text-micro uppercase text-label">
              RAM
            </th>
            <th scope="col" className="p-4 text-micro uppercase text-label">
              Disk
            </th>
            <th scope="col" className="p-4 text-micro uppercase text-label">
              Cost per month
            </th>
          </tr>
        </thead>
        <tbody>
          {REQUIREMENTS.map((row) => (
            <tr
              key={row.profile}
              className="border-b border-paper-hairline last:border-0"
            >
              <th scope="row" className="p-4 align-top font-normal">
                <span className="block text-body font-bold">{row.profile}</span>
                {compact ? null : (
                  <span className="mt-1 block text-small text-onpaper-2">
                    {row.detail}
                  </span>
                )}
              </th>
              <td className="p-4 align-top text-body tabular-nums">{row.vcpu}</td>
              <td className="p-4 align-top text-body tabular-nums">{row.ram}</td>
              <td className="p-4 align-top text-body tabular-nums">{row.disk}</td>
              <td className="p-4 align-top text-body tabular-nums">{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The part of sizing that costs people real money if they skip it. */
export function RequirementsTruths() {
  return (
    <p className="mt-8 max-w-[66ch] text-body text-onpaper-2">
      Do not use a 2 GB droplet. Production needs Docker Compose 2.24 or newer —
      2.20 is the floor, but older Compose versions silently publish PostgreSQL
      and Redis on <code className="text-mono text-onpaper">0.0.0.0</code>, which
      is your database on the public internet. Add a 4 GB swapfile. Budget around
      8 GB of scratch space per concurrent transcode job at a 2 GB maximum upload
      size.
    </p>
  );
}
