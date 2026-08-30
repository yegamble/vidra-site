import { NOT_YET } from "@/lib/site";

/**
 * Three things Vidra does not do, stated where people will look for them.
 *
 * The heaviest of the three is not folded away. DRM is the entry that can
 * waste a whole evaluation — everything else here changes what an instance
 * costs; this one decides whether Vidra is usable at all for a reader whose
 * distributor requires encrypted playback — so it reads as prose above the
 * disclosure, on every page this component appears on.
 *
 * The rest stay in a native `<details>` rather than a card that is always
 * open: they have to be findable and quotable, but they are not the pitch, and
 * a disclosure widget the platform already ships is keyboard-operable,
 * printable and searchable without a line of JavaScript.
 *
 * The `<summary>` must not be a flex container. `display: flex` overrides the
 * element's `display: list-item`, which is what draws the disclosure triangle
 * in Chromium — so the control looked like a bold sentence and there was
 * nothing to say it opened.
 */

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five"];

export function NotYet() {
  const surfaced = NOT_YET.filter((item) => item.surfaced);
  const folded = NOT_YET.filter((item) => !item.surfaced);
  const count = COUNT_WORDS[folded.length] ?? String(folded.length);

  return (
    <div className="rounded-card border border-paper-hairline bg-white p-5">
      {surfaced.map((item) => (
        <p key={item.title} className="text-body max-w-[66ch] text-onpaper-2">
          <strong className="font-bold text-onpaper">{item.title}:</strong>{" "}
          {item.body}
        </p>
      ))}

      <details className="mt-5 border-t border-paper-hairline pt-4">
        <summary className="text-body min-h-11 cursor-pointer py-2 font-semibold marker:text-label">
          {count} more thing{folded.length === 1 ? "" : "s"} Vidra does not do
        </summary>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {folded.map((item) => (
            <div key={item.title}>
              <dt className="text-body font-bold">{item.title}</dt>
              <dd className="text-small mt-1 text-onpaper-2">{item.body}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
