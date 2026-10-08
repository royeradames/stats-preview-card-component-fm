import { expect, test } from "@playwright/test";

test("renders the supplied heading, copy and stats as a description list", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Stats preview card | Royer Adames");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  const heading = page.getByRole("heading", { level: 1, name: "Get insights that help your business grow." });
  await expect(heading).toBeVisible();
  await expect(heading.locator(".accent")).toHaveCSS("color", "rgb(171, 92, 219)");
  await expect(page.getByText("Discover the benefits of data analytics and make better decisions regarding revenue, customer experience, and overall efficiency.")).toBeVisible();
  const pairs = await page.locator(".stats > div").evaluateAll(items => items.map(item => [item.querySelector("dt")?.textContent, item.querySelector("dd")?.textContent]));
  expect(pairs).toEqual([["Companies", "10k+"], ["Templates", "314"], ["Queries", "12M+"]]);
  await expect(page.getByText("Companies", { exact: true })).toHaveCSS("text-transform", "uppercase");
});

test("art-directs the supplied header photo with the purple multiply treatment", async ({ page }) => {
  for (const [width, file] of [[400, "image-header-mobile.jpg"], [768, "image-header-desktop.jpg"], [1440, "image-header-desktop.jpg"]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const image = page.getByRole("img", { name: "Three colleagues working on laptops around a shared office table." });
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).currentSrc)).toContain(file);
    expect(await image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveCSS("mix-blend-mode", "multiply");
    await expect(image).toHaveCSS("opacity", "0.75");
    await expect(page.locator(".stats-image")).toHaveCSS("background-color", "rgb(171, 92, 219)");
  }
});

test("follows the mobile, tablet and desktop frames", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 956 });
  await page.goto("/");
  const card = page.locator(".stats-card");
  const image = page.locator(".stats-image");
  const copy = page.locator(".stats-copy");
  expect((await card.boundingBox())?.width).toBeCloseTo(327, 0);
  expect((await image.boundingBox())?.height).toBeCloseTo(240, 0);
  await expect(page.locator("h1")).toHaveCSS("text-align", "center");
  await expect(page.locator("h1")).toHaveCSS("font-size", "28px");
  await expect(page.locator(".stats")).toHaveCSS("flex-direction", "column");

  await page.setViewportSize({ width: 768, height: 1068 });
  expect((await card.boundingBox())?.width).toBeCloseTo(564, 0);
  const tabletImage = await image.boundingBox();
  const tabletCopy = await copy.boundingBox();
  expect(tabletImage!.y + tabletImage!.height).toBeCloseTo(tabletCopy!.y, 0);
  // Figma Tablet "Image Container" is 564×442; the photo must not drive the panel height.
  expect(tabletImage!.height).toBeCloseTo(442, 0);
  await expect(page.locator("h1")).toHaveCSS("text-align", "left");
  await expect(page.locator("h1")).toHaveCSS("font-size", "36px");
  await expect(page.locator(".stats")).toHaveCSS("flex-direction", "row");

  await page.setViewportSize({ width: 1440, height: 800 });
  const desktopCard = await card.boundingBox();
  const desktopImage = await image.boundingBox();
  const desktopCopy = await copy.boundingBox();
  // Figma Desktop "Container" is 1128×442 (two 564 halves).
  expect(desktopCard!.width).toBeCloseTo(1128, 0);
  expect(desktopImage!.x).toBeGreaterThan(desktopCopy!.x);
  expect(desktopImage!.height).toBeCloseTo(desktopCopy!.height, 0);
  const copyContentHeight = await copy.evaluate(element => {
    const style = getComputedStyle(element);
    return [...element.children].reduce((sum, child) => sum + child.getBoundingClientRect().height, 0)
      + parseFloat(style.rowGap) * (element.children.length - 1) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  });
  expect(desktopCard!.height).toBeCloseTo(copyContentHeight, 0);
  expect(Math.abs(desktopCard!.height - 442)).toBeLessThanOrEqual(4);
});

/* QA sweep October 8 (INP1, LG1): the 12px stat captions were the only text under the family 16px floor. */
test("fits from 320 to 1440 with no overflow and no text under 16px, stat captions included", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1120, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallText = await page.locator("h1, p, dt, dd, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const link of await page.locator("a").all()) {
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("footer links are reachable by keyboard with a visible focus ring", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const mentor = page.getByRole("link", { name: "Frontend Mentor", exact: true });
  await expect(mentor).toBeFocused();
  await expect(mentor).toHaveCSS("outline-style", "solid");
  await expect(mentor).toHaveAttribute("href", "https://www.frontendmentor.io/challenges/stats-preview-card-component-8JqbgoU62");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Royer Adames", exact: true })).toBeFocused();
});

test("declares one site name in the footer, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  const visible = await page.locator("footer .site-name").textContent();
  expect(visible).toBe("Stats preview card");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", visible!);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /three headline stats/);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: visible, url: "https://stats-preview-card-component-fm.royeradames.com/" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

/* Review October 8: with 16px captions the 4rem-gapped stats row was wider than the copy column at 640 and 1120 px,
   and the card's overflow: hidden would have hidden the spill. Every stat must sit inside the copy column, in one row from 640. */
test("the three stats stay inside the copy column, in one row on tablet and desktop", async ({ page }) => {
  for (const width of [320, 375, 640, 700, 768, 1024, 1119, 1120, 1200, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const layout = await page.evaluate(() => {
      const copy = document.querySelector(".stats-copy")!;
      const style = getComputedStyle(copy);
      const box = copy.getBoundingClientRect();
      const left = box.left + parseFloat(style.paddingLeft);
      const right = box.right - parseFloat(style.paddingRight);
      const items = [...document.querySelectorAll(".stats > div")].map(item => item.getBoundingClientRect());
      return {
        inside: items.every(item => item.left >= left - 0.5 && item.right <= right + 0.5),
        rows: new Set(items.map(item => Math.round(item.top))).size,
      };
    });
    expect(layout.inside, `stats spill out of the copy column at ${width}`).toBe(true);
    if (width >= 640) expect(layout.rows, `stats rows at ${width}`).toBe(1);
  }
});
