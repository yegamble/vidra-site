"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A real command, copyable. The `$` is decorative and is not part of what the
 * clipboard receives.
 */
export function CommandBlock({
  command,
  label = "Install command",
  ground = "paper",
}: {
  command: string;
  label?: string;
  ground?: "ink" | "paper";
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused. The command stays selectable either way.
      setCopied(false);
    }
  }, [command]);

  // The block itself is always Ink, on both grounds: it is terminal output.
  const shell =
    ground === "ink"
      ? "bg-ink-surface ring-1 ring-ink-hairline"
      : "bg-ink ring-1 ring-ink/10";

  return (
    <div
      className={`on-ink flex flex-col gap-3 rounded-card p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${shell}`}
    >
      {/* The command is longer than a phone is wide, so this scrolls — and a
          scrollable region has to be operable from the keyboard (WCAG 2.1.1;
          axe scrollable-region-focusable). Same contract as
          ArchitectureDiagram: tabbable, named, no mouse required. */}
      <pre
        className="min-w-0 flex-1 overflow-x-auto text-mono text-onink"
        tabIndex={0}
        role="group"
        aria-label={`${label}. Scrolls horizontally on narrow screens.`}
      >
        <code>
          <span aria-hidden="true" className="pr-2 text-onink-2 select-none">
            $
          </span>
          {command}
        </code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()} to clipboard`}
        className="inline-flex min-h-11 shrink-0 items-center justify-center self-start rounded-button px-4 text-small font-semibold text-ice ring-1 ring-inset ring-ice/60 transition-colors hover:bg-ice/10 sm:self-auto"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </div>
  );
}
