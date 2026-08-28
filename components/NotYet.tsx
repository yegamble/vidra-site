import { NOT_YET } from "@/lib/site";

/** Three things Vidra does not do. Stated where people will look for them. */
export function NotYet({ ground = "ink" }: { ground?: "ink" | "paper" }) {
  const ink = ground === "ink";

  return (
    <div
      className={`rounded-card border p-6 md:p-8 ${
        ink ? "border-slate/70" : "border-paper-hairline bg-white"
      }`}
    >
      <h3
        className={`text-micro uppercase ${ink ? "text-onink-2" : "text-label"}`}
      >
        Not yet, and in one case not ever
      </h3>
      <dl className="mt-6 grid gap-6 md:grid-cols-3">
        {NOT_YET.map((item) => (
          <div key={item.title}>
            <dt
              className={`text-card ${ink ? "text-onink" : "text-onpaper"}`}
            >
              {item.title}
            </dt>
            <dd
              className={`mt-2 text-small ${
                ink ? "text-onink-2" : "text-onpaper-2"
              }`}
            >
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
