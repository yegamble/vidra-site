import { NOT_YET } from "@/lib/site";

/**
 * Three things Vidra does not do, stated where people will look for them.
 *
 * A native `<details>` rather than a card that is always open: the negatives
 * have to be findable and quotable, but they are not the pitch, and a
 * disclosure widget the platform already ships is keyboard-operable, printable
 * and searchable without a line of JavaScript.
 */
export function NotYet() {
  return (
    <details className="rounded-card border border-paper-hairline bg-white p-5">
      <summary className="text-body flex min-h-11 cursor-pointer items-center font-semibold">
        Three things Vidra does not do
      </summary>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {NOT_YET.map((item) => (
          <div key={item.title}>
            <dt className="text-body font-bold">{item.title}</dt>
            <dd className="text-small mt-1 text-onpaper-2">{item.body}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
