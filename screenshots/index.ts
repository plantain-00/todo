import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });
    await page.goto(`http://localhost:8000`);
    await page.screenshot({ path: `screenshots/initial.png`, fullPage: true });

    await (page.type as any)("input", "Task 1", { delay: 100 });
    await (page.keyboard as any).press("Enter");
    await page.hover(".content");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/new-task.png`, fullPage: true });

    await page.hover(".content");
    await page.waitFor(100);
    await page.click("li .on-it");
    await page.hover(".content");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/on-it.png`, fullPage: true });

    await page.hover(".content");
    await page.waitFor(100);
    await page.click("li .done");
    await page.hover(".content");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/done.png`, fullPage: true });

    await page.hover(".content");
    await page.waitFor(100);
    await page.click("li .reopen");
    await page.hover(".content");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/reopen.png`, fullPage: true });

    await page.hover(".content");
    await page.waitFor(100);
    await page.click("li .close");
    await page.waitFor(100);
    await page.hover(".content");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/close.png`, fullPage: true });

    await page.hover(".content");
    await page.waitFor(100);
    await page.click("li .closed");
    await page.waitFor(100);
    await page.screenshot({ path: `screenshots/edit.png`, fullPage: true });

    browser.close();
})();
