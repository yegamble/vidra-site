import { expect, test } from "@playwright/test";
import { PHONE, ROUTES } from "./routes";

/**
 * Apple HIG's 44x44 floor, measured rather than eyeballed. A control that is
 * comfortable with a mouse can still be a miss with a thumb, and the only way
 * to know is to ask the box how big it is.
 *
 * Two documented exemptions, both encoded below rather than kept in an
 * allowlist:
 *
 *  - WCAG 2.5.8 "inline": a link inside a sentence is sized by the line-height
 *    of the text around it, so growing it would break the paragraph. Encoded as
 *    an <a> whose parent is a <p>, or whose computed display is inline.
 *  - Screen-reader-only controls (Tailwind's `sr-only`: a 1x1 clipped box, such
 *    as the skip link before it takes focus) have no visual target to hit.
 *
 * Anything else that fails is a component to fix, not an entry to add here.
 *
 * The launch page has links only; the former mobile menu and range controls
 * were explicitly retired with the technical marketing pages.

 */

const FLOOR = 44;

test.describe(`hit targets at ${PHONE.name}`, () => {
  for (const route of ROUTES) {
    test(route, async ({ page }) => {
      await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
      await page.goto(route);

      const small = await page.evaluate((floor) => {
        const offenders: {
          tag: string;
          name: string;
          w: number;
          h: number;
          html: string;
        }[] = [];

        for (const el of document.querySelectorAll("a, button")) {
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") {
            continue;
          }
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          // sr-only: a clipped 1x1 box with nothing to aim at.
          if (rect.width <= 1 && rect.height <= 1) continue;

          // WCAG 2.5.8 inline exception.
          if (el.tagName === "A") {
            if (el.parentElement?.tagName === "P") continue;
            if (style.display === "inline") continue;
          }

          if (rect.width < floor || rect.height < floor) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              name: (el.textContent ?? "").trim().slice(0, 40) ||
                el.getAttribute("aria-label") ||
                "(no name)",
              w: Math.round(rect.width),
              h: Math.round(rect.height),
              html: el.outerHTML.slice(0, 140),
            });
          }
        }
        return offenders;
      }, FLOOR);

      expect(
        small,
        `controls under ${FLOOR}x${FLOOR} on ${route}:\n${small
          .map((o) => `  <${o.tag}> "${o.name}" ${o.w}x${o.h}\n    ${o.html}`)
          .join("\n")}`,
      ).toEqual([]);
    });
  }

});
