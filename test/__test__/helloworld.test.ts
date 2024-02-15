import * as puppeteer from "puppeteer";
import fs from "fs";

let page: puppeteer.Page;
let browser: puppeteer.Browser;

const absPath = fs.realpathSync("./../fe/index.html");

describe("Hello World", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto(`file://${absPath}`, {
        waitUntil: "load",
      })
      .catch(() => {
        // TODO: add catch
      });
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  test("should open local file", async () => {
    await page.waitForSelector("h1");
    const title = await page.$eval("h1", (el: HTMLHeadingElement) => {
      return el.textContent;
    });

    expect(await page.title()).toEqual("Noteboard");
    expect(title).toEqual("Hello Noteboard!");
  });
});
