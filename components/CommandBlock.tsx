"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A real command, copyable. The `$` is decorative and is not part of what the
 * clipboard receives.
 *
 * It wraps rather than scrolls. The earlier version kept the command on one
 * line in a horizontally scrolling `<pre>`, which read as a tidy single row at
 * 1440 and hid roughly nine tenths of the command at 390 — worse as the
 * reader's font size rose, because the box stayed the width of the column
 * while the text grew. A terminal wraps a long command; so does this. That
 * also retires the scrollable-region contract here: the `<pre>` stays
 * focusable so the text can be selected from the keyboard, but there is no
 * longer anything past the right edge to reach.
 */

type CopyState = "idle" | "copied" | "failed";

export function CommandBlock({
  command,
  label = "Install command",
  ground = "paper",
}: {
  command: string;
  label?: string;
  ground?: "ink" | "paper";
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const settle = (next: CopyState) => {
      setState(next);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 4000);
    };
    try {
      await navigator.clipboard.writeText(command);
      settle("copied");
    } catch {
      // Clipboard access can be refused — an insecure origin, a permissions
      // policy, a browser that has no async clipboard at all. Swallowing that
      // leaves a reader pressing a button that does nothing, so the failure is
      // stated and the manual route is named. The command stays selectable.
      settle("failed");
    }
  }, [command]);

  // The block itself is always Ink, on both grounds: it is terminal output.
  const shell =
    ground === "ink"
      ? "bg-ink-surface ring-1 ring-ink-hairline"
      : "bg-ink ring-1 ring-ink/10";

  const buttonLabel =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy";

  return (
    <div
      className={`on-ink flex flex-row items-center gap-3 rounded-card p-4 sm:gap-4 sm:p-5 ${shell}`}
    >
      {/* Wrapped, never clipped: `break-all` is the terminal's own behaviour —
          it breaks at the column, mid-token if the token is longer than the
          line. The element keeps `tabIndex` so the command can be reached and
          selected without a mouse, which is the fallback when the clipboard
          refuses. */}
      <pre
        data-testid="command-text"
        className="min-w-0 flex-1 break-all whitespace-pre-wrap text-mono text-onink"
        tabIndex={0}
        role="group"
        aria-label={label}
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
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-button px-4 text-small font-semibold text-ice ring-1 ring-inset ring-ice/60 transition-colors hover:bg-ice/10"
      >
        {buttonLabel}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? `${label} copied to clipboard`
          : state === "failed"
            ? `Could not copy the ${label.toLowerCase()}. Select it and copy it yourself.`
            : ""}
      </span>
    </div>
  );
}
