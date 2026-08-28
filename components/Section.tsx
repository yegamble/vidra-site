import type { ReactNode } from "react";

type Ground = "ink" | "paper" | "mist";

const grounds: Record<Ground, string> = {
  // `on-ink` switches the focus ring to Ice, per the brand accessibility contract.
  ink: "on-ink bg-ink text-onink",
  paper: "bg-paper text-onpaper",
  mist: "bg-mist text-onpaper",
};

/**
 * One band of the long scroll. Grounds alternate — never two Ink sections in a row.
 */
export function Section({
  id,
  ground,
  media = false,
  className = "",
  children,
}: {
  id?: string;
  ground: Ground;
  /** Widen from the 1080px text measure to the 1280px media measure. */
  media?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${grounds[ground]} ${className}`}>
      <div className={`section-y ${media ? "measure-media" : "measure-text"}`}>
        {children}
      </div>
    </section>
  );
}

/** 11px all-caps micro-label. The only place all caps is allowed. */
export function Eyebrow({
  children,
  ground = "paper",
}: {
  children: ReactNode;
  ground?: Ground;
}) {
  return (
    <p
      className={`text-micro uppercase ${
        ground === "ink" ? "text-onink-2" : "text-label"
      }`}
    >
      {children}
    </p>
  );
}

export function Head({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={`text-head text-balance ${className}`}>{children}</Tag>
  );
}

export function Standfirst({
  children,
  ground = "paper",
  className = "",
}: {
  children: ReactNode;
  ground?: Ground;
  className?: string;
}) {
  return (
    <p
      className={`text-standfirst max-w-[54ch] text-pretty ${
        ground === "ink" ? "text-onink-2" : "text-onpaper-2"
      } ${className}`}
    >
      {children}
    </p>
  );
}
