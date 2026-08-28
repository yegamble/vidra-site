import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { LAPTOP, PHONE, ROUTES } from "./routes";

/**
 * WCAG 2.2 AA. axe serious and critical findings fail the build; moderate and
 * minor are printed in the failure message but do not gate — the same scoping
 * vidra-user uses, so the two repos agree on what "a11y is green" means.
 */

const WIDTHS = [PHONE, LAPTOP];

for (const vp of WIDTHS) {
  for (const route of ROUTES) {
    test(`axe: ${route} at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      const advisory = results.violations.filter(
        (v) => v.impact !== "serious" && v.impact !== "critical",
      );

      const describe = (list: typeof results.violations) =>
        list
          .map(
            (v) =>
              `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${
                v.nodes.length === 1 ? "" : "s"
              })\n    ${v.nodes
                .slice(0, 3)
                .map((n) => n.target.join(" "))
                .join("\n    ")}`,
          )
          .join("\n");

      expect(
        blocking,
        `serious/critical on ${route} at ${vp.name}:\n${describe(
          blocking,
        )}\n\nnot gated (reported only):\n${describe(advisory) || "  none"}`,
      ).toEqual([]);
    });
  }
}

for (const route of ROUTES) {
  test(`landmarks: ${route}`, async ({ page }) => {
    await page.goto(route);

    // Exactly one <main>. Two main landmarks is the bug where a page-level
    // wrapper gets duplicated inside a section.
    await expect(page.locator("main")).toHaveCount(1);

    // Every <nav> carries a name, including the ones display:none hides at
    // this width — an unnamed nav is unnamed at every width.
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll("nav")]
        .filter((nav) => {
          const label = nav.getAttribute("aria-label")?.trim();
          const by = nav.getAttribute("aria-labelledby")?.trim();
          const named = by
            ? by
                .split(/\s+/)
                .some(
                  (id) =>
                    (document.getElementById(id)?.textContent ?? "").trim()
                      .length > 0,
                )
            : false;
          return !(label && label.length > 0) && !named;
        })
        .map((nav) => nav.outerHTML.slice(0, 120)),
    );
    expect(unnamed, "every <nav> needs an accessible name").toEqual([]);
  });
}
